import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Square, RotateCcw, Volume2, Mic, CheckCircle, ArrowLeft, ArrowRight, Home, Star } from "lucide-react";
import { ScreenOrientation } from '@capacitor/screen-orientation';

interface Surah {
  id: number;
  name: string;
  englishId: string; // Surah number in 3 digits (e.g. 001)
  verses: string[];
}

const surahs: Surah[] = [
  {
    id: 1,
    name: "سورة الفاتحة",
    englishId: "001",
    verses: [
      "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "الرَّحْمَنِ الرَّحِيمِ",
      "مَالِكِ يَوْمِ الدِّينِ",
      "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ"
    ]
  },
  {
    id: 108,
    name: "سورة الكوثر",
    englishId: "108",
    verses: [
      "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
      "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
      "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ"
    ]
  },
  {
    id: 110,
    name: "سورة النصر",
    englishId: "110",
    verses: [
      "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
      "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا",
      "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا"
    ]
  },
  {
    id: 112,
    name: "سورة الإخلاص",
    englishId: "112",
    verses: [
      "قُلْ هُوَ اللَّهُ أَحَدٌ",
      "اللَّهُ الصَّمَدُ",
      "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ"
    ]
  },
  {
    id: 113,
    name: "سورة الفلق",
    englishId: "113",
    verses: [
      "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
      "مِن شَرِّ مَا خَلَقَ",
      "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
      "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
      "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ"
    ]
  },
  {
    id: 114,
    name: "سورة الناس",
    englishId: "114",
    verses: [
      "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
      "مَلِكِ النَّاسِ",
      "إِلَهِ النَّاسِ",
      "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
      "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
      "مِنَ الْجِنَّةِ وَالنَّاسِ"
    ]
  },
  {
    id: 105,
    name: "سورة الفيل",
    englishId: "105",
    verses: [
      "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ",
      "أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ",
      "وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ",
      "تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ",
      "فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ"
    ]
  },
  {
    id: 109,
    name: "سورة الكافرون",
    englishId: "109",
    verses: [
      "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
      "لَا أَعْبُدُ مَا تَعْبُدُونَ",
      "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ",
      "وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ",
      "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ",
      "لَكُمْ دِينُكُمْ وَلِيَ دِينِ"
    ]
  },
  {
    id: 111,
    name: "سورة المسد",
    englishId: "111",
    verses: [
      "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ",
      "مَا أَغْنَى عَنْهُ مَالُهُ وَمَا كَسَبَ",
      "سَيَصْلَى نَارًا ذَاتَ لَهَبٍ",
      "وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ",
      "فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ"
    ]
  }
];

interface ThikrItem {
  label: string;
  text: string;
}

interface Thikr {
  title: string;
  emoji: string;
  items: ThikrItem[];
}

const athkarData: Record<string, Thikr> = {
  bed: {
    title: "أذكار النوم والاستيقاظ 🛏️",
    emoji: "🛏️",
    items: [
      {
        label: "عند النوم",
        text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ."
      },
      {
        label: "عند الاستيقاظ",
        text: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ."
      }
    ]
  },
  food: {
    title: "آداب الطعام والشراب 🍎",
    emoji: "🍎",
    items: [
      {
        label: "قبل الطعام",
        text: "بِسْمِ اللَّهِ. اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ."
      },
      {
        label: "بعد الطعام",
        text: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ."
      }
    ]
  },
  door: {
    title: "أذكار الدخول والخروج 🚪",
    emoji: "🚪",
    items: [
      {
        label: "عند دخول المنزل",
        text: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا."
      },
      {
        label: "عند خروج المنزل",
        text: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ."
      }
    ]
  },
  bathroom: {
    title: "أذكار دخول وخروج الخلاء 🚿",
    emoji: "🚿",
    items: [
      {
        label: "عند الدخول",
        text: "بِسْمِ اللَّهِ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ."
      },
      {
        label: "عند الخروج",
        text: "غُفْرَانَكَ. الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الْأَذَى وَعَافَانِي."
      }
    ]
  }
};

interface QuranIslandProps {
  onClose: () => void;
  globalStars: number;
  setGlobalStars?: React.Dispatch<React.SetStateAction<number>>;
}

export default function QuranIsland({ onClose, globalStars, setGlobalStars }: QuranIslandProps) {
  // Navigation State: "selection" | "quran" | "athkar"
  const [currentScreen, setCurrentScreen] = useState<"selection" | "quran" | "athkar">("selection");

  // Quran State
  const [selectedSurah, setSelectedSurah] = useState<Surah>(surahs[0]);
  const [activeVerseIndex, setActiveVerseIndex] = useState<number | null>(null);
  const [repeatCount, setRepeatCount] = useState<number>(3); // default 3 repetitions
  const [currentRepetition, setCurrentRepetition] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Athkar State
  const [activeThikrKey, setActiveThikrKey] = useState<string | null>(null);
  const [activeThikrTab, setActiveThikrTab] = useState<number>(0);
  const [isRecordingThikr, setIsRecordingThikr] = useState<boolean>(false);
  const [recordedThikrUrl, setRecordedThikrUrl] = useState<string | null>(null);
  const [isListeningThikrBack, setIsListeningThikrBack] = useState<boolean>(false);
  const [thikrEarnedStars, setThikrEarnedStars] = useState<Record<string, boolean>>({});

  // Microphone recording states (Quran)
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isListeningBack, setIsListeningBack] = useState<boolean>(false);

  // Audio References
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const playbackRef = useRef<HTMLAudioElement | null>(null);

  const [noticeText, setNoticeText] = useState<string | null>(null);

  // Lock screen orientation to landscape on mobile
  useEffect(() => {
    try {
      if (ScreenOrientation) {
        ScreenOrientation.lock({ orientation: 'landscape' }).catch(() => {});
      }
    } catch (e) {}
    return () => {
      try {
        if (ScreenOrientation) {
          ScreenOrientation.unlock().catch(() => {});
        }
      } catch (e) {}
    };
  }, []);

  const triggerNotice = (text: string) => {
    setNoticeText(text);
    setTimeout(() => setNoticeText(null), 2500);
  };

  const updateStars = (diff: number) => {
    if (setGlobalStars) {
      setGlobalStars(prev => {
        const next = Math.max(0, prev + diff);
        localStorage.setItem("bloomly_stars", next.toString());
        return next;
      });
    } else {
      const prev = parseInt(localStorage.getItem("bloomly_stars") || "0", 10);
      localStorage.setItem("bloomly_stars", Math.max(0, prev + diff).toString());
    }
  };

  // Play verse by verse audio streaming from everyayah
  const playVerse = (verseIdx: number, rep: number) => {
    if (verseIdx >= selectedSurah.verses.length) {
      // Completed Surah!
      stopPlaying();
      updateStars(20); // Reward double stars (20 stars) as requested
      triggerNotice("🎉 ممتاز جداً! أتممت الاستماع والتكرار وحصلت على ٢٠ نجمة مضاعفة! ⭐⭐");
      return;
    }

    setActiveVerseIndex(verseIdx);
    setCurrentRepetition(rep);
    setIsPlaying(true);

    const verseNum = verseIdx + 1;
    const verseStr = verseNum.toString().padStart(3, "0");
    const audioUrl = `https://www.everyayah.com/data/Husary_Muallim_128kbps/${selectedSurah.englishId}${verseStr}.mp3`;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onended = () => {
      if (rep < repeatCount) {
        playVerse(verseIdx, rep + 1);
      } else {
        startRecording();
        triggerNotice("🎙️ حان دورك! ردد الآية الآن...");
      }
    };

    audio.onerror = () => {
      triggerNotice("⚠️ فشل تحميل الصوت، يرجى التحقق من اتصال الإنترنت.");
      stopPlaying();
    };

    audio.play().catch(e => {
      console.warn("Audio play blocked/failed:", e);
      stopPlaying();
    });
  };

  const startPlaying = () => {
    playVerse(0, 1);
  };

  const stopPlaying = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setActiveVerseIndex(null);
    setCurrentRepetition(1);
    setIsPlaying(false);
  };

  // Microphone Recording Logic (Quran)
  const startRecording = async () => {
    try {
      setRecordedAudioUrl(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        triggerNotice("🎤 تم حفظ تلاوتك! اضغط استماع لتسمع تلاوتك الجميلة.");
      };

      mediaRecorder.start();
      setIsRecording(true);
      triggerNotice("🎙️ جاري تسجيل تلاوتك الآن، اقرأ بصوتك الجميل...");
    } catch (e) {
      console.warn(e);
      triggerNotice("❌ لم نتمكن من الوصول للميكروفون، يرجى تفعيل السماح بالوصول من الإعدادات!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      try {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      } catch (err) {}
      
      if (isPlaying && activeVerseIndex !== null) {
        setTimeout(() => {
          playVerse(activeVerseIndex + 1, 1);
        }, 1000);
      }
    }
  };

  const startListenPlayback = () => {
    if (!recordedAudioUrl) return;

    if (playbackRef.current) {
      playbackRef.current.pause();
    }

    const audio = new Audio(recordedAudioUrl);
    playbackRef.current = audio;
    setIsListeningBack(true);

    audio.onended = () => {
      setIsListeningBack(false);
    };

    audio.play().catch(() => {
      setIsListeningBack(false);
    });
  };

  const stopListenPlayback = () => {
    if (playbackRef.current) {
      playbackRef.current.pause();
    }
    setIsListeningBack(false);
  };

  // Recording Logic (Athkar)
  const startRecordingThikr = async () => {
    try {
      setRecordedThikrUrl(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedThikrUrl(audioUrl);
        triggerNotice("🎤 تم حفظ تلاوتك للذكر! اضغط استماع لتسمع صوتك الجميل.");
      };

      mediaRecorder.start();
      setIsRecordingThikr(true);
      triggerNotice("🎙️ جاري تسجيل صوتك العذب، تفضل بالقراءة...");
    } catch (e) {
      console.warn(e);
      triggerNotice("❌ لم نتمكن من الوصول للميكروفون، يرجى السماح بالوصول من الإعدادات!");
    }
  };

  const stopRecordingThikr = () => {
    if (mediaRecorderRef.current && isRecordingThikr) {
      mediaRecorderRef.current.stop();
      setIsRecordingThikr(false);
      try {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      } catch (err) {}
    }
  };

  const playRecordedThikr = () => {
    if (!recordedThikrUrl) return;
    if (playbackRef.current) playbackRef.current.pause();
    const audio = new Audio(recordedThikrUrl);
    playbackRef.current = audio;
    setIsListeningThikrBack(true);
    audio.onended = () => setIsListeningThikrBack(false);
    audio.play().catch(() => setIsListeningThikrBack(false));
  };

  const stopRecordedThikr = () => {
    if (playbackRef.current) playbackRef.current.pause();
    setIsListeningThikrBack(false);
  };

  // Text-To-Speech for Athkar Arabic Supplications
  const speakThikr = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.85; // slightly slower for children
    utterance.pitch = 1.1;  // happy kids pitch
    window.speechSynthesis.speak(utterance);
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (playbackRef.current) playbackRef.current.pause();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9990] bg-gradient-to-b from-[#E0F2FE] via-[#F0FDFA] to-[#FAF7FD] select-none font-sans flex flex-col justify-between overflow-hidden">
      
      {/* Dynamic CSS Keyframe Animations for Selection & Room Screen */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.6)); }
          50% { transform: scale(1.08); filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.95)); }
        }
        .animate-pulse-glow { animation: pulseGlow 2.2s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4D2B82; border-radius: 10px; }
      `}} />

      {/* Floating Star Reward Indicator (Top-Right) */}
      <div className="absolute top-4 right-4 z-[9990] select-none pointer-events-auto">
        <div className="flex items-center gap-1.5 bg-[#FFFCE6] border-3 border-[#D97706] text-[#D97706] font-black text-sm px-4 py-2 rounded-full shadow-lg">
          <span className="text-lg text-yellow-400">★</span>
          <span>نجومك: {globalStars}</span>
        </div>
      </div>
      
      {/* Exit/Back Button (Top-Left) */}
      <div className="absolute top-4 left-4 z-[9990] select-none pointer-events-auto">
        {currentScreen === "selection" ? (
          <button
            onClick={() => {
              stopPlaying();
              onClose();
            }}
            className="w-12 h-12 bg-white hover:bg-red-50 text-red-500 rounded-full flex items-center justify-center cursor-pointer border-3 border-[#4D2B82] shadow-[0_4px_0_0_#4D2B82] active:translate-y-1 active:shadow-none transition-all"
          >
            <X className="w-6 h-6 stroke-[3px]" />
          </button>
        ) : (
          <button
            onClick={() => {
              stopPlaying();
              stopRecordedThikr();
              setCurrentScreen("selection");
            }}
            className="w-12 h-12 bg-white hover:bg-purple-50 text-[#4D2B82] rounded-full flex items-center justify-center cursor-pointer border-3 border-[#4D2B82] shadow-[0_4px_0_0_#4D2B82] active:translate-y-1 active:shadow-none transition-all"
          >
            <ArrowRight className="w-6 h-6 stroke-[3px]" />
          </button>
        )}
      </div>

      {/* Notice Banner */}
      <AnimatePresence>
        {noticeText && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 inset-x-0 mx-auto w-fit max-w-sm px-6 py-2.5 rounded-full border-3 bg-white text-center font-extrabold text-sm shadow-md z-[9999]"
            style={{
              borderColor: noticeText.startsWith("❌") ? "#EF4444" : noticeText.startsWith("🎉") || noticeText.startsWith("🌱") ? "#2ECC71" : "#FF9F29",
              color: noticeText.startsWith("❌") ? "#EF4444" : "#4D2B82",
            }}
          >
            {noticeText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 1. SELECTION SCREEN (Din & Quran Selection Hub) */}
      {/* ========================================================================= */}
      {currentScreen === "selection" && (
        <div className="flex-grow w-full flex flex-col justify-center items-center p-6 pt-20 relative overflow-hidden select-none">
          {/* Cloud decorations */}
          <div className="absolute top-10 left-10 text-4xl opacity-20 animate-pulse">☁️</div>
          <div className="absolute top-16 right-20 text-5xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }}>☁️</div>
          <div className="absolute bottom-10 left-1/4 text-6xl opacity-10 pointer-events-none">☁️</div>

          <h2 className="text-3xl font-black text-[#4D2B82] mb-10 text-center drop-shadow-sm border-b-4 border-dashed border-[#4D2B82]/20 pb-3 max-w-md">
            الدين القيم والقرآن الكريم 🕌✨
          </h2>

          <div className="flex flex-col sm:flex-row gap-8 max-w-4xl w-full justify-center px-4">
            
            {/* Card 1: القرآن الكريم */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentScreen("quran")}
              className="flex-1 bg-gradient-to-b from-[#FFFCE6] to-[#FFF3B3] rounded-[40px] border-[6px] border-white shadow-2xl cursor-pointer p-6 flex flex-col items-center justify-between text-center min-h-[250px] relative overflow-hidden group"
              style={{ boxShadow: "0 15px 0 0 #D97706, 0 25px 15px rgba(0,0,0,0.15)" }}
            >
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-inner bg-emerald-50 mb-4 flex items-center justify-center relative">
                <img 
                  src="/assets/images/logos/din_quran_logo_3d.jpg" 
                  alt="Quran" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <h3 className="text-2xl font-black text-[#854D0E] mb-2 leading-tight">القرآن الكريم 📖</h3>
              <p className="text-xs font-bold text-[#A16207]">الاستماع والتكرار والتسجيل لأجمل السور القصيرة</p>
            </motion.div>

            {/* Card 2: غرفة الأذكار */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentScreen("athkar")}
              className="flex-1 bg-gradient-to-b from-[#E0F2FE] to-[#BAE6FD] rounded-[40px] border-[6px] border-white shadow-2xl cursor-pointer p-6 flex flex-col items-center justify-between text-center min-h-[250px] relative overflow-hidden group"
              style={{ boxShadow: "0 15px 0 0 #0284C7, 0 25px 15px rgba(0,0,0,0.15)" }}
            >
              {/* Cozy Bedroom representation in card */}
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-inner bg-sky-100 mb-4 flex items-center justify-center relative">
                <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-md group-hover:scale-110 transition-transform duration-500">
                  <rect x="10" y="45" width="80" height="40" rx="10" fill="#3B82F6" stroke="#fff" strokeWidth="4" />
                  <rect x="5" y="20" width="10" height="65" rx="3" fill="#78350F" stroke="#fff" strokeWidth="3" />
                  <rect x="85" y="30" width="10" height="55" rx="3" fill="#78350F" stroke="#fff" strokeWidth="3" />
                  <rect x="15" y="35" width="25" height="15" rx="3" fill="#fff" stroke="#93C5FD" strokeWidth="2.5" />
                  <circle cx="50" cy="20" r="10" fill="#FEF08A" />
                  <circle cx="45" cy="20" r="10" fill="#E0F2FE" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-[#0369A1] mb-2 leading-tight">غرفة الأذكار 🛏️</h3>
              <p className="text-xs font-bold text-[#075985]">تعلم أذكار اليوم والليلة بأسلوب تفاعلي وممتع</p>
            </motion.div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. QURAN RECITER VIEW */}
      {/* ========================================================================= */}
      {currentScreen === "quran" && (
        <main className="quran-main-panel flex-grow w-full flex flex-col md:flex-row p-6 gap-6 pt-20 relative z-10 overflow-hidden">
          
          {/* Side Panel: Surah List */}
          <div className="quran-surah-sidebar w-full md:w-[280px] bg-white/70 backdrop-blur-sm border-3 border-[#4D2B82] rounded-[24px] p-4 flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shadow-sm select-none">
            <h3 className="hidden md:block font-black text-base text-[#4D2B82] border-b-2 border-purple-100 pb-2 mb-2 text-right">
              📖 اختر السورة للحفظ:
            </h3>
            {surahs.map((surah) => {
              const isSelected = selectedSurah.id === surah.id;
              return (
                <button
                  key={surah.id}
                  onClick={() => {
                    stopPlaying();
                    setSelectedSurah(surah);
                    setRecordedAudioUrl(null);
                  }}
                  className={`w-[140px] md:w-full flex-shrink-0 text-right p-3.5 rounded-xl font-extrabold text-sm transition-all border-2 cursor-pointer ${
                    isSelected
                      ? "bg-[#4D2B82] text-white border-[#4D2B82] shadow-md"
                      : "bg-white hover:bg-purple-50 text-[#4D2B82] border-purple-150"
                  }`}
                >
                  <span>{surah.name}</span>
                </button>
              );
            })}
          </div>

          {/* Center Panel: Verse Board */}
          <div className="quran-verse-board flex-grow bg-white border-3 border-[#4D2B82] rounded-[32px] p-6 flex flex-col justify-between shadow-lg overflow-hidden relative">
            
            {/* Top Surah info */}
            <div className="flex items-center justify-between border-b-2 border-purple-100 pb-3 mb-4">
              <div className="text-right">
                <h2 className="text-xl font-black text-[#4D2B82]">{selectedSurah.name}</h2>
                <span className="text-[10px] text-gray-500 font-extrabold">عدد الآيات: {selectedSurah.verses.length}</span>
              </div>

              {/* Repetitions */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-black text-[#4D2B82] ml-2">تكرار الآية:</span>
                {[1, 3, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setRepeatCount(num)}
                    disabled={isPlaying}
                    className={`w-9 h-9 rounded-full border-2 font-black text-xs flex items-center justify-center cursor-pointer transition-colors ${
                      repeatCount === num
                        ? "bg-emerald-500 text-white border-emerald-700 shadow-sm"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                  >
                    {num}x
                  </button>
                ))}
              </div>
            </div>

            {/* Verses Container */}
            <div className="quran-verse-list flex-grow overflow-y-auto custom-scrollbar space-y-4 px-2 py-4 mb-4 text-center">
              {selectedSurah.verses.map((verse, index) => {
                const isActive = activeVerseIndex === index;
                return (
                  <motion.div
                    key={index}
                    animate={isActive ? { scale: 1.03 } : { scale: 1 }}
                    className={`p-4 rounded-2xl transition-all border-2 text-xl font-extrabold leading-loose ${
                      isActive
                        ? "bg-[#EAFDF3] text-emerald-800 border-emerald-500 shadow-sm"
                        : "bg-transparent text-gray-800 border-transparent"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-2xl font-black">{verse}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full border">
                          آية {index + 1}
                        </span>
                        {isActive && (
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-black animate-pulse">
                            قراءة تكرار {currentRepetition} من {repeatCount} 🔊
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between border-t-2 border-purple-100 pt-4 gap-4">
              <div className="flex gap-2.5">
                {!isPlaying ? (
                  <button
                    onClick={startPlaying}
                    className="btn-bubbly-primary text-xs py-3 px-6 flex items-center gap-1.5"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>بدء الاستماع والتكرار 🚀</span>
                  </button>
                ) : (
                  <button
                    onClick={stopPlaying}
                    className="bg-red-500 hover:bg-red-600 text-white font-black text-xs py-3 px-6 rounded-full border-3 border-red-700 shadow-[0_4px_0_0_#991B1B] active:translate-y-1 active:shadow-none flex items-center gap-1.5 cursor-pointer"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>إيقاف التشغيل</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#4D2B82]">سجل صوتك:</span>
                
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    disabled={isPlaying || isListeningBack}
                    className="bg-[#A855F7] hover:bg-[#9333EA] disabled:opacity-50 text-white font-black text-xs py-2.5 px-4 rounded-full border-2 border-purple-700 shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <Mic className="w-4 h-4" />
                    <span>سجل الآن 🎙️</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="bg-red-500 hover:bg-red-600 text-white font-black text-xs py-2.5 px-4 rounded-full border-2 border-red-700 shadow-sm flex items-center gap-1 animate-pulse cursor-pointer"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>إيقاف الحفظ</span>
                  </button>
                )}

                {recordedAudioUrl && (
                  <div className="flex gap-1.5">
                    {!isListeningBack ? (
                      <button
                        onClick={startListenPlayback}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs py-2.5 px-4 rounded-full border-2 border-emerald-700 shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>استمع لصوتك 🎧</span>
                      </button>
                    ) : (
                      <button
                        onClick={stopListenPlayback}
                        className="bg-red-500 hover:bg-red-600 text-white font-black text-xs py-2.5 px-4 rounded-full border-2 border-red-700 shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Square className="w-4 h-4 fill-white" />
                        <span>إيقاف</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE ATHKAR ROOM VIEW (Remembrance Room) */}
      {/* ========================================================================= */}
      {currentScreen === "athkar" && (
        <div className="flex-grow w-full flex flex-col justify-start items-center p-6 pt-20 relative overflow-hidden select-none">
          
          <div className="text-center mb-4 z-10">
            <h2 className="text-2xl font-black text-[#0369A1]">غرفة الأذكار السحرية 🌟🛌</h2>
            <p className="text-xs font-bold text-sky-700 mt-1">اضغط على أجزاء الغرفة لتكتشف وتقرأ أذكارك اليومية الجسورة!</p>
          </div>

          {/* Interactive room layout container */}
          <div className="relative w-full max-w-4xl aspect-[8/4.5] bg-white border-[6px] border-[#0369A1] rounded-[32px] shadow-2xl overflow-hidden">
            
            {/* Vector Bedroom SVG Scene */}
            <svg viewBox="0 0 800 450" className="w-full h-full rounded-[24px] shadow-inner select-none pointer-events-auto">
              {/* Room Walls & Floor */}
              <rect x="0" y="0" width="800" height="300" fill="#FEF2F2" /> {/* Wall color */}
              <rect x="0" y="300" width="800" height="150" fill="#F59E0B" opacity="0.9" /> {/* Floor */}
              <rect x="0" y="290" width="800" height="10" fill="#D97706" /> {/* Baseboard */}

              {/* Parallax night window in the middle */}
              <rect x="330" y="40" width="140" height="100" rx="12" fill="#1E1B4B" stroke="#fff" strokeWidth="5" />
              {/* Moon & stars */}
              <circle cx="410" cy="80" r="16" fill="#FEF08A" />
              <circle cx="402" cy="80" r="16" fill="#1E1B4B" />
              <circle cx="360" cy="70" r="1.5" fill="#fff" />
              <circle cx="370" cy="110" r="1.5" fill="#fff" />
              <circle cx="445" cy="70" r="1.5" fill="#fff" />

              {/* Main Exit/Entry Door (Left) */}
              <rect x="50" y="60" width="90" height="230" fill="#854D0E" stroke="#fff" strokeWidth="4" rx="4" />
              <rect x="58" y="70" width="74" height="210" fill="none" stroke="#A16207" strokeWidth="3" />
              <circle cx="120" cy="180" r="5" fill="#FBBF24" />

              {/* Bathroom Door (Right) */}
              <rect x="660" y="60" width="90" height="230" fill="#4B5563" stroke="#fff" strokeWidth="4" rx="4" />
              <rect x="668" y="70" width="74" height="210" fill="none" stroke="#6B7280" strokeWidth="3" />
              <circle cx="680" cy="180" r="5" fill="#FBBF24" />
              {/* Shower sign */}
              <circle cx="705" cy="110" r="8" fill="none" stroke="#fff" strokeWidth="2" />
              <line x1="705" y1="118" x2="705" y2="128" stroke="#fff" strokeWidth="1.5" />
              <line x1="705" y1="120" x2="701" y2="125" stroke="#fff" strokeWidth="1.5" />
              <line x1="705" y1="120" x2="709" y2="125" stroke="#fff" strokeWidth="1.5" />

              {/* Interactive Bed (Left center) */}
              <g transform="translate(180, 220)">
                <rect x="10" y="40" width="180" height="40" rx="8" fill="#78350F" stroke="#fff" strokeWidth="3.5" />
                <rect x="0" y="10" width="15" height="70" rx="4" fill="#78350F" stroke="#fff" strokeWidth="3.5" />
                <rect x="180" y="25" width="15" height="55" rx="4" fill="#78350F" stroke="#fff" strokeWidth="3.5" />
                <rect x="15" y="30" width="165" height="30" fill="#2563EB" rx="4" />
                <rect x="50" y="20" width="130" height="30" fill="#60A5FA" rx="4" />
                <rect x="20" y="22" width="30" height="15" rx="4" fill="#fff" stroke="#93C5FD" strokeWidth="2" />
              </g>

              {/* Dining Table with apple (Right center) */}
              <g transform="translate(480, 240)">
                <rect x="25" y="40" width="12" height="50" fill="#78350F" rx="2" />
                <rect x="93" y="40" width="12" height="50" fill="#78350F" rx="2" />
                <ellipse cx="65" cy="40" rx="65" ry="12" fill="#D97706" stroke="#fff" strokeWidth="4" />
                {/* Red Apple on table */}
                <circle cx="55" cy="27" r="9" fill="#EF4444" stroke="#fff" strokeWidth="1.5" />
                <path d="M55 18 Q57 14, 60 14" fill="none" stroke="#10B981" strokeWidth="1.5" />
                {/* Plate and Cup */}
                <ellipse cx="65" cy="31" rx="16" ry="4" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1" />
                <rect x="85" y="18" width="10" height="16" fill="#E5E7EB" stroke="#4B5563" strokeWidth="1" rx="2" />
              </g>
            </svg>

            {/* Glowing Hotspot Overlays */}
            
            {/* 1. Main Door (Left) */}
            <div className="absolute top-[20%] left-[6%] w-[12%] h-[60%] flex items-center justify-center">
              <button
                onClick={() => {
                  setActiveThikrKey("door");
                  setActiveThikrTab(0);
                  setRecordedThikrUrl(null);
                }}
                className="w-14 h-14 bg-yellow-400 hover:bg-yellow-500 border-3 border-white rounded-full flex items-center justify-center text-2xl shadow-lg cursor-pointer animate-pulse-glow"
              >
                🚪
              </button>
            </div>

            {/* 2. Cozy Bed (Center Left) */}
            <div className="absolute top-[52%] left-[28%] w-[18%] h-[25%] flex items-center justify-center">
              <button
                onClick={() => {
                  setActiveThikrKey("bed");
                  setActiveThikrTab(0);
                  setRecordedThikrUrl(null);
                }}
                className="w-14 h-14 bg-sky-400 hover:bg-sky-500 border-3 border-white rounded-full flex items-center justify-center text-2xl shadow-lg cursor-pointer animate-pulse-glow"
                style={{ animationDelay: '0.5s' }}
              >
                🛏️
              </button>
            </div>

            {/* 3. Dining Table (Center Right) */}
            <div className="absolute top-[55%] left-[60%] w-[16%] h-[22%] flex items-center justify-center">
              <button
                onClick={() => {
                  setActiveThikrKey("food");
                  setActiveThikrTab(0);
                  setRecordedThikrUrl(null);
                }}
                className="w-14 h-14 bg-emerald-400 hover:bg-emerald-500 border-3 border-white rounded-full flex items-center justify-center text-2xl shadow-lg cursor-pointer animate-pulse-glow"
                style={{ animationDelay: '1s' }}
              >
                🍎
              </button>
            </div>

            {/* 4. Bathroom Door (Right) */}
            <div className="absolute top-[20%] left-[82%] w-[12%] h-[60%] flex items-center justify-center">
              <button
                onClick={() => {
                  setActiveThikrKey("bathroom");
                  setActiveThikrTab(0);
                  setRecordedThikrUrl(null);
                }}
                className="w-14 h-14 bg-purple-400 hover:bg-purple-500 border-3 border-white rounded-full flex items-center justify-center text-2xl shadow-lg cursor-pointer animate-pulse-glow"
                style={{ animationDelay: '1.5s' }}
              >
                🚿
              </button>
            </div>

          </div>

          {/* Detailed Supplication Modal popup */}
          <AnimatePresence>
            {activeThikrKey && (() => {
              const thikr = athkarData[activeThikrKey];
              const selectedItem = thikr.items[activeThikrTab];
              const uniqueThikrId = `${activeThikrKey}_${activeThikrTab}`;
              const isAlreadyEarned = thikrEarnedStars[uniqueThikrId] || false;

              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 30 }}
                    className="bg-white border-5 border-[#0369A1] rounded-[36px] w-full max-w-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between"
                  >
                    
                    {/* Close modal */}
                    <button
                      onClick={() => {
                        stopRecordedThikr();
                        if (window.speechSynthesis) window.speechSynthesis.cancel();
                        setActiveThikrKey(null);
                      }}
                      className="absolute top-4 left-4 w-10 h-10 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-full flex items-center justify-center border-2 border-gray-300 cursor-pointer shadow-sm active:translate-y-0.5"
                    >
                      <X className="w-5 h-5 stroke-[2.5px]" />
                    </button>

                    {/* Modal Title */}
                    <div className="text-right border-b-2 border-sky-100 pb-3 mb-4 pr-10">
                      <h3 className="text-2xl font-black text-[#0369A1] flex items-center justify-end gap-2">
                        <span>{thikr.title}</span>
                      </h3>
                    </div>

                    {/* Supplication Tabs Selection */}
                    <div className="flex gap-2 justify-center mb-4">
                      {thikr.items.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            stopRecordedThikr();
                            setActiveThikrTab(idx);
                            setRecordedThikrUrl(null);
                          }}
                          className={`px-6 py-2.5 rounded-full font-black text-sm border-2 cursor-pointer transition-colors ${
                            activeThikrTab === idx
                              ? "bg-[#0369A1] text-white border-[#0369A1] shadow-md"
                              : "bg-white text-sky-800 border-sky-200 hover:bg-sky-50"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Huge Readable arabic text block */}
                    <div className="bg-sky-50/50 border-2 border-sky-100 rounded-3xl p-6 text-center mb-6 min-h-[140px] flex flex-col justify-center items-center shadow-inner">
                      <p className="text-2xl md:text-3xl font-black text-gray-800 leading-loose text-center pr-2 pl-2">
                        {selectedItem.text}
                      </p>
                    </div>

                    {/* Action Controls for Athkar Recital */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-sky-100 pt-4">
                      
                      {/* Left: Speak Aloud */}
                      <button
                        onClick={() => {
                          speakThikr(selectedItem.text);
                          triggerNotice("🔊 استمع وكرر بلسانك العذب...");
                        }}
                        className="bg-[#0284C7] hover:bg-[#0369A1] text-white font-black text-xs py-3 px-6 rounded-full border-3 border-[#075985] shadow-[0_4px_0_0_#075985] active:translate-y-1 active:shadow-none flex items-center gap-1.5 cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4 fill-white" />
                        <span>استمع للدعاء 🔊</span>
                      </button>

                      {/* Right: Record and Earn Stars */}
                      <div className="flex items-center gap-2">
                        {!isRecordingThikr ? (
                          <button
                            onClick={startRecordingThikr}
                            className="bg-[#A855F7] hover:bg-[#9333EA] text-white font-black text-xs py-2.5 px-4 rounded-full border-2 border-purple-700 shadow-sm flex items-center gap-1 cursor-pointer"
                          >
                            <Mic className="w-4 h-4" />
                            <span>سجل صوتك 🎙️</span>
                          </button>
                        ) : (
                          <button
                            onClick={stopRecordingThikr}
                            className="bg-red-500 hover:bg-red-600 text-white font-black text-xs py-2.5 px-4 rounded-full border-2 border-red-700 shadow-sm flex items-center gap-1 animate-pulse cursor-pointer"
                          >
                            <Square className="w-4 h-4 fill-white" />
                            <span>إنهاء التسجيل</span>
                          </button>
                        )}

                        {recordedThikrUrl && (
                          <div className="flex gap-1.5">
                            {!isListeningThikrBack ? (
                              <button
                                onClick={playRecordedThikr}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs py-2.5 px-4 rounded-full border-2 border-emerald-700 shadow-sm flex items-center gap-1 cursor-pointer"
                              >
                                <Volume2 className="w-4 h-4" />
                                <span>استمع لصوتك</span>
                              </button>
                            ) : (
                              <button
                                onClick={stopRecordedThikr}
                                className="bg-red-500 hover:bg-red-600 text-white font-black text-xs py-2.5 px-4 rounded-full border-2 border-red-700 shadow-sm flex items-center gap-1 cursor-pointer"
                              >
                                <Square className="w-4 h-4 fill-white" />
                                <span>إيقاف</span>
                              </button>
                            )}

                            {/* Reward Claim Button (Only if not earned yet) */}
                            {!isAlreadyEarned ? (
                              <button
                                onClick={() => {
                                  updateStars(5);
                                  setThikrEarnedStars(prev => ({ ...prev, [uniqueThikrId]: true }));
                                  triggerNotice("🎉 رائع! كسبت ٥ نجوم مضاعفة على قراءة الذكر! ⭐");
                                }}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs py-2.5 px-4 rounded-full border-2 border-amber-700 shadow-sm flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>كسب ٥ نجوم! ⭐</span>
                              </button>
                            ) : (
                              <span className="text-xs text-green-600 font-extrabold flex items-center gap-1 bg-green-50 px-3 py-2 rounded-full border border-green-200">
                                <span>✓ كسبت النجوم</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

        </div>
      )}

    </div>
  );
}
