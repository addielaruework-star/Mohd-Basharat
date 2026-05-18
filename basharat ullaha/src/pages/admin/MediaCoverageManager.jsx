import { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
  Newspaper, Plus, Trash2, Edit2, Loader2, Save, X,
  CheckCircle, AlertCircle, Upload, Play, Link as LinkIcon, Image as ImageIcon
} from 'lucide-react';
import { getCollectionData, addCollectionItem, deleteCollectionItem, updateCollectionItem } from '../../services/firebaseService';
import { uploadImage } from '../../lib/cloudinary';
import LazyImage from '../../components/LazyImage';
import { optimizeCloudinaryUrl } from '../../utils/optimizeCloudinaryUrl';

// ─── Matches the public page categories exactly ───────────────────────────────
const CATEGORIES = [
  'Newspapers',
  'Press Coverage',
  'Interviews',
  'Conferences',
  'Public Speaking',
]

const BLANK_FORM = {
  title: '',
  description: '',
  date: '',
  category: CATEGORIES[0],
  image: '',
  videoUrl: '',
}

// ─── YouTube thumbnail helper ─────────────────────────────────────────────────
function getYouTubeThumbnail(url) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/)
  return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : null
}

export default function MediaCoverageManager() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(BLANK_FORM)

  // Image upload state
  const [imageFile, setImageFile]     = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading]     = useState(false)
  const fileInputRef = useRef(null)

  const [saving, setSaving]   = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [toast, setToast]     = useState({ show: false, message: '', type: 'success' })
  const [confirmId, setConfirmId] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await getCollectionData('mediaCoverage')
        // Sort newest first by createdAt
        data.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
        setItems(data)
      } catch (err) {
        console.error('Failed to load mediaCoverage:', err)
        showToast('Failed to load media coverage data.', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500)
  }

  // ─── Editor open / close ──────────────────────────────────────────
  const openEditor = (item = null) => {
    if (item) {
      setFormData({
        title:       item.title       || '',
        description: item.description || '',
        date:        item.date        || '',
        category:    item.category    || CATEGORIES[0],
        image:       item.image       || '',
        videoUrl:    item.videoUrl    || '',
      })
      setImagePreview(item.image || '')
      setEditingId(item.id)
    } else {
      setFormData({ ...BLANK_FORM })
      setImagePreview('')
      setEditingId(null)
    }
    setImageFile(null)
    setIsEditing(true)
  }

  const closeEditor = () => {
    setIsEditing(false)
    setEditingId(null)
    setImageFile(null)
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
    setImagePreview('')
  }

  // ─── Image file selection ─────────────────────────────────────────
  const handleFileSelect = (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (!f.type.startsWith('image/')) { showToast('Please select an image file.', 'error'); return }
    if (f.size > 10 * 1024 * 1024) { showToast('Image must be under 10MB.', 'error'); return }
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
    setImageFile(f)
    setImagePreview(URL.createObjectURL(f))
  }

  // ─── Save ─────────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.title) return

    setSaving(true)
    try {
      let imageUrl = formData.image

      // Upload new image if selected
      if (imageFile) {
        setUploading(true)
        const { url } = await uploadImage(imageFile)
        imageUrl = url
        setUploading(false)
      }

      const payload = { ...formData, image: imageUrl }

      if (editingId) {
        await updateCollectionItem('mediaCoverage', editingId, payload)
        setItems(prev => prev.map(i => i.id === editingId ? { ...i, ...payload } : i))
        showToast('Record updated successfully.')
      } else {
        const id = await addCollectionItem('mediaCoverage', payload)
        setItems(prev => [{ id, ...payload, createdAt: new Date().toISOString() }, ...prev])
        showToast('Record created successfully.')
      }
      closeEditor()
    } catch (err) {
      console.error('Save failed:', err)
      showToast(err.message || 'Failed to save changes.', 'error')
      setUploading(false)
    } finally {
      setSaving(false)
    }
  }

  // ─── Delete ───────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setConfirmId(null)
    setDeletingId(id)
    try {
      await deleteCollectionItem('mediaCoverage', id)
      setItems(prev => prev.filter(i => i.id !== id))
      showToast('Record deleted.')
    } catch (err) {
      console.error('Delete failed:', err)
      showToast('Failed to delete record.', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-enter">

      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <m.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
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

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {confirmId && (
          <m.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <m.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl"
            >
              <h3 className="text-lg font-medium text-slate-100 mb-2">Delete this record?</h3>
              <p className="text-sm text-slate-400 mb-6">This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setConfirmId(null)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">Cancel</button>
                <button onClick={() => handleDelete(confirmId)} className="bg-red-500/20 hover:bg-red-500/40 text-red-100 px-4 py-2 rounded-lg text-sm font-medium border border-red-500/30 transition-colors">Delete</button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="font-sans font-medium text-2xl text-slate-100 tracking-tight">Media Coverage</h2>
          <p className="text-sm text-slate-400 mt-1.5">Manage press coverage, newspaper publications, interviews, and conference highlights.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => openEditor()}
            className="bg-[#c9a84c] text-slate-950 hover:bg-[#dfc26b] py-2.5 px-6 rounded-lg flex items-center gap-2 text-[0.85rem] font-medium transition-all shadow-lg shadow-[#c9a84c]/10"
          >
            <Plus size={16} /> New Entry
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          /* ─── Editor Form ─────────────────────────────────────────── */
          <m.div
            key="editor"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-black/20"
          >
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#c9a84c]/5">
              <h3 className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-[0.15em]">
                {editingId ? 'Edit Media Entry' : 'Create New Media Entry'}
              </h3>
              <button onClick={closeEditor} className="text-slate-500 hover:text-slate-200 transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 lg:p-8 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-[0.75rem] font-medium text-slate-400">Title *</label>
                <input
                  type="text" required value={formData.title}
                  onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Feature in The Hindu, Interview on NDTV..."
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-slate-100 transition-all text-[0.9rem] placeholder:text-slate-600"
                />
              </div>

              {/* Category + Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[0.75rem] font-medium text-slate-400">Category</label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-slate-100 transition-all text-[0.9rem] appearance-none"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-950">{c}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <svg width="12" height="12" fill="none"><path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[0.75rem] font-medium text-slate-400">Date</label>
                  <input
                    type="text" value={formData.date}
                    onChange={e => setFormData(f => ({ ...f, date: e.target.value }))}
                    placeholder="e.g. Jan 2024, 15 March 2023..."
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-slate-100 transition-all text-[0.9rem] placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-[0.75rem] font-medium text-slate-400">Description</label>
                <textarea
                  rows="3" value={formData.description}
                  onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief summary of the coverage..."
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-slate-100 transition-all text-[0.9rem] resize-none placeholder:text-slate-600"
                />
              </div>

              {/* Featured Image */}
              <div className="space-y-2">
                <label className="block text-[0.75rem] font-medium text-slate-400">Featured Image</label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />

                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-800 h-48 group bg-black">
                    <LazyImage src={imagePreview.startsWith('blob:') ? imagePreview : optimizeCloudinaryUrl(imagePreview)} alt="Preview" className="w-full h-full opacity-90" />
                    <button
                      type="button"
                      onClick={() => { if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview); setImageFile(null); setImagePreview(''); setFormData(f => ({ ...f, image: '' })); if (fileInputRef.current) fileInputRef.current.value = '' }}
                      className="absolute top-2 right-2 bg-red-500/30 hover:bg-red-500/60 text-red-100 p-1.5 rounded-lg transition-colors border border-red-500/30"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-[1.5px] border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#c9a84c]/5 hover:border-white/20 transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#c9a84c]/5 flex items-center justify-center border border-slate-800">
                      <ImageIcon className="text-slate-400" size={20} />
                    </div>
                    <p className="text-[0.85rem] font-medium text-slate-300">Click to upload featured image</p>
                    <p className="text-[0.75rem] text-slate-500">JPG, PNG, WebP — up to 10MB</p>
                  </div>
                )}
              </div>

              {/* YouTube URL */}
              <div className="space-y-2">
                <label className="block text-[0.75rem] font-medium text-slate-400 flex items-center gap-2">
                  <Play size={12} className="text-red-400" /> YouTube / Video Link <span className="text-slate-600">(optional)</span>
                </label>
                <div className="relative">
                  <LinkIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="url" value={formData.videoUrl}
                    onChange={e => setFormData(f => ({ ...f, videoUrl: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 text-slate-100 transition-all text-[0.9rem] placeholder:text-slate-600"
                  />
                </div>
                {formData.videoUrl && getYouTubeThumbnail(formData.videoUrl) && (
                  <div className="flex items-center gap-3 mt-2 p-3 bg-slate-800/40 rounded-lg border border-slate-700/50">
                    <img src={getYouTubeThumbnail(formData.videoUrl)} alt="YT thumb" className="w-20 rounded object-cover" />
                    <span className="text-[0.78rem] text-green-400 font-medium">✓ Valid YouTube link detected</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50">
                <button type="button" onClick={closeEditor} className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">Cancel</button>
                <button
                  type="submit" disabled={saving || uploading}
                  className="bg-[#c9a84c] text-slate-950 hover:bg-[#dfc26b] py-2.5 px-6 rounded-lg flex items-center gap-2 text-[0.85rem] font-medium transition-all disabled:opacity-50"
                >
                  {(saving || uploading) ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {uploading ? 'Uploading image...' : saving ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </m.div>
        ) : (
          /* ─── Items List ──────────────────────────────────────────── */
          <div key="list">
            {loading ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-slate-600" size={24} /></div>
            ) : items.length === 0 ? (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-24 text-center flex flex-col items-center justify-center shadow-lg shadow-black/20">
                <div className="w-16 h-16 bg-[#c9a84c]/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800/50">
                  <Newspaper className="text-slate-500" size={24} />
                </div>
                <h3 className="font-medium text-slate-100 mb-2 text-[0.95rem]">No Media Coverage Found</h3>
                <p className="text-slate-500 text-[0.85rem] max-w-sm mx-auto leading-relaxed">Click "New Entry" to add your first media coverage item.</p>
              </div>
            ) : (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
                <ul className="divide-y divide-slate-800/50">
                  {items.map(item => (
                    <li key={item.id} className="p-5 hover:bg-slate-800/20 transition-colors group">
                      <div className="flex items-center gap-5">
                        {/* Thumbnail */}
                        <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-800 relative">
                          {(item.image || getYouTubeThumbnail(item.videoUrl)) ? (
                            <LazyImage
                              src={item.image ? optimizeCloudinaryUrl(item.image) : getYouTubeThumbnail(item.videoUrl)}
                              alt={item.title}
                              className="w-full h-full"
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Newspaper size={18} className="text-slate-600" />
                            </div>
                          )}
                          {item.videoUrl && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Play size={12} fill="#c9a84c" className="text-[#c9a84c]" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-[0.62rem] font-bold text-[#c9a84c] bg-[#c9a84c]/10 px-2 py-0.5 rounded uppercase tracking-wider">{item.category}</span>
                            {item.date && <span className="text-[0.68rem] text-slate-500">{item.date}</span>}
                            {item.videoUrl && <span className="text-[0.62rem] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded uppercase tracking-wider">Video</span>}
                          </div>
                          <h4 className="text-[0.95rem] font-medium text-slate-100 truncate">{item.title}</h4>
                          {item.description && (
                            <p className="text-[0.8rem] text-slate-500 truncate mt-0.5">{item.description}</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button onClick={() => openEditor(item)} className="p-2 text-slate-500 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-lg transition-all">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => setConfirmId(item.id)} disabled={deletingId === item.id} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                            {deletingId === item.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
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
  )
}
