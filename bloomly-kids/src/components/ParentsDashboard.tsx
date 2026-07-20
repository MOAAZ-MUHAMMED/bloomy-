import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ParentsDashboardProps {
  childProfile: any;
  setChildProfile: (profile: any) => void;
  globalStars: number;
  onClose: () => void;
  onSaveProfileToBackend: (profile: any) => void;
}

export default function ParentsDashboard({ childProfile, setChildProfile, globalStars, onClose, onSaveProfileToBackend }: ParentsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'settings'>('overview');
  
  const updateSettings = (updates: any) => {
    if (!childProfile) return;
    const newProfile = { ...childProfile, ...updates };
    setChildProfile(newProfile);
    localStorage.setItem("childProfile", JSON.stringify(newProfile));
    onSaveProfileToBackend(newProfile);
  };

  const handlePrintCertificate = () => {
    // Open a new window and print a beautiful certificate
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>شهادة تقدير - بلومي</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; background: #f0fdf4; margin: 0; padding: 20px; }
            .cert-container { border: 15px solid #22c55e; padding: 40px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); max-width: 800px; margin: 40px auto; position: relative; }
            h1 { color: #166534; font-size: 50px; margin-bottom: 10px; }
            h2 { color: #4D2B82; font-size: 30px; margin: 20px 0; }
            .name { font-size: 45px; color: #e01e5a; border-bottom: 3px dashed #e01e5a; display: inline-block; padding: 0 40px; margin: 20px 0; }
            .stars { font-size: 30px; color: #d97706; margin: 20px 0; }
            .seal { position: absolute; bottom: 40px; right: 40px; width: 100px; height: 100px; background: #eab308; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px; border: 5px solid #ca8a04; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
          </style>
        </head>
        <body dir="rtl">
          <div class="cert-container">
            <h1>شهادة تفوق وإبداع 🌟</h1>
            <h2>مقدمة من أصدقاء بلومي في الحديقة السحرية إلى البطل:</h2>
            <div class="name">${childProfile?.name || 'البطل'}</div>
            <h2>لجهوده الرائعة وإتمامه للألعاب بذكاء وعبقرية!</h2>
            <div class="stars">جمع ${globalStars} نجمة ⭐</div>
            <p>مع تمنياتنا بمزيد من التألق والنجاح في رحلة التعلم.</p>
            <div class="seal">رائع!</div>
          </div>
          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const getCategoryName = (cat: string) => {
    const map: any = { arabic: 'عربي', math: 'حساب', english: 'إنجليزي', coloring: 'رسم', kitchen: 'مطبخ', iq: 'ذكاء', fun: 'ترفيه', general: 'عام' };
    return map[cat] || cat;
  };

  const getCategoryColor = (cat: string) => {
    const map: any = { arabic: '#3b82f6', math: '#ef4444', english: '#8b5cf6', coloring: '#ec4899', kitchen: '#f59e0b', iq: '#10b981', fun: '#14b8a6', general: '#64748b' };
    return map[cat] || '#64748b';
  };

  const chartData = useMemo(() => {
    if (!childProfile?.categoryProgress) return [];
    return Object.entries(childProfile.categoryProgress)
      .filter(([_, stars]: any) => stars > 0)
      .map(([cat, stars]: any) => ({
        name: getCategoryName(cat),
        stars: stars,
        color: getCategoryColor(cat)
      }))
      .sort((a, b) => b.stars - a.stars);
  }, [childProfile]);

  const smartInsight = useMemo(() => {
    if (chartData.length === 0) return "دع طفلك يبدأ رحلته في الحديقة السحرية لنتمكن من تحليل مهاراته وميوله بدقة!";
    
    const strongest = chartData[0];
    const weakest = chartData[chartData.length - 1];
    
    if (chartData.length === 1) {
      return `مرحلة رائعة للبدء! طفلك يركز حالياً على (${strongest.name})، شجعه على اكتشاف باقي الأقسام مثل الحساب واللغات لتطوير مهاراته المتكاملة.`;
    }

    if (strongest.stars === weakest.stars) {
      return "ما شاء الله! طفلك متوازن جداً ويوزع مجهوده على جميع المواد بالتساوي. استمر في تشجيعه!";
    }

    return `بناءً على تحليل ذكائيات طفلك، نلاحظ أنه عبقري ومبدع جداً في (${strongest.name}) 🌟، ولكنه قد يحتاج لبعض التشجيع والمشاركة منك في ألعاب (${weakest.name}) ليصبح متفوقاً في كل المجالات.`;
  }, [chartData]);

  return (
    <div className="min-h-screen bg-[#3D1E6D] py-12 px-4 select-none" dir="rtl">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-3xl border-3 border-purple-200 shadow-md">
          <button 
            onClick={onClose}
            className="btn-bubbly-secondary text-sm py-2 px-5 text-[#4D2B82] bg-white rounded-full flex items-center gap-1 cursor-pointer border-2 border-[#4D2B82] shadow-[0_4px_0_0_#4D2B82] active:translate-y-1 active:shadow-[0_0_0_0_#4D2B82] transition-all"
          >
            <span>🔙 رجوع للقائمة</span>
          </button>
          <h2 className="text-2xl font-black text-[#4D2B82]">👨‍👩‍👧‍👦 لوحة أولياء الأمور</h2>
        </div>
        
        {!childProfile ? (
          <div className="card-bubbly bg-[#FFFCE6] p-12 text-center border-[#D97706] rounded-[36px]">
            <span className="text-5xl">👋</span>
            <p className="font-bold text-xl text-[#6B4E9E] mt-4">لم يتم تسجيل أي بطل بعد! أضف طفلاً من الشاشة الرئيسية لرؤية التقارير هنا.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 flex flex-col gap-3">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`p-4 rounded-2xl border-3 font-black text-right transition-all ${activeTab === 'overview' ? 'bg-[#FFECA1] border-[#D97706] text-[#B45309]' : 'bg-white border-purple-100 text-purple-400 hover:bg-purple-50'}`}
              >
                📊 نظرة عامة والشهادة
              </button>
              <button 
                onClick={() => setActiveTab('activity')}
                className={`p-4 rounded-2xl border-3 font-black text-right transition-all ${activeTab === 'activity' ? 'bg-[#E0F2FE] border-[#0284C7] text-[#0369A1]' : 'bg-white border-purple-100 text-purple-400 hover:bg-purple-50'}`}
              >
                📝 سجل النشاط اليومي
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`p-4 rounded-2xl border-3 font-black text-right transition-all ${activeTab === 'settings' ? 'bg-[#FCE7F3] border-[#DB2777] text-[#BE185D]' : 'bg-white border-purple-100 text-purple-400 hover:bg-purple-50'}`}
              >
                ⚙️ إعدادات الوقت والنوم
              </button>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              
              {/* TAB: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-[24px] border-3 border-[#2ECC71] shadow-md flex items-center justify-between">
                      <div>
                        <p className="text-xs font-extrabold text-[#27AE60] mb-1">وقت اللعب الإجمالي</p>
                        <p className="text-3xl font-black text-[#145A32]">{childProfile.playtimeMinutes || 0} <span className="text-sm">دقيقة</span></p>
                      </div>
                      <span className="text-5xl">⏱️</span>
                    </div>
                    <div className="bg-white p-6 rounded-[24px] border-3 border-[#F1C40F] shadow-md flex items-center justify-between">
                      <div>
                        <p className="text-xs font-extrabold text-[#D4AC0D] mb-1">مجموع النجوم المكتسبة</p>
                        <p className="text-3xl font-black text-[#7D6608]">{globalStars} <span className="text-sm">نجمة</span></p>
                      </div>
                      <span className="text-5xl">⭐</span>
                    </div>
                  </div>

                  {/* Certificate Generator */}
                  <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-8 rounded-[24px] border-3 border-pink-300 shadow-md text-center">
                    <h3 className="text-2xl font-black text-pink-800 mb-2">🎓 شهادة التقدير</h3>
                    <p className="text-pink-600 font-bold mb-6">هل أكمل طفلك العديد من الألعاب؟ كافئه وطبّع له شهادة تفوق مميزة لتعليقها في غرفته!</p>
                    <button 
                      onClick={handlePrintCertificate}
                      disabled={globalStars < 10}
                      className={`py-3 px-8 rounded-full font-black text-lg transition-all shadow-lg border-2 ${globalStars >= 10 ? 'bg-pink-500 text-white border-pink-600 hover:bg-pink-600 hover:scale-105 active:scale-95 cursor-pointer' : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed opacity-70'}`}
                    >
                      {globalStars >= 10 ? '🖨️ طباعة الشهادة الآن' : '🔒 يحتاج إلى 10 نجوم لفتح الشهادة'}
                    </button>
                  </div>

                  {/* Smart Advisor & Analytics Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Smart Advisor */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-[24px] border-3 border-indigo-200 shadow-md flex flex-col justify-center relative overflow-hidden">
                      <div className="absolute top-[-20px] left-[-20px] text-8xl opacity-10 pointer-events-none">🧠</div>
                      <h3 className="text-xl font-black text-indigo-900 mb-4 flex items-center gap-2 relative z-10">
                        <span className="text-2xl animate-bounce">🤖</span> المستشار التربوي الذكي
                      </h3>
                      <p className="text-indigo-800 font-bold leading-relaxed relative z-10 bg-white/60 p-4 rounded-xl border border-indigo-100 shadow-sm text-lg">
                        {smartInsight}
                      </p>
                    </div>

                    {/* Analytics Chart */}
                    <div className="bg-white p-6 rounded-[24px] border-3 border-[#0284C7] shadow-md flex flex-col h-[350px]">
                      <h3 className="text-xl font-black text-[#0369A1] mb-4 flex items-center gap-2">
                        <span>📊</span> تحليل النشاط البياني
                      </h3>
                      {chartData.length > 0 ? (
                        <div className="flex-1 w-full h-full min-h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                              <XAxis dataKey="name" tick={{ fill: '#4D2B82', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                              <YAxis hide />
                              <Tooltip 
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                                contentStyle={{ borderRadius: '16px', border: '2px solid #4D2B82', fontWeight: 'bold' }} 
                                formatter={(value: any) => [`${value} نجمة`, 'الرصيد']}
                              />
                              <Bar dataKey="stars" radius={[8, 8, 8, 8]}>
                                {chartData.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-sky-300">
                          <p className="font-bold text-center">لا توجد بيانات كافية لرسم التحليل البياني بعد.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: ACTIVITY LOG */}
              {activeTab === 'activity' && (
                <div className="bg-white p-6 rounded-[24px] border-3 border-[#0284C7] shadow-md min-h-[400px]">
                  <h3 className="text-xl font-black text-[#0369A1] mb-6 flex items-center gap-2"><span>📝</span> السجل اليومي للألعاب</h3>
                  
                  <div className="space-y-4">
                    {childProfile.activityLog && childProfile.activityLog.length > 0 ? (
                      childProfile.activityLog.map((log: any) => (
                        <div key={log.id} className="flex items-center gap-4 p-4 rounded-2xl bg-sky-50 border border-sky-100">
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl shadow-sm border-2 border-sky-200 shrink-0">
                            {log.category === 'math' ? '🔢' : log.category === 'arabic' ? 'أ' : log.category === 'english' ? 'A' : log.category === 'coloring' ? '🎨' : '🎮'}
                          </div>
                          <div className="flex-1 text-right">
                            <p className="font-black text-sky-900 text-sm">{log.title}</p>
                            <p className="text-xs font-bold text-sky-600 mt-0.5">{new Date(log.timestamp).toLocaleTimeString('ar-EG')} - {new Date(log.timestamp).toLocaleDateString('ar-EG')}</p>
                          </div>
                          <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-black text-xs border border-yellow-200 shrink-0">
                            +{log.stars} ⭐
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-sky-300">
                        <span className="text-5xl">😴</span>
                        <p className="font-bold text-lg mt-4">لا توجد أنشطة مسجلة حتى الآن.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: SETTINGS (SCREEN TIME) */}
              {activeTab === 'settings' && (
                <div className="bg-white p-6 rounded-[24px] border-3 border-[#DB2777] shadow-md">
                  <h3 className="text-xl font-black text-[#9D174D] mb-6 flex items-center gap-2"><span>⚙️</span> التحكم في وقت الشاشة والنوم</h3>
                  
                  <div className="space-y-8">
                    {/* Screen Time Limit */}
                    <div className="bg-pink-50 p-6 rounded-2xl border-2 border-pink-100">
                      <div className="flex items-start gap-4 mb-4">
                        <span className="text-4xl">⏳</span>
                        <div>
                          <h4 className="font-black text-pink-900 text-lg">الحد الأقصى للعب يومياً</h4>
                          <p className="text-sm font-bold text-pink-700 mt-1">يمنع الطفل من الإفراط في استخدام التطبيق ويقفل الألعاب تلقائياً عند انتهاء الوقت.</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {[0, 15, 30, 45, 60, 120].map(mins => (
                          <button
                            key={mins}
                            onClick={() => updateSettings({ dailyTimeLimit: mins })}
                            className={`px-4 py-2 rounded-xl font-black text-sm transition-all border-2 ${childProfile.dailyTimeLimit === mins || (!childProfile.dailyTimeLimit && mins === 0) ? 'bg-pink-600 text-white border-pink-700' : 'bg-white text-pink-600 border-pink-200 hover:bg-pink-100'}`}
                          >
                            {mins === 0 ? 'غير محدود' : `${mins} دقيقة`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bedtime Lock */}
                    <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-100">
                      <div className="flex items-start gap-4 mb-4">
                        <span className="text-4xl">🌙</span>
                        <div>
                          <h4 className="font-black text-indigo-900 text-lg">قفل وقت النوم</h4>
                          <p className="text-sm font-bold text-indigo-700 mt-1">يمنع الطفل من فتح الألعاب بعد هذا الوقت ليلاً لضمان نوم صحي (يفتح في 6 صباحاً).</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {[null, "19:00", "20:00", "21:00", "22:00"].map((time, idx) => {
                          const displayTime = time ? new Date(`2000-01-01T${time}`).toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit', hour12: true }) : 'معطل';
                          return (
                            <button
                              key={idx}
                              onClick={() => updateSettings({ bedTime: time })}
                              className={`px-4 py-2 rounded-xl font-black text-sm transition-all border-2 ${childProfile.bedTime === time || (!childProfile.bedTime && !time) ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-100'}`}
                            >
                              {displayTime}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
