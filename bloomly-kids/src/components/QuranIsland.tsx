import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Square, RotateCcw, Volume2, Mic, CheckCircle } from "lucide-react";

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
  }
];

interface QuranIslandProps {
  onClose: () => void;
  globalStars: number;
  setGlobalStars?: React.Dispatch<React.SetStateAction<number>>;
}

export default function QuranIsland({ onClose, globalStars, setGlobalStars }: QuranIslandProps) {
  const [selectedSurah, setSelectedSurah] = useState<Surah>(surahs[0]);
  const [activeVerseIndex, setActiveVerseIndex] = useState<number | null>(null);
  const [repeatCount, setRepeatCount] = useState<number>(3); // default 3 repetitions
  const [currentRepetition, setCurrentRepetition] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Microphone recording states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isListeningBack, setIsListeningBack] = useState<boolean>(false);

  // Audio References
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const playbackRef = useRef<HTMLAudioElement | null>(null);

  const [noticeText, setNoticeText] = useState<string | null>(null);

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

    // Verse number starts from 1, needs to be 3 digits
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
        // Repeat same verse again
        playVerse(verseIdx, rep + 1);
      } else {
        // Go to next verse
        playVerse(verseIdx + 1, 1);
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
    // Start from the first verse
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

  // Microphone Recording Logic
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
      
      // Stop microphone stream tracks
      try {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      } catch (err) {}
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

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (playbackRef.current) playbackRef.current.pause();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9990] bg-gradient-to-b from-[#E0F2FE] via-[#F0FDFA] to-[#FAF7FD] select-none font-sans flex flex-col justify-between overflow-hidden">
      
      {/* 1. Header Navigation */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b-4 border-[#4D2B82] p-4 flex items-center justify-between shadow-md relative z-30">
        <button
          onClick={() => {
            stopPlaying();
            onClose();
          }}
          className="btn-bubbly-secondary text-sm py-2 px-5 text-[#4D2B82] bg-white rounded-full flex items-center gap-1 cursor-pointer border-2 border-[#4D2B82] shadow-[0_4px_0_0_#4D2B82] active:translate-y-1 active:shadow-none transition-all"
        >
          <X className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </button>

        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-[#4D2B82] tracking-wide flex items-center gap-2 justify-center">
            جزيرة القرآن الكريم والآيات 🕋✨
          </h1>
          <p className="text-xs font-bold text-emerald-600">
            كرر الآيات لتسهيل الحفظ، سجل صوتك بالتلاوة، واكسب ٢٠ نجمة مضاعفة!
          </p>
        </div>

        {/* Global Stars */}
        <div className="flex items-center gap-1.5 bg-[#FFFCE6] border-2 border-[#D97706] text-[#D97706] font-extrabold text-sm px-4 py-1.5 rounded-full shadow-inner">
          <span className="text-lg text-yellow-400">★</span>
          <span>نجومك: {globalStars}</span>
        </div>
      </header>

      {/* 2. Notice Banner */}
      <AnimatePresence>
        {noticeText && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 inset-x-0 mx-auto w-fit max-w-sm px-6 py-2.5 rounded-full border-3 bg-white text-center font-extrabold text-sm shadow-md z-[9999]"
            style={{
              borderColor: noticeText.startsWith("❌") ? "#EF4444" : noticeText.startsWith("🌱") ? "#2ECC71" : "#FF9F29",
              color: noticeText.startsWith("❌") ? "#EF4444" : "#4D2B82",
            }}
          >
            {noticeText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Workspace Split Panel */}
      <main className="flex-grow w-full flex flex-col md:flex-row p-6 gap-6 relative z-10 overflow-hidden">
        
        {/* Side Panel: Surah List Carousel */}
        <div className="w-full md:w-[280px] bg-white/70 backdrop-blur-sm border-3 border-[#4D2B82] rounded-[24px] p-4 flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shadow-sm select-none">
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

        {/* Center Panel: Verse board and Repetition Control */}
        <div className="flex-grow bg-white border-3 border-[#4D2B82] rounded-[32px] p-6 flex flex-col justify-between shadow-lg overflow-hidden relative">
          
          {/* Top Panel: Surah Title and Repetitions */}
          <div className="flex items-center justify-between border-b-2 border-purple-100 pb-3 mb-4">
            <div className="text-right">
              <h2 className="text-xl font-black text-[#4D2B82]">{selectedSurah.name}</h2>
              <span className="text-[10px] text-gray-500 font-extrabold">عدد الآيات: {selectedSurah.verses.length}</span>
            </div>

            {/* Repetition Multiplier select buttons */}
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

          {/* Center Verse List (Scrolling and active highlighting) */}
          <div className="flex-grow overflow-y-auto custom-scrollbar space-y-4 px-2 py-4 mb-4 text-center">
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

          {/* Bottom Bar: Action Controls */}
          <div className="flex flex-wrap items-center justify-between border-t-2 border-purple-100 pt-4 gap-4">
            
            {/* Audio Recitation controls */}
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

            {/* Microphone recorder controls */}
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

              {/* Playback of recorded audio */}
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

    </div>
  );
}
