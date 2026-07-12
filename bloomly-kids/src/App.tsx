import { useState, useEffect, useRef } from "react";
import { InteractiveGarden } from "./components/InteractiveGarden";
import { GameZone } from "./components/GameZone";
import { IntroScreen } from "./components/IntroScreen";
import { RegisterScreen } from "./components/RegisterScreen";
import { BoyAvatar, GirlAvatar } from "./components/Avatars";
import MagicGarden from "./components/MagicGarden";
import { 
  Sparkles, 
  Gamepad2, 
  Trophy, 
  Menu, 
  X,
  Volume2,
  VolumeX
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCharactersView, setShowCharactersView] = useState(false);

  // Magic Garden State
  const [showMagicGarden, setShowMagicGarden] = useState(false);
  const [isLoadingGarden, setIsLoadingGarden] = useState(false);
  const [gardenLoadingProgress, setGardenLoadingProgress] = useState(0);
  const [spectateProfile, setSpectateProfile] = useState<any>(null);

  // Stored child profile state
  const [childProfile, setChildProfile] = useState<{
    id?: string;
    gender: "boy" | "girl" | null;
    name: string;
    age: string;
    phone: string;
    level: "level1" | "level2" | "level3" | "level4" | null;
    stars?: number;
    maxIslandUnlocked?: number;
  } | null>(() => {
    try {
      const saved = localStorage.getItem("childProfile");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn("Failed to load child profile:", e);
      return null;
    }
  });

  const [showRegister, setShowRegister] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  // بيانات الأدمين - غيّرها زي ما تحب
  const ADMIN_PHONE = "00000";
  const ADMIN_NAME = "admin";
  // Login form state
  const [loginPhone, setLoginPhone] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginError, setLoginError] = useState("");
  // Delete confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // List of all registered profiles on this device
  const [allProfiles, setAllProfiles] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("bloomly_all_profiles");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dynamic backend API URL resolver
  const getApiUrl = (path: string) => {
    const ip = localStorage.getItem("bloomly_server_ip") || "";
    if (ip) {
      return `http://${ip}:5000${path}`;
    }
    const origin = window.location.origin;
    if (origin.includes(":5173")) {
      return origin.replace(":5173", ":5000") + path;
    }
    return `${origin}${path}`;
  };

  // API Call: Fetch all profiles from backend database
  const fetchAllProfiles = async () => {
    try {
      const url = getApiUrl("/api/child-profiles");
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAllProfiles(data);
        localStorage.setItem("bloomly_all_profiles", JSON.stringify(data));
      }
    } catch (e) {
      console.warn("Failed to fetch backend profiles:", e);
    }
  };

  // API Call: Save child profile to database
  const saveProfileToBackend = async (profile: any) => {
    try {
      const url = getApiUrl("/api/child-profiles");
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
    } catch (e) {
      console.warn("Failed to save child profile to backend:", e);
    }
  };

  // API Call: Update child stars in database
  const updateStarsOnBackend = async (id: string, stars: number) => {
    try {
      const url = getApiUrl(`/api/child-profiles/${id}/stars`);
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stars })
      });
    } catch (e) {
      console.warn("Failed to update stars on backend:", e);
    }
  };

  // API Call: Delete child profile from database
  const deleteProfile = async (id: string) => {
    try {
      const url = getApiUrl(`/api/child-profiles/${id}`);
      await fetch(url, { method: "DELETE" });
    } catch (e) {
      console.warn("Failed to delete profile from backend:", e);
    }
    // Remove from local state
    setAllProfiles(prev => {
      const nextList = prev.filter(p => p.id !== id);
      localStorage.setItem("bloomly_all_profiles", JSON.stringify(nextList));
      return nextList;
    });
    // If deleted profile is the logged-in one, log out
    if (childProfile?.id === id) {
      setChildProfile(null);
      localStorage.removeItem("childProfile");
      localStorage.removeItem("bloomly_stars");
      setGlobalStars(0);
    }
  };

  const openParentDashboardWithGate = () => {
    const num1 = Math.floor(Math.random() * 8) + 6; // 6 to 13
    const num2 = Math.floor(Math.random() * 8) + 6; // 6 to 13
    const ans = num1 + num2;
    const input = prompt(`سؤال حماية للأبوين لمنع دخول الأطفال:\nما هو ناتج: ${num1} + ${num2}؟`);
    if (input && parseInt(input, 10) === ans) {
      setShowAdminDashboard(true);
      fetchAllProfiles();
    } else if (input) {
      alert("إجابة خاطئة! هذه المنطقة مخصصة للأبوين فقط.");
    }
  };

  // Handle login: match phone + name against stored profiles or admin
  const handleLogin = () => {
    const phone = loginPhone.trim();
    const name = loginName.trim();
    if (!phone || !name) {
      setLoginError("من فضلك أدخل رقم الهاتف والاسم");
      return;
    }
    // Check admin credentials
    if (phone === ADMIN_PHONE && name === ADMIN_NAME) {
      setShowLogin(false);
      setLoginPhone("");
      setLoginName("");
      setLoginError("");
      setShowAdminDashboard(true);
      fetchAllProfiles();
      return;
    }
    // Find matching profile
    const allStored: any[] = (() => {
      try {
        const saved = localStorage.getItem("bloomly_all_profiles");
        return saved ? JSON.parse(saved) : [];
      } catch { return []; }
    })();
    const match = allStored.find(
      p => p.phone === phone && p.name.trim() === name
    );
    if (match) {
      setChildProfile(match);
      localStorage.setItem("childProfile", JSON.stringify(match));
      const stars = match.stars ?? 0;
      setGlobalStars(stars);
      localStorage.setItem("bloomly_stars", String(stars));
      setShowLogin(false);
      setLoginPhone("");
      setLoginName("");
      setLoginError("");
    } else {
      // Check if phone exists but name is wrong
      const phoneExists = allStored.some(p => p.phone === phone);
      if (phoneExists) {
        setLoginError("الاسم غير صحيح لهذا الرقم");
      } else {
        setLoginError("هذا الرقم غير مسجل - أنشئ حساباً أولاً");
      }
    }
  };


  useEffect(() => {
    fetchAllProfiles();
    const interval = setInterval(fetchAllProfiles, 5000);
    return () => clearInterval(interval);
  }, []);

  // Sync global stars count from localStorage for the parent dashboard
  const [globalStars, setGlobalStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("bloomly_stars");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Keep global stars synced in real time
  useEffect(() => {
    const syncStars = () => {
      try {
        const saved = localStorage.getItem("bloomly_stars");
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed)) setGlobalStars(parsed);
        }
      } catch (e) {
        console.warn("Failed to sync stars:", e);
      }
    };
    const interval = setInterval(syncStars, 1000);
    window.addEventListener("storage", syncStars);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", syncStars);
    };
  }, []);

  const [forcedGame, setForcedGame] = useState<string | null>(null);

  // Global background music player
  const [bgMusicPlaying, setBgMusicPlaying] = useState(false);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgAudioRef.current = new Audio("/garden_of_joy.mp3");
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = 0.22;

    const wasPlaying = localStorage.getItem("bloomly_bg_music_playing") === "true";
    if (wasPlaying) {
      bgAudioRef.current.play().then(() => {
        setBgMusicPlaying(true);
      }).catch(() => {
        localStorage.setItem("bloomly_bg_music_playing", "false");
      });
    }

    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current = null;
      }
    };
  }, []);

  const toggleGlobalBgMusic = () => {
    if (!bgAudioRef.current) return;
    playBubbleSound();
    if (bgMusicPlaying) {
      bgAudioRef.current.pause();
      setBgMusicPlaying(false);
      localStorage.setItem("bloomly_bg_music_playing", "false");
    } else {
      bgAudioRef.current.play().then(() => {
        setBgMusicPlaying(true);
        localStorage.setItem("bloomly_bg_music_playing", "true");
      }).catch(e => {
        console.warn("Autoplay blocked:", e);
      });
    }
  };

  // Keep active profile synced with global stars and backend database
  useEffect(() => {
    if (!childProfile) return;
    if (childProfile.stars !== globalStars) {
      const updatedChild = { ...childProfile, stars: globalStars };
      setChildProfile(updatedChild);
      localStorage.setItem("childProfile", JSON.stringify(updatedChild));
      
      // Update backend database
      if (childProfile.id) {
        updateStarsOnBackend(childProfile.id, globalStars);
      }
      
      // Local fallback list update
      setAllProfiles(prev => {
        const nextList = prev.map(p => p.id === childProfile.id ? { ...p, stars: globalStars } : p);
        if (!nextList.some(p => p.id === childProfile.id)) {
          nextList.push(updatedChild);
        }
        localStorage.setItem("bloomly_all_profiles", JSON.stringify(nextList));
        return nextList;
      });
    }
  }, [globalStars, childProfile]);

  // Scroll helper
  const scrollToGames = () => {
    setMobileMenuOpen(false);
    const element = document.getElementById("game-zone");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Selected island state for the magical map (initially closed)
  const [selectedIslandIndex, setSelectedIslandIndex] = useState<number | null>(null);

  // Play a pleasant bubble click sound
  const playBubbleSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.error(e);
    }
  };

  const startLoadingGarden = () => {
    // Check profile
    const saved = localStorage.getItem("childProfile");
    if (!saved) {
      setShowRegister(true);
      return;
    }
    
    setMobileMenuOpen(false);
    setGardenLoadingProgress(0);
    setIsLoadingGarden(true);

    const interval = setInterval(() => {
      setGardenLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoadingGarden(false);
          setShowMagicGarden(true);
          return 100;
        }
        return prev + 5;
      });
    }, 60);
  };

    {
      title: "سفاري الأصوات 🎵",
      character: "🦁 الأسد زئير (مستكشف الأصوات)",
      characterEmoji: "🦁",
      emoji: "🎵",
      colorClass: "bg-[#FFFCE6] border-[#D97706]/40 text-[#D97706]",
      gameName: "سفاري الأصوات السحرية",
      quest: "مرحباً! أنا الأسد زئير. سنستمع معاً لأصوات الطبيعة والقطارات والحيوانات لنميزها ونعرف الكروت المطابقة لها!",
      superpower: "قوة الاستماع والتركيز السمعي الخارق لتمييز الأصوات! 👂",
      badge: "تركيز سمعي",
      x: 42,
      y: 82
    },
    {
      title: "مطبخ الحلوى 🧁",
      character: "🐼 الباندا فودي (شيف الحلويات)",
      characterEmoji: "🐼",
      emoji: "🧁",
      colorClass: "bg-[#FFFDF6] border-[#4D2B82]/40 text-[#4D2B82]",
      gameName: "مطبخ الحلوى السحري",
      quest: "أهلاً يا شيف! أنا الباندا فودي. سنقوم معاً بخلط المكونات بالترتيب الصحيح لنطبخ أشهى وأجمل الحلويات السحرية الملونة!",
      superpower: "الطبخ الإبداعي والترتيب الدقيق للخطوات والوصفات! 🎂",
      badge: "طهي ووصفات",
      x: 70,
      y: 85
    },
    {
      title: "جزيرة القرآن 🕋",
      character: "🦉 الهدهد هدهد (معلم التلاوة)",
      characterEmoji: "🪶",
      emoji: "🕋",
      colorClass: "bg-[#F0FDF4] border-emerald-300 text-emerald-800",
      gameName: "حفظ قصار السور بالتكرار التفاعلي",
      quest: "أهلاً بك يا صديقي الصغير! أنا الهدهد هدهد. سنستمع معاً لآيات الله الكريمة ونكررها لنكسب الأجر ونحفظ القرآن الكريم في قلوبنا ونفوز بالنجوم المضاعفة!",
      superpower: "حفظ سور القرآن وتلاوتها بصوت ندي وجميل! 🕋✨",
      badge: "تحفيظ وقيم",
      x: 48,
      y: 35
    },
    {
      title: "قصص بلومي 📚",
      character: "🦊 الثعلب حكواتي (راوي القصص)",
      characterEmoji: "🦊",
      emoji: "📚",
      colorClass: "bg-[#FFFDF0] border-amber-300 text-amber-800",
      gameName: "قصص تفاعلية مصورة تتبع الكلمات",
      quest: "أهلاً بك في خيمتي السحرية! أنا الراوي حكواتي. سنقرأ معاً أروع القصص المصورة التي تعلمنا القيم والأخلاق، ونتبع الكلمات المقروءة كلمة بكلمة!",
      superpower: "قراءة القصص بطلاقة وتعلم الأخلاق الكريمة والأمانة! 🌟📖",
      badge: "قصص وقيم",
      x: 30,
      y: 62
    }
  ];

  // How it works steps
  const steps = [
    {
      number: "١",
      title: "اختر الرحلة اليومية",
      desc: "يختار طفلك مهمة قصيرة مدتها 10 دقائق (قراءة، رياضيات أو قيم) داخل الحديقة السحرية.",
      icon: <Gamepad2 className="w-8 h-8" />
    },
    {
      number: "٢",
      title: "العب وتعلّم",
      desc: "ألعاب تفاعلية خالية من الملل ومن الإعلانات، مصممة تحت إشراف معلمين وخبراء تربويين.",
      icon: <Sparkles className="w-8 h-8" />
    },
    {
      number: "٣",
      title: "ازهر واكسب النجوم",
      desc: "يكافئ طفلك بنجوم ملونة ونقاط لفتح شخصيات جديدة، مما يبني حبه وشغفه للتعلّم المستمر.",
      icon: <Trophy className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen relative font-sans overflow-x-hidden pb-16 bg-[#FAF7FD]">
      <AnimatePresence>
        {showIntro && (
          <IntroScreen onFinish={() => {
            setShowIntro(false);
            if (!childProfile) {
              setShowLogin(true);
            }
          }} />
        )}

        {showRegister && (
          <RegisterScreen
            existingPhones={allProfiles.map((p: any) => p.phone).filter(Boolean)}
            onFinish={(profile) => {
              const profileId = Date.now().toString();
              const updatedProfile = { 
                ...profile, 
                id: profileId,
                stars: 0,
                maxIslandUnlocked: 0
              };
              
              setChildProfile(updatedProfile);
              localStorage.setItem("childProfile", JSON.stringify(updatedProfile));
              
              setGlobalStars(0);
              localStorage.setItem("bloomly_stars", "0");
              
              // Sync to backend database
              saveProfileToBackend(updatedProfile);
              
              // Update local profiles list
              setAllProfiles(prev => {
                const nextList = [...prev, updatedProfile];
                localStorage.setItem("bloomly_all_profiles", JSON.stringify(nextList));
                return nextList;
              });
              
              setShowRegister(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* ===== LOGIN MODAL ===== */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99995] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => { setShowLogin(false); setLoginPhone(""); setLoginName(""); setLoginError(""); }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 30 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="relative bg-white border-4 border-[#4D2B82] rounded-[32px] shadow-[0_12px_0_0_#4D2B82] max-w-sm w-full p-7 text-right font-sans z-10 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Top gradient bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#4D2B82] via-[#E01E5A] to-[#FF7A00]" />
              
              {/* Close */}
              <button onClick={() => { setShowLogin(false); setLoginPhone(""); setLoginName(""); setLoginError(""); }}
                className="absolute top-4 left-4 bg-gray-100 hover:bg-red-100 border-2 border-[#4D2B82] text-[#E01E5A] w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-lg cursor-pointer"
              >✕</button>

              <div className="text-center mb-5 mt-2">
                <div className="text-4xl mb-2">🔑</div>
                <h2 className="text-2xl font-black text-[#4D2B82]">أهلاً بعودتك!</h2>
                <p className="text-xs font-bold text-purple-400 mt-1">أدخل اسمك ورقم هاتفك للدخول لحسابك</p>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-black text-[#4D2B82] mb-1.5 text-right">رقم الهاتف 📱</label>
                  <input
                    type="tel"
                    value={loginPhone}
                    onChange={(e) => { setLoginPhone(e.target.value.replace(/\D/g, "")); setLoginError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="01xxxxxxxxx"
                    dir="ltr"
                    className="w-full text-center text-lg font-black py-3 px-4 rounded-2xl border-3 border-[#4D2B82] outline-none focus:ring-4 focus:ring-purple-200 text-[#4D2B82] placeholder:text-gray-300"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#4D2B82] mb-1.5 text-right">الاسم ✏️</label>
                  <input
                    type="text"
                    value={loginName}
                    onChange={(e) => { setLoginName(e.target.value); setLoginError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="اكتب اسمك..."
                    className="w-full text-center text-lg font-black py-3 px-4 rounded-2xl border-3 border-[#4D2B82] outline-none focus:ring-4 focus:ring-purple-200 text-[#4D2B82] placeholder:text-gray-300"
                  />
                </div>
              </div>

              {loginError && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl px-4 py-2.5 mb-3 text-center">
                  <p className="text-sm font-black text-red-500">❌ {loginError}</p>
                </div>
              )}

              <button
                onClick={handleLogin}
                className="w-full py-3.5 rounded-2xl bg-[#4D2B82] text-white font-black text-base border-2 border-[#2D1560] shadow-[0_5px_0_0_#2D1560] hover:shadow-[0_3px_0_0_#2D1560] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer mb-3"
              >
                تسجيل الدخول 🚀
              </button>

              <div className="text-center border-t border-purple-100 pt-3">
                <p className="text-xs font-bold text-purple-400 mb-2">ليس لديك حساب؟</p>
                <button
                  onClick={() => { setShowLogin(false); setLoginPhone(""); setLoginName(""); setLoginError(""); setShowRegister(true); }}
                  className="w-full py-3 rounded-2xl bg-[#2ECC71] text-white font-black text-sm border-2 border-[#1a9e55] shadow-[0_4px_0_0_#1a9e55] hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#1a9e55] transition-all cursor-pointer"
                >
                  انشئ حساباً جديداً ✨
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== ADMIN DASHBOARD ===== */}
      <AnimatePresence>
        {showAdminDashboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#F0EBF9] z-[99990] overflow-y-auto font-sans"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b-3 border-[#4D2B82] shadow-sm px-6 py-4 flex items-center justify-between">
              <button
                onClick={() => setShowAdminDashboard(false)}
                className="flex items-center gap-2 font-black text-[#E01E5A] text-sm hover:underline cursor-pointer"
              >
                <span>✕</span>
                <span>إغلاق</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#4D2B82] rounded-full flex items-center justify-center text-white text-lg">🛡️</div>
                <div className="text-right">
                  <h1 className="text-lg font-black text-[#4D2B82]">لوحة التحكم</h1>
                  <p className="text-xs font-bold text-purple-400">منطقة الإدارة - سرية</p>
                </div>
              </div>
              <button
                onClick={() => { fetchAllProfiles(); }}
                className="text-xs font-black text-[#4D2B82] bg-purple-100 border-2 border-purple-200 px-3 py-1.5 rounded-full hover:bg-purple-200 transition-colors cursor-pointer"
              >
                🔄 تحديث
              </button>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
              {/* Stats bar */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "إجمالي الأبطال", value: allProfiles.length, icon: "👥", color: "bg-purple-100 border-purple-200 text-purple-700" },
                  { label: "النشط الآن", value: childProfile ? 1 : 0, icon: "✅", color: "bg-green-100 border-green-200 text-green-700" },
                  { label: "إجمالي النجوم", value: allProfiles.reduce((sum: number, p: any) => sum + (p.stars ?? 0), 0), icon: "⭐", color: "bg-yellow-100 border-yellow-200 text-yellow-700" },
                ].map((stat, i) => (
                  <div key={i} className={`${stat.color} border-2 rounded-2xl p-4 text-center`}>
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-2xl font-black">{stat.value}</div>
                    <div className="text-xs font-bold">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="bg-white border-3 border-[#4D2B82] rounded-[24px] overflow-hidden shadow-[0_6px_0_0_#4D2B82]">
                <div className="bg-[#4D2B82] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full">{allProfiles.length} بطل مسجّل</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs font-bold text-white/80">عنوان IP الخادم:</span>
                    <input 
                      type="text"
                      placeholder="192.168.1.15"
                      defaultValue={localStorage.getItem("bloomly_server_ip") || ""}
                      onChange={(e) => {
                        localStorage.setItem("bloomly_server_ip", e.target.value.trim());
                        fetchAllProfiles();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="border border-white/20 bg-white/10 text-white placeholder-white/40 rounded-lg px-2.5 py-0.5 text-xs outline-none focus:bg-white/20 text-center w-36 font-bold"
                    />
                  </div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <span>📋</span>
                    <span>جميع الأبطال المسجلين</span>
                  </h2>
                </div>

                {allProfiles.length === 0 ? (
                  <div className="text-center py-16 text-purple-300">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="font-black text-lg">لا يوجد أبطال مسجلين بعد</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm font-bold" dir="rtl">
                      <thead>
                        <tr className="bg-purple-50 border-b-2 border-purple-100">
                          <th className="px-5 py-3 text-xs font-extrabold text-purple-600">البطل</th>
                          <th className="px-5 py-3 text-xs font-extrabold text-purple-600">البلد</th>
                          <th className="px-5 py-3 text-xs font-extrabold text-purple-600">رقم الهاتف</th>
                          <th className="px-5 py-3 text-xs font-extrabold text-purple-600">العمر</th>
                          <th className="px-5 py-3 text-xs font-extrabold text-purple-600">المستوى</th>
                          <th className="px-5 py-3 text-xs font-extrabold text-purple-600">النجوم ⭐</th>
                          <th className="px-5 py-3 text-xs font-extrabold text-purple-600">رؤية المزرعة 👁️</th>
                          <th className="px-5 py-3 text-xs font-extrabold text-red-400">حذف 🗑️</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allProfiles.map((p: any, i: number) => (
                          <tr key={p.id || i} className={`border-b border-purple-50 transition-colors hover:bg-purple-50/40 ${childProfile?.id === p.id ? 'bg-yellow-50' : i % 2 === 0 ? 'bg-white' : 'bg-purple-50/10'}`}>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2 flex-row-reverse">
                                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#4D2B82] bg-white shrink-0">
                                  {p.gender === "boy" ? <BoyAvatar className="w-full h-full" /> : <GirlAvatar className="w-full h-full" />}
                                </div>
                                <div>
                                  <span className="font-black text-[#4D2B82]">{p.name}</span>
                                  {childProfile?.id === p.id && <span className="block text-[10px] text-green-600 font-extrabold">● نشط الآن</span>}
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4"><span className="font-bold text-[#4D2B82] text-xl" title={p.country}>{p.country ? p.country.split(' ')[0] : '—'}</span></td>
                            <td className="px-5 py-4"><span dir="ltr" className="font-bold text-[#4D2B82]">{p.phone || '—'}</span></td>
                            <td className="px-5 py-4"><span className="font-bold text-[#4D2B82]">{p.age === "1" ? "سنة" : p.age === "2" ? "سنتين" : p.age === "+8" ? "+8" : `${p.age}س`}</span></td>
                            <td className="px-5 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${p.level === 'level1' ? 'bg-green-50 text-green-700 border-green-200' : p.level === 'level2' ? 'bg-blue-50 text-blue-700 border-blue-200' : p.level === 'level3' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                                {p.level === 'level1' ? '🌱 أول' : p.level === 'level2' ? '⭐ ثاني' : p.level === 'level3' ? '🏆 ثالث' : '🚀 فائق'}
                              </span>
                            </td>
                             <td className="px-5 py-4">
                              <span className="bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-black text-xs border border-yellow-200">
                                {p.id === childProfile?.id ? globalStars : (p.stars ?? 0)} ⭐
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <button
                                onClick={() => {
                                  setSpectateProfile(p);
                                  setShowMagicGarden(true);
                                }}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-2 border-emerald-200 px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer flex items-center justify-center gap-1 mx-auto"
                              >
                                👁️ عرض المزرعة
                              </button>
                            </td>
                            <td className="px-5 py-4">
                              {deleteConfirmId === p.id ? (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => { deleteProfile(p.id); setDeleteConfirmId(null); }}
                                    className="bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-xl border-2 border-red-700 shadow-[0_3px_0_0_#b91c1c] hover:translate-y-[1px] hover:shadow-[0_2px_0_0_#b91c1c] transition-all cursor-pointer"
                                  >تأكيد</button>
                                  <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="bg-gray-100 text-gray-600 text-xs font-black px-3 py-1.5 rounded-xl border-2 border-gray-200 cursor-pointer"
                                  >إلغاء</button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirmId(p.id)}
                                  className="bg-red-50 text-red-500 text-xs font-black px-3 py-1.5 rounded-xl border-2 border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                                >🗑️ حذف</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                               {/* API Server URL Settings */}
                <div className="card-bubbly p-6 bg-white border-2 border-purple-200 mt-6 text-right select-none">
                  <h3 className="text-lg font-black text-[#4D2B82] mb-2 flex items-center justify-start gap-2 flex-row-reverse">
                    <span>🌐</span>
                    <span>عنوان خادم قاعدة البيانات المشتركة (API Backend)</span>
                  </h3>
                  <p className="text-xs text-purple-400 mb-4 leading-relaxed">
                    من هنا يمكنك تحديد عنوان خادم الـ API (مثل Render أو Railway أو IP الكمبيوتر المحلي) لمزامنة حسابات الأطفال ونقاط النجوم تلقائياً بين جميع الأجهزة (الهاتف، التابلت، اللابتوب).
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="url"
                      placeholder="مثال: https://my-bloomly-api.onrender.com"
                      defaultValue={localStorage.getItem("bloomly_api_base_url") || ""}
                      id="bloomly-api-url-input"
                      className="flex-1 bg-purple-50/50 border-2 border-purple-200 rounded-2xl px-4 py-2.5 text-sm font-bold text-[#4D2B82] focus:outline-none focus:border-[#4D2B82]"
                    />
                    <button
                      onClick={() => {
                        const val = (document.getElementById("bloomly-api-url-input") as HTMLInputElement)?.value.trim();
                        if (val) {
                          localStorage.setItem("bloomly_api_base_url", val);
                          alert("تم حفظ عنوان خادم الـ API بنجاح! سيتم المزامنة عبره الآن.");
                        } else {
                          localStorage.removeItem("bloomly_api_base_url");
                          alert("تم مسح عنوان الخادم، سيعود التطبيق للتخزين المحلي التلقائي.");
                        }
                        fetchAllProfiles();
                      }}
                      className="btn-bubbly-purple text-sm py-2.5 px-6 font-black cursor-pointer"
                    >
                      حفظ الخادم 💾
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Soft Blobs */}
      <div className="bg-blob bg-blob-green top-[10%] left-[-100px]" />
      <div className="bg-blob bg-blob-yellow top-[40%] right-[-100px]" />
      <div className="bg-blob bg-blob-pink bottom-[15%] left-[20%]" />

      {/* 1. Capsule Header */}
      <header className="container mx-auto px-4 pt-6 relative z-50">
        <div className="bg-white/90 backdrop-blur-md border-3 border-[#4D2B82] rounded-full px-6 py-3 flex items-center justify-between shadow-[0_5px_0_0_#4D2B82]">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer select-none">
            {/* Sprout Icon */}
            <div className="w-8 h-8 bg-[#2ECC71] rounded-full border-2 border-[#4D2B82] flex items-center justify-center">
              <span className="text-white text-xs">🌱</span>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#4D2B82]">بلومي</span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 font-bold text-xs xl:text-sm text-[#4D2B82]">
            <a href="#game-zone" onClick={(e) => { e.preventDefault(); scrollToGames(); }} className="hover:text-[#E01E5A] transition-colors">الألعاب السحرية 🎮</a>
            <button onClick={() => { playBubbleSound(); startLoadingGarden(); }} className="hover:text-[#E01E5A] transition-colors cursor-pointer font-bold bg-transparent border-none">الحديقة السحرية 🌿</button>
            <button onClick={() => { playBubbleSound(); setForcedGame("quran"); }} className="hover:text-[#E01E5A] transition-colors cursor-pointer font-bold bg-transparent border-none">جزيرة القرآن 🕋</button>
            <button onClick={() => { playBubbleSound(); setForcedGame("stories"); }} className="hover:text-[#E01E5A] transition-colors cursor-pointer font-bold bg-transparent border-none">قصص بلومي 📚</button>
            <a href="#characters" onClick={(e) => { e.preventDefault(); setShowCharactersView(true); playBubbleSound(); }} className="hover:text-[#E01E5A] transition-colors">شخصيات بلومي 🦉</a>
            <a href="#what-we-teach" className="hover:text-[#E01E5A] transition-colors">ماذا نتعلّم؟</a>
            <a href="#how-it-works" className="hover:text-[#E01E5A] transition-colors">كيف نعمل؟</a>
            <a href="#parents" className="hover:text-[#E01E5A] transition-colors">أولياء الأمور</a>
          </nav>

          {/* Start Free Button & Profile Tag */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Global Music Toggle Button */}
            <button
              onClick={toggleGlobalBgMusic}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer border-2 transition-all active:scale-95 shadow-md ${
                bgMusicPlaying 
                  ? 'bg-[#2ECC71] border-[#27AE60] text-white shadow-[0_2px_0_0_#27AE60]' 
                  : 'bg-white border-[#4D2B82] text-gray-500 hover:bg-slate-50'
              }`}
              title="موسيقى الخلفية 🎵"
            >
              {bgMusicPlaying ? (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5px]" />
              ) : (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 stroke-[2.5px]" />
              )}
            </button>

            {childProfile && (
              <div className="flex items-center gap-2">
                <div 
                  className="bg-[#FFECA1] border-3 border-[#4D2B82] text-[#4D2B82] text-xs sm:text-sm py-1.5 px-3 flex items-center gap-2 rounded-full shadow-[0_4px_0_0_#4D2B82] font-black select-none"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border-2 border-[#4D2B82] bg-white flex items-center justify-center">
                    {childProfile.gender === "boy" ? (
                      <BoyAvatar className="w-full h-full scale-110" />
                    ) : (
                      <GirlAvatar className="w-full h-full scale-110" />
                    )}
                  </div>
                  <span>مرحبا {childProfile.name}</span>
                </div>
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    playBubbleSound();
                  }}
                  className="btn-bubbly-purple text-xs py-1.5 px-3.5 flex items-center gap-1 cursor-pointer shadow-[0_4px_0_0_#4D2B82] hover:translate-y-[-1px] hover:shadow-[0_5px_0_0_#4D2B82] active:translate-y-[2px] active:shadow-[0_1px_0_0_#4D2B82]"
                >
                  <span>تعديل الملف الشخصي ⚙️</span>
                </button>
              </div>
            )}
            <button 
              onClick={() => { setShowCharactersView(true); playBubbleSound(); }}
              className="lg:hidden btn-bubbly-purple text-xs py-1.5 px-3 flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>الشخصيات 🦉</span>
            </button>
            {!childProfile && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => { setShowLogin(true); playBubbleSound(); }}
                  className="btn-bubbly-secondary text-sm py-2 px-4 border-2 border-[#4D2B82] text-[#4D2B82] bg-white rounded-full font-black hover:bg-purple-50 transition-colors shadow-[0_3px_0_0_#4D2B82] cursor-pointer"
                >
                  تسجيل الدخول 🔑
                </button>
                <button
                  onClick={() => { setShowRegister(true); playBubbleSound(); }}
                  className="btn-bubbly-purple text-sm py-2.5 px-5 cursor-pointer"
                >
                  انشئ حساب والعب دلوقتي 🚀
                </button>
              </div>
            )}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full border-2 border-[#4D2B82] hover:bg-purple-50 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-[85px] left-4 right-4 bg-white border-3 border-[#4D2B82] rounded-[24px] p-6 shadow-[0_6px_0_0_#4D2B82] flex flex-col gap-4 text-center font-bold text-lg lg:hidden z-50">
            {!childProfile && (
              <div className="flex flex-col gap-3 pb-3 border-b-2 border-purple-100">
                <button
                  onClick={() => { setMobileMenuOpen(false); setShowLogin(true); playBubbleSound(); }}
                  className="btn-bubbly-secondary text-base py-3 px-4 border-2 border-[#4D2B82] text-[#4D2B82] bg-white rounded-2xl font-black hover:bg-purple-50 transition-colors shadow-[0_3px_0_0_#4D2B82] cursor-pointer"
                >
                  تسجيل الدخول 🔑
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); setShowRegister(true); playBubbleSound(); }}
                  className="btn-bubbly-purple text-base py-3 px-5 cursor-pointer rounded-2xl"
                >
                  انشئ حساب والعب دلوقتي 🚀
                </button>
              </div>
            )}
            <a href="#game-zone" onClick={(e) => { e.preventDefault(); scrollToGames(); }} className="py-2 border-b border-purple-100 hover:text-[#E01E5A]">الألعاب السحرية 🎮</a>
            <button onClick={() => { playBubbleSound(); startLoadingGarden(); }} className="py-2 border-b border-purple-100 hover:text-[#E01E5A] cursor-pointer text-right w-full font-bold bg-transparent border-none">الحديقة السحرية 🌿</button>
            <button onClick={() => { playBubbleSound(); setMobileMenuOpen(false); setForcedGame("quran"); }} className="py-2 border-b border-purple-100 hover:text-[#E01E5A] cursor-pointer text-right w-full font-bold bg-transparent border-none">جزيرة القرآن 🕋</button>
            <button onClick={() => { playBubbleSound(); setMobileMenuOpen(false); setForcedGame("stories"); }} className="py-2 border-b border-purple-100 hover:text-[#E01E5A] cursor-pointer text-right w-full font-bold bg-transparent border-none">قصص بلومي 📚</button>
            <a href="#characters" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); setShowCharactersView(true); playBubbleSound(); }} className="py-2 border-b border-purple-100 hover:text-[#E01E5A]">شخصيات بلومي 🦉</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-purple-100 hover:text-[#E01E5A]">كيف نعمل؟</a>
            <a href="#parents" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-purple-100 hover:text-[#E01E5A]">أولياء الأمور</a>

            <button 
              onClick={scrollToGames}
              className="btn-bubbly-primary w-full py-3 mt-2"
            >
              ابدأ اللعب مجاناً 🎮
            </button>
          </div>
        )}
      </header>

      {/* 2. Farm Interactive Section (At the top now) */}
      <section className="container mx-auto px-4 pt-12 md:pt-20 pb-8 relative z-10 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-6 relative max-w-2xl w-full">
          {/* Little background decor */}
          <div className="absolute -top-6 -right-6 text-yellow-300 text-4xl animate-pulse">✨</div>
          <div className="absolute -bottom-6 -left-6 text-purple-300 text-4xl animate-float">🌸</div>
          
          <InteractiveGarden />

          {/* Entry button to Large Garden */}
          <button
            onClick={() => {
              playBubbleSound();
              startLoadingGarden();
            }}
            className="btn-bubbly-primary text-xl px-12 py-5 flex items-center justify-center gap-3 animate-bounce-slow w-full sm:w-auto mt-4 shadow-[0_0_30px_rgba(255,122,0,0.4)] hover:shadow-[0_0_50px_rgba(255,122,0,0.6)]"
          >
            <span className="text-3xl">🚪🌿</span>
            <span>دخول الحديقة السحرية الكبيرة</span>
          </button>
        </div>
      </section>

      {/* 3. Game Zone Section */}
      <GameZone 
        onNeedRegister={() => setShowRegister(true)} 
        globalStars={globalStars} 
        setGlobalStars={setGlobalStars}
        childLevel={childProfile?.level}
        forcedGame={forcedGame}
        setForcedGame={setForcedGame}
      />

      {/* 4. Hero Text Section (Moved below Games) */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto bg-white/60 p-8 sm:p-12 rounded-[36px] border-4 border-purple-200 shadow-xl backdrop-blur-sm">
          
          {/* Playful Tag */}
          <div className="bg-[#FFECA1] border-2 border-[#D97706] text-[#B45309] font-extrabold text-sm px-4 py-1.5 rounded-full shadow-sm flex items-center justify-center gap-1.5 mx-auto animate-bounce-slow">
            <span>🐞</span>
            <span>للأطفال الأذكياء من عمر 4 إلى 12 سنة</span>
          </div>

          {/* Main Bouncy Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#4D2B82] leading-[1.2] tracking-tight">
            مغامرات صغيرة.
            <span className="block mt-4">
              عقول{" "}
              <span className="text-[#FF7A00] highlight-underline relative inline-block">
                تزهر بالعلم!
                <span className="absolute -top-4 -right-8 text-yellow-400 text-2xl animate-pulse">✨</span>
              </span>{" "}
              🌱
            </span>
          </h1>

          {/* Description Paragraph */}
          <p className="text-lg sm:text-xl text-[#6B4E9E] font-medium leading-relaxed max-w-2xl mx-auto">
            بلومي يحوّل تعلّم القراءة والحساب والقرآن الكريم إلى مغامرات حديقة ممتعة يعشقها الأطفال - صُمم بواسطة معلمين وخبراء، خالٍ تماماً من الإعلانات، ولطيف على وقت الشاشة.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm sm:text-base font-bold text-[#6B4E9E]">
            <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-xl shadow-sm border border-purple-100">
              <span className="text-yellow-400 text-xl">★</span>
              <span>4.9 في متاجر التطبيقات</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-xl shadow-sm border border-purple-100">
              <span className="text-xl">👥</span>
              <span>محبوب من 240,000+ عائلة</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-xl shadow-sm border border-purple-100">
              <span className="text-xl">🚫</span>
              <span>بيئة آمنة بدون إعلانات</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y-4 border-[#4D2B82] relative z-10">
        <div className="container mx-auto px-4">
          
          {/* Header Title */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#4D2B82] mb-4">
              كيف تبدأ الرحلة؟ 🗺️
            </h2>
            <p className="text-lg text-[#6B4E9E] font-medium">
              3 خطوات بسيطة تأخذ طفلك من التعلم التقليدي الممل إلى التميز والازدهار المعرفي.
            </p>
          </div>

          {/* Steps Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            
            {/* Connective Line (Desktop Only) */}
            <div className="hidden md:block absolute top-[55px] right-[10%] left-[10%] h-1 border-t-4 border-dashed border-[#4D2B82]/20 z-0" />

            {steps.map((st, i) => (
              <div key={i} className="flex flex-col items-center text-center px-4 relative z-10 group">
                
                {/* Step Circle Counter */}
                <div className="w-20 h-20 rounded-full bg-[#FAF7FD] border-3 border-[#4D2B82] flex items-center justify-center text-[#E01E5A] shadow-[0_5px_0_0_#4D2B82] group-hover:scale-105 transition-transform duration-300 relative">
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#E01E5A] text-white border-2 border-[#4D2B82] flex items-center justify-center text-[10px] font-extrabold">
                    {st.number}
                  </div>
                  {st.icon}
                </div>

                {/* Step Title */}
                <h3 className="text-xl font-extrabold text-[#4D2B82] mt-6 mb-3">
                  {st.title}
                </h3>

                {/* Step Desc */}
                <p className="text-sm text-[#6B4E9E] font-medium leading-relaxed max-w-xs">
                  {st.desc}
                </p>

              </div>
            ))}

          </div>

          {/* CTA at Bottom */}
          <div className="flex justify-center mt-16">
            <button onClick={scrollToGames} className="btn-bubbly-primary text-lg px-10 py-4">
              ابدأ تجربة الألعاب السحرية الآن! 🚀
            </button>
          </div>

        </div>
      </section>

      {/* 6. Parent Dashboard/Testimonial Section */}
      <section id="parents" className="container mx-auto px-4 py-20 relative z-10">
        <div className="card-bubbly bg-[#FFFCE6] p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-[#D97706]">
          
          <div className="lg:col-span-7 space-y-6 text-right">
            
            {/* Stat Pill */}
            <div className="inline-flex items-center gap-1 text-xs font-extrabold text-[#D97706] bg-[#FEF7D2] px-3 py-1 rounded-full border border-[#D97706]/20">
              <span>👪</span>
              <span>لوحة تحكم خاصة بأولياء الأمور</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4D2B82]">
              تابع تقدم طفلك خطوة بخطوة 📈
            </h2>

            <p className="text-base sm:text-lg text-[#6B4E9E] font-medium leading-relaxed">
              نوفر لك لوحة تحكم ذكية ترسل لك تقارير دورية حول الكلمات التي قرأها طفلك، والمسائل الرياضية التي قام بحلها، ومستوى الحفظ القرآني، مع إمكانية تعديل أوقات الجلسات اليومية وتحديد فترات الراحة.
            </p>

            {/* Check Features */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-extrabold text-[#4D2B82] pt-2">
              <li className="flex items-center gap-2">
                <span className="text-[#198754] text-lg">✔</span>
                <span>تقارير تقدم يومية عبر البريد</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#198754] text-lg">✔</span>
                <span>التحكم في أوقات الشاشة اليومية</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#198754] text-lg">✔</span>
                <span>مراجعة وتقييم مسارات التعلم</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#198754] text-lg">✔</span>
                <span>مزامنة الأجهزة المتعددة للعائلة</span>
              </li>
            </ul>

          </div>

          <div className="lg:col-span-5 flex flex-col space-y-5">
            
            {/* Live Parent Dashboard Card */}
            <div className="card-bubbly bg-white p-5 border-[#2ECC71] shadow-md text-right relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-2 bg-[#2ECC71]" />
              <h3 className="text-lg font-black text-[#4D2B82] mb-4 flex items-center justify-start gap-2 flex-row-reverse">
                <span>📊</span>
                <span>تقرير البطل الحالي</span>
              </h3>
              {childProfile ? (
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center border-b border-purple-50 pb-2">
                    <span className="text-[11px] font-bold text-purple-400">البطل المسجل</span>
                    <span className="font-extrabold text-xs sm:text-sm text-[#4D2B82] flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-full overflow-hidden border border-[#4D2B82] bg-white inline-block">
                        {childProfile.gender === "boy" ? (
                          <BoyAvatar className="w-full h-full" />
                        ) : (
                          <GirlAvatar className="w-full h-full" />
                        )}
                      </span>
                      {childProfile.name} ({childProfile.gender === "boy" ? "ولد" : "بنت"})
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-purple-50 pb-2">
                    <span className="text-[11px] font-bold text-purple-400">رقم الهاتف</span>
                    <span className="font-extrabold text-xs sm:text-sm text-[#4D2B82] ltr-only">{childProfile.phone}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-purple-50 pb-2">
                    <span className="text-[11px] font-bold text-purple-400">العمر والمستوى</span>
                    <span className="font-extrabold text-xs sm:text-sm text-[#4D2B82]">
                      {childProfile.age === "1" ? "سنة 1" : childProfile.age === "2" ? "سنتين 2" : childProfile.age === "+8" ? "+8 سنوات" : `${childProfile.age} سنوات`}
                      {" - "}
                      {childProfile.level === "level1" ? "المستوى الأول" : childProfile.level === "level2" ? "المستوى الثاني" : childProfile.level === "level3" ? "المستوى الثالث" : "المستوى الفائق"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-0.5">
                    <span className="text-[11px] font-bold text-purple-400">مجموع النجوم</span>
                    <span className="bg-yellow-100 text-yellow-700 px-2.5 py-0.5 rounded-full font-black text-xs sm:text-sm border border-yellow-200 flex items-center gap-1">
                      <span>⭐</span>
                      <span>{globalStars} نجمة</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <span className="text-3xl">👋</span>
                  <p className="font-bold text-sm text-[#6B4E9E] mt-2">لم يتم تسجيل أي بطل بعد!</p>
                  <p className="text-[11px] text-purple-300 mt-0.5">دع طفلك يبدأ اللعب وسنقوم بحفظ تقدمه هنا.</p>
                </div>
              )}
            </div>

            {/* Bouncy Review Card 1 */}
            <div className="card-bubbly p-5 bg-white transform rotate-1 border-purple-200">
              <p className="text-sm font-bold text-[#6B4E9E] italic mb-3">
                "بلومي غيّر روتين طفلي تماماً! كان يكره القراءة، والآن هو من يطلب اللعب بعشر دقائق الحديقة السحرية ليجمع النجوم. برنامج رائع ومريح للأمهات."
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-xs">👩</div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#4D2B82]">سارة م.</h4>
                  <span className="text-[10px] font-bold text-purple-400">أم ليوسف (6 سنوات)</span>
                </div>
              </div>
            </div>

            {/* Bouncy Review Card 2 */}
            <div className="card-bubbly p-5 bg-white transform -rotate-1 border-purple-200">
              <p className="text-sm font-bold text-[#6B4E9E] italic mb-3">
                "أفضل تطبيق ألعاب تعليمي استخدمناه حتى الآن. الأهم أنه آمن تماماً، وبدون إعلانات، ويساعدهم على الفهم وحفظ سور القرآن بطريقة مرحة."
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs">👨</div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#4D2B82]">أحمد ك.</h4>
                  <span className="text-[10px] font-bold text-purple-400">والد لمايا (5 سنوات)</span>
                </div>
              </div>
            </div>

            {/* Bouncy Review Card 3 */}
            <div className="card-bubbly p-5 bg-white transform rotate-2 border-purple-200">
              <p className="text-sm font-bold text-[#6B4E9E] italic mb-3">
                "كان ابني يعاني من بطء في الحساب وتشتت التركيز، لكن حديقة الأرقام والألعاب السحرية الممتعة جعلته يعشق الرياضيات ويحل المسائل بذكاء وسرعة. فكرة الخريطة والجوائز عبقرية!"
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs">👩</div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#4D2B82]">منى ع.</h4>
                  <span className="text-[10px] font-bold text-purple-400">أم لآدم (8 سنوات)</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </section>



      {/* 7. Footer Section */}

      <footer className="container mx-auto px-4 mt-12 pt-12 border-t-3 border-[#4D2B82]/10 text-center">


        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#2ECC71] rounded-full flex items-center justify-center text-[10px]">🌱</div>
            <span className="font-extrabold text-xl text-[#4D2B82]">بلومي للأطفال</span>
          </div>
          <p className="text-sm font-bold text-purple-400">
            تأسيس ممتع، عقول تزهر، ومستقبل مشرق.
          </p>
          <p className="text-xs text-purple-300 font-bold select-none">
            © ٢٠٢٦ بلومي. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>

      {/* Profile Details Modal */}
      <AnimatePresence>
        {showProfileModal && childProfile && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
            {/* Backdrop to close */}
            <div className="absolute inset-0" onClick={() => setShowProfileModal(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="relative bg-white border-4 border-[#4D2B82] rounded-[32px] shadow-[0_12px_0_0_#4D2B82] max-w-sm w-full p-7 text-right font-sans z-10 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Top accent bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#4D2B82] via-[#E01E5A] to-[#FF7A00]" />

              {/* Close button */}
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 left-4 bg-gray-100 hover:bg-red-100 border-2 border-[#4D2B82] text-[#E01E5A] w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-lg cursor-pointer transition-colors shadow-[0_3px_0_0_#4D2B82] active:translate-y-[2px] active:shadow-none"
              >
                ✕
              </button>

              {/* Avatar & Name Header */}
              <div className="flex flex-col items-center mb-6 mt-3">
                <div className="w-20 h-20 rounded-full border-4 border-[#4D2B82] overflow-hidden bg-purple-50 shadow-[0_5px_0_0_#4D2B82] mb-3">
                  {childProfile.gender === "boy" ? (
                    <BoyAvatar className="w-full h-full" />
                  ) : (
                    <GirlAvatar className="w-full h-full" />
                  )}
                </div>
                <h3 className="text-2xl font-black text-[#4D2B82]">{childProfile.name}</h3>
                <span className="text-xs font-bold text-purple-400 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full mt-1">
                  {childProfile.gender === "boy" ? "👦 ولد" : "👧 بنت"}
                </span>
              </div>

              {/* Profile Details Rows */}
              <div className="space-y-3 mb-6">
                {/* Name Row */}
                <div className="flex justify-between items-center bg-purple-50 rounded-2xl px-4 py-3 border border-purple-100">
                  <span className="text-xs font-extrabold text-purple-400">الاسم</span>
                  <span className="font-black text-sm text-[#4D2B82]">{childProfile.name}</span>
                </div>

                {/* Phone Row */}
                <div className="flex justify-between items-center bg-purple-50 rounded-2xl px-4 py-3 border border-purple-100">
                  <span className="text-xs font-extrabold text-purple-400">رقم الهاتف</span>
                  <span className="font-black text-sm text-[#4D2B82] ltr-only" dir="ltr">{childProfile.phone}</span>
                </div>

                {/* Age Row */}
                <div className="flex justify-between items-center bg-purple-50 rounded-2xl px-4 py-3 border border-purple-100">
                  <span className="text-xs font-extrabold text-purple-400">العمر</span>
                  <span className="font-black text-sm text-[#4D2B82]">
                    {childProfile.age === "1" ? "سنة واحدة" : childProfile.age === "2" ? "سنتين" : childProfile.age === "+8" ? "+8 سنوات" : `${childProfile.age} سنوات`}
                  </span>
                </div>

                {/* Level Row */}
                <div className="flex justify-between items-center bg-purple-50 rounded-2xl px-4 py-3 border border-purple-100">
                  <span className="text-xs font-extrabold text-purple-400">المستوى (تعديل)</span>
                  <select 
                    value={childProfile.level || "level1"}
                    onChange={(e) => {
                      const newLevel = e.target.value as "level1" | "level2" | "level3" | "level4" | null;
                      const updatedChild = { ...childProfile, level: newLevel };
                      setChildProfile(updatedChild);
                      localStorage.setItem("childProfile", JSON.stringify(updatedChild));
                      saveProfileToBackend(updatedChild);
                      setAllProfiles(prev => prev.map(p => p.id === updatedChild.id ? updatedChild : p));
                    }}
                    className="font-black text-sm text-[#4D2B82] bg-white border-2 border-purple-200 rounded-xl px-2 py-1 outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer"
                  >
                    <option value="level1">🌱 المستوى الأول</option>
                    <option value="level2">⭐ المستوى الثاني</option>
                    <option value="level3">🏆 المستوى الثالث</option>
                    <option value="level4">🚀 المستوى الفائق</option>
                  </select>
                </div>

                {/* Stars Row */}
                <div className="flex justify-between items-center bg-yellow-50 rounded-2xl px-4 py-3 border border-yellow-200">
                  <span className="text-xs font-extrabold text-yellow-600">النجوم المكتسبة</span>
                  <span className="font-black text-sm text-yellow-700 flex items-center gap-1">
                    <span>⭐</span>
                    <span>{globalStars} نجمة</span>
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setChildProfile(null);
                  localStorage.removeItem("childProfile");
                  localStorage.removeItem("bloomly_stars");
                  setGlobalStars(0);
                  // يرجع للتطبيق مش لصفحة التسجيل
                }}
                className="w-full py-3.5 rounded-2xl bg-[#E01E5A] text-white font-black text-base border-2 border-[#9B1239] shadow-[0_5px_0_0_#9B1239] hover:shadow-[0_3px_0_0_#9B1239] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer"
              >
                تسجيل الخروج 👋
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. Characters Full-Page View Overlay */}
      {showCharactersView && (
        <div className="fixed inset-0 bg-[#FAF7FD] overflow-y-auto font-sans p-6 md:p-12 flex flex-col items-center z-[9999] animate-[fadeIn_0.2s_ease-out]">
          
          {/* Close button top right */}
          <button 
            onClick={() => {
              setShowCharactersView(false);
              playBubbleSound();
            }}
            className="absolute top-6 right-6 md:top-8 md:right-8 bg-white border-3 border-[#4D2B82] text-[#E01E5A] hover:bg-red-50 p-2.5 rounded-full shadow-[0_4px_0_0_#4D2B82] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#4D2B82] transition-all cursor-pointer z-50 flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mt-8 mb-12 relative z-10">
            <span className="text-5xl animate-bounce-slow inline-block">👑</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#4D2B82] mt-3 mb-4">
              شخصيات بلومي
            </h1>
            <p className="text-base sm:text-lg text-[#6B4E9E] font-bold">
              تعرّف على أصدقائك الطيبين الذين سيرشدونك ويساعدونك في مغامراتك داخل الجزر!
            </p>
          </div>

          {/* Characters Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full relative z-10 mb-12">
            {islands.map((char, index) => (
              <div 
                key={index} 
                className="card-bubbly bg-white p-6 flex flex-col items-center text-center relative overflow-hidden group hover:border-[#FF7A00] transition-colors"
              >
                {/* Top color ribbon */}
                <div className="absolute top-0 inset-x-0 h-2 bg-[#4D2B82]/10" />

                {/* Character avatar */}
                <div className="w-20 h-20 rounded-3xl bg-purple-50 border-3 border-[#4D2B82] flex items-center justify-center text-5xl mb-4 shadow-[0_5px_0_0_#4D2B82] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                  {char.characterEmoji}
                </div>

                {/* Character Name */}
                <h3 className="text-xl font-extrabold text-[#4D2B82] mb-1 font-sans">
                  {char.character.split(" ")[1] || char.character}
                </h3>
                <span className="text-xs font-bold text-purple-400 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full mb-4">
                  {char.character.split("(")[1]?.replace(")", "") || "مرشد سحري"}
                </span>

                {/* Description */}
                <p className="text-sm text-[#6B4E9E] font-medium leading-relaxed mb-6">
                  {char.quest.replace("سنتعلّم ", "أساعدك على تعلّم ")}
                </p>

                {/* Superpower Info */}
                <div className="bg-yellow-50 border-2 border-[#D97706]/10 rounded-2xl p-4 w-full mt-auto">
                  <span className="text-[10px] font-extrabold text-[#D97706] block mb-1">
                    ✨ القوة التي يمنحها لك:
                  </span>
                  <span className="text-xs font-extrabold text-[#B45309]">
                    {char.superpower}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center relative z-10">
            <button 
              onClick={() => {
                setShowCharactersView(false);
                playBubbleSound();
                setTimeout(() => {
                  const element = document.getElementById("game-zone");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="btn-bubbly-primary text-base px-8 py-3.5"
            >
              انطلق للعب الآن مع الشخصيات! 🚀
            </button>
          </div>

        </div>
      )}

      {/* 9. Large Magic Garden View Overlay */}
      {showMagicGarden && (
        <MagicGarden 
          onClose={() => {
            setShowMagicGarden(false);
            setSpectateProfile(null);
          }} 
          globalStars={spectateProfile ? (spectateProfile.stars ?? 0) : globalStars} 
          setGlobalStars={spectateProfile ? () => {} : setGlobalStars} 
          spectateMode={!!spectateProfile}
          spectateFarmData={spectateProfile?.farmData}
        />
      )}

      {/* 10. Magic Garden Loading Overlay */}
      {isLoadingGarden && (
        <div className="fixed inset-0 bg-gradient-to-br from-[#E8F5E9] via-white to-[#E3F2FD] z-[10030] flex flex-col items-center justify-center p-6 select-none">
          <div className="text-center max-w-md w-full flex flex-col items-center gap-6">
            <span className="text-6xl animate-bounce">🌿</span>
            
            <div className="text-center w-full">
              <h3 className="text-2xl font-black text-[#4D2B82] mb-1">
                جاري الانتقال إلى حديقتك السحرية...
              </h3>
              <p className="text-sm font-bold text-emerald-600">
                استعد لزرع البذور وري النباتات وملاعبة الحيوانات! 🐰🌻
              </p>
            </div>

            {/* Bouncy Progress Bar */}
            <div className="w-full bg-emerald-100 h-6 rounded-full border-3 border-[#4D2B82] overflow-hidden p-0.5 shadow-md relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-400 via-green-400 to-yellow-400 rounded-full"
                style={{ width: `${gardenLoadingProgress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${gardenLoadingProgress}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-black text-xs text-[#4D2B82]">
                {gardenLoadingProgress}%
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


