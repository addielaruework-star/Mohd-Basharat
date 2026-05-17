import { useState, useEffect, useRef } from 'react';
import { Save, Loader2, CheckCircle2, AlertCircle, Upload, X, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { getProfileData, updateProfileData } from '../../services/firebaseService';
import { uploadImage } from '../../lib/cloudinary';
import { optimizeCloudinaryUrl } from '../../utils/optimizeCloudinaryUrl';
import LazyImage from '../../components/LazyImage';

export default function AboutSectionSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  
  const [formData, setFormData] = useState({
    aboutText: '',
    mission: '',
    vision: '',
    bioImage: '',
    leadershipPositions: []
  });

  const [uploadingBio, setUploadingBio] = useState(false);
  const bioInputRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProfileData();
        if (data) {
          setFormData(prev => ({ 
            ...prev, 
            aboutText: data.aboutText || '',
            mission: data.mission || '',
            vision: data.vision || '',
            bioImage: data.bioImage || '',
            leadershipPositions: data.leadershipPositions || []
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingBio(true);
    try {
      const { url } = await uploadImage(file);
      setFormData(prev => ({ ...prev, bioImage: url }));
      setStatus({ type: 'success', message: 'Biography image uploaded. Save to persist.' });
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error("Upload failed", err);
      setStatus({ type: 'error', message: err.message || "Failed to upload image." });
    } finally {
      setUploadingBio(false);
      if (bioInputRef.current) bioInputRef.current.value = '';
    }
  };

  const clearImage = () => {
    setFormData(prev => ({ ...prev, bioImage: '' }));
  };

  const handleAddPosition = () => {
    setFormData(prev => ({
      ...prev,
      leadershipPositions: [
        ...(prev.leadershipPositions || []),
        { organization: '', title: '' }
      ]
    }));
  };

  const handleRemovePosition = (index) => {
    setFormData(prev => ({
      ...prev,
      leadershipPositions: (prev.leadershipPositions || []).filter((_, i) => i !== index)
    }));
  };

  const handlePositionChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...(prev.leadershipPositions || [])];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        leadershipPositions: updated
      };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const currentFullData = await getProfileData() || {};
      const updatedData = {
        ...currentFullData,
        ...formData
      };
      await updateProfileData(updatedData);
      sessionStorage.removeItem('mb_profile_cache');
      setStatus({ type: 'success', message: 'About section configuration saved successfully.' });
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
          <h2 className="font-sans font-medium text-2xl text-slate-100 tracking-tight">About Section Settings</h2>
          <p className="text-sm text-slate-400 mt-1.5">Manage biography, mission, vision, and your official positions.</p>
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
        {/* Biography Content & Image */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 lg:p-10 shadow-lg shadow-black/20">
          <h3 className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-[0.15em] mb-6 border-b border-slate-800 pb-4">Biography</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[0.75rem] font-medium text-slate-400">About Narrative Text</label>
              <textarea name="aboutText" value={formData.aboutText} onChange={handleChange} rows="10"
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-200 transition-all text-[0.9rem] resize-y leading-relaxed"></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-slate-400">Biography Image</label>
              <div className="relative border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50 h-[220px] flex items-center justify-center">
                {formData.bioImage ? (
                  <>
                    <LazyImage src={optimizeCloudinaryUrl(formData.bioImage)} alt="Bio" className="w-full h-full" />
                    <button type="button" onClick={clearImage} className="absolute top-2 right-2 bg-red-500/20 hover:bg-red-500/40 text-red-100 p-2 rounded-full transition-colors border border-red-500/30">
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <ImageIcon size={32} className="text-slate-700 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">No image uploaded</p>
                  </div>
                )}
                {uploadingBio && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="animate-spin text-[#c9a84c]" size={24} />
                  </div>
                )}
              </div>
              <button 
                type="button" 
                onClick={() => bioInputRef.current?.click()}
                className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Upload size={14} />
                Upload Bio Image
              </button>
              <input type="file" accept="image/*" ref={bioInputRef} onChange={handleImageUpload} className="hidden" />
            </div>

          </div>
        </div>

        {/* Mission & Vision Statements */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 lg:p-10 shadow-lg shadow-black/20">
          <h3 className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-[0.15em] mb-6 border-b border-slate-800 pb-4">Mission &amp; Vision</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-slate-400">Mission Statement</label>
              <textarea name="mission" value={formData.mission} onChange={handleChange} rows="2"
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-200 transition-all text-[0.9rem] resize-none leading-relaxed"></textarea>
            </div>
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-slate-400">Vision Statement</label>
              <textarea name="vision" value={formData.vision} onChange={handleChange} rows="2"
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-200 transition-all text-[0.9rem] resize-none leading-relaxed"></textarea>
            </div>
          </div>
        </div>

        {/* Leadership Positions Repeater */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 lg:p-10 shadow-lg shadow-black/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-[0.15em]">Leadership Positions</h3>
              <p className="text-xs text-slate-400 mt-1">Manage positions held and organizations served.</p>
            </div>
            <button 
              type="button" 
              onClick={handleAddPosition}
              className="bg-[#c9a84c] text-slate-950 hover:bg-[#dfc26b] py-2 px-4 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all shadow-md shadow-[#c9a84c]/10"
            >
              <Plus size={14} /> Add Position
            </button>
          </div>

          {!formData.leadershipPositions || formData.leadershipPositions.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
              <p className="text-sm text-slate-500">No positions added yet. Click "Add Position" to begin.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.leadershipPositions.map((pos, index) => (
                <div key={index} className="flex gap-4 items-start bg-slate-950/30 p-5 border border-slate-800/80 rounded-xl relative group">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="space-y-2">
                      <label className="block text-[0.75rem] font-medium text-slate-400">Organization Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Anti Corruption Foundation of India"
                        value={pos.organization} 
                        onChange={(e) => handlePositionChange(index, 'organization', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-slate-200 transition-all text-[0.9rem]" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[0.75rem] font-medium text-slate-400">Position Title</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. State Chief Director Telangana"
                        value={pos.title} 
                        onChange={(e) => handlePositionChange(index, 'title', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-slate-200 transition-all text-[0.9rem]" 
                      />
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemovePosition(index)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all mt-7"
                    title="Delete Position"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
