const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add currentView state declaration
const stateTarget = `const [showIntro, setShowIntro] = useState(true);`;
const stateReplacement = `const [showIntro, setShowIntro] = useState(true);
  const [currentView, setCurrentView] = useState<'main' | 'parents' | 'about'>('main');`;

if (content.includes(stateTarget)) {
  content = content.replace(stateTarget, stateReplacement);
  console.log("currentView state added!");
}

// 2. Remove the Entry button to Large Garden under InteractiveGarden
// Let's find it:
const buttonTarget = `          {/* Entry button to Large Garden */}
          <button
            onClick={() => {
              playBubbleSound();
              startLoadingGarden();
            }}
            className="btn-bubbly-primary text-xl px-12 py-5 flex items-center justify-center gap-3 animate-bounce-slow w-full sm:w-auto mt-4 shadow-[0_0_30px_rgba(255,122,0,0.4)] hover:shadow-[0_0_50px_rgba(255,122,0,0.6)]"
          >
            <span className="text-3xl">🚪🌿</span>
            <span>دخول الحديقة السحرية الكبيرة</span>
          </button>`;

if (content.includes(buttonTarget)) {
  content = content.replace(buttonTarget, '');
  console.log("Large Garden entry button removed!");
} else {
  // Let's do a regex replace for the button in case spacing is different
  const regex = /\{\/\*\s*Entry button to Large Garden\s*\*\/\}[\s\S]*?<\/button>/;
  if (regex.test(content)) {
    content = content.replace(regex, '');
    console.log("Large Garden entry button removed via regex!");
  } else {
    console.log("Large Garden entry button not found!");
  }
}

// 3. Update GameZone properties to pass callbacks
const gameZoneTarget = `      <GameZone 
        onNeedRegister={() => setShowRegister(true)} 
        globalStars={globalStars} 
        setGlobalStars={setGlobalStars}
        childLevel={childProfile?.level}
        forcedGame={forcedGame}
        setForcedGame={setForcedGame}
      />`;

const gameZoneReplacement = `      <GameZone 
        onNeedRegister={() => setShowRegister(true)} 
        globalStars={globalStars} 
        setGlobalStars={setGlobalStars}
        childLevel={childProfile?.level}
        forcedGame={forcedGame}
        setForcedGame={setForcedGame}
        onOpenParents={() => {
          setCurrentView('parents');
          if (window.speechSynthesis) window.speechSynthesis.speak(new SpeechSynthesisUtterance("لوحة التحكم لأولياء الأمور"));
        }}
        onOpenAbout={() => {
          setCurrentView('about');
          if (window.speechSynthesis) window.speechSynthesis.speak(new SpeechSynthesisUtterance("معلومات عن التطبيق"));
        }}
      />`;

if (content.includes(gameZoneTarget)) {
  content = content.replace(gameZoneTarget, gameZoneReplacement);
  console.log("GameZone rendering updated with callbacks!");
}

// 4. Wrap main homepage sections with currentView === 'main' check
// Let's locate the return structure:
// It starts with:
//   return (
//     <div className="min-h-screen relative font-sans overflow-x-hidden pb-16 bg-transparent">
//       <MagicalForestBackground />
// We can wrap everything after MagicalForestBackground up to what-we-teach section inside currentView === 'main'
const searchStart = `    <div className="min-h-screen relative font-sans overflow-x-hidden pb-16 bg-transparent">
      <MagicalForestBackground />`;

const replacementStart = `    <div className="min-h-screen relative font-sans overflow-x-hidden pb-16 bg-transparent">
      <MagicalForestBackground />
      {currentView === 'main' && (
        <>`;

if (content.includes(searchStart)) {
  content = content.replace(searchStart, replacementStart);
  console.log("Main view wrapper start added!");
}

// Now let's close currentView === 'main' right before What We Teach section (id="what-we-teach")
// Wait, we also want to completely exclude what-we-teach and parents sections from main view!
// In fact, what-we-teach starts with:
//   {/* 4. Hero Text Section (Moved below Games) */}
//   <section id="what-we-teach"
// And parents section is section 6.
// Let's close currentView === 'main' after GameZone!
const closeTarget = `      <GameZone 
        onNeedRegister={() => setShowRegister(true)} 
        globalStars={globalStars} 
        setGlobalStars={setGlobalStars}
        childLevel={childProfile?.level}
        forcedGame={forcedGame}
        setForcedGame={setForcedGame}
        onOpenParents={() => {
          setCurrentView('parents');
          if (window.speechSynthesis) window.speechSynthesis.speak(new SpeechSynthesisUtterance("لوحة التحكم لأولياء الأمور"));
        }}
        onOpenAbout={() => {
          setCurrentView('about');
          if (window.speechSynthesis) window.speechSynthesis.speak(new SpeechSynthesisUtterance("معلومات عن التطبيق"));
        }}
      />`;

const closeReplacement = `      <GameZone 
        onNeedRegister={() => setShowRegister(true)} 
        globalStars={globalStars} 
        setGlobalStars={setGlobalStars}
        childLevel={childProfile?.level}
        forcedGame={forcedGame}
        setForcedGame={setForcedGame}
        onOpenParents={() => {
          setCurrentView('parents');
          if (window.speechSynthesis) window.speechSynthesis.speak(new SpeechSynthesisUtterance("لوحة التحكم لأولياء الأمور"));
        }}
        onOpenAbout={() => {
          setCurrentView('about');
          if (window.speechSynthesis) window.speechSynthesis.speak(new SpeechSynthesisUtterance("معلومات عن التطبيق"));
        }}
      />
        </>
      )}`;

if (content.includes(closeTarget)) {
  content = content.replace(closeTarget, closeReplacement);
  console.log("Main view wrapper end closed!");
}

// 5. Hide old what-we-teach and parents sections by wrapping them or commenting them out,
// since we now render them in their own views.
// What-we-teach is lines 984 to 1083. Let's wrap it in if currentView === 'about'
// Parents section starts with `<section id="parents" className="container mx-auto px-4 py-20 relative z-10">`
// Let's do this dynamically in a script by replacing sections.
// Let's find the what-we-teach section:
const whatWeTeachStart = `      {/* 4. Hero Text Section (Moved below Games) */}
      <section id="what-we-teach"`;

if (content.includes(whatWeTeachStart)) {
  content = content.replace(whatWeTeachStart, `      {/* 4. Hero Text Section (Moved below Games) */}
      {false && <section id="what-we-teach"`);
  // And the closing of what-we-teach:
  // We need to close the {false && ...}
  // Let's do it by finding the end of the section
  // To keep it simple, we can just search for `<section id="parents"` and insert the closing before it
  content = content.replace('<section id="parents"', '}</section>\n      <section id="parents"');
  console.log("Original What We Teach section disabled!");
}

// Now let's disable the original parents section
const parentsStart = `<section id="parents"`;
if (content.includes(parentsStart)) {
  content = content.replace(parentsStart, `{false && <section id="parents"`);
  // And close it before the footer section
  content = content.replace('<footer', '}</section>\n      <footer');
  console.log("Original Parents section disabled!");
}

// 6. Append the new Parents View and About View rendering blocks before the final closing div in App.tsx
const parentsView = `
      {/* --- PARENTS VIEW --- */}
      {currentView === 'parents' && (
        <div className="min-h-screen bg-[#3D1E6D] py-12 px-4 select-none" dir="rtl">
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-3xl border-3 border-purple-200 shadow-md">
              <button 
                onClick={() => {
                  setCurrentView("main");
                  playBubbleSound();
                }}
                className="btn-bubbly-secondary text-sm py-2 px-5 text-[#4D2B82] bg-white rounded-full flex items-center gap-1 cursor-pointer border-2 border-[#4D2B82] shadow-[0_4px_0_0_#4D2B82] active:translate-y-1 active:shadow-[0_0_0_0_#4D2B82] transition-all"
              >
                <span>🔙 رجوع للقائمة</span>
              </button>
              <h2 className="text-2xl font-black text-[#4D2B82]">👨‍👩‍👧‍👦 لوحة تحكم أولياء الأمور</h2>
            </div>
            
            <div className="card-bubbly bg-[#FFFCE6] p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-[#D97706] rounded-[36px]">
              <div className="lg:col-span-7 space-y-6 text-right">
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
                <div className="card-bubbly bg-white p-5 border-[#2ECC71] shadow-md text-right relative overflow-hidden rounded-[24px]">
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
                          {childProfile.name} ({childProfile.gender === "boy" ? "ولد" : "بنت"})
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-purple-50 pb-2">
                        <span className="text-[11px] font-bold text-purple-400">رقم الهاتف</span>
                        <span className="font-extrabold text-xs sm:text-sm text-[#4D2B82]">{childProfile.phone}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-purple-50 pb-2">
                        <span className="text-[11px] font-bold text-purple-400">العمر والمستوى</span>
                        <span className="font-extrabold text-xs sm:text-sm text-[#4D2B82]">
                          {childProfile.age} سنوات - {childProfile.level === "level1" ? "المستوى الأول" : "المستوى الفائق"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-purple-50 pb-2">
                        <span className="text-[11px] font-bold text-purple-400">وقت اللعب الإجمالي</span>
                        <span className="font-extrabold text-xs sm:text-sm text-[#4D2B82]">
                          {childProfile.playtimeMinutes || 0} دقيقة
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-[11px] font-bold text-purple-400">مجموع النجوم</span>
                        <span className="bg-yellow-100 text-yellow-700 px-2.5 py-0.5 rounded-full font-black text-xs sm:text-sm border border-yellow-200">
                          ⭐ {globalStars} نجمة
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <span className="text-3xl">👋</span>
                      <p className="font-bold text-sm text-[#6B4E9E] mt-2">لم يتم تسجيل أي بطل بعد!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ABOUT VIEW --- */}
      {currentView === 'about' && (
        <div className="min-h-screen bg-[#3D1E6D] py-12 px-4 select-none" dir="rtl">
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-3xl border-3 border-purple-200 shadow-md">
              <button 
                onClick={() => {
                  setCurrentView("main");
                  playBubbleSound();
                }}
                className="btn-bubbly-secondary text-sm py-2 px-5 text-[#4D2B82] bg-white rounded-full flex items-center gap-1 cursor-pointer border-2 border-[#4D2B82] shadow-[0_4px_0_0_#4D2B82] active:translate-y-1 active:shadow-[0_0_0_0_#4D2B82] transition-all"
              >
                <span>🔙 رجوع للقائمة</span>
              </button>
              <h2 className="text-2xl font-black text-[#4D2B82]">ℹ️ بنعرف عن نفسنا</h2>
            </div>
            
            <div className="bg-white/95 p-8 sm:p-12 rounded-[36px] border-4 border-purple-200 shadow-xl space-y-8 text-right">
              <div className="bg-[#FFECA1] border-2 border-[#D97706] text-[#B45309] font-extrabold text-sm px-4 py-1.5 rounded-full shadow-sm flex items-center justify-center gap-1.5 mx-auto w-fit animate-bounce-slow">
                <span>🐞</span>
                <span>للأطفال الأذكياء من عمر 4 إلى 12 سنة</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#4D2B82] leading-[1.2] tracking-tight">
                مغامرات صغيرة. عقول تزهر بالعلم! 🌱
              </h1>
              <p className="text-lg text-[#6B4E9E] font-medium leading-relaxed max-w-2xl mx-auto">
                بلومي يحوّل تعلّم القراءة والحساب والقرآن الكريم إلى مغامرات حديقة ممتعة يعشقها الأطفال - صُمم بواسطة معلمين وخبراء، خالٍ تماماً من الإعلانات، ولطيف على وقت الشاشة.
              </p>
              
              <div className="border-t border-purple-100 pt-6 flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#2ECC71] rounded-full flex items-center justify-center text-[10px]">🌱</div>
                  <span className="font-extrabold text-xl text-[#4D2B82]">بلومي للأطفال</span>
                </div>
                <p className="text-xs text-[#8A6FB8] font-bold">
                  جميع الحقوق محفوظة © {new Date().getFullYear()} بلومي للألعاب التعليمية السحرية.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
`;

// Insert views rendering before the very final </div>
const finalDivIdx = content.lastIndexOf('</div>');
if (finalDivIdx !== -1) {
  content = content.substring(0, finalDivIdx) + parentsView + '\n    ' + content.substring(finalDivIdx);
  console.log("Parents and About view rendering blocks appended!");
}

// 7. Call orientation lock when intro screen onFinish runs
const introTarget = `          <IntroScreen onFinish={() => {
            setShowIntro(false);
            if (!childProfile) {
              setShowLogin(true);
            }
          }} />`;

const introReplacement = `          <IntroScreen onFinish={() => {
            setShowIntro(false);
            try {
              if (window.Capacitor) {
                ScreenOrientation.lock({ orientation: 'landscape' }).catch(e => console.log(e));
                StatusBar.hide().catch(e => console.log(e));
              }
            } catch(e) {}
            if (!childProfile) {
              setShowLogin(true);
            }
          }} />`;

if (content.includes(introTarget)) {
  content = content.replace(introTarget, introReplacement);
  console.log("Intro Screen onFinish callback updated with landscape lock!");
}

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log("App.tsx rewritten successfully!");
