import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Login error:", err);
      // Show the specific Firebase error message or code
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
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
              <Lock size={20} className="text-[#c9a84c]" />
            </div>
            <h1 className="font-sans font-semibold text-slate-100 text-2xl tracking-tight mb-2">Welcome Back</h1>
            <p className="text-slate-400 text-sm">Please enter your details to sign in.</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 flex items-start gap-3 text-sm"
              >
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="space-y-2">
              <label className="block text-[0.75rem] font-medium text-slate-300">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#c9a84c] transition-colors duration-300" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:bg-slate-900 text-slate-100 transition-all duration-300 placeholder:text-slate-600 text-[0.95rem] tracking-wide"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-[#c9a84c] border-[#c9a84c]' : 'border-slate-600 group-hover:border-slate-400'}`}>
                  {rememberMe && <Check size={12} className="text-slate-900" strokeWidth={3} />}
                </div>
                <span className="text-[0.8rem] text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
                <input type="checkbox" className="hidden" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
              </label>
              <Link to="/admin/forgot-password" className="text-[0.8rem] text-[#c9a84c] hover:text-[#dfc26b] transition-colors font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a84c] text-slate-950 hover:bg-[#dfc26b] font-semibold rounded-xl flex items-center justify-center gap-2 py-3.5 mt-2 transition-all duration-300 disabled:opacity-50 disabled:scale-[0.99] active:scale-[0.98] shadow-lg shadow-[#c9a84c]/10"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-slate-500 text-[0.75rem]">Protected Area • Authorized Personnel Only</p>
        </div>
      </motion.div>
    </div>
  );
}
