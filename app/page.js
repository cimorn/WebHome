'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

// 引入组件
import Sidebar from '@/components/Sidebar';
import SearchBar from '@/components/SearchBar';
import Dashboard from '@/components/Dashboard';
import LinkGrid from '@/components/LinkGrid';
import LinkModal from '@/components/LinkModal';

export default function Home() {
  const [links, setLinks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [categories, setCategories] = useState(['Home']);
  
  const [activeCategory, setActiveCategory] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(null);
  const [quote, setQuote] = useState({ text: "加载中...", from: "..." });
  const [searchEngine, setSearchEngine] = useState('google');
  const [isGlobalEditMode, setIsGlobalEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [currentLink, setCurrentLink] = useState({ title: '', url: '', category: '默认', isSecret: false, isPinned: false, icon: '', desc: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchData(); // ✨ 改名为 fetchData，因为要同时获取链接和顺序
    fetchQuote();
    return () => clearInterval(timer);
  }, []);

  // ✨ 核心逻辑：同时获取链接 + 分类顺序，并合并
  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      // 1. 并行请求：获取链接 + 获取保存的顺序
      const [linksRes, orderRes] = await Promise.all([
          axios.get('/api/links', { headers: { 'x-auth-token': token } }),
          axios.get('/api/categories')
      ]);

      setLinks(linksRes.data.data);
      setIsAdmin(linksRes.data.isAdmin);
      if (!linksRes.data.isAdmin) setIsGlobalEditMode(false);

      // 2. 计算所有存在的分类
      const allCategories = [...new Set(linksRes.data.data.map(l => l.category))];
      
      // 3. 获取保存的顺序
      const savedOrder = orderRes.data.order || [];

      // 4. 智能排序：
      //    A. 先放保存了顺序的
      //    B. 再放新出现的（不在保存列表里的）
      //    C. 过滤掉已经不存在的空分类
      //    D. 确保 Home 永远在第一个
      const sortedCats = [
          'Home',
          ...savedOrder.filter(c => allCategories.includes(c) && c !== 'Home'),
          ...allCategories.filter(c => !savedOrder.includes(c) && c !== 'Home')
      ];

      setCategories(sortedCats);

    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  // ✨ 新增：保存顺序到数据库
  const handleSortEnd = async (newOrder) => {
      const token = localStorage.getItem('token');
      if (!token) return; // 只有管理员能保存顺序
      try {
          // 乐观更新 UI
          setCategories(newOrder);
          // 发送请求
          await axios.post('/api/categories', { order: newOrder }, { headers: { 'x-auth-token': token } });
      } catch (e) {
          console.error("保存顺序失败", e);
      }
  };

  const fetchQuote = async () => {
    try {
        const res = await axios.get('https://v1.hitokoto.cn/?c=i');
        setQuote({ text: res.data.hitokoto, from: res.data.from });
    } catch (e) {
        setQuote({ text: "热爱可抵岁月漫长。", from: "网络" });
    }
  };

  const handleSearchKeyDown = async (e) => {
    if (e.key === 'Enter') {
      if (!searchQuery.trim()) return;
      try {
        const res = await axios.post('/api/auth', { action: 'login', username: 'admin', password: searchQuery });
        localStorage.setItem('token', res.data.token);
        setSearchQuery('');
        fetchData(); // 重新加载数据
        alert("🔓 管理员已解锁");
        return;
      } catch (err) {}

      let url = '';
      switch (searchEngine) {
          case 'baidu': url = `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery)}`; break;
          case 'bing': url = `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`; break;
          case 'google': default: url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`; break;
      }
      window.open(url, '_blank');
    }
  };

  const handleLogout = () => {
      localStorage.removeItem('token');
      setIsAdmin(false);
      setIsGlobalEditMode(false);
      fetchData();
      setActiveCategory('Home');
  };

  const handleCardClick = (e, link) => {
      if (isGlobalEditMode) {
          e.preventDefault();
          setIsEditingLink(true);
          setCurrentLink({ ...link });
          setShowModal(true);
      }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
        if (isEditingLink) {
            await axios.put('/api/links', currentLink, { headers: { 'x-auth-token': token } });
            alert("修改成功");
        } else {
            await axios.post('/api/links', currentLink, { headers: { 'x-auth-token': token } });
            alert("添加成功");
        }
        setShowModal(false);
        fetchData(); // 刷新
    } catch(e) { alert("操作失败"); }
  };

  const handleDelete = async (e, id) => {
      e.stopPropagation();
      e.preventDefault();
      if(!confirm("确定要删除这个链接吗？")) return;
      const token = localStorage.getItem('token');
      try {
          await axios.delete(`/api/links?id=${id}`, { headers: { 'x-auth-token': token } });
          fetchData(); // 刷新
      } catch(e) { alert("删除失败"); }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      const formattedData = data.map(item => ({
        ...item,
        isSecret: String(item.isSecret).toUpperCase() === 'TRUE',
        isPinned: String(item.isPinned).toUpperCase() === 'TRUE',
        icon: item.icon || '🔗',
        category: item.category || '默认'
      }));
      const token = localStorage.getItem('token');
      axios.post('/api/links', formattedData, { headers: { 'x-auth-token': token } })
        .then(() => { alert(`导入 ${formattedData.length} 条数据成功`); fetchData(); })
        .catch(() => alert("导入失败"));
    };
    reader.readAsBinaryString(file);
  };

  const displayLinks = activeCategory === 'Home' 
    ? links.filter(l => l.isPinned && (!l.isSecret || isAdmin)) 
    : links.filter(l => l.category === activeCategory);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Outfit:wght@400;500;700&family=JetBrains+Mono:wght@500&family=Caveat:wght@700&display=swap');
        body { font-family: 'Outfit', 'Noto Sans SC', sans-serif; }
        .font-mono-clock { font-family: 'JetBrains Mono', monospace; }
        .font-art { font-family: 'Caveat', cursive; }
      `}</style>

      <div className="flex h-screen text-slate-700 overflow-hidden bg-[#f8fafc] selection:bg-blue-100 selection:text-blue-600">
        
        {/* ✨ 传递 onSortEnd 给侧边栏 */}
        <Sidebar 
            isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}
            categories={categories} 
            setCategories={setCategories} 
            onSortEnd={handleSortEnd} // ✨ 关键：传递保存函数
            activeCategory={activeCategory} setActiveCategory={setActiveCategory}
            isAdmin={isAdmin} isGlobalEditMode={isGlobalEditMode} setIsGlobalEditMode={setIsGlobalEditMode}
            openAddModal={() => { setIsEditingLink(false); setCurrentLink({ title: '', url: '', category: activeCategory === 'Home' ? '默认' : activeCategory, isSecret: false, isPinned: false, icon: '', desc: '' }); setShowModal(true); }}
            fileInputRef={fileInputRef} handleFileUpload={handleFileUpload} handleLogout={handleLogout}
        />

        <main className="relative z-10 flex-1 flex flex-col min-w-0 h-full bg-[#f8fafc]">
          <div className="flex-1 overflow-y-auto scroll-smooth flex flex-col pt-12 px-8 lg:px-12">
              
              <SearchBar 
                  searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
                  handleSearchKeyDown={handleSearchKeyDown} 
                  searchEngine={searchEngine} setSearchEngine={setSearchEngine} 
                  isAdmin={isAdmin} 
              />

              {activeCategory === 'Home' && (
                  <Dashboard currentTime={currentTime} quote={quote} />
              )}

              <LinkGrid 
                  activeCategory={activeCategory} loading={loading} displayLinks={displayLinks}
                  isGlobalEditMode={isGlobalEditMode} handleCardClick={handleCardClick} handleDelete={handleDelete}
              />

              <footer className="w-full py-10 text-center mt-auto border-t border-slate-200/50">
                   <p className="text-xs text-slate-400">Copyright © 2025 CiMorn</p>
              </footer>
          </div>
        </main>

        <LinkModal 
            showModal={showModal} setShowModal={setShowModal} 
            isEditingLink={isEditingLink} currentLink={currentLink} setCurrentLink={setCurrentLink} 
            handleSave={handleSave} 
        />
      </div>
    </>
  );
}