import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Loader2, CheckCircle2, AlertCircle, Monitor, Moon } from 'lucide-react';

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 8) {
      setStatus({ type: 'error', message: 'Password must be at least 8 characters long.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    // Mock API Call
    setTimeout(() => {
      setLoading(false);
      if (currentPassword === 'Alice123@') {
        setStatus({ type: 'success', message: 'Password has been successfully updated.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setStatus(null), 4000);
      } else {
        setStatus({ type: 'error', message: 'Current password is incorrect.' });
      }
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl space-y-10"
    >
      <div>
        <h2 className="font-sans font-semibold text-2xl text-slate-100 tracking-tight">System Settings</h2>
        <p className="text-sm text-slate-400 mt-1.5">Manage your security preferences and application theme.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Security / Password Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-800/50 pb-5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                <Shield size={18} className="text-[#c9a84c]" />
              </div>
              <div>
                <h3 className="font-medium text-slate-100 text-[1rem]">Security & Password</h3>
                <p className="text-[0.8rem] text-slate-400 mt-0.5">Update your authentication credentials.</p>
              </div>
            </div>

            <AnimatePresence>
              {status && (
                <motion.div initial={{ opacity: 0, height: 0, scale: 0.95 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0 }} className="mb-6">
                  <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${
                    status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {status.message}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-[0.75rem] font-medium text-slate-400">Current Password</label>
                <div className="relative group">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-100 transition-all text-[0.9rem]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-2">
                  <label className="block text-[0.75rem] font-medium text-slate-400">New Password</label>
                  <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-100 transition-all text-[0.9rem]" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[0.75rem] font-medium text-slate-400">Confirm New Password</label>
                  <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-100 transition-all text-[0.9rem]" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setStatus(null); }} className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">
                  Clear
                </button>
                <button type="submit" disabled={loading || !currentPassword || !newPassword || !confirmPassword} className="bg-[#c9a84c] text-slate-950 hover:bg-[#dfc26b] py-2.5 px-6 rounded-lg flex items-center gap-2 text-[0.85rem] font-semibold transition-all disabled:opacity-50 disabled:active:scale-100 active:scale-[0.98]">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preferences / Theme */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 shadow-sm">
            <h3 className="font-medium text-slate-100 text-[1rem] mb-6">Appearance</h3>
            
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 rounded-xl border border-[#c9a84c]/30 bg-[#c9a84c]/5 text-slate-200 transition-all">
                <div className="flex items-center gap-3">
                  <Moon size={18} className="text-[#c9a84c]" />
                  <span className="text-sm font-medium">Deep Slate Theme</span>
                </div>
                <div className="w-4 h-4 rounded-full border-4 border-[#c9a84c]"></div>
              </button>

              <button disabled className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/50 text-slate-500 opacity-50 cursor-not-allowed transition-all">
                <div className="flex items-center gap-3">
                  <Monitor size={18} />
                  <span className="text-sm font-medium">System Default</span>
                </div>
                <span className="text-[0.65rem] font-bold tracking-wider uppercase border border-slate-700 px-2 py-0.5 rounded">Soon</span>
              </button>
            </div>
            
            <p className="text-xs text-slate-500 mt-6 leading-relaxed">
              Theme settings are currently locked to Deep Slate to maintain premium brand identity.
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
