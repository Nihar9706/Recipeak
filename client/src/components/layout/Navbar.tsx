import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User, LogOut, BookmarkCheck, ChefHat, Sparkles } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/categories', label: 'Categories', icon: <ChefHat size={16} /> },
    { to: '/recipes', label: 'Recipes', icon: <Search size={16} /> },
    { to: '/ai-search', label: 'AI Assistant', icon: <Sparkles size={16} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center
                          group-hover:shadow-[0_0_16px_rgba(91,163,217,0.3)] transition-all duration-300">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="font-display text-2xl tracking-wide text-text font-bold">
              Recipeak
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                         text-text-muted hover:text-primary hover:bg-accent-blue/20 transition-all duration-200"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border
                           hover:border-primary/50 hover:bg-accent-blue/10 transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                    <User size={14} className="text-primary" />
                  </div>
                  <span className="hidden sm:block text-sm text-text-muted font-medium">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-52 py-2 rounded-xl bg-bg-card border border-border shadow-xl"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-muted
                                 hover:text-primary hover:bg-accent-blue/10 transition-colors"
                      >
                        <User size={15} />
                        Profile
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-muted
                                 hover:text-primary hover:bg-accent-blue/10 transition-colors"
                      >
                        <BookmarkCheck size={15} />
                        Saved Recipes
                      </Link>
                      <hr className="my-1 border-border" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-accent-red
                                 hover:bg-accent-red/5 transition-colors w-full text-left"
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-medium text-text-muted hover:text-primary transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold
                           hover:bg-primary/90 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(91,163,217,0.3)]"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-black/5 transition-colors text-text-muted"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border overflow-hidden bg-bg-card"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted text-base
                           hover:text-primary hover:bg-accent-blue/10 transition-colors"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              {!user && (
                <div className="pt-3 flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-center rounded-xl border border-border text-sm font-medium
                             hover:border-primary/50 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-center rounded-xl bg-primary text-white text-sm font-semibold"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
