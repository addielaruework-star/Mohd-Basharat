import { useState, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon, Upload, X, Loader2, CheckCircle,
  AlertCircle, RotateCcw, Globe
} from 'lucide-react';
import { uploadImage } from '../../lib/cloudinary';
import { saveSiteAssets, DEFAULT_ASSETS } from '../../context/SiteAssetsContext';
import { useSiteAssets } from '../../context/SiteAssetsContext';
import { optimizeCloudinaryUrl } from '../../utils/optimizeCloudinaryUrl';
import LazyImage from '../../components/LazyImage';

/* ── Asset slot definitions ───────────────────────────────────────────── */
const ASSET_SLOTS = [
  { key: 'heroImage',          label: 'Hero Background (Desktop)', desc: 'Main homepage hero image — shown on desktop' },
  { key: 'mobileHeroImage',    label: 'Hero Image (Mobile)',        desc: 'Profile photo shown in mobile hero section' },
  { key: 'profileImage',       label: 'Profile Photo',              desc: 'Bio/About page profile portrait' },
  { key: 'biographyImage',     label: 'Biography Image',            desc: 'Secondary image beside bio text on About page' },
  { key: 'aboutBanner',        label: 'About Banner',               desc: 'Full-width banner at bottom of About page' },
  { key: 'awardsBanner',       label: 'Awards Banner',              desc: 'Full-width banner on Awards page' },
  { key: 'servicesBanner',     label: 'Services Banner',            desc: 'Full-width banner on Social Services page' },
  { key: 'galleryBanner',      label: 'Gallery Banner',             desc: 'Bottom banner on Homepage gallery section' },
  { key: 'contactBanner',      label: 'Contact Banner',             desc: 'Visual image on Contact page' },
];

/* ── Toast ────────────────────────────────────────────────────────────── */
function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast.show && (
        <m.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-xl backdrop-blur-xl ${
            toast.type === 'success'
              ? 'bg-green-900/20 border-green-500/30 text-green-100'
              : 'bg-red-900/20 border-red-500/30 text-red-100'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={17} /> : <AlertCircle size={17} />}
          <span className="text-[0.88rem] font-medium">{toast.message}</span>
        </m.div>
      )}
    </AnimatePresence>
  );
}

/* ── Single Asset Card ────────────────────────────────────────────────── */
function AssetCard({ slotKey, label, desc, currentUrl, onSave, onRemove }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      await onSave(slotKey, url);
    } catch (err) {
      throw err; // bubble up to parent toast
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onFileInput = async (e) => {
    try { await handleFile(e.target.files[0]); }
    catch (err) { onSave(null, null, err.message); }
  };

  const onDrop = async (e) => {
    e.preventDefault(); setDragOver(false);
    try { await handleFile(e.dataTransfer.files[0]); }
    catch (err) { onSave(null, null, err.message); }
  };

  return (
    <div
      className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden hover:border-[#c9a84c]/30 transition-all duration-300 shadow-lg shadow-black/20"
    >
      {/* Image Preview */}
      <div
        className={`relative aspect-video bg-slate-950/60 border-b border-slate-800/60 cursor-pointer group overflow-hidden ${dragOver ? 'border-[#c9a84c]/50 bg-[#c9a84c]/5' : ''}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        {currentUrl ? (
          <>
            <LazyImage
              src={optimizeCloudinaryUrl(currentUrl)}
              alt={label}
              className="w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
              <div className="bg-[#c9a84c]/20 text-[#c9a84c] px-3 py-2 rounded-lg text-xs font-semibold border border-[#c9a84c]/30 flex items-center gap-1.5">
                <Upload size={13} /> Replace
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-600">
            <div className={`w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center transition-colors ${dragOver ? 'border-[#c9a84c]/50 text-[#c9a84c]' : 'border-slate-700'}`}>
              <Upload size={20} />
            </div>
            <p className="text-xs text-slate-500 text-center px-4">
              {dragOver ? 'Drop to upload' : 'Click or drag & drop to upload'}
            </p>
          </div>
        )}

        {/* Uploading spinner overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-[#c9a84c]" size={28} />
            <p className="text-xs text-slate-300 font-medium">Compressing & uploading…</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={onFileInput}
          className="hidden"
        />
      </div>

      {/* Card Footer */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[0.85rem] font-semibold text-slate-100 truncate">{label}</p>
          <p className="text-[0.72rem] text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
          {currentUrl && (
            <p className="text-[0.65rem] text-[#c9a84c]/60 mt-1 flex items-center gap-1">
              <Globe size={9} /> Cloudinary
            </p>
          )}
        </div>
        {currentUrl && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(slotKey); }}
            className="shrink-0 p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Remove image"
          >
            <X size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────────────────── */
export default function SiteAssetsManager() {
  const { assets } = useSiteAssets();
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  const handleSave = async (key, url, errMsg) => {
    if (errMsg) { showToast(errMsg, 'error'); return; }
    try {
      await saveSiteAssets({ [key]: url });
      showToast(`${ASSET_SLOTS.find(s => s.key === key)?.label} updated!`);
    } catch (err) {
      showToast(err.message || 'Failed to save.', 'error');
    }
  };

  const handleRemove = async (key) => {
    try {
      await saveSiteAssets({ [key]: '' });
      showToast(`Image removed. Fallback image will be used.`);
    } catch (err) {
      showToast('Failed to remove image.', 'error');
    }
  };

  const handleResetAll = async () => {
    if (!window.confirm('Reset ALL site assets to defaults? This will clear all custom uploads.')) return;
    try {
      await saveSiteAssets(Object.fromEntries(Object.keys(DEFAULT_ASSETS).map(k => [k, ''])));
      showToast('All assets reset to local defaults.');
    } catch (err) {
      showToast('Failed to reset.', 'error');
    }
  };

  return (
    <div className="space-y-10 relative pb-12">
      <Toast toast={toast} />

      {/* Header */}
      <div className="animate-enter">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          <div>
            <h2 className="font-sans font-medium text-2xl text-slate-100 tracking-tight">Site Assets</h2>
            <p className="text-sm text-slate-400 mt-1.5 max-w-lg">
              Upload and manage all major website images. Uploaded images override local defaults instantly across the live site.
            </p>
          </div>
          <button
            onClick={handleResetAll}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-200 border border-slate-800 hover:border-slate-600 bg-slate-900/50 hover:bg-slate-800 transition-all"
          >
            <RotateCcw size={13} /> Reset All to Defaults
          </button>
        </div>
      </div>


      {/* Info Banner */}
      <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-xl px-5 py-4 flex items-start gap-3">
        <ImageIcon size={16} className="text-[#c9a84c] mt-0.5 shrink-0" />
        <p className="text-[0.82rem] text-slate-300 leading-relaxed">
          <span className="font-semibold text-[#c9a84c]">How it works:</span> Upload an image to any slot. It is immediately compressed, stored on Cloudinary, and its URL saved to Firestore. The live site updates in real-time. If a slot is empty, the local fallback image is used automatically.
        </p>
      </div>

      {/* Asset Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-enter"
        style={{ animationDelay: '0.15s' }}
      >
        {ASSET_SLOTS.map((slot) => (
          <AssetCard
            key={slot.key}
            slotKey={slot.key}
            label={slot.label}
            desc={slot.desc}
            currentUrl={assets[slot.key] || ''}
            onSave={handleSave}
            onRemove={handleRemove}
          />
        ))}
      </div>

    </div>
  );
}
