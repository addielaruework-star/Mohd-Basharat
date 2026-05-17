import { useState, useEffect, useRef } from 'react';
import { Save, Loader2, CheckCircle2, AlertCircle, Upload, X, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { getProfileData, updateProfileData } from '../../services/firebaseService';
import { uploadImage } from '../../lib/cloudinary';
import { optimizeCloudinaryUrl } from '../../utils/optimizeCloudinaryUrl';
import LazyImage from '../../components/LazyImage';

export default function ProfileManager() {
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
    heroSubtitle: '',
    aboutText: '',
    mission: '',
    vision: '',
    profileImage: '',
    bioImage: '',
    leadershipPositions: []
  });

  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingBio, setUploadingBio] = useState(false);
  
  const profileInputRef = useRef(null);
  const bioInputRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProfileData();
        if (data) {
          setFormData(prev => ({ 
            ...prev, 
            ...data,
            leadershipPositions: data.leadershipPositions || []
          }));
        } else {
          // Defaults if no data in Firestore
          setFormData({
            name: 'Mohd Basharath Ullah',
            role: 'Social Activist & Humanitarian Leader',
            phone: '6281823792',
            email: 'Mohdbasharath18@gmail.com',
            instagram: 'https://www.instagram.com/mohd.basharath.96',
            facebook: 'https://www.facebook.com/share/r/14btibmxfRQ/',
            heroSubtitle: 'Committed social activist and humanitarian leader dedicated to promoting human rights and social justice.',
            aboutText: 'Mohd Basharath Ullah is a dedicated social activist and government officer...',
            mission: 'To serve humanity by promoting justice, equality, and support for underprivileged communities.',
            vision: 'To create a society where every individual has access to basic rights and opportunities.',
            profileImage: '',
            bioImage: '',
            leadershipPositions: [
              { organization: 'Anti Corruption Foundation of India', title: 'State Chief Director Telangana' },
              { organization: 'International Human Rights & Social Justice Organization', title: 'Ex Vice President' }
            ]
          });
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

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'profile') setUploadingProfile(true);
    else setUploadingBio(true);

    try {
      const { url } = await uploadImage(file);
      setFormData(prev => ({ ...prev, [type === 'profile' ? 'profileImage' : 'bioImage']: url }));
      setStatus({ type: 'success', message: `${type === 'profile' ? 'Profile' : 'Biography'} image uploaded. Save to persist.` });
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error("Upload failed", err);
      setStatus({ type: 'error', message: err.message || "Failed to upload image." });
    } finally {
      if (type === 'profile') setUploadingProfile(false);
      else setUploadingBio(false);
      if (type === 'profile' && profileInputRef.current) profileInputRef.current.value = '';
      if (type === 'bio' && bioInputRef.current) bioInputRef.current.value = '';
    }
  };

  const clearImage = (type) => {
    setFormData(prev => ({ ...prev, [type === 'profile' ? 'profileImage' : 'bioImage']: '' }));
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
      await updateProfileData(formData);
      sessionStorage.removeItem('mb_profile_cache');
      setStatus({ type: 'success', message: 'Profile configuration saved successfully.' });
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
          <h2 className="font-sans font-medium text-2xl text-slate-100 tracking-tight">Profile Settings</h2>
          <p className="text-sm text-slate-400 mt-1.5">Manage your personal information and biography.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#c9a84c] text-slate-950 hover:bg-[#c9a84c] py-2.5 px-6 rounded-lg flex items-center gap-2 text-[0.85rem] font-medium transition-all disabled:opacity-50"
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
        {/* Personal Details Panel */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 lg:p-10 shadow-lg shadow-black/20">
          <h3 className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-[0.15em] mb-6 border-b border-slate-800 pb-4">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-slate-400">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-200 transition-all text-[0.9rem]" />
            </div>
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-slate-400">Professional Role</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-200 transition-all text-[0.9rem]" />
            </div>
          </div>
        </div>

        {/* Media Assets Panel */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 lg:p-10 shadow-lg shadow-black/20">
          <h3 className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-[0.15em] mb-6 border-b border-slate-800 pb-4">Media Assets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Profile Image */}
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-slate-400">Profile Image (Hero)</label>
              <div className="relative border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50 h-[200px] flex items-center justify-center">
                {formData.profileImage ? (
                  <>
                    <LazyImage src={optimizeCloudinaryUrl(formData.profileImage)} alt="Profile" className="w-full h-full" />
                    <button type="button" onClick={() => clearImage('profile')} className="absolute top-2 right-2 bg-red-500/20 hover:bg-red-500/40 text-red-100 p-2 rounded-full transition-colors border border-red-500/30">
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <ImageIcon size={32} className="text-slate-700 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">No image uploaded</p>
                  </div>
                )}
                {uploadingProfile && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="animate-spin text-[#c9a84c]" size={24} />
                  </div>
                )}
              </div>
              <button 
                type="button" 
                onClick={() => profileInputRef.current?.click()}
                className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Upload size={14} />
                Upload Profile Image
              </button>
              <input type="file" accept="image/*" ref={profileInputRef} onChange={(e) => handleImageUpload(e, 'profile')} className="hidden" />
            </div>

            {/* Bio Image */}
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-slate-400">Biography Image (About)</label>
              <div className="relative border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50 h-[200px] flex items-center justify-center">
                {formData.bioImage ? (
                  <>
                    <LazyImage src={optimizeCloudinaryUrl(formData.bioImage)} alt="Bio" className="w-full h-full" />
                    <button type="button" onClick={() => clearImage('bio')} className="absolute top-2 right-2 bg-red-500/20 hover:bg-red-500/40 text-red-100 p-2 rounded-full transition-colors border border-red-500/30">
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
              <input type="file" accept="image/*" ref={bioInputRef} onChange={(e) => handleImageUpload(e, 'bio')} className="hidden" />
            </div>

          </div>
        </div>

        {/* Contact & Social Links Panel */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 lg:p-10 shadow-lg shadow-black/20">
          <h3 className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-[0.15em] mb-6 border-b border-slate-800 pb-4">Contact & Social</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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
              <label className="block text-[0.75rem] font-medium text-slate-400">Instagram Profile URL</label>
              <input type="url" name="instagram" value={formData.instagram} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-200 transition-all text-[0.9rem]" />
            </div>
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-slate-400">Facebook Page URL</label>
              <input type="url" name="facebook" value={formData.facebook} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-200 transition-all text-[0.9rem]" />
            </div>
          </div>
        </div>

        {/* Content Panel */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 lg:p-10 shadow-lg shadow-black/20">
          <h3 className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-[0.15em] mb-6 border-b border-slate-800 pb-4">Content Assets</h3>
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-slate-400">Hero Subtitle</label>
              <textarea name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} rows="2"
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-200 transition-all text-[0.9rem] resize-none leading-relaxed"></textarea>
            </div>
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-slate-400">Biography (About Section)</label>
              <textarea name="aboutText" value={formData.aboutText} onChange={handleChange} rows="6"
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-200 transition-all text-[0.9rem] resize-y leading-relaxed"></textarea>
            </div>
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

        {/* Leadership Positions Panel */}
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
