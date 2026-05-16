import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const { resetPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await resetPassword(email);
      setStatus({ type: 'success', message: 'Password reset instructions have been sent to your email.' });
      setEmail('');
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: err.message || 'Failed to send password reset email.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 relative overflow-hidden font-body selection:bg-[#c9a84c]/20">
      
      {/* Subtle Blue-Gray Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-slate-800/20 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative">
          
          <div className="mb-10 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center mb-6">
              <Mail size={20} className="text-[#c9a84c]" />
            </div>
            <h1 className="font-sans font-semibold text-slate-100 text-2xl tracking-tight mb-2">Reset Password</h1>
            <p className="text-slate-400 text-sm">Enter your email and we'll send you a recovery link.</p>
          </div>

          <AnimatePresence mode="wait">
            {status ? (
              <motion.div 
                key="status"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-6 rounded-xl mb-8 flex flex-col items-center text-center gap-3 border ${
                  status.type === 'success' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 size={32} className="text-green-400 mb-2" />
                ) : (
                  <AlertCircle size={32} className="text-red-400 mb-2" />
                )}
                <p className={`text-sm leading-relaxed ${status.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                  {status.message}
                </p>
                {status.type === 'error' && (
                  <button onClick={() => setStatus(null)} className="text-xs font-medium text-slate-400 hover:text-slate-200 underline mt-2">
                    Try again
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="block text-[0.75rem] font-medium text-slate-300">Email address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#c9a84c] transition-colors duration-300" size={18} />
                    <input
                      type="email"
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-100 transition-all duration-300 placeholder:text-slate-600 text-[0.95rem]"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#c9a84c] text-slate-950 hover:bg-[#dfc26b] font-semibold rounded-xl flex items-center justify-center gap-2 py-3.5 mt-2 transition-all duration-300 disabled:opacity-50 disabled:scale-[0.99] active:scale-[0.98] shadow-lg shadow-[#c9a84c]/10"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                      <span>Sending Link...</span>
                    </div>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <Link to="/admin/login" className="inline-flex items-center gap-2 text-[0.8rem] text-slate-400 hover:text-slate-200 transition-colors font-medium">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
