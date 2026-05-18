import { useState, useRef, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, Loader2, X, AlertCircle, CheckCircle } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { getCollectionData, addCollectionItem, deleteCollectionItem } from '../../services/firebaseService';
import { uploadImage } from '../../lib/cloudinary';
import { SkeletonGallery } from '../../components/SkeletonLoaders';
import { galleryData } from '../../data/galleryData';
import { optimizeCloudinaryUrl } from '../../utils/optimizeCloudinaryUrl';
import LazyImage from '../../components/LazyImage';

const CATEGORIES = ['Social Activities', 'Milestone', 'Meetings & Conferences', 'Public Events & Speaking'];

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const fileInputRef = useRef(null);

  // Custom Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null, url: null });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCollectionData('gallery');
        setImages(data);
      } catch (err) {
        console.error("Failed to load gallery:", err);
        showToast("Failed to load gallery data.", "error");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      const isImage = selected.type.startsWith('image/');
      const isVideo = selected.type.startsWith('video/');
      if (!isImage && !isVideo) {
        showToast("Invalid file type. Supported types: JPG, PNG, WEBP, and MP4/WEBM/OGG/MOV videos.", "error");
        return;
      }
      // Max 50MB for video, 10MB for image
      const maxLimit = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      if (selected.size > maxLimit) {
        showToast(`File size exceeds limit (${isVideo ? '50MB' : '10MB'}).`, "error");
        return;
      }

      setFile(selected);
      // Create Object URL for clean browser preview of both images and videos
      const url = URL.createObjectURL(selected);
      setPreview(url);
    }
  };

  const clearSelection = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const isVideo = file.type.startsWith('video/');
    
    try {
      // 1. Upload to Cloudinary
      const { url, publicId } = await uploadImage(file);
      
      // 2. Save metadata to Firestore
      const newImage = {
        url,
        publicId, // Store public_id for future hard deletes
        category,
        title,
        caption,
        type: isVideo ? 'video' : 'image',
        createdAt: new Date().toISOString()
      };
      
      const id = await addCollectionItem('gallery', newImage);
      
      const updated = [{ id, ...newImage }, ...images];
      setImages(updated);
      
      clearSelection();
      setTitle('');
      setCaption('');
      showToast(`${isVideo ? 'Video' : 'Image'} uploaded successfully!`);
    } catch (err) {
      console.error("Upload failed", err);
      showToast(err.message || "Failed to upload.", "error");
    } finally {
      setUploading(false);
    }
  };

  const triggerDelete = (id, url) => {
    setConfirmModal({ show: true, id, url });
  };

  const handleConfirmDelete = async () => {
    const { id } = confirmModal;
    setConfirmModal({ show: false, id: null, url: null });
    setDeletingId(id);
    
    try {
      // Delete from Firestore
      await deleteCollectionItem('gallery', id);
      
      // Update UI instantly
      const updated = images.filter(img => img.id !== id);
      setImages(updated);
      showToast("Image deleted successfully!");
    } catch (err) {
      console.error("Delete failed", err);
      showToast("Failed to delete image.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-12 relative">
      
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

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.show && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl"
            >
              <h3 className="text-lg font-medium text-slate-100 mb-2">Delete Image?</h3>
              <p className="text-sm text-slate-400 mb-6">Are you sure you want to delete this image? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmModal({ show: false, id: null, url: null })}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500/20 hover:bg-red-500/40 text-red-100 px-4 py-2 rounded-lg text-sm font-medium border border-red-500/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h2 className="font-sans font-medium text-2xl text-slate-100 tracking-tight">Gallery Assets</h2>
        <p className="text-sm text-slate-400 mt-1.5">Manage and organize visual assets for your public portfolio.</p>
      </div>

      {/* Upload Section */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden shadow-lg shadow-black/20 animate-enter">

        <div className="p-6 lg:p-8 border-b border-slate-800 bg-[#c9a84c]/5">
          <h3 className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-[0.15em]">Upload New Asset</h3>
        </div>
        
        <form onSubmit={handleUpload} className="p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* File Dropzone / Preview */}
          <div>
            {!preview ? (
              <div 
                className="border-[1.5px] border-dashed border-white/[0.1] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#c9a84c]/5 hover:border-white/[0.2] transition-all duration-300 h-[340px]"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-14 h-14 rounded-full bg-[#c9a84c]/5 flex items-center justify-center mb-5 border border-slate-800">
                  <Upload className="text-slate-400" size={22} />
                </div>
                <p className="text-[0.95rem] font-medium text-slate-100 mb-1">Select an image or video to upload</p>
                <p className="text-[0.8rem] text-slate-500">Images (up to 10MB) or Videos (up to 50MB)</p>
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  className="hidden" 
                />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden h-[340px] border border-white/[0.1] group bg-black">
                {file && file.type.startsWith('video/') ? (
                  <video src={preview} controls className="w-full h-full object-contain" />
                ) : (
                  <LazyImage src={preview} alt="Preview" className="w-full h-full opacity-90" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm pointer-events-none">
                  <button type="button" onClick={clearSelection} className="pointer-events-auto bg-red-500/20 hover:bg-red-500/40 text-red-100 p-4 rounded-full transition-colors border border-red-500/30">
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-2.5">
              <label className="block text-[0.75rem] font-medium text-slate-400">Category Allocation</label>
              <div className="relative">
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-200 transition-all text-[0.9rem] appearance-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="bg-slate-950/50">{cat}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2.5">
              <label className="block text-[0.75rem] font-medium text-slate-400">Asset Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter title..."
                className="w-full px-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-200 transition-all text-[0.9rem] placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-2.5">
              <label className="block text-[0.75rem] font-medium text-slate-400">Asset Caption</label>
              <input 
                type="text" 
                value={caption} 
                onChange={e => setCaption(e.target.value)}
                placeholder="Optional description..."
                className="w-full px-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-200 transition-all text-[0.9rem] placeholder:text-slate-600"
              />
            </div>

            <button 
              type="submit" 
              disabled={!file || uploading}
              className="w-full bg-[#c9a84c] text-slate-950 hover:bg-[#c9a84c] font-medium rounded-xl flex items-center justify-center gap-2 py-4 mt-2 transition-all duration-300 disabled:opacity-50 disabled:scale-100 active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Publish to Gallery
                </>
              )}
            </button>
          </div>
        </form>
      </div>


      {/* Asset Library */}
      <div className="animate-enter" style={{ animationDelay: '0.1s' }}>

        <h3 className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-[0.15em] mb-6">Asset Library</h3>
        
        {loading ? (
          <SkeletonGallery count={6} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {(images.length > 0 ? images : galleryData).map((img, i) => (
              <div 
                key={img.id} 
                className="bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-800 overflow-hidden group hover:border-[#c9a84c]/50 transition-all duration-300 shadow-lg shadow-black/20"
              >
                <div className="aspect-[4/3] relative bg-slate-950/50">
                  {img.type === 'video' ? (
                    <div className="w-full h-full relative">
                      <video 
                        src={optimizeCloudinaryUrl(img.url)} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
                        preload="metadata" 
                        muted 
                        playsInline
                      />
                      <div className="absolute top-2 left-2 bg-[#c9a84c] text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded tracking-wider shadow">
                        VIDEO
                      </div>
                    </div>
                  ) : (
                    <LazyImage src={optimizeCloudinaryUrl(img.url)} alt={img.caption} className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    {deletingId === img.id ? (
                      <Loader2 className="animate-spin text-red-500" size={20} />
                    ) : !img.isLocal ? (
                      <button onClick={() => triggerDelete(img.id, img.url)} className="bg-red-500/20 text-red-100 p-2.5 rounded-lg hover:bg-red-500/40 transition-colors border border-red-500/30">
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-md border border-slate-700">
                        Local Asset
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-[0.1em] truncate mb-1.5">{img.category}</p>
                  <p className="text-[0.85rem] text-[#ddd] truncate" title={img.caption}>{img.caption || 'Untitled Asset'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
