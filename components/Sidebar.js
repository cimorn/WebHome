import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ✨ 可拖拽的单项组件
function SortableCategoryItem({ cat, activeCategory, setActiveCategory, isSidebarOpen }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative',
    touchAction: 'none', 
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex justify-center w-full mb-3">
       <button
          onClick={() => setActiveCategory(cat)}
          title={cat}
          className={`
              flex items-center justify-center rounded-xl transition-all duration-300 ease-in-out font-bold tracking-wide cursor-grab active:cursor-grabbing overflow-hidden
              ${isSidebarOpen ? 'w-full py-3.5 text-sm' : 'w-12 h-12 p-0.5 text-[10px]'} 
              ${activeCategory === cat 
                  ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}
              ${isDragging ? 'opacity-50 shadow-xl scale-105 ring-2 ring-blue-400' : ''}
          `}
      >
          {/* 只显示文字，不显示任何图标 */}
          <span className="whitespace-nowrap overflow-hidden w-full text-center block px-1">
              {cat}
          </span>
      </button>
    </div>
  );
}

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  categories,       
  setCategories,    
  onSortEnd,
  activeCategory,
  setActiveCategory,
  isAdmin,
  isGlobalEditMode,
  setIsGlobalEditMode,
  openAddModal,
  fileInputRef,
  handleFileUpload,
  handleLogout
}) {
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = categories.indexOf(active.id);
      const newIndex = categories.indexOf(over.id);
      const newOrder = arrayMove(categories, oldIndex, newIndex);
      
      setCategories(newOrder);
      if(onSortEnd) onSortEnd(newOrder);
    }
  };

  const sortableCategories = categories.filter(c => c !== 'Home');

  return (
    <aside className={`relative z-20 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-[80px]'}`}>
      
      {/* 顶部收缩按钮 */}
      <div className="h-20 flex items-center justify-center border-b border-slate-100">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors flex items-center justify-center">
              {isSidebarOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
              ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
              )}
          </button>
      </div>
      
      {/* 分类列表区域 */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 scrollbar-hide">
          
          {/* Home 按钮 (固定) */}
          <div className="flex justify-center w-full mb-3">
              <button
                  onClick={() => setActiveCategory('Home')}
                  title="Home"
                  className={`
                      flex items-center justify-center rounded-xl transition-all duration-300 ease-in-out font-bold tracking-wide overflow-hidden
                      ${isSidebarOpen ? 'w-full py-3.5 text-sm' : 'w-12 h-12 p-0.5 text-[10px]'} 
                      ${activeCategory === 'Home' 
                          ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100' 
                          : 'bg-blue-50/50 text-blue-400 hover:bg-blue-50'}
                  `}
              >
                  {/* ✨ 修正：只有文字 Home，没有任何图标 */}
                  <span className="whitespace-nowrap overflow-hidden w-full text-center block px-1">Home</span>
              </button>
          </div>

          <div className="h-[1px] bg-slate-100 w-full mb-3"></div>

          {/* 拖拽列表 */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sortableCategories} strategy={verticalListSortingStrategy}>
              {sortableCategories.map(cat => (
                <SortableCategoryItem 
                  key={cat} 
                  cat={cat} 
                  activeCategory={activeCategory} 
                  setActiveCategory={setActiveCategory} 
                  isSidebarOpen={isSidebarOpen} 
                />
              ))}
            </SortableContext>
          </DndContext>

      </nav>

      {/* 底部工具栏 */}
      <div className="p-4 border-t border-slate-100 bg-white flex flex-col gap-3 items-center">
           {isAdmin && (
               <>
                   <button onClick={() => setIsGlobalEditMode(!isGlobalEditMode)} className={`w-full p-2 rounded-xl transition-all flex items-center justify-center gap-2 border ${isGlobalEditMode ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-white text-slate-500 hover:bg-slate-50 border-slate-200'}`} title="编辑模式">
                      <span className="text-lg">✎</span>
                      {isSidebarOpen && <span className="text-xs font-medium whitespace-nowrap">{isGlobalEditMode ? '退出' : '编辑'}</span>}
                   </button>
                   <button onClick={openAddModal} className="w-full p-2 bg-white hover:bg-green-50 text-slate-400 hover:text-green-600 rounded-xl transition-colors border border-slate-200 flex items-center justify-center gap-2" title="添加"><span>＋</span>{isSidebarOpen && <span className="text-xs whitespace-nowrap">添加</span>}</button>
                   <button onClick={() => fileInputRef.current.click()} className="w-full p-2 bg-white hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-colors border border-slate-200 flex items-center justify-center gap-2" title="导入"><span>📂</span>{isSidebarOpen && <span className="text-xs whitespace-nowrap">导入</span>}</button>
                   <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
                   <button onClick={handleLogout} className="w-full p-2 rounded-xl bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors border border-slate-200 flex items-center justify-center gap-2" title="锁定"><span>🔒</span>{isSidebarOpen && <span className="text-xs whitespace-nowrap">锁定</span>}</button>
               </>
           )}
      </div>
    </aside>
  );
}