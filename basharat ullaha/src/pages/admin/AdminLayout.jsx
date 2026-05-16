import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Image as ImageIcon, UserCircle, Award, 
  FileText, Link as LinkIcon, Trophy, LogOut, Menu, X, 
  Settings, ChevronDown, Monitor, Layers, Mail
} from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview', exact: true },
  { to: '/admin/messages',  icon: Mail, label: 'Messages', badge: true },
  { to: '/admin/profile', icon: UserCircle, label: 'Profile' },
  { to: '/admin/gallery', icon: ImageIcon, label: 'Gallery' },
  { to: '/admin/achievements', icon: Trophy, label: 'Achievements' },
  { to: '/admin/awards', icon: Award, label: 'Awards' },
  { to: '/admin/certificates', icon: FileText, label: 'Certificates' },
  { to: '/admin/connections', icon: LinkIcon, label: 'Connections' },
  { to: '/admin/settings',    icon: Settings, label: 'Settings' },
  { to: '/admin/site-assets', icon: Layers,   label: 'Site Assets' },
];

export default function AdminLayout() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'messages'), where('read', '==', false));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.docs.length);
    });
    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  async function handleLogout() {
    try {
      await logout();
      navigate('/admin/login');
    } catch (err) {
      console.error('Failed to log out', err);
    }
  }

  const currentRouteName = navItems.find(i => location.pathname === i.to)?.label || 'Settings';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex font-body selection:bg-[#c9a84c]/20">
      
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <m.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 h-screen w-64 bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/60 flex flex-col z-50 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-20 flex items-center justify-between px-7 shrink-0 border-b border-slate-800/30">
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center shadow-inner">
              <span className="font-sans font-bold text-[#c9a84c] text-[10px] tracking-widest uppercase">OS</span>
            </div>
            <div className="flex-1">
              <h2 className="font-sans font-semibold text-[0.85rem] text-slate-100 tracking-wide">CMS System</h2>
            </div>
          </div>
          <button className="lg:hidden text-slate-500 hover:text-slate-200 transition-colors" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-[2px] custom-scrollbar">
          <div className="px-3 mb-4 text-[0.65rem] font-bold text-slate-500 uppercase tracking-[0.15em]">Modules</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => `
                flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-[0.85rem] font-medium transition-all duration-300
                ${isActive ? 'bg-[#c9a84c]/10 text-[#c9a84c]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
              `}
              onClick={() => setSidebarOpen(false)}
            >
              {({ isActive }) => (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3.5">
                    <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#c9a84c]' : 'text-slate-500'} />
                    {item.label}
                  </div>
                  {item.badge && unreadCount > 0 && (
                    <span className="bg-[#c9a84c] text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-5 shrink-0 border-t border-slate-800/50">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-between px-4 py-3.5 w-full rounded-xl text-[0.85rem] font-medium text-slate-400 hover:text-slate-200 bg-slate-900/50 hover:bg-slate-800 border border-slate-800/80 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <LogOut size={16} className="text-slate-500 group-hover:text-red-400 transition-colors" />
              <span className="group-hover:text-red-400 transition-colors">Log Out</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen w-full lg:w-[calc(100%-16rem)] relative overflow-x-hidden">
        
        {/* Subtle Blue-Gray Radial Glow in main area */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[600px] bg-slate-800/20 blur-[120px] rounded-full pointer-events-none" />

        {/* Top Header */}
        <header className={`sticky top-0 z-30 flex items-center justify-between px-6 lg:px-12 h-20 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800/60 shadow-sm' : 'bg-transparent'}`}>
          <div className="flex items-center gap-5">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-slate-200 transition-colors">
              <Menu size={22} />
            </button>
            <div className="hidden sm:flex items-center gap-3">
              <h1 className="font-sans font-semibold text-slate-100 text-lg tracking-tight">{currentRouteName}</h1>
            </div>
          </div>

          <div className="flex items-center gap-5 lg:gap-6">
            
            {/* Live Site Link */}
            <a href="/" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-2 text-[0.75rem] font-medium text-slate-400 hover:text-slate-200 transition-colors uppercase tracking-widest border border-slate-700 rounded-full px-4 py-1.5 bg-slate-900 shadow-sm hover:border-slate-500">
              <Monitor size={12} />
              View Site
            </a>

            <div className="w-px h-5 bg-slate-800 hidden sm:block"></div>

            {/* Profile Dropdown Trigger */}
            <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="hidden sm:block text-right">
                <p className="text-[0.8rem] font-medium text-slate-200 leading-tight">Administrator</p>
                <p className="text-[0.65rem] text-slate-500 leading-tight mt-0.5">{currentUser?.email || 'admin@portal.gov'}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
                <UserCircle size={18} className="text-[#c9a84c]" />
              </div>
              <ChevronDown size={14} className="text-slate-500 hidden sm:block ml-1" />
            </button>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <div className="flex-1 p-6 lg:p-12 relative z-10">
          <div className="max-w-[1000px] mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
