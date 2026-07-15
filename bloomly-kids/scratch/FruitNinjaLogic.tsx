// Fruit Ninja (النينجا القاطع) Logic to inject into GameZone.tsx

  // NEW GAME: FRUIT NINJA (النينجا القاطع)
  const [ninjaFruits, setNinjaFruits] = useState<{
    id: number;
    type: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    isSliced: boolean;
    isBomb: boolean;
  }[]>([]);
  const [ninjaParticles, setNinjaParticles] = useState<{id: number, x: number, y: number, color: string, vx: number, vy: number, life: number}[]>([]);
  const [ninjaScore, setNinjaScore] = useState(0);
  const [ninjaActive, setNinjaActive] = useState(false);
  const [ninjaGameOver, setNinjaGameOver] = useState(false);
  const [ninjaLives, setNinjaLives] = useState(3);
  const [ninjaSlash, setNinjaSlash] = useState<{x: number, y: number}[]>([]);

  const ninjaRequestRef = useRef<number>();
  const ninjaLastTimeRef = useRef<number>();
  const ninjaSpawnTimerRef = useRef<number>(0);
  
  const fruitEmojis = ["🍎", "🍉", "🥥", "🥝", "🍍", "🥭"];
  const bombEmoji = "💣";

  const startNinjaGame = () => {
    requireProfile(() => {
      setNinjaFruits([]);
      setNinjaParticles([]);
      setNinjaScore(0);
      setNinjaLives(3);
      setNinjaActive(true);
      setNinjaGameOver(false);
      setStarsEarnedThisSession(0);
      setActiveGame("ninja");
      sfx.speakArabic("اقطع الفواكه وتجنب القنابل!", "welcome");
      ninjaLastTimeRef.current = performance.now();
      ninjaRequestRef.current = requestAnimationFrame(updateNinja);
    });
  };

  const createParticles = (x: number, y: number, color: string) => {
    const newParticles = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: Math.random(),
        x, y,
        color,
        vx: (Math.random() - 0.5) * 400,
        vy: (Math.random() - 0.5) * 400,
        life: 1
      });
    }
    setNinjaParticles(prev => [...prev, ...newParticles]);
  };

  const updateNinja = (time: number) => {
    if (!ninjaActive || ninjaGameOver) return;
    
    if (!ninjaLastTimeRef.current) ninjaLastTimeRef.current = time;
    const deltaTime = (time - ninjaLastTimeRef.current) / 1000;
    ninjaLastTimeRef.current = time;

    // Spawn fruits
    ninjaSpawnTimerRef.current += deltaTime;
    if (ninjaSpawnTimerRef.current > 1.5 - Math.min(1.0, ninjaScore / 100)) {
      ninjaSpawnTimerRef.current = 0;
      const count = Math.floor(Math.random() * 3) + 1; // 1 to 3 fruits
      
      setNinjaFruits(prev => {
        const newSpawn = [];
        for (let i=0; i<count; i++) {
          const isBomb = Math.random() > 0.8;
          newSpawn.push({
            id: Math.random(),
            type: isBomb ? bombEmoji : fruitEmojis[Math.floor(Math.random() * fruitEmojis.length)],
            x: 20 + Math.random() * 60, // 20% to 80%
            y: 110, // below screen
            vx: (Math.random() - 0.5) * 40,
            vy: -70 - Math.random() * 40, // throw up
            rotation: Math.random() * 360,
            isSliced: false,
            isBomb
          });
        }
        return [...prev, ...newSpawn];
      });
    }

    // Update fruits
    setNinjaFruits(prev => {
      let activeFruits = prev.map(f => {
        if (f.isSliced) {
          return { ...f, y: f.y + 150 * deltaTime, rotation: f.rotation + 180 * deltaTime }; // sliced fall fast
        }
        return {
          ...f,
          x: f.x + f.vx * deltaTime,
          y: f.y + f.vy * deltaTime,
          vy: f.vy + 90 * deltaTime, // gravity
          rotation: f.rotation + 90 * deltaTime
        };
      });

      // Missed fruits (only active non-bomb fruits that fall below screen)
      const missed = activeFruits.filter(f => !f.isBomb && !f.isSliced && f.y > 120 && f.vy > 0);
      if (missed.length > 0) {
        setNinjaLives(l => {
          const newLives = l - missed.length;
          if (newLives <= 0) {
            setNinjaGameOver(true);
            setNinjaActive(false);
            sfx.playWrong();
          }
          return newLives;
        });
      }

      activeFruits = activeFruits.filter(f => f.y < 130);
      return activeFruits;
    });

    // Update particles
    setNinjaParticles(prev => {
      return prev.map(p => ({
        ...p,
        x: p.x + p.vx * deltaTime,
        y: p.y + p.vy * deltaTime,
        vy: p.vy + 300 * deltaTime, // heavy gravity
        life: p.life - deltaTime * 2
      })).filter(p => p.life > 0);
    });
    
    // Clear slash trail gradually
    setNinjaSlash(prev => {
      if (prev.length > 0) return prev.slice(1);
      return prev;
    });

    ninjaRequestRef.current = requestAnimationFrame(updateNinja);
  };

  useEffect(() => {
    return () => {
      if (ninjaRequestRef.current) cancelAnimationFrame(ninjaRequestRef.current);
    };
  }, []);

  const handleNinjaPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ninjaActive || ninjaGameOver) return;
    
    // Check if pointer is down
    if (e.buttons !== 1) {
      setNinjaSlash([]);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setNinjaSlash(prev => {
      const newSlash = [...prev, {x, y}];
      if (newSlash.length > 10) newSlash.shift();
      return newSlash;
    });

    // Collision check
    setNinjaFruits(prev => {
      let hitBomb = false;
      let scoreGained = 0;
      
      const newFruits = prev.map(f => {
        if (f.isSliced) return f;
        
        // distance between fruit center and swipe point
        const dx = f.x - x;
        const dy = f.y - y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < 10) { // Hit radius
          if (f.isBomb) {
            hitBomb = true;
          } else {
            scoreGained += 10;
            // particles color based on fruit roughly
            createParticles(x, y, f.type === '🍉' ? '#EF4444' : f.type === '🥝' ? '#84CC16' : '#FCD34D');
            sfx.playSuccess();
          }
          return { ...f, isSliced: true };
        }
        return f;
      });

      if (hitBomb) {
        setNinjaGameOver(true);
        setNinjaActive(false);
        sfx.playWrong();
      }

      if (scoreGained > 0) {
        setNinjaScore(s => {
          const newScore = s + scoreGained;
          if (Math.floor(newScore / 100) > Math.floor(s / 100)) addStars(1);
          return newScore;
        });
      }

      return newFruits;
    });
  };

// UI BLOCK
      {/* --- FRUIT NINJA PLAY VIEW --- */}
      {activeGame === "ninja" && !showLevelMap && (
        <div 
          className="card-bubbly bg-[#451a03] max-w-2xl mx-auto p-0 relative overflow-hidden text-white border-4 border-amber-800 h-[600px] select-none touch-none"
          onPointerMove={handleNinjaPointerMove}
          onPointerDown={handleNinjaPointerMove}
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-20 bg-gradient-to-b from-black/60 to-transparent">
            <button
              onClick={quitGame}
              className="flex items-center gap-1 font-bold text-sm text-[#FF5A92] hover:underline"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
              <span>خروج</span>
            </button>
            <div className="font-extrabold text-white text-xl flex items-center gap-2 drop-shadow-md">
              <span>النقاط: {ninjaScore}</span>
              <span className="text-red-500 ml-4">
                {Array.from({length: 3}).map((_, i) => i < ninjaLives ? '❤️' : '🖤')}
              </span>
            </div>
            <div className="text-lg font-bold text-[#38BDF8] drop-shadow-md">
              ⭐ كسبت: {starsEarnedThisSession}
            </div>
          </div>

          {/* Game Over Overlay */}
          {ninjaGameOver && (
            <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center animate-in fade-in zoom-in">
              <h2 className="text-5xl font-black text-red-500 mb-4 animate-bounce">انتهت اللعبة! 💥</h2>
              <p className="text-2xl text-white mb-6">النقاط: {ninjaScore}</p>
              <button 
                onClick={startNinjaGame}
                className="bg-yellow-400 text-slate-900 px-8 py-3 rounded-full font-black text-xl hover:bg-yellow-300 hover:scale-105 transition-transform"
              >
                العب مرة أخرى 🔄
              </button>
            </div>
          )}

          {/* Play Area */}
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            
            {/* Particles */}
            {ninjaParticles.map(p => (
              <div 
                key={p.id} 
                className="absolute w-3 h-3 rounded-full"
                style={{ 
                  left: `${p.x}%`, 
                  top: `${p.y}%`, 
                  backgroundColor: p.color,
                  opacity: p.life
                }} 
              />
            ))}

            {/* Fruits & Bombs */}
            {ninjaFruits.map(f => (
              <div 
                key={f.id}
                className="absolute text-6xl drop-shadow-lg"
                style={{ 
                  left: `${f.x}%`, 
                  top: `${f.y}%`,
                  transform: `translate(-50%, -50%) rotate(${f.rotation}deg)`,
                  filter: f.isSliced ? 'grayscale(100%) opacity(50%)' : 'none'
                }}
              >
                {f.type}
              </div>
            ))}

            {/* Slash trail */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 0 4px white)' }}>
              {ninjaSlash.length > 1 && (
                <polyline 
                  points={ninjaSlash.map(p => `${p.x}%,${p.y}%`).join(' ')} 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              )}
            </svg>
          </div>
        </div>
      )}
