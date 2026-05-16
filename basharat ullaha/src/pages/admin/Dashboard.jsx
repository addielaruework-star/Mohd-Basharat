import { useState, useEffect } from 'react';
import { Image as ImageIcon, UserCircle, Award, FileText, Link as LinkIcon, Trophy, ArrowRight, Activity, LayoutDashboard, Settings, Mail, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

const overviewActions = [
  { label: 'Messages Inbox', to: '/admin/messages', icon: Mail },
  { label: 'Profile Settings', to: '/admin/profile', icon: UserCircle },
  { label: 'Gallery Management', to: '/admin/gallery', icon: ImageIcon },
  { label: 'Awards & Honors', to: '/admin/awards', icon: Award },
];

const contentCards = [
  { title: 'Update Biography', desc: 'Modify your personal bio and hero subtitle.', to: '/admin/profile', icon: UserCircle },
  { title: 'Upload Photos', desc: 'Add new images to your public gallery.', to: '/admin/gallery', icon: ImageIcon },
  { title: 'Add Achievement', desc: 'Record a new milestone in your career.', to: '/admin/achievements', icon: Trophy },
  { title: 'Manage Connections', desc: 'Update links to affiliated organizations.', to: '/admin/connections', icon: LinkIcon },
];

export default function Dashboard() {
  const [recentMessages, setRecentMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentMessages(msgs.slice(0, 3)); // Show top 3
      setUnreadCount(msgs.filter(m => !m.read).length); // Approximate recent unread
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="text-slate-100 space-y-12 pb-12">
      
      {/* Header */}
      <div className="animate-enter">
        <h1 className="font-sans font-medium text-3xl mb-3 tracking-tight">Overview</h1>
        <p className="text-slate-400 text-[0.95rem] max-w-2xl leading-relaxed">
          Welcome to your content management system. Access core modules to update your public portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Quick Stats / Status */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 flex items-center justify-between animate-enter" style={{ animationDelay: '0.1s' }}>
                <div>
                  <p className="text-[0.7rem] font-medium text-slate-400 uppercase tracking-widest mb-1">System Status</p>
                  <p className="text-slate-100 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"></span>
                    Operational
                  </p>
                </div>
                <Activity size={20} className="text-slate-600" />
              </div>

              <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 flex items-center justify-between animate-enter" style={{ animationDelay: '0.15s' }}>
                <div>
                  <p className="text-[0.7rem] font-medium text-slate-400 uppercase tracking-widest mb-1">Messages</p>
                  <p className="text-slate-100 font-medium text-sm flex items-center gap-2">
                    {unreadCount > 0 ? (
                      <><span className="w-2 h-2 rounded-full bg-[#c9a84c] shadow-[0_0_8px_rgba(201,168,76,0.5)]"></span> {unreadCount} Unread</>
                    ) : (
                      'All caught up'
                    )}
                  </p>
                </div>
                <Mail size={20} className="text-slate-600" />
              </div>
            </div>
          </section>

          {/* Content Management Cards */}
          <section>
            <h2 className="text-[0.8rem] font-semibold text-slate-400 uppercase tracking-widest mb-5">Content Management</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contentCards.map((card, i) => (
                <div key={card.title} className="animate-enter" style={{ animationDelay: `${i * 0.05 + 0.2}s` }}>
                  <Link 
                    to={card.to}
                    className="flex items-start gap-4 p-6 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 hover:bg-slate-950/50 hover:border-[#c9a84c]/50 transition-all duration-300 group h-full"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/5 border border-slate-800/50 flex items-center justify-center shrink-0 group-hover:bg-[#c9a84c]/10 transition-colors">
                      <card.icon size={18} className="text-slate-400 group-hover:text-slate-100 transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[0.95rem] text-gray-200 mb-1 flex items-center gap-2 group-hover:text-slate-100 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-[0.85rem] text-slate-500 leading-relaxed">{card.desc}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-10">
          
          {/* Action Menu */}
          <section>
            <h2 className="text-[0.8rem] font-semibold text-slate-400 uppercase tracking-widest mb-5">Core Modules</h2>
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-2 animate-enter" style={{ animationDelay: '0.3s' }}>
              {overviewActions.map((action, i) => (
                <Link 
                  key={action.label} 
                  to={action.to}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-[#c9a84c]/5 transition-colors group"
                >
                  <div className="flex items-center gap-3 text-[#aaa] group-hover:text-slate-100 transition-colors">
                    <action.icon size={16} />
                    <span className="text-[0.9rem] font-medium">{action.label}</span>
                  </div>
                  <ArrowRight size={16} className="text-slate-600 group-hover:text-slate-100 transition-colors" />
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Messages Widget */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[0.8rem] font-semibold text-slate-400 uppercase tracking-widest">Recent Messages</h2>
              <Link to="/admin/messages" className="text-[0.75rem] text-[#c9a84c] hover:text-slate-200 transition-colors flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden animate-enter" style={{ animationDelay: '0.4s' }}>
              {recentMessages.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
                  <div className="w-12 h-12 rounded-full bg-[#c9a84c]/5 border border-slate-800/50 flex items-center justify-center mb-4">
                    <Inbox size={20} className="text-slate-600" />
                  </div>
                  <p className="text-slate-400 text-[0.9rem]">No recent messages.</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-800/50">
                  {recentMessages.map(msg => (
                    <li key={msg.id}>
                      <Link to="/admin/messages" className="flex items-start gap-3 p-4 hover:bg-slate-800/30 transition-colors">
                        <div className="mt-1">
                          {!msg.read ? (
                            <div className="w-2 h-2 bg-[#c9a84c] rounded-full shadow-[0_0_5px_rgba(201,168,76,0.5)]" />
                          ) : (
                            <div className="w-2 h-2" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${!msg.read ? 'font-medium text-slate-200' : 'text-slate-400'}`}>
                            {msg.name}
                          </p>
                          <p className="text-[0.75rem] text-slate-500 truncate mt-0.5">
                            {msg.subject || 'No Subject'}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
