import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

export default function FunHiddenCup({ onComplete, onBack }: Props) {
  const [cups, setCups] = useState([0, 1, 2]);
  const [ballIndex, setBallIndex] = useState(1);
  const [isShuffling, setIsShuffling] = useState(false);
  const [revealed, setRevealed] = useState<number | null>(null);
  const [message, setMessage] = useState("Watch the ball!");
  const [hasStarted, setHasStarted] = useState(false);

  const startGame = async () => {
    setHasStarted(true);
    setRevealed(null);
    setMessage("Shuffling...");
    setIsShuffling(true);

    // Initial show
    setRevealed(ballIndex);
    await new Promise(r => setTimeout(r, 1500));
    setRevealed(null);
    await new Promise(r => setTimeout(r, 500));

    let currentCups = [...cups];
    for (let i = 0; i < 5; i++) {
      const idx1 = Math.floor(Math.random() * 3);
      let idx2 = Math.floor(Math.random() * 3);
      while (idx1 === idx2) idx2 = Math.floor(Math.random() * 3);
      
      const temp = currentCups[idx1];
      currentCups[idx1] = currentCups[idx2];
      currentCups[idx2] = temp;
      
      setCups([...currentCups]);
      await new Promise(r => setTimeout(r, 400));
    }
    
    setIsShuffling(false);
    setMessage("Where's the ball?");
  };

  const handleCupClick = (cupVal: number) => {
    if (isShuffling || !hasStarted || revealed !== null) return;
    
    setRevealed(cupVal);
    if (cupVal === ballIndex) {
      setMessage("You found it! 🎉");
      setTimeout(onComplete, 1500);
    } else {
      setMessage("Oops! Try again.");
      setTimeout(() => setHasStarted(false), 1500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-6 bg-blue-100 rounded-3xl shadow-xl relative overflow-hidden">
      {onBack && (
        <button onClick={onBack} className="absolute top-4 left-4 bg-white/50 hover:bg-white text-blue-500 p-2 rounded-full shadow-md transition-colors font-bold z-10">
          ← Back
        </button>
      )}
      <h2 className="text-3xl font-extrabold text-blue-500 mb-2 drop-shadow-sm font-sans tracking-wide">
        Hidden Ball! 🎾
      </h2>
      <p className="text-blue-400 mb-8 font-bold text-xl h-8">{message}</p>

      {!hasStarted && !revealed ? (
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="bg-blue-400 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-500 transition-colors text-xl mb-8 z-20"
        >
          Start Game
        </motion.button>
      ) : (
        <div className="h-16 mb-8" />
      )}

      <div className="flex gap-8 justify-center relative w-full max-w-lg h-32 items-end">
        {cups.map((cupVal) => (
          <motion.div
            key={cupVal}
            layout
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="flex flex-col items-center relative cursor-pointer group"
            onClick={() => handleCupClick(cupVal)}
            style={{ zIndex: revealed === cupVal ? 10 : 1 }}
          >
            <motion.div 
              animate={{ y: revealed === cupVal ? -60 : 0 }}
              className="text-7xl drop-shadow-xl group-hover:scale-105 transition-transform"
            >
              🥤
            </motion.div>
            {cupVal === ballIndex && (
              <div className="absolute bottom-0 text-4xl -z-10">
                🎾
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
