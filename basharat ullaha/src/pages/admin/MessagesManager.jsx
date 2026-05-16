import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Mail, Search, Trash2, Check, CheckCircle2, Star, Clock, Inbox, AlertCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, important
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })));
      setLoading(false);
    }, (err) => {
      console.error(err);
      toast.error('Failed to load messages');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleRead = async (e, msg) => {
    e.stopPropagation();
    try {
      await updateDoc(doc(db, 'messages', msg.id), { read: !msg.read });
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleToggleImportant = async (e, msg) => {
    e.stopPropagation();
    try {
      await updateDoc(doc(db, 'messages', msg.id), { important: !msg.important });
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteDoc(doc(db, 'messages', id));
      toast.success('Message deleted');
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  const handleOpenMessage = async (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      try {
        await updateDoc(doc(db, 'messages', msg.id), { read: true });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread' && msg.read) return false;
    if (filter === 'important' && !msg.important) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return msg.name?.toLowerCase().includes(q) || msg.email?.toLowerCase().includes(q) || msg.subject?.toLowerCase().includes(q);
    }
    return true;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-6 pb-12 text-slate-100 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
        <div className="animate-enter">
          <h1 className="font-sans font-medium text-3xl tracking-tight mb-2 flex items-center gap-3">
            Messages
            {unreadCount > 0 && (
              <span className="bg-[#c9a84c] text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Manage inquiries, collaboration requests, and contact messages.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative group flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#c9a84c]" size={16} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-sm text-slate-200 transition-colors"
            />
          </div>
          <select 
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="py-2.5 px-4 bg-slate-900/80 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-sm text-slate-200 transition-colors"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="important">Important</option>
          </select>
        </div>
      </div>

      <div className="flex-1 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl flex overflow-hidden min-h-[400px]">
        
        {/* Inbox List */}
        <div className={`w-full ${selectedMessage ? 'hidden lg:block lg:w-2/5 xl:w-1/3' : 'block'} border-r border-slate-800 flex flex-col`}>
          <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900">
            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <Inbox size={16} /> Inbox
            </div>
            <span className="text-xs text-slate-500">{filteredMessages.length} messages</span>
          </div>
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading messages...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                <Mail size={32} className="mx-auto mb-3 opacity-20" />
                No messages found.
              </div>
            ) : (
              <ul className="divide-y divide-slate-800/50">
                {filteredMessages.map((msg) => (
                  <li key={msg.id}>
                    <button 
                      onClick={() => handleOpenMessage(msg)}
                      className={`w-full text-left p-4 hover:bg-slate-800/50 transition-colors flex items-start gap-3 ${selectedMessage?.id === msg.id ? 'bg-[#c9a84c]/5 border-l-2 border-[#c9a84c]' : 'border-l-2 border-transparent'} ${!msg.read ? 'bg-slate-800/30' : ''}`}
                    >
                      <div className="mt-1">
                        {!msg.read ? (
                          <div className="w-2.5 h-2.5 bg-[#c9a84c] rounded-full shadow-[0_0_8px_rgba(201,168,76,0.6)]" />
                        ) : (
                          <div className="w-2.5 h-2.5 bg-transparent" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm truncate pr-2 ${!msg.read ? 'font-semibold text-slate-100' : 'font-medium text-slate-300'}`}>
                            {msg.name}
                          </p>
                          <span className="text-[0.7rem] text-slate-500 whitespace-nowrap">
                            {msg.createdAt?.toLocaleDateString()}
                          </span>
                        </div>
                        <p className={`text-[0.8rem] truncate mb-1.5 ${!msg.read ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                          {msg.subject || 'No Subject'}
                        </p>
                        <p className="text-[0.75rem] text-slate-500 truncate">
                          {msg.message}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Message Viewer */}
        <div className={`flex-1 flex flex-col ${!selectedMessage ? 'hidden lg:flex' : 'flex'}`}>
          {selectedMessage ? (
            <>
              <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <button className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-200" onClick={() => setSelectedMessage(null)}>
                    <X size={20} />
                  </button>
                  <h2 className="text-lg font-medium text-slate-100">{selectedMessage.subject || 'No Subject'}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => handleToggleImportant(e, selectedMessage)}
                    className="p-2 rounded-lg hover:bg-slate-800 transition-colors group relative"
                    title="Toggle Important"
                  >
                    <Star size={18} className={selectedMessage.important ? 'fill-[#c9a84c] text-[#c9a84c]' : 'text-slate-400 group-hover:text-slate-200'} />
                  </button>
                  <button 
                    onClick={(e) => handleToggleRead(e, selectedMessage)}
                    className="p-2 rounded-lg hover:bg-slate-800 transition-colors group relative"
                    title={selectedMessage.read ? "Mark unread" : "Mark read"}
                  >
                    {selectedMessage.read ? <Mail size={18} className="text-slate-400 group-hover:text-slate-200" /> : <CheckCircle2 size={18} className="text-[#c9a84c]" />}
                  </button>
                  <div className="w-px h-6 bg-slate-800 mx-1" />
                  <button 
                    onClick={(e) => handleDelete(e, selectedMessage.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors group"
                    title="Delete Message"
                  >
                    <Trash2 size={18} className="text-slate-500 group-hover:text-red-400" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-b border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 font-bold uppercase">
                    {selectedMessage.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-200">{selectedMessage.name}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <a href={`mailto:${selectedMessage.email}`} className="hover:text-[#c9a84c] transition-colors">{selectedMessage.email}</a>
                      {selectedMessage.phone && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-700" />
                          <a href={`tel:${selectedMessage.phone}`} className="hover:text-[#c9a84c] transition-colors">{selectedMessage.phone}</a>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 sm:text-right">
                  <Clock size={12} />
                  {selectedMessage.createdAt?.toLocaleString()}
                </div>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
                <div className="max-w-3xl whitespace-pre-wrap text-[0.95rem] text-slate-300 leading-relaxed font-body">
                  {selectedMessage.message}
                </div>
              </div>
              
              <div className="p-4 border-t border-slate-800 bg-slate-900/50 shrink-0">
                <a 
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="btn-primary inline-flex py-2 px-4 text-sm"
                >
                  Reply via Email
                </a>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-700/50">
                <Mail size={32} className="text-slate-600" />
              </div>
              <p className="font-medium text-slate-400">Select a message</p>
              <p className="text-sm mt-1 max-w-xs text-center">Choose a message from the list to read its contents here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
