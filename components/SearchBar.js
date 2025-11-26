import React, { useState, useEffect, useRef } from 'react';

export default function SearchBar({ searchQuery, setSearchQuery, handleSearchKeyDown, searchEngine, setSearchEngine, isAdmin }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 搜索引擎配置
  const engines = {
    google: {
      name: 'Google',
      icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
    },
    baidu: {
      name: 'Baidu',
      // ✨ 修正：使用百度熊掌SVG
      icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.34 13.36c-1.09-1.09-1.09-2.86 0-3.95 1.09-1.09 2.86-1.09 3.95 0 1.09 1.09 1.09 2.86 0 3.95-1.09 1.09-2.86 1.09-3.95 0zm-4.24 4.24c-1.09-1.09-1.09-2.86 0-3.95 1.09-1.09 2.86-1.09 3.95 0 1.09 1.09 1.09 2.86 0 3.95-1.09 1.09-2.86 1.09-3.95 0zm8.49 0c-1.09-1.09-1.09-2.86 0-3.95 1.09-1.09 2.86-1.09 3.95 0 1.09 1.09 1.09 2.86 0 3.95-1.09 1.09-2.86 1.09-3.95 0zm-4.25 4.25c-1.09-1.09-1.09-2.86 0-3.95 1.09-1.09 2.86-1.09 3.95 0 1.09 1.09 1.09 2.86 0 3.95-1.09 1.09-2.86 1.09-3.95 0zm10.6-6.36c-1.66-1.66-4.34-1.66-6 0-1.66 1.66-1.66 4.34 0 6 1.66 1.66 4.34 1.66 6 0 1.66-1.66 1.66-4.34 0-6zm-18 0c-1.66-1.66-4.34-1.66-6 0-1.66 1.66-1.66 4.34 0 6 1.66 1.66 4.34 1.66 6 0 1.66-1.66 1.66-4.34 0-6z"/></svg>
    },
    bing: {
      name: 'Bing',
      icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M5.36 1.626v20.748l14.476-8.362L8.925 9.52V4.392l-3.565-2.766zM8.925 12.03l7.157 2.86-7.157 4.137V12.03z"/></svg>
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-10 relative z-30">
        <div className="relative flex items-center bg-white rounded-2xl shadow-sm border border-slate-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
            
            {/* 下拉菜单 */}
            <div className="relative pl-2" ref={dropdownRef}>
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-blue-600 transition-colors"
                    title="切换搜索引擎"
                >
                    <span className="text-blue-600">
                        {engines[searchEngine].icon}
                    </span>
                    <svg className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>

                {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-36 bg-white border border-slate-100 rounded-xl shadow-xl p-1.5 z-50 animate-fade-in">
                        {Object.keys(engines).map((key) => (
                            <button
                                key={key}
                                onClick={() => {
                                    setSearchEngine(key);
                                    setIsDropdownOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                    ${searchEngine === key 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {engines[key].icon}
                                {engines[key].name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 分割线 */}
            <div className="h-6 border-r border-slate-200 mx-1"></div>

            {/* 输入框 */}
            <input 
                type="text" 
                placeholder={`Search ${engines[searchEngine].name}...`} 
                className="w-full py-4 px-3 text-lg bg-transparent outline-none text-slate-700 placeholder:text-slate-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                autoFocus
            />

            <div className="pr-4 text-slate-300">
                {searchQuery ? (
                    <button onClick={() => setSearchQuery('')} className="hover:text-slate-500 transition-colors">
                       ✕
                    </button>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                )}
            </div>
        </div>
    </div>
  );
}