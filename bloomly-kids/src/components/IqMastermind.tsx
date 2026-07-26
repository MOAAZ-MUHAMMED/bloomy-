import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Brain, Sparkles, CheckCircle2, RefreshCw } from "lucide-react";

interface IqMastermindProps {
  onWin: (stars: number) => void;
}

interface IQChallenge {
  id: number;
  title: string;
  category: "pattern" | "logic" | "matrix" | "geometry";
  grid: (string | null)[][];
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

const IQ_CHALLENGES: IQChallenge[] = [
  {
    id: 1,
    title: "نمط الأشكال الهندسية الملونة 🔷",
    category: "pattern",
    grid: [
      ["🔴", "🔵", "🟡"],
      ["🔵", "🟡", "🔴"],
      ["🟡", "🔴", null],
    ],
    options: ["🔵", "🟢", "🔴", "🟣"],
    correctAnswerIndex: 0,
    explanation: "كل صف وعمود يحتوي على دائرة حمراء، زرقاء، وسطوع أصفر!",
  },
  {
    id: 2,
    title: "مصفوفة الاتجاهات السحرية 🧭",
    category: "matrix",
    grid: [
      ["⬆️", "➡️", "⬇️"],
      ["➡️", "⬇️", "⬅️"],
      ["⬇️", "⬅️", null],
    ],
    options: ["⬆️", "↗️", "↘️", "⬇️"],
    correctAnswerIndex: 0,
    explanation: "الأسهم تدور مع عقارب الساعة بمقدار 90 درجة!",
  },
  {
    id: 3,
    title: "نمط كائنات الفضاء المضيئة 🛸",
    category: "logic",
    grid: [
      ["👾", "🤖", "🛸"],
      ["🤖", "🛸", "👾"],
      ["🛸", "👾", null],
    ],
    options: ["🤖", "👾", "🛸", "🚀"],
    correctAnswerIndex: 0,
    explanation: "تتابع متوازن للكائنات الفضائية الثلاثة!",
  },
  {
    id: 4,
    title: "تتابع أطوار القمر 🌙",
    category: "geometry",
    grid: [
      ["🌑", "🌒", "🌓"],
      ["🌔", "🌕", "🌖"],
      ["🌗", "🌘", null],
    ],
    options: ["🌑", "🌙", "⭐", "☀️"],
    correctAnswerIndex: 0,
    explanation: "مراحل اكتمال القمر من الجديد إلى الهلال ثم العودة للجديد!",
  },
  {
    id: 5,
    title: "تسلسل الفواكه المنطقية 🍎",
    category: "pattern",
    grid: [
      ["🍎", "🍌", "🍇"],
      ["🍌", "🍇", "🍎"],
      ["🍇", "🍎", null],
    ],
    options: ["🍌", "🍎", "🍊", "🍓"],
    correctAnswerIndex: 0,
    explanation: "ترتيب دوري للفواكه اللذيذة!",
  },
  {
    id: 6,
    title: "مصفوفة القلوب الملونة 💖",
    category: "logic",
    grid: [
      ["❤️", "💙", "💚"],
      ["💙", "💚", "❤️"],
      ["💚", "❤️", null],
    ],
    options: ["💙", "💜", "💛", "🧡"],
    correctAnswerIndex: 0,
    explanation: "ترتيب القلوب الملونة في مصفوفة متكاملة!",
  },
];

export default function IqMastermind({ onWin }: IqMastermindProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | "idle">("idle");
  const [isCompleted, setIsCompleted] = useState(false);

  const currentChallenge = IQ_CHALLENGES[currentIndex];

  const handleSelectOption = (index: number) => {
    if (feedback !== "idle") return;
    setSelectedOption(index);

    if (index === currentChallenge.correctAnswerIndex) {
      setFeedback("correct");
      if ((window as any).sfx) (window as any).sfx.playSuccess();

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#38BDF8", "#FACC15", "#4ADE80", "#EC4899"],
      });

      setTimeout(() => {
        if (currentIndex < IQ_CHALLENGES.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setFeedback("idle");
        } else {
          setIsCompleted(true);
          setTimeout(() => onWin(30), 1800);
        }
      }, 1400);
    } else {
      setFeedback("wrong");
      if ((window as any).sfx) (window as any).sfx.playWrong();

      setTimeout(() => {
        setFeedback("idle");
        setSelectedOption(null);
      }, 1000);
    }
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center" dir="rtl">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="relative mb-6">
          <Brain className="w-28 h-28 text-yellow-400 animate-pulse filter drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]" />
          <Sparkles className="w-12 h-12 text-cyan-300 absolute -top-2 -right-2 animate-bounce" />
        </motion.div>
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 mb-3 drop-shadow-md">
          أنت عبقري الذكاء الخارق! 🧠✨
        </h2>
        <p className="text-xl font-bold text-slate-200 mb-8 max-w-md">
          حللت جميع مصفوفات وألغاز الذكاء المتقدمة ببراعة وسرعة فائقة!
        </p>
        <button
          onClick={() => onWin(30)}
          className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-2xl px-10 py-4 rounded-full shadow-[0_0_30px_rgba(250,204,21,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          استلم تاج العباقرة والنجوم 👑
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4 py-6 font-sans select-none" dir="rtl">
      {/* Header Banner */}
      <div className="bg-slate-900/90 backdrop-blur-md px-8 py-3 rounded-full border-2 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.3)] mb-6 flex items-center gap-4">
        <Brain className="w-7 h-7 text-indigo-400" />
        <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
          تحدي عباقرة الذكاء ({currentIndex + 1} / {IQ_CHALLENGES.length})
        </span>
      </div>

      <h3 className="text-2xl font-black text-slate-100 text-center mb-6 drop-shadow-md">
        {currentChallenge.title}
      </h3>

      {/* 3x3 Matrix Grid */}
      <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border-4 border-indigo-500/60 shadow-2xl mb-8">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {currentChallenge.grid.map((row, rIdx) =>
            row.map((cell, cIdx) => (
              <motion.div
                key={`${rIdx}-${cIdx}`}
                whileHover={{ scale: 1.05 }}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl shadow-md transition-all ${
                  cell === null
                    ? "bg-indigo-950 border-4 border-dashed border-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.4)] animate-pulse"
                    : "bg-slate-800/90 border-2 border-slate-700"
                }`}
              >
                {cell !== null ? (
                  <span className="filter drop-shadow">{cell}</span>
                ) : (
                  <span className="text-3xl font-black text-cyan-300">❓</span>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Answer Options */}
      <div className="flex flex-wrap justify-center gap-4 max-w-lg">
        {currentChallenge.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = isSelected && feedback === "correct";
          const isWrong = isSelected && feedback === "wrong";

          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleSelectOption(idx)}
              disabled={feedback !== "idle"}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl border-3 shadow-xl transition-all cursor-pointer ${
                isCorrect
                  ? "bg-emerald-500 border-emerald-300 text-white scale-110 shadow-[0_0_25px_rgba(16,185,129,0.8)]"
                  : isWrong
                  ? "bg-red-600 border-red-300 text-white animate-shake shadow-[0_0_25px_rgba(239,68,68,0.8)]"
                  : "bg-slate-800/90 border-slate-700 hover:border-indigo-400 hover:bg-slate-700"
              }`}
            >
              <span className="filter drop-shadow">{option}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
