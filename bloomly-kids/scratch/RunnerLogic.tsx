// Endless Runner Logic to inject into GameZone.tsx

  // NEW GAME: ENDLESS RUNNER (سباق التزلج اللانهائي) replacing TURBO ARROW RACER
  const [runnerLane, setRunnerLane] = useState(1); // 0 = Left, 1 = Center, 2 = Right
  const [runnerObstacles, setRunnerObstacles] = useState<{id: number, lane: number, y: number, type: string}[]>([]);
  const [runnerSpeed, setRunnerSpeed] = useState(5);
  const [runnerScore, setRunnerScore] = useState(0);
  const [runnerActive, setRunnerActive] = useState(false);
  const [runnerGameOver, setRunnerGameOver] = useState(false);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  
  const runnerObstacleTypes = ["🚧", "🪨", "🪵", "🧱", "💧", "📦"];

  const startRunnerGame = () => {
    requireProfile(() => {
      setRunnerLane(1);
      setRunnerObstacles([]);
      setRunnerSpeed(40); // 40 pixels per frame approximately based on delta
      setRunnerScore(0);
      setRunnerActive(true);
      setRunnerGameOver(false);
      setStarsEarnedThisSession(0);
      setActiveGame("arrowRacer");
      sfx.speakArabic("أهلاً بك في سباق التزلج اللانهائي! اسحب يميناً ويساراً لتفادي العقبات!", "welcome");
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(updateRunner);
    });
  };

  const updateRunner = (time: number) => {
    if (!runnerActive || runnerGameOver) return;
    
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    setRunnerObstacles(prev => {
      let newObstacles = prev.map(obs => ({ ...obs, y: obs.y + runnerSpeed * deltaTime * 10 }));
      
      // Collision detection (if y > 80 and < 95 and lane matches)
      // Assuming track height is 100vh or 100%. Let's say player is at y=85.
      const hit = newObstacles.some(obs => obs.lane === runnerLane && obs.y > 80 && obs.y < 90);
      
      if (hit) {
        setRunnerGameOver(true);
        setRunnerActive(false);
        sfx.playWrong();
        return prev;
      }

      // Remove off-screen obstacles
      newObstacles = newObstacles.filter(obs => obs.y < 110);
      
      return newObstacles;
    });

    setRunnerScore(prev => {
      const newScore = prev + deltaTime * 10;
      // Add stars every 100 points
      if (Math.floor(newScore / 100) > Math.floor(prev / 100)) {
        addStars(1);
        sfx.playSuccess();
      }
      return newScore;
    });
    
    setRunnerSpeed(prev => prev + deltaTime * 0.5); // Increase speed over time

    requestRef.current = requestAnimationFrame(updateRunner);
  };

  // Spawn obstacles
  useEffect(() => {
    if (!runnerActive || runnerGameOver) return;
    const interval = setInterval(() => {
      setRunnerObstacles(prev => {
        // Only spawn if not too many
        if (prev.length > 5) return prev;
        const newObs = {
          id: Math.random(),
          lane: Math.floor(Math.random() * 3), // 0, 1, 2
          y: -10, // Start above the screen
          type: runnerObstacleTypes[Math.floor(Math.random() * runnerObstacleTypes.length)]
        };
        return [...prev, newObs];
      });
    }, Math.max(800, 2000 - runnerSpeed * 20)); 
    
    return () => clearInterval(interval);
  }, [runnerActive, runnerGameOver, runnerSpeed]);

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleRunnerSwipe = (direction: 'left' | 'right') => {
    if (!runnerActive || runnerGameOver) return;
    setRunnerLane(prev => {
      if (direction === 'left') return Math.max(0, prev - 1);
      if (direction === 'right') return Math.min(2, prev + 1);
      return prev;
    });
  };

  // Listen to keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeGame === 'arrowRacer' && runnerActive && !runnerGameOver) {
        if (e.key === 'ArrowLeft' || e.key === 'a') handleRunnerSwipe('left');
        if (e.key === 'ArrowRight' || e.key === 'd') handleRunnerSwipe('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame, runnerActive, runnerGameOver]);

// UI BLOCK
      {/* --- ENDLESS RUNNER PLAY VIEW --- */}
      {activeGame === "arrowRacer" && !showLevelMap && (
        <div 
          className="card-bubbly bg-[#0F172A] max-w-2xl mx-auto p-0 relative overflow-hidden text-white border-4 border-[#38BDF8] h-[600px] select-none"
          onPointerDown={(e) => {
            const startX = e.clientX;
            window.onpointerup = (upEvent) => {
              const endX = upEvent.clientX;
              if (endX - startX > 50) handleRunnerSwipe('right');
              else if (startX - endX > 50) handleRunnerSwipe('left');
              window.onpointerup = null;
            };
          }}
        >
          {/* Background / Sky / Perspective Track */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-slate-900 overflow-hidden">
            {/* Stars/Clouds */}
            <div className="absolute top-10 left-10 text-4xl opacity-50">☁️</div>
            <div className="absolute top-20 right-10 text-4xl opacity-50">☁️</div>
            
            {/* Perspective Track */}
            <div 
              className="absolute bottom-0 w-[150%] h-[200%] bg-slate-800 left-1/2 -translate-x-1/2"
              style={{ transform: 'translateX(-50%) perspective(500px) rotateX(60deg)', transformOrigin: 'bottom' }}
            >
              {/* Lane dividers */}
              <div className="absolute top-0 bottom-0 left-1/3 w-2 bg-white/30 border-dashed" />
              <div className="absolute top-0 bottom-0 left-2/3 w-2 bg-white/30 border-dashed" />
              
              {/* Speed lines */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-slide-down" style={{ animationDuration: `${100/runnerSpeed}s` }} />
            </div>
          </div>

          {/* Header */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-20 bg-gradient-to-b from-black/80 to-transparent">
            <button
              onClick={quitGame}
              className="flex items-center gap-1 font-bold text-sm text-[#FF5A92] hover:underline"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
              <span>خروج</span>
            </button>
            <div className="font-extrabold text-yellow-400 text-xl flex items-center gap-2 drop-shadow-md">
              <span>النقاط: {Math.floor(runnerScore)}</span>
            </div>
            <div className="text-lg font-bold text-[#38BDF8] drop-shadow-md">
              ⭐ كسبت: {starsEarnedThisSession}
            </div>
          </div>

          {/* Game Over Overlay */}
          {runnerGameOver && (
            <div className="absolute inset-0 bg-black/70 z-50 flex flex-col items-center justify-center animate-in fade-in zoom-in">
              <h2 className="text-5xl font-black text-red-500 mb-4 animate-bounce">تحطم! 💥</h2>
              <p className="text-2xl text-white mb-6">النقاط: {Math.floor(runnerScore)}</p>
              <button 
                onClick={startRunnerGame}
                className="bg-yellow-400 text-slate-900 px-8 py-3 rounded-full font-black text-xl hover:bg-yellow-300 hover:scale-105 transition-transform"
              >
                العب مرة أخرى 🔄
              </button>
            </div>
          )}

          {/* Play Area */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Obstacles */}
            {runnerObstacles.map(obs => (
              <div 
                key={obs.id}
                className="absolute text-5xl transition-transform duration-75 ease-linear"
                style={{ 
                  left: obs.lane === 0 ? '16%' : obs.lane === 1 ? '50%' : '84%', 
                  top: `${obs.y}%`,
                  transform: `translate(-50%, -50%) scale(${0.5 + obs.y / 100})`, // Gets bigger as it gets closer
                  opacity: obs.y < 0 ? 0 : 1
                }}
              >
                {obs.type}
              </div>
            ))}

            {/* Player Character */}
            <div 
              className="absolute bottom-[10%] text-7xl transition-all duration-200 ease-out drop-shadow-2xl"
              style={{
                left: runnerLane === 0 ? '16%' : runnerLane === 1 ? '50%' : '84%',
                transform: `translateX(-50%) ${runnerActive && !runnerGameOver ? 'animate-bounce-slight' : ''}`
              }}
            >
              🛹
            </div>
          </div>
        </div>
      )}
