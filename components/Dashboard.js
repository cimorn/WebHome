import React from 'react';

export default function Dashboard({ currentTime, quote }) {
  return (
    <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* 1. 左侧：时间卡片 */}
        <div className="bg-white rounded-2xl p-6 flex flex-col justify-center items-center shadow-sm border border-slate-100 text-center h-full">
            {currentTime ? (
                <div className="flex flex-col items-center gap-2">
                    {/* 时间 */}
                    <div className="text-5xl font-bold text-slate-700 tabular-nums tracking-tight font-mono-clock">
                        {currentTime.toLocaleTimeString([], { hour12: false })}
                    </div>
                    
                    {/* 日期 (蓝色高亮) */}
                    <div className="text-lg font-bold text-blue-600 tracking-widest border-b-2 border-blue-50 pb-1 mb-1">
                        {currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                    </div>

                    {/* 星期 + 天气 */}
                    <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                         <span>{currentTime.toLocaleDateString('zh-CN', { weekday: 'long' })}</span>
                         <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                         <span>武汉 🌤️ 24°C</span>
                    </div>
                </div>
            ) : <div className="text-slate-300 text-sm">Loading...</div>}
        </div>

        {/* 2. 中间：身份卡片 (更新了图标和链接) */}
        <div className="bg-white rounded-2xl p-6 flex flex-col justify-center items-center shadow-sm border border-slate-100 h-full">
            {/* 头像 */}
            <div className="w-24 h-24 rounded-full p-1 border-2 border-slate-50 shadow-inner mb-3 overflow-hidden">
                 <img 
                    src="/avatar.png" 
                    alt="CiMorn" 
                    className="w-full h-full object-cover rounded-full hover:scale-110 transition-transform duration-500" 
                    onError={(e) => { e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=CiMorn"; }}
                 />
            </div>
            
            {/* 名字 */}
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-4">CiMorn</h2>

            {/* ✨ 社交链接栏 (新图标 + 你的链接) */}
            <div className="flex items-center gap-6">
                {/* GitHub: cimorn */}
                <a href="https://github.com/cimorn" target="_blank" className="text-slate-400 hover:text-black transition-all transform hover:-translate-y-1 hover:scale-110" title="GitHub">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>

                {/* Email: cimorns@gmail.com (新图标) */}
                <a href="mailto:cimorns@gmail.com" className="text-slate-400 hover:text-red-500 transition-all transform hover:-translate-y-1 hover:scale-110" title="Email">
                    {/* 简约信封图标 */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </a>

                {/* Discord */}
                <a href="https://discord.com" target="_blank" className="text-slate-400 hover:text-indigo-500 transition-all transform hover:-translate-y-1 hover:scale-110" title="Discord">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 13.46 13.46 0 0 0-.64 1.312 18.395 18.395 0 0 0-5.427 0 12.599 12.599 0 0 0-.642-1.315.077.077 0 0 0-.08-.035 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-2.313-9.153-4.677-12.179.001 0-.013-.01-.027-.022z"/></svg>
                </a>
            </div>
        </div>

        {/* 3. 右侧：语录卡片 */}
        <div className="bg-white rounded-2xl p-8 flex flex-col justify-center shadow-sm border border-slate-100 relative overflow-hidden h-full text-center">
            <div className="absolute top-4 right-4 text-6xl font-serif text-slate-100 select-none">❞</div>
            <div className="relative z-10 flex flex-col justify-between h-full py-1">
                <div>
                    <p className="text-slate-600 text-base font-medium leading-relaxed font-serif not-italic">
                        “{quote.text}”
                    </p>
                    <div className="mt-3 text-slate-400 text-xs font-bold tracking-wider uppercase text-right">
                        — {quote.from}
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50">
                    <span className="font-art text-3xl text-blue-500 transform -rotate-2 inline-block">Have a nice day ~</span>
                </div>
            </div>
        </div>
    </div>
  );
}