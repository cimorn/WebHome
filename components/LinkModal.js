import React from 'react';

export default function LinkModal({ showModal, setShowModal, isEditingLink, currentLink, setCurrentLink, handleSave }) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm animate-fade-in">
        <div className="bg-white p-8 rounded-2xl w-[400px] shadow-xl relative border border-white/50">
            <h3 className="text-lg font-bold mb-6 text-slate-800">{isEditingLink ? '编辑链接' : '添加新链接'}</h3>
            <div className="space-y-4">
                <input className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-blue-500 focus:bg-white outline-none text-sm transition-all" placeholder="标题" value={currentLink.title || ''} onChange={e => setCurrentLink({...currentLink, title: e.target.value})} />
                <input className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-blue-500 focus:bg-white outline-none text-sm transition-all" placeholder="链接 (URL)" value={currentLink.url || ''} onChange={e => setCurrentLink({...currentLink, url: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                    <input className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-blue-500 outline-none text-sm" placeholder="分类" value={currentLink.category || ''} onChange={e => setCurrentLink({...currentLink, category: e.target.value})} />
                    <input className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-blue-500 outline-none text-sm" placeholder="图标 (Emoji/URL)" value={currentLink.icon || ''} onChange={e => setCurrentLink({...currentLink, icon: e.target.value})} />
                </div>
                <input className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-blue-500 outline-none text-sm" placeholder="备注描述" value={currentLink.desc || ''} onChange={e => setCurrentLink({...currentLink, desc: e.target.value})} />
                
                <div className="flex gap-4">
                    {/* ✨ 修复点：加上 || false，防止 undefined 报错 */}
                    <label className="flex-1 flex items-center gap-3 p-3 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 border border-blue-100">
                        <input type="checkbox" className="rounded border-blue-300 text-blue-600 focus:ring-blue-500" checked={currentLink.isPinned || false} onChange={e => setCurrentLink({...currentLink, isPinned: e.target.checked})} />
                        <span className="text-sm text-blue-700 font-bold">📌 设为置顶</span>
                    </label>

                    <label className="flex-1 flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 border border-slate-100">
                        <input type="checkbox" className="rounded border-slate-300 text-slate-600 focus:ring-slate-500" checked={currentLink.isSecret || false} onChange={e => setCurrentLink({...currentLink, isSecret: e.target.checked})} />
                        <span className="text-sm text-slate-600 font-medium">🔒 设为私密</span>
                    </label>
                </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setShowModal(false)} className="px-5 py-2 text-slate-400 hover:text-slate-600 transition text-sm">取消</button>
                <button onClick={handleSave} className="px-5 py-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-100 transition-all hover:bg-blue-700 text-sm">保存</button>
            </div>
        </div>
    </div>
  );
}