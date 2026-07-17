const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Normalize line endings to \n to make replacements robust on Windows
content = content.replace(/\r\n/g, '\n');

// 1. Add currentView state declaration
content = content.replace('const [showIntro, setShowIntro] = useState(true);', 
  `const [showIntro, setShowIntro] = useState(true);
  const [currentView, setCurrentView] = useState<'main' | 'parents' | 'about'>('main');`);
console.log("1. currentView state added.");

// 2. Remove entry button to Large Garden under InteractiveGarden
const buttonRegex = /\{\/\*\s*Entry button to Large Garden\s*\*\/\}[\s\S]*?<\/button>/;
if (buttonRegex.test(content)) {
  content = content.replace(buttonRegex, '');
  console.log("2. Large Garden entry button removed.");
} else {
  console.log("2. Button not found!");
}

// 3. Find indexes to wrap main homepage content in currentView === 'main'
const bgTag = '<MagicalForestBackground />';
const bgIdx = content.indexOf(bgTag);

const gameZoneTag = '<GameZone';
const gzIdx = content.indexOf(gameZoneTag);
const gzCloseIdx = content.indexOf('/>', gzIdx);

if (bgIdx !== -1 && gzIdx !== -1 && gzCloseIdx !== -1) {
  const before = content.substring(0, bgIdx + bgTag.length);
  const mainContent = content.substring(bgIdx + bgTag.length, gzCloseIdx + 2);
  const after = content.substring(gzCloseIdx + 2);
  
  content = before + '\n      {currentView === \'main\' && (\n        <>\n' + mainContent + '\n        </>\n      )}' + after;
  console.log("3. Main homepage wrapper added.");
} else {
  console.log("3. Indices not found!");
}

// 4. Update GameZone properties to pass callbacks
const newGzIdx = content.indexOf('<GameZone');
const newGzCloseIdx = content.indexOf('/>', newGzIdx);

if (newGzIdx !== -1 && newGzCloseIdx !== -1) {
  const gzBody = `<GameZone 
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
  
  content = content.substring(0, newGzIdx) + gzBody + content.substring(newGzCloseIdx + 2);
  console.log("4. GameZone props updated with callbacks.");
}

// 5. Delete original what-we-teach and parents sections completely to prevent duplicates and compiler errors
content = content.replace(/<section id="what-we-teach"[\s\S]*?<\/section>/, '');
content = content.replace(/<section id="parents"[\s\S]*?<\/section>/, '');
console.log("5. Original duplicate sections deleted completely.");

// 6. Append parents view and about view before the final closing div
const finalDivIdx = content.lastIndexOf('</div>');
if (finalDivIdx !== -1) {
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
                          {childProfile?.name} ({childProfile?.gender === "boy" ? "ولد" : "بنت"})
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-purple-50 pb-2">
                        <span className="text-[11px] font-bold text-purple-400">رقم الهاتف</span>
                        <span className="font-extrabold text-xs sm:text-sm text-[#4D2B82]">{childProfile?.phone}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-purple-50 pb-2">
                        <span className="text-[11px] font-bold text-purple-400">العمر والمستوى</span>
                        <span className="font-extrabold text-xs sm:text-sm text-[#4D2B82]">
                          {childProfile?.age} سنوات - {childProfile?.level === "level1" ? "المستوى الأول" : "المستوى الفائق"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-purple-50 pb-2">
                        <span className="text-[11px] font-bold text-purple-400">وقت اللعب الإجمالي</span>
                        <span className="font-extrabold text-xs sm:text-sm text-[#4D2B82]">
                          {childProfile?.playtimeMinutes || 0} دقيقة
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
  content = content.substring(0, finalDivIdx) + parentsView + '\n    ' + content.substring(finalDivIdx);
  console.log("6. Parents and About view rendering blocks appended.");
}

// 7. Update IntroScreen onFinish callback
const introTarget = `<IntroScreen onFinish={() => {
            setShowIntro(false);
            if (!childProfile) {
              setShowLogin(true);
            }
          }} />`;

const introReplacement = `<IntroScreen onFinish={() => {
            setShowIntro(false);
            try {
              if ((window as any).Capacitor) {
                (window as any).ScreenOrientation.lock({ orientation: 'landscape' }).catch(() => {});
                (window as any).StatusBar.hide().catch(() => {});
              }
            } catch(e) {}
            if (!childProfile) {
              setShowLogin(true);
            }
          }} />`;

if (content.includes(introTarget)) {
  content = content.replace(introTarget, introReplacement);
  console.log("7. Intro Screen onFinish callback updated.");
} else {
  content = content.replace(/<IntroScreen onFinish[\s\S]*?\}\s*\}\s*\/>/, introReplacement);
  console.log("7. Intro Screen onFinish callback updated via fuzzy regex.");
}

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log("App.tsx rewritten successfully!");
