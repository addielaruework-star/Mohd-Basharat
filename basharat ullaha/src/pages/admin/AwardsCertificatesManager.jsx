import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Award, FileText, Plus, Trash2, Edit2, Loader2, Save, X, CheckCircle, AlertCircle } from 'lucide-react';
import { getCollectionData, addCollectionItem, deleteCollectionItem, updateCollectionItem } from '../../services/firebaseService';

export default function AwardsCertificatesManager() {
  const [activeTab, setActiveTab] = useState('awards'); // 'awards' or 'certificates'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    description: '',
    type: '' // used for certificates
  });
  
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getCollectionData(activeTab);
        setItems(data);
      } catch (err) {
        console.error(`Failed to load ${activeTab}:`, err);
        showToast(`Failed to load ${activeTab} data.`, 'error');
      } finally {
        setLoading(false);
      }
    }
    loadData();
    setIsEditing(false);
    setEditingId(null);
  }, [activeTab]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const openEditor = (item = null) => {
    if (item) {
      setFormData({ 
        title: item.title, 
        year: item.year, 
        description: item.description || '',
        type: item.type || ''
      });
      setEditingId(item.id);
    } else {
      setFormData({ 
        title: '', 
        year: new Date().getFullYear().toString(), 
        description: '',
        type: activeTab === 'certificates' ? 'Certification' : ''
      });
      setEditingId(null);
    }
    setIsEditing(true);
  };

  const closeEditor = () => {
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.year) return;
    
    setSaving(true);
    try {
      if (editingId) {
        await updateCollectionItem(activeTab, editingId, formData);
        setItems(items.map(i => i.id === editingId ? { ...i, ...formData } : i));
        showToast('Record updated successfully.');
      } else {
        const id = await addCollectionItem(activeTab, formData);
        setItems([{ id, ...formData, createdAt: new Date().toISOString() }, ...items]);
        showToast('Record created successfully.');
      }
      closeEditor();
    } catch (err) {
      console.error("Save failed:", err);
      showToast("Failed to save changes.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await deleteCollectionItem(activeTab, id);
      setItems(items.filter(i => i.id !== id));
      showToast('Record deleted successfully.');
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Failed to delete record.", "error");
    }
  };

  return (
    <div className="space-y-8 animate-enter">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-3.5 rounded-xl border shadow-lg backdrop-blur-xl ${
              toast.type === 'success' 
                ? 'bg-green-900/20 border-green-500/30 text-green-100' 
                : 'bg-red-900/20 border-red-500/30 text-red-100'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-[0.9rem] font-medium">{toast.message}</span>
          </m.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="font-sans font-medium text-2xl text-slate-100 tracking-tight">Awards &amp; Certificates</h2>
          <p className="text-sm text-slate-400 mt-1.5">Manage recognition milestones, qualifications, and official certifications.</p>
        </div>
        {!isEditing && (
          <button onClick={() => openEditor()} className="bg-[#c9a84c] text-slate-950 hover:bg-[#dfc26b] py-2.5 px-6 rounded-lg flex items-center gap-2 text-[0.85rem] font-medium transition-all shadow-lg shadow-[#c9a84c]/10">
            <Plus size={16} /> New Record
          </button>
        )}
      </div>

      {/* Tabs Selector */}
      <div className="flex gap-2 border-b border-slate-800 pb-[1px]">
        <button
          onClick={() => setActiveTab('awards')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'awards' 
              ? 'border-[#c9a84c] text-[#c9a84c]' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award size={16} />
          Awards
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'certificates' 
              ? 'border-[#c9a84c] text-[#c9a84c]' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText size={16} />
          Certificates
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <m.div 
            key="editor"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-black/20"
          >
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#c9a84c]/5">
              <h3 className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-[0.15em]">
                {editingId ? `Edit ${activeTab === 'awards' ? 'Award' : 'Certificate'}` : `Create New ${activeTab === 'awards' ? 'Award' : 'Certificate'}`}
              </h3>
              <button onClick={closeEditor} className="text-slate-500 hover:text-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 lg:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 space-y-2">
                  <label className="block text-[0.75rem] font-medium text-slate-400">Title / Name</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-slate-100 transition-all text-[0.9rem]" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[0.75rem] font-medium text-slate-400">Year</label>
                  <input type="text" required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-slate-100 transition-all text-[0.9rem]" />
                </div>
              </div>

              {activeTab === 'certificates' && (
                <div className="space-y-2">
                  <label className="block text-[0.75rem] font-medium text-slate-400">Certificate Type</label>
                  <input type="text" required placeholder="e.g. Certification, Participation, Recognition" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-slate-100 transition-all text-[0.9rem]" />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="block text-[0.75rem] font-medium text-slate-400">Description</label>
                <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-slate-100 transition-all text-[0.9rem] resize-none"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50">
                <button type="button" onClick={closeEditor} className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="bg-[#c9a84c] text-slate-950 hover:bg-[#dfc26b] py-2.5 px-6 rounded-lg flex items-center gap-2 text-[0.85rem] font-medium transition-all disabled:opacity-50">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </m.div>
        ) : (
          <div key={activeTab}>
            {loading ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-slate-600" size={24} /></div>
            ) : items.length === 0 ? (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-24 text-center flex flex-col items-center justify-center shadow-lg shadow-black/20 animate-enter">
                <div className="w-16 h-16 bg-[#c9a84c]/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800/50">
                  {activeTab === 'awards' ? <Award className="text-slate-500" size={24} /> : <FileText className="text-slate-500" size={24} />}
                </div>
                <h3 className="font-medium text-slate-100 mb-2 text-[0.95rem]">No {activeTab} Found</h3>
                <p className="text-slate-500 text-[0.85rem] max-w-sm mx-auto leading-relaxed">Click "New Record" to add your first dynamic entry.</p>
              </div>
            ) : (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-black/20 animate-enter">
                <ul className="divide-y divide-slate-800/50">
                  {items.map(item => (
                    <li key={item.id} className="p-6 hover:bg-slate-800/20 transition-colors group">
                      <div className="flex justify-between items-start gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1.5">
                            <span className="text-[0.7rem] font-bold text-[#c9a84c] bg-[#c9a84c]/10 px-2 py-0.5 rounded uppercase tracking-wider">{item.year}</span>
                            <h4 className="text-[1rem] font-medium text-slate-100">{item.title}</h4>
                            {item.type && (
                              <span className="text-[0.6rem] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded uppercase tracking-wider">{item.type}</span>
                            )}
                          </div>
                          <p className="text-[0.85rem] text-slate-400 leading-relaxed white-space-pre-line">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditor(item)} className="p-2 text-slate-500 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-lg transition-all">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
