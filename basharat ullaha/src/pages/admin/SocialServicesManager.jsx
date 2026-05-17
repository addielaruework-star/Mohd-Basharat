import { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Heart, Scale, Users, Megaphone, Box, Shield, Link as LinkIcon, Plus, Trash2, Edit2, Loader2, Save, X, Upload, ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { getCollectionData, addCollectionItem, deleteCollectionItem, updateCollectionItem, getProfileData, updateProfileData } from '../../services/firebaseService';
import { uploadImage } from '../../lib/cloudinary';
import { optimizeCloudinaryUrl } from '../../utils/optimizeCloudinaryUrl';
import LazyImage from '../../components/LazyImage';

const ICONS = [
  { value: 'Heart', label: 'Heart / Compassion' },
  { value: 'Scale', label: 'Scale / Justice' },
  { value: 'Shield', label: 'Shield / Rights' },
  { value: 'Users', label: 'Users / Community' },
  { value: 'Megaphone', label: 'Megaphone / Advocacy' },
  { value: 'Box', label: 'Box / Relief' },
  { value: 'LinkIcon', label: 'Link / Collaboration' }
];

export default function SocialServicesManager() {
  const [activeTab, setActiveTab] = useState('cards'); // 'cards' or 'settings'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  // Tab 1: Service Cards Collection
  const [cards, setCards] = useState([]);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [cardForm, setCardForm] = useState({ title: '', icon: 'Heart' });

  // Tab 2: Page Settings Document (on settings/profile document for caching & ease)
  const [settingsForm, setSettingsForm] = useState({
    servicesIntroPart1: '',
    servicesIntroPart2: '',
    servicesBanner: '',
    // Statistics
    servicesStat1Count: '10,000+',
    servicesStat1Label: 'Lives Impacted',
    servicesStat2Count: '50+',
    servicesStat2Label: 'Villages Reached',
    servicesStat3Count: '15+',
    servicesStat3Label: 'NGO Collaborations',
    // CTA
    servicesCtaTitle: 'Support Our Social Causes',
    servicesCtaText: 'Join hands with us to bring sustainable change and uplift marginalized communities.',
    servicesCtaButtonText: 'Get In Touch'
  });

  const [uploadingBanner, setUploadingBanner] = useState(false);
  const bannerInputRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Load services cards
        const serviceItems = await getCollectionData('services');
        setCards(serviceItems);

        // Load profile settings
        const profile = await getProfileData();
        if (profile) {
          setSettingsForm({
            servicesIntroPart1: profile.servicesIntroPart1 || '',
            servicesIntroPart2: profile.servicesIntroPart2 || '',
            servicesBanner: profile.servicesBanner || '',
            servicesStat1Count: profile.servicesStat1Count || '10,000+',
            servicesStat1Label: profile.servicesStat1Label || 'Lives Impacted',
            servicesStat2Count: profile.servicesStat2Count || '50+',
            servicesStat2Label: profile.servicesStat2Label || 'Villages Reached',
            servicesStat3Count: profile.servicesStat3Count || '15+',
            servicesStat3Label: profile.servicesStat3Label || 'NGO Collaborations',
            servicesCtaTitle: profile.servicesCtaTitle || 'Support Our Social Causes',
            servicesCtaText: profile.servicesCtaText || 'Join hands with us to bring sustainable change and uplift marginalized communities.',
            servicesCtaButtonText: profile.servicesCtaButtonText || 'Get In Touch'
          });
        }
      } catch (err) {
        console.error("Failed to load Social Services CMS:", err);
        setStatus({ type: 'error', message: 'Failed to connect to database.' });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const showStatus = (message, type = 'success') => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 3000);
  };

  // Card Handlers
  const openCardEditor = (card = null) => {
    if (card) {
      setCardForm({ title: card.title, icon: card.icon || 'Heart' });
      setEditingCardId(card.id);
    } else {
      setCardForm({ title: '', icon: 'Heart' });
      setEditingCardId(null);
    }
    setIsEditingCard(true);
  };

  const closeCardEditor = () => {
    setIsEditingCard(false);
    setEditingCardId(null);
  };

  const handleSaveCard = async (e) => {
    e.preventDefault();
    if (!cardForm.title) return;
    
    setSaving(true);
    try {
      if (editingCardId) {
        await updateCollectionItem('services', editingCardId, cardForm);
        setCards(cards.map(c => c.id === editingCardId ? { ...c, ...cardForm } : c));
        showStatus('Service card updated successfully.');
      } else {
        const id = await addCollectionItem('services', cardForm);
        setCards([...cards, { id, ...cardForm }]);
        showStatus('Service card created successfully.');
      }
      closeCardEditor();
    } catch (err) {
      console.error(err);
      showStatus('Failed to save service card.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCard = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service card?")) return;
    try {
      await deleteCollectionItem('services', id);
      setCards(cards.filter(c => c.id !== id));
      showStatus('Service card deleted.');
    } catch (err) {
      console.error(err);
      showStatus('Failed to delete card.', 'error');
    }
  };

  // Settings Handlers
  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettingsForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingBanner(true);
    try {
      const { url } = await uploadImage(file);
      setSettingsForm(prev => ({ ...prev, servicesBanner: url }));
      showStatus('Social Services banner image uploaded. Save to persist.');
    } catch (err) {
      console.error(err);
      showStatus('Failed to upload banner image.', 'error');
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = '';
    }
  };

  const clearBanner = () => {
    setSettingsForm(prev => ({ ...prev, servicesBanner: '' }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const profile = await getProfileData() || {};
      const updatedData = {
        ...profile,
        ...settingsForm
      };
      await updateProfileData(updatedData);
      sessionStorage.removeItem('mb_profile_cache');
      showStatus('Page configuration saved successfully.');
    } catch (err) {
      console.error(err);
      showStatus('Failed to save changes.', 'error');
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
          <h2 className="font-sans font-medium text-2xl text-slate-100 tracking-tight">Social Services Settings</h2>
          <p className="text-sm text-slate-400 mt-1.5">Manage service initiatives, statistics counters, and page text details.</p>
        </div>
        {activeTab === 'settings' && (
          <button 
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-[#c9a84c] text-slate-950 hover:bg-[#dfc26b] py-2.5 px-6 rounded-lg flex items-center gap-2 text-[0.85rem] font-medium transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        )}
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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-[1px] mb-8">
        <button
          onClick={() => { setActiveTab('cards'); closeCardEditor(); }}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'cards' ? 'border-[#c9a84c] text-[#c9a84c]' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Service Cards
        </button>
        <button
          onClick={() => { setActiveTab('settings'); closeCardEditor(); }}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'settings' ? 'border-[#c9a84c] text-[#c9a84c]' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Page Text &amp; Settings
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'cards' ? (
          isEditingCard ? (
            <m.div 
              key="card-editor"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-black/20"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#c9a84c]/5">
                <h3 className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-[0.15em]">
                  {editingCardId ? 'Edit Service Card' : 'Create New Service Card'}
                </h3>
                <button onClick={closeCardEditor} className="text-slate-500 hover:text-slate-200 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveCard} className="p-6 lg:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[0.75rem] font-medium text-slate-400">Service Title</label>
                    <input type="text" required placeholder="e.g. Human Rights Advocacy" value={cardForm.title} onChange={e => setCardForm({...cardForm, title: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-slate-100 transition-all text-[0.9rem]" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[0.75rem] font-medium text-slate-400">Icon Emblem</label>
                    <select value={cardForm.icon} onChange={e => setCardForm({...cardForm, icon: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-slate-100 transition-all text-[0.9rem]">
                      {ICONS.map(ic => <option key={ic.value} value={ic.value} className="bg-slate-950">{ic.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50">
                  <button type="button" onClick={closeCardEditor} className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="bg-[#c9a84c] text-slate-950 hover:bg-[#dfc26b] py-2.5 px-6 rounded-lg flex items-center gap-2 text-[0.85rem] font-medium transition-all">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Card
                  </button>
                </div>
              </form>
            </m.div>
          ) : (
            <m.div key="cards-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Service Cards</h3>
                <button onClick={() => openCardEditor()} className="bg-[#c9a84c] text-slate-950 hover:bg-[#dfc26b] py-2 px-4 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all">
                  <Plus size={14} /> Add Service Card
                </button>
              </div>

              {cards.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                  <p className="text-sm text-slate-500">No service cards saved yet. Click "Add Service Card" to begin.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {cards.map(c => (
                    <div key={c.id} className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-5 flex items-center justify-between group hover:border-[#c9a84c]/50 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center text-[#c9a84c] border border-slate-800">
                          <Heart size={18} />
                        </div>
                        <h4 className="text-slate-100 font-medium text-sm truncate max-w-[140px]" title={c.title}>{c.title}</h4>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openCardEditor(c)} className="p-1.5 text-slate-400 hover:text-[#c9a84c] hover:bg-slate-800 rounded-md transition-all"><Edit2 size={14} /></button>
                        <button onClick={() => handleDeleteCard(c.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-all"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </m.div>
          )
        ) : (
          <m.div key="settings-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            {/* Intro Narratives */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 shadow-lg">
              <h3 className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-[0.15em] mb-6 border-b border-slate-800 pb-4">Introduction Paragraphs</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[0.75rem] font-medium text-slate-400">First Paragraph</label>
                  <textarea name="servicesIntroPart1" value={settingsForm.servicesIntroPart1} onChange={handleSettingsChange} rows="3"
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-slate-200 transition-all text-[0.9rem] resize-y leading-relaxed" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[0.75rem] font-medium text-slate-400">Second Paragraph</label>
                  <textarea name="servicesIntroPart2" value={settingsForm.servicesIntroPart2} onChange={handleSettingsChange} rows="3"
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-slate-200 transition-all text-[0.9rem] resize-y leading-relaxed" />
                </div>
              </div>
            </div>

            {/* Banners */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 shadow-lg">
              <h3 className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-[0.15em] mb-6 border-b border-slate-800 pb-4">Page Banner Image</h3>
              <div className="space-y-2">
                <label className="block text-[0.75rem] font-medium text-slate-400">Upload Banner Photo</label>
                <div className="relative border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50 h-[220px] flex items-center justify-center">
                  {settingsForm.servicesBanner ? (
                    <>
                      <LazyImage src={optimizeCloudinaryUrl(settingsForm.servicesBanner)} alt="Banner" className="w-full h-full" />
                      <button type="button" onClick={clearBanner} className="absolute top-2 right-2 bg-red-500/20 hover:bg-red-500/40 text-red-100 p-2 rounded-full transition-colors border border-red-500/30">
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <ImageIcon size={32} className="text-slate-700 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">No image uploaded</p>
                    </div>
                  )}
                  {uploadingBanner && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="animate-spin text-[#c9a84c]" size={24} />
                    </div>
                  )}
                </div>
                <button 
                  type="button" 
                  onClick={() => bannerInputRef.current?.click()}
                  className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Upload size={14} />
                  Upload Banner Photo
                </button>
                <input type="file" accept="image/*" ref={bannerInputRef} onChange={handleImageUpload} className="hidden" />
              </div>
            </div>

            {/* Statistics Section */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 shadow-lg">
              <h3 className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-[0.15em] mb-6 border-b border-slate-800 pb-4">Statistics Counters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Stat 1 */}
                <div className="bg-slate-950/40 p-5 border border-slate-850 rounded-xl space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[0.7rem] text-slate-400">Stat 1 Counter</label>
                    <input type="text" name="servicesStat1Count" value={settingsForm.servicesStat1Count} onChange={handleSettingsChange}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[0.7rem] text-slate-400">Stat 1 Label</label>
                    <input type="text" name="servicesStat1Label" value={settingsForm.servicesStat1Label} onChange={handleSettingsChange}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-sm" />
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-slate-950/40 p-5 border border-slate-850 rounded-xl space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[0.7rem] text-slate-400">Stat 2 Counter</label>
                    <input type="text" name="servicesStat2Count" value={settingsForm.servicesStat2Count} onChange={handleSettingsChange}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[0.7rem] text-slate-400">Stat 2 Label</label>
                    <input type="text" name="servicesStat2Label" value={settingsForm.servicesStat2Label} onChange={handleSettingsChange}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-sm" />
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-slate-950/40 p-5 border border-slate-850 rounded-xl space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[0.7rem] text-slate-400">Stat 3 Counter</label>
                    <input type="text" name="servicesStat3Count" value={settingsForm.servicesStat3Count} onChange={handleSettingsChange}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-slate-200 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[0.7rem] text-slate-400">Stat 3 Label</label>
                    <input type="text" name="servicesStat3Label" value={settingsForm.servicesStat3Label} onChange={handleSettingsChange}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-sm" />
                  </div>
                </div>

              </div>
            </div>

            {/* CTA Segment */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 shadow-lg">
              <h3 className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-[0.15em] mb-6 border-b border-slate-800 pb-4">Call to Action (CTA) Section</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[0.75rem] font-medium text-slate-400">CTA Heading</label>
                    <input type="text" name="servicesCtaTitle" value={settingsForm.servicesCtaTitle} onChange={handleSettingsChange}
                      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-slate-200 text-[0.9rem]" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[0.75rem] font-medium text-slate-400">Button Label</label>
                    <input type="text" name="servicesCtaButtonText" value={settingsForm.servicesCtaButtonText} onChange={handleSettingsChange}
                      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-slate-200 text-[0.9rem]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[0.75rem] font-medium text-slate-400">CTA Description</label>
                  <textarea name="servicesCtaText" value={settingsForm.servicesCtaText} onChange={handleSettingsChange} rows="3"
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-slate-200 transition-all text-[0.9rem] resize-none leading-relaxed" />
                </div>
              </div>
            </div>

          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
