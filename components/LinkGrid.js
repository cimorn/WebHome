import React from 'react';

export default function LinkGrid({ activeCategory, loading, displayLinks, isGlobalEditMode, handleCardClick, handleDelete }) {
  
  const renderIcon = (iconStr) => {
      if (!iconStr) return '🔗';
      if (iconStr.startsWith('http')) {
          return <img src={iconStr} alt="icon" className="w-full h-full object-cover rounded-full" />;
      }
      return <span className="text-2xl">{iconStr}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto w-full pb-20">
        {/* 标题栏 */}
        <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                {/* ✨ 修复：Home 纯文字，其他分类显示灰色方块图标 */}
                {activeCategory === 'Home' ? (
                    <span className="text-blue-600 font-extrabold text-2xl tracking-tight">Home</span>
                ) : (
                    <>
                        <span className="text-slate-400 bg-slate-100 w-9 h-9 flex items-center justify-center rounded-xl">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                        </span>
                        <span>{activeCategory}</span>
                    </>
                )}
            </h2>
            <div className="h-[1px] flex-1 bg-slate-200/60"></div>
        </div>

        {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
                {[1,2,3,4,5].map(i => <div key={i} className="h-28 bg-white rounded-xl shadow-sm animate-pulse"></div>)}
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {displayLinks.map(link => (
                    <a 
                        key={link._id} 
                        href={isGlobalEditMode ? '#' : link.url}
                        target={isGlobalEditMode ? '_self' : '_blank'}
                        onClick={(e) => handleCardClick(e, link)}
                        rel="noopener noreferrer"
                        className={`group relative flex flex-col p-5 rounded-xl bg-white border border-slate-100 shadow-sm transition-all duration-200
                            ${isGlobalEditMode 
                                ? 'cursor-pointer ring-2 ring-orange-300 bg-orange-50/20 scale-[0.98]' 
                                : 'hover:shadow-md hover:-translate-y-1 hover:border-blue-200'
                            }
                            ${link.isSecret ? 'bg-amber-50/30 border-amber-100' : ''}
                        `}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                {renderIcon(link.icon)}
                            </div>
                            <h3 className="text-sm font-bold text-slate-700 truncate flex-1 group-hover:text-blue-600 transition-colors">{link.title}</h3>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed h-8">{link.desc || '暂无描述'}</p>
                        {link.isSecret && <span className="absolute top-3 right-3 w-2 h-2 bg-amber-400 rounded-full"></span>}
                        {isGlobalEditMode && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-[1px] rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button className="bg-blue-50 text-blue-600 w-8 h-8 rounded-full hover:bg-blue-100 transition flex items-center justify-center">✎</button>
                                <button onClick={(e) => handleDelete(e, link._id)} className="bg-red-50 text-red-600 w-8 h-8 rounded-full hover:bg-red-100 transition flex items-center justify-center">✕</button>
                            </div>
                        )}
                    </a>
                ))}
            </div>
        )}
    </div>
  );
}