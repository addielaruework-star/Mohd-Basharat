import { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { getProfileData, updateProfileData } from '../../services/firebaseService';

export default function HomeManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    instagram: '',
    facebook: '',
    heroSubtitle: ''
  });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProfileData();
        if (data) {
          setFormData(prev => ({ 
            ...prev, 
            name: data.name || '',
            role: data.role || '',
            phone: data.phone || '',
            email: data.email || '',
            instagram: data.instagram || '',
            facebook: data.facebook || '',
            heroSubtitle: data.heroSubtitle || ''
          }));
        }
      } catch (err) {
        setStatus({ type: 'error', message: 'Failed to connect to database.' });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };



  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      // Merge with existing profile data to prevent overwriting other fields (bio, positions, etc.)
      const currentFullData = await getProfileData() || {};
      const updatedData = {
        ...currentFullData,
        ...formData
      };
      await updateProfileData(updatedData);
      sessionStorage.removeItem('mb_profile_cache');
      setStatus({ type: 'success', message: 'Home configuration saved successfully.' });
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to save changes.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <Loader2 className="animate-spin" size={20} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl pb-12 animate-enter">
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="font-sans font-medium text-2xl text-slate-100 tracking-tight">Home Page Settings</h2>
          <p className="text-sm text-slate-400 mt-1.5">Manage your homepage details, image banners, and contact links.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#c9a84c] text-slate-950 hover:bg-[#dfc26b] py-2.5 px-6 rounded-lg flex items-center gap-2 text-[0.85rem] font-medium transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <AnimatePresence>
        {status && (
          <m.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-8">
            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${
              status.type === 'success' ? 'bg-green-500/[0.05] border-green-500/20 text-green-400' : 'bg-red-500/[0.05] border-red-500/20 text-red-400'
            }`}>
              {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {status.message}
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <form className="space-y-8">
        {/* Hero Section Configuration */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 lg:p-10 shadow-lg shadow-black/20">
          <h3 className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-[0.15em] mb-6 border-b border-slate-800 pb-4">Hero Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-slate-400">Full Name (Main Heading)</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-200 transition-all text-[0.9rem]" />
            </div>
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-slate-400">Professional Subtitle (Role)</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-200 transition-all text-[0.9rem]" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-[0.75rem] font-medium text-slate-400">Introductory Subtitle</label>
            <textarea name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} rows="3"
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-200 transition-all text-[0.9rem] resize-none leading-relaxed"></textarea>
            <p className="text-[0.68rem] text-slate-500 mt-1.5 flex gap-3">
              <span>Formatting: <strong>**bold**</strong></span>
              <span>==<span className="text-[#c9a84c]">highlight</span>==</span>
            </p>
          </div>
        </div>



        {/* CTA Contact & Action Buttons */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 lg:p-10 shadow-lg shadow-black/20">
          <h3 className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-[0.15em] mb-6 border-b border-slate-800 pb-4">Social &amp; Contact Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-slate-400">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-200 transition-all text-[0.9rem] font-mono" />
            </div>
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-slate-400">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-200 transition-all text-[0.9rem] font-mono" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-slate-400">Instagram Link</label>
              <input type="url" name="instagram" value={formData.instagram} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-200 transition-all text-[0.9rem]" />
            </div>
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-slate-400">Facebook Link</label>
              <input type="url" name="facebook" value={formData.facebook} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-200 transition-all text-[0.9rem]" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
