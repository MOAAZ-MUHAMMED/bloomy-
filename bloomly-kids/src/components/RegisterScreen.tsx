import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BoyAvatar, GirlAvatar } from "./Avatars";

interface ProfileData {
  gender: "boy" | "girl" | null;
  name: string;
  age: string;
  country: string;
  phone: string;
  level: "level1" | "level2" | "level3" | "level4" | null;
}

interface RegisterScreenProps {
  onFinish: (profile: ProfileData) => void;
  existingPhones?: string[];
}

export function RegisterScreen({ onFinish, existingPhones = [] }: RegisterScreenProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<ProfileData>({
    gender: null,
    name: "",
    age: "",
    country: "",
    phone: "",
    level: null
  });
  const [phoneError, setPhoneError] = useState("");

  // Programmatic audio feedback
  const playClickSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("Click sound failed:", e);
    }
  };

  const playSuccessSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major chord
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch (e) {
      console.warn("Success sound failed:", e);
    }
  };

  const nextStep = () => {
    playClickSound();
    if (step < 6) {
      setStep(step + 1);
    } else {
      playSuccessSound();
      onFinish(profile);
    }
  };

  const prevStep = () => {
    playClickSound();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Check if button "Next" should be disabled
  const isNextDisabled = () => {
    if (step === 1 && !profile.gender) return true;
    if (step === 2 && profile.name.trim().length === 0) return true;
    if (step === 3 && !profile.age) return true;
    if (step === 4 && !profile.country) return true;
    if (step === 5) {
      if (profile.phone.trim().length < 8) return true;
      if (existingPhones.includes(profile.phone.trim())) return true;
    }
    if (step === 6 && !profile.level) return true;
    return false;
  };

  // Slider animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <div className="fixed inset-0 bg-[#FAF7FD] z-[99990] flex flex-col items-center justify-start overflow-y-auto px-4 py-8 select-none font-sans">
      {/* 1. Parents Top Welcome Phrase 'hi mom' */}
      <div className="w-full max-w-md flex justify-center mb-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-pink-100/70 border border-pink-200 text-pink-600 font-extrabold text-sm px-5 py-1.5 rounded-full shadow-sm tracking-wide"
        >
          👋 hi mom
        </motion.div>
      </div>

      {/* Main wizard Card */}
      <div className="w-full max-w-xl bg-white border-4 border-[#4D2B82] rounded-[32px] shadow-[0_8px_0_0_#4D2B82] p-4 sm:p-8 relative flex flex-col justify-between min-h-[480px] md:min-h-[500px]">
        {/* Step Indicator dots */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full border-2 border-[#4D2B82] transition-colors duration-300 ${
                  step >= i ? "bg-[#2ECC71]" : "bg-gray-100"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-extrabold text-purple-400 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            خطوة {step} من ٦
          </span>
        </div>

        {/* Wizard content */}
        <div className="flex-grow flex flex-col justify-center overflow-hidden py-2 relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center w-full"
              >
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4D2B82] text-center mb-8">
                  هل أنت ولد أم بنت؟ 🧸
                </h2>
                <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md justify-center">
                  {/* Boy card */}
                  <div
                    onClick={() => {
                      setProfile({ ...profile, gender: "boy" });
                      playClickSound();
                    }}
                    className={`flex-1 flex flex-col items-center justify-center p-6 rounded-2xl border-4 cursor-pointer transition-all duration-200 ${
                      profile.gender === "boy"
                        ? "border-[#2ECC71] bg-blue-50/70 scale-105 shadow-md"
                        : "border-[#4D2B82] bg-white hover:scale-102 hover:shadow-sm"
                    }`}
                  >
                    <BoyAvatar className="w-24 h-24 sm:w-28 sm:h-28 mb-3 filter drop-shadow-md" />
                    <span className="text-2xl font-extrabold text-[#4D2B82]">ولد</span>
                    {profile.gender === "boy" && (
                      <div className="mt-2 bg-[#2ECC71] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                        مختار ✅
                      </div>
                    )}
                  </div>

                  {/* Girl card */}
                  <div
                    onClick={() => {
                      setProfile({ ...profile, gender: "girl" });
                      playClickSound();
                    }}
                    className={`flex-1 flex flex-col items-center justify-center p-6 rounded-2xl border-4 cursor-pointer transition-all duration-200 ${
                      profile.gender === "girl"
                        ? "border-[#2ECC71] bg-pink-50/70 scale-105 shadow-md"
                        : "border-[#4D2B82] bg-white hover:scale-102 hover:shadow-sm"
                    }`}
                  >
                    <GirlAvatar className="w-24 h-24 sm:w-28 sm:h-28 mb-3 filter drop-shadow-md" />
                    <span className="text-2xl font-extrabold text-[#4D2B82]">بنت</span>
                    {profile.gender === "girl" && (
                      <div className="mt-2 bg-[#2ECC71] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                        مختارة ✅
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key={2}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center w-full"
              >
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4D2B82] text-center mb-8">
                  ما هو اسمك يا بطل؟ ✏️
                </h2>
                <div className="w-full max-w-sm">
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="اكتب اسمك هنا..."
                    maxLength={15}
                    className="w-full text-center text-3xl font-extrabold py-4 px-6 rounded-2xl border-4 border-[#4D2B82] outline-none focus:ring-4 focus:ring-purple-200 text-[#4D2B82] placeholder:text-gray-300"
                    autoFocus
                  />
                  <p className="text-center text-sm font-bold text-purple-400 mt-3">
                    اكتب اسمك الأول لكي تناديك به ألعاب بلومي! 🌟
                  </p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key={3}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center w-full"
              >
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4D2B82] text-center mb-6">
                  كم عمرك؟ 🎂
                </h2>
                <div className="grid grid-cols-4 gap-2 sm:gap-3.5 w-full max-w-md">
                  {["1", "2", "3", "4", "5", "6", "7", "+8"].map((ageVal) => {
                    const label = ageVal === "1" ? "سنة 1" : ageVal === "2" ? "سنتين 2" : ageVal === "+8" ? "+8 سنوات" : `${ageVal} سنوات`;
                    const isSelected = profile.age === ageVal;
                    return (
                      <div
                        key={ageVal}
                        onClick={() => {
                          setProfile({ ...profile, age: ageVal });
                          playClickSound();
                        }}
                        className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl border-3 cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? "border-[#2ECC71] bg-green-50 scale-105 shadow-sm"
                            : "border-[#4D2B82] bg-white hover:scale-102"
                        }`}
                      >
                        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-base sm:text-lg font-black border-2 border-[#4D2B82] mb-1 sm:mb-1.5 ${
                          isSelected ? "bg-[#2ECC71] text-white" : "bg-purple-50 text-[#4D2B82]"
                        }`}>
                          {ageVal}
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-bold text-[#4D2B82] text-center whitespace-nowrap">
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key={4}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center w-full"
              >
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4D2B82] text-center mb-6">
                  من أي بلد أنت؟ 🌍
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-md max-h-[300px] overflow-y-auto px-2 pb-2">
                  {[
                    { name: "مصر", flag: "🇪🇬" },
                    { name: "السعودية", flag: "🇸🇦" },
                    { name: "الإمارات", flag: "🇦🇪" },
                    { name: "الكويت", flag: "🇰🇼" },
                    { name: "قطر", flag: "🇶🇦" },
                    { name: "عمان", flag: "🇴🇲" },
                    { name: "الأردن", flag: "🇯🇴" },
                    { name: "فلسطين", flag: "🇵🇸" },
                    { name: "المغرب", flag: "🇲🇦" },
                    { name: "الجزائر", flag: "🇩🇿" },
                    { name: "تونس", flag: "🇹🇳" },
                    { name: "بلد آخر", flag: "🌎" }
                  ].map((country) => {
                    const countryVal = `${country.flag} ${country.name}`;
                    const isSelected = profile.country === countryVal;
                    return (
                      <div
                        key={country.name}
                        onClick={() => {
                          setProfile({ ...profile, country: countryVal });
                          playClickSound();
                        }}
                        className={`flex items-center gap-2 p-3 rounded-xl border-3 cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? "border-[#2ECC71] bg-green-50 scale-105 shadow-sm"
                            : "border-[#4D2B82] bg-white hover:scale-102"
                        }`}
                      >
                        <span className="text-2xl">{country.flag}</span>
                        <span className="text-sm font-bold text-[#4D2B82]">{country.name}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key={5}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center w-full"
              >
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4D2B82] text-center mb-6">
                  ما هو رقم هاتف بابا أو ماما؟ 📞
                </h2>
                <div className="w-full max-w-sm">
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setProfile({ ...profile, phone: val });
                      setPhoneError("");
                    }}
                    placeholder="مثال: 01xxxxxxxxx"
                    maxLength={15}
                    className={`w-full text-center text-2xl sm:text-3xl font-extrabold py-3 px-5 rounded-2xl border-4 outline-none focus:ring-4 text-[#4D2B82] placeholder:text-gray-300 ltr-only transition-colors ${
                      existingPhones.includes(profile.phone.trim())
                        ? "border-red-400 focus:ring-red-200 bg-red-50"
                        : "border-[#4D2B82] focus:ring-purple-200"
                    }`}
                    autoFocus
                  />
                  {existingPhones.includes(profile.phone.trim()) && profile.phone.trim().length >= 8 ? (
                    <p className="text-center text-sm font-black text-red-500 mt-3 bg-red-50 border border-red-200 rounded-xl py-2 px-3">
                      ❌ هذا الرقم مسجّل بالفعل! سجّل دخولك بدلاً من إنشاء حساب جديد.
                    </p>
                  ) : (
                    <p className="text-center text-xs sm:text-sm font-bold text-purple-400 mt-4 leading-relaxed">
                      نحتاج رقم الهاتف للتواصل ولحفظ تقدم البطل! 🌟
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                key={6}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center w-full"
              >
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4D2B82] text-center mb-6">
                  اختر مستوى اللعب 🗺️
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg">
                  {/* Level 1 */}
                  <div
                    onClick={() => {
                      setProfile({ ...profile, level: "level1" });
                      playClickSound();
                    }}
                    className={`p-3 sm:p-4 rounded-xl border-3 cursor-pointer text-right flex flex-col justify-between transition-all duration-200 ${
                      profile.level === "level1"
                        ? "border-[#2ECC71] bg-green-50/50 scale-[1.02] shadow-xs"
                        : "border-[#4D2B82] bg-white hover:scale-[1.01]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base sm:text-lg font-black text-[#4D2B82]">المستوى الأول ⭐</span>
                        {profile.level === "level1" && <span className="text-xs bg-[#2ECC71] text-white px-2 py-0.5 rounded-full font-bold">مختار</span>}
                      </div>
                      <p className="text-[11px] font-bold text-purple-400 mb-1">من عمر 1 إلى 4 سنوات</p>
                      <p className="text-[10px] text-gray-500 font-medium leading-relaxed">ألعاب الألوان، التعرف على الحروف الأولى والبالونات والأصوات البسيطة.</p>
                    </div>
                  </div>

                  {/* Level 2 */}
                  <div
                    onClick={() => {
                      setProfile({ ...profile, level: "level2" });
                      playClickSound();
                    }}
                    className={`p-3 sm:p-4 rounded-xl border-3 cursor-pointer text-right flex flex-col justify-between transition-all duration-200 ${
                      profile.level === "level2"
                        ? "border-[#2ECC71] bg-green-50/50 scale-[1.02] shadow-xs"
                        : "border-[#4D2B82] bg-white hover:scale-[1.01]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base sm:text-lg font-black text-[#4D2B82]">المستوى الثاني 🌟</span>
                        {profile.level === "level2" && <span className="text-xs bg-[#2ECC71] text-white px-2 py-0.5 rounded-full font-bold">مختار</span>}
                      </div>
                      <p className="text-[11px] font-bold text-purple-400 mb-1">من عمر 5 إلى 7 سنوات</p>
                      <p className="text-[10px] text-gray-500 font-medium leading-relaxed">مغامرات الحروف والتهجئة، الرياضيات السهلة وتنشيط كروت الذاكرة.</p>
                    </div>
                  </div>

                  {/* Level 3 */}
                  <div
                    onClick={() => {
                      setProfile({ ...profile, level: "level3" });
                      playClickSound();
                    }}
                    className={`p-3 sm:p-4 rounded-xl border-3 cursor-pointer text-right flex flex-col justify-between transition-all duration-200 ${
                      profile.level === "level3"
                        ? "border-[#2ECC71] bg-green-50/50 scale-[1.02] shadow-xs"
                        : "border-[#4D2B82] bg-white hover:scale-[1.01]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base sm:text-lg font-black text-[#4D2B82]">المستوى الثالث 🚀</span>
                        {profile.level === "level3" && <span className="text-xs bg-[#2ECC71] text-white px-2 py-0.5 rounded-full font-bold">مختار</span>}
                      </div>
                      <p className="text-[11px] font-bold text-purple-400 mb-1">من عمر 8 إلى 10 سنوات</p>
                      <p className="text-[10px] text-gray-500 font-medium leading-relaxed">تهجئة متقدمة، عمليات حسابية سريعة، تحديات التوصيل والمتاهة الذكية.</p>
                    </div>
                  </div>

                  {/* Level 4 */}
                  <div
                    onClick={() => {
                      setProfile({ ...profile, level: "level4" });
                      playClickSound();
                    }}
                    className={`p-3 sm:p-4 rounded-xl border-3 cursor-pointer text-right flex flex-col justify-between transition-all duration-200 ${
                      profile.level === "level4"
                        ? "border-[#2ECC71] bg-green-50/50 scale-[1.02] shadow-xs"
                        : "border-[#4D2B82] bg-white hover:scale-[1.01]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base sm:text-lg font-black text-[#E01E5A]">المستوى الفائق 🏆</span>
                        {profile.level === "level4" && <span className="text-xs bg-[#2ECC71] text-white px-2 py-0.5 rounded-full font-bold">مختار</span>}
                      </div>
                      <p className="text-[11px] font-bold text-pink-400 mb-1">تحدي العباقرة الخارقين</p>
                      <p className="text-[10px] text-gray-500 font-medium leading-relaxed">ألعاب ذكاء وسرعة فائقة بدون حدود لعقول متميزة تتطلع للتميز الدائم.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Buttons Nav controls */}
        <div className="flex items-center justify-between mt-8 border-t-3 border-[#4D2B82] pt-5">
          {/* Previous button */}
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="bg-white border-3 border-[#4D2B82] text-[#4D2B82] font-black text-lg py-2.5 px-6 rounded-full shadow-[0_4px_0_0_#4D2B82] active:translate-y-[4px] active:shadow-none transition-all duration-100 cursor-pointer"
            >
              ← السابق
            </button>
          ) : (
            <div />
          )}

          {/* Next / Finish button */}
          <button
            onClick={nextStep}
            disabled={isNextDisabled()}
            className={`font-black text-lg py-2.5 px-8 rounded-full border-3 border-[#4D2B82] transition-all duration-100 cursor-pointer ${
              isNextDisabled()
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-[#2ECC71] text-white shadow-[0_4px_0_0_#4D2B82] active:translate-y-[4px] active:shadow-none"
            }`}
          >
            {step === 5 ? "ابدأ المغامرة! 🚀" : "التالي →"}
          </button>
        </div>
      </div>
    </div>
  );
}
