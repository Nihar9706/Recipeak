import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created! Let\'s cook! 🍳');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-28 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3 text-text">Join Recipeak</h1>
          <p className="text-text-muted text-lg">Start your goal-based nutrition journey</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-bg-card border border-border p-8 space-y-6 shadow-sm">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-text mb-2">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-xl bg-bg border border-border text-text text-base
                       placeholder:text-text-dim focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                       transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-text mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-xl bg-bg border border-border text-text text-base
                       placeholder:text-text-dim focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                       transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-text mb-2">
              Password <span className="text-text-dim font-normal">(min 6 chars)</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3.5 rounded-xl bg-bg border border-border text-text text-base
                         placeholder:text-text-dim focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                         transition-all pr-12"
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-muted transition-colors"
              >
                {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-base
                     hover:bg-primary/90 disabled:opacity-50 transition-all duration-200
                     flex items-center justify-center gap-2 hover:shadow-[0_4px_16px_rgba(91,163,217,0.3)]"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            Create Account
          </button>

          <p className="text-center text-base text-text-muted pt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
