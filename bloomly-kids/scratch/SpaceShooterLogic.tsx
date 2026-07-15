// Space Shooter (حرب الفضاء) Logic to inject into GameZone.tsx

  // NEW GAME: SPACE SHOOTER (حرب الفضاء)
  const [spacePlayerX, setSpacePlayerX] = useState(50);
  const [spaceLasers, setSpaceLasers] = useState<{id: number, x: number, y: number}[]>([]);
  const [spaceEnemies, setSpaceEnemies] = useState<{id: number, x: number, y: number, type: string, hp: number}[]>([]);
  const [spaceParticles, setSpaceParticles] = useState<{id: number, x: number, y: number, color: string, vx: number, vy: number, life: number}[]>([]);
  const [spaceScore, setSpaceScore] = useState(0);
  const [spaceActive, setSpaceActive] = useState(false);
  const [spaceGameOver, setSpaceGameOver] = useState(false);

  const spaceRequestRef = useRef<number>();
  const spaceLastTimeRef = useRef<number>();
  const spaceFireTimerRef = useRef<number>(0);
  const spaceSpawnTimerRef = useRef<number>(0);
  
  const spaceEnemyTypes = ["👾", "🛸", "☄️", "👽"];

  const startSpaceGame = () => {
    requireProfile(() => {
      setSpacePlayerX(50);
      setSpaceLasers([]);
      setSpaceEnemies([]);
      setSpaceParticles([]);
      setSpaceScore(0);
      setSpaceActive(true);
      setSpaceGameOver(false);
      setStarsEarnedThisSession(0);
      setActiveGame("space");
      sfx.speakArabic("اقضِ على الغزاة الفضائيين وتفادى النيازك!", "welcome");
      spaceLastTimeRef.current = performance.now();
      spaceRequestRef.current = requestAnimationFrame(updateSpace);
    });
  };

  const createSpaceParticles = (x: number, y: number, color: string) => {
    const newParticles = [];
    for (let i = 0; i < 10; i++) {
      newParticles.push({
        id: Math.random(),
        x, y,
        color,
        vx: (Math.random() - 0.5) * 200,
        vy: (Math.random() - 0.5) * 200,
        life: 1
      });
    }
    setSpaceParticles(prev => [...prev, ...newParticles]);
  };

  const updateSpace = (time: number) => {
    if (!spaceActive || spaceGameOver) return;
    
    if (!spaceLastTimeRef.current) spaceLastTimeRef.current = time;
    const deltaTime = (time - spaceLastTimeRef.current) / 1000;
    spaceLastTimeRef.current = time;

    // Fire laser automatically
    spaceFireTimerRef.current += deltaTime;
    if (spaceFireTimerRef.current > 0.3) {
      spaceFireTimerRef.current = 0;
      setSpaceLasers(prev => [...prev, { id: Math.random(), x: spacePlayerX, y: 90 }]); // Player is at y=90
    }

    // Spawn enemies
    spaceSpawnTimerRef.current += deltaTime;
    if (spaceSpawnTimerRef.current > Math.max(0.5, 2.0 - spaceScore / 200)) {
      spaceSpawnTimerRef.current = 0;
      setSpaceEnemies(prev => [
        ...prev,
        {
          id: Math.random(),
          x: 10 + Math.random() * 80,
          y: -10,
          type: spaceEnemyTypes[Math.floor(Math.random() * spaceEnemyTypes.length)],
          hp: 1
        }
      ]);
    }

    // Move lasers
    setSpaceLasers(prev => prev.map(l => ({ ...l, y: l.y - 100 * deltaTime })).filter(l => l.y > -10));

    // Move enemies and check collision with player
    setSpaceEnemies(prev => {
      const moved = prev.map(e => ({ ...e, y: e.y + (20 + spaceScore/10) * deltaTime }));
      
      const hitPlayer = moved.some(e => e.y > 85 && e.y < 95 && Math.abs(e.x - spacePlayerX) < 10);
      if (hitPlayer) {
        setSpaceGameOver(true);
        setSpaceActive(false);
        sfx.playWrong();
      }

      return moved.filter(e => e.y < 110);
    });

    // Check laser-enemy collisions
    setSpaceLasers(lasers => {
      let currentLasers = [...lasers];
      setSpaceEnemies(enemies => {
        let currentEnemies = [...enemies];
        let scoreGained = 0;

        for (let i = currentLasers.length - 1; i >= 0; i--) {
          const l = currentLasers[i];
          for (let j = currentEnemies.length - 1; j >= 0; j--) {
            const e = currentEnemies[j];
            if (Math.abs(l.x - e.x) < 8 && Math.abs(l.y - e.y) < 8) {
              // Hit!
              createSpaceParticles(e.x, e.y, '#38BDF8');
              scoreGained += 10;
              sfx.playSuccess();
              currentLasers.splice(i, 1);
              currentEnemies.splice(j, 1);
              break; // laser consumed
            }
          }
        }

        if (scoreGained > 0) {
          setSpaceScore(s => {
            const newScore = s + scoreGained;
            if (Math.floor(newScore / 100) > Math.floor(s / 100)) addStars(1);
            return newScore;
          });
        }
        return currentEnemies;
      });
      return currentLasers;
    });

    // Update particles
    setSpaceParticles(prev => {
      return prev.map(p => ({
        ...p,
        x: p.x + p.vx * deltaTime,
        y: p.y + p.vy * deltaTime,
        life: p.life - deltaTime * 3
      })).filter(p => p.life > 0);
    });

    spaceRequestRef.current = requestAnimationFrame(updateSpace);
  };

  useEffect(() => {
    return () => {
      if (spaceRequestRef.current) cancelAnimationFrame(spaceRequestRef.current);
    };
  }, []);

  const handleSpacePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!spaceActive || spaceGameOver) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSpacePlayerX(Math.max(5, Math.min(95, x)));
  };

// UI BLOCK
      {/* --- SPACE SHOOTER PLAY VIEW --- */}
      {activeGame === "space" && !showLevelMap && (
        <div 
          className="card-bubbly bg-slate-900 max-w-2xl mx-auto p-0 relative overflow-hidden text-white border-4 border-indigo-500 h-[600px] select-none touch-none"
          onPointerMove={handleSpacePointerMove}
          onPointerDown={handleSpacePointerMove}
        >
          {/* Background Stars (Parallax simulation) */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 animate-slide-down" style={{ animationDuration: '4s' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent" />

          {/* Header */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-20 bg-gradient-to-b from-black/80 to-transparent">
            <button
              onClick={quitGame}
              className="flex items-center gap-1 font-bold text-sm text-[#FF5A92] hover:underline"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
              <span>خروج</span>
            </button>
            <div className="font-extrabold text-white text-xl flex items-center gap-2 drop-shadow-md">
              <span>النقاط: {spaceScore}</span>
            </div>
            <div className="text-lg font-bold text-indigo-300 drop-shadow-md">
              ⭐ كسبت: {starsEarnedThisSession}
            </div>
          </div>

          {/* Game Over Overlay */}
          {spaceGameOver && (
            <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center animate-in fade-in zoom-in">
              <h2 className="text-5xl font-black text-red-500 mb-4 animate-bounce">تدمرت مركبتك! 💥</h2>
              <p className="text-2xl text-white mb-6">النقاط: {spaceScore}</p>
              <button 
                onClick={startSpaceGame}
                className="bg-indigo-500 text-white px-8 py-3 rounded-full font-black text-xl hover:bg-indigo-400 hover:scale-105 transition-transform shadow-lg shadow-indigo-500/50"
              >
                العب مرة أخرى 🔄
              </button>
            </div>
          )}

          {/* Play Area */}
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            
            {/* Particles */}
            {spaceParticles.map(p => (
              <div 
                key={p.id} 
                className="absolute w-2 h-2 rounded-full"
                style={{ 
                  left: `${p.x}%`, 
                  top: `${p.y}%`, 
                  backgroundColor: p.color,
                  opacity: p.life,
                  boxShadow: `0 0 8px ${p.color}`
                }} 
              />
            ))}

            {/* Lasers */}
            {spaceLasers.map(l => (
              <div 
                key={l.id}
                className="absolute w-1 h-6 bg-cyan-400 rounded-full"
                style={{ 
                  left: `${l.x}%`, 
                  top: `${l.y}%`,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 10px #22d3ee'
                }}
              />
            ))}

            {/* Enemies */}
            {spaceEnemies.map(e => (
              <div 
                key={e.id}
                className="absolute text-5xl drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]"
                style={{ 
                  left: `${e.x}%`, 
                  top: `${e.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {e.type}
              </div>
            ))}

            {/* Player */}
            <div 
              className="absolute bottom-[5%] text-6xl drop-shadow-[0_0_15px_rgba(99,102,241,0.8)] transition-transform duration-75"
              style={{
                left: `${spacePlayerX}%`,
                transform: 'translateX(-50%)'
              }}
            >
              🚀
            </div>
          </div>
        </div>
      )}
