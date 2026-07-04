import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-20 bg-accent-warm/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="font-display text-2xl tracking-wide font-bold">Recipeak</span>
            </Link>
            <p className="text-text-muted text-base leading-relaxed max-w-sm">
              Eat with purpose. Fuel your goals. Discover recipes tailored to your fitness journey
              and sport performance needs.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-text mb-5">
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/categories', label: 'Categories' },
                { to: '/recipes', label: 'All Recipes' },

              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-base text-text-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-text mb-5">
              Connect
            </h4>
            <div className="flex gap-3">
              <a
                href="https://github.com/Nihar9706"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center
                         hover:border-primary hover:text-primary hover:bg-accent-blue/10 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center
                         hover:border-primary hover:text-primary hover:bg-accent-blue/10 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-dim">
            © {new Date().getFullYear()} Recipeak. All rights reserved.
          </p>
          <p className="text-sm text-text-dim flex items-center gap-1">
            Made by Nihar
          </p>
        </div>
      </div>
    </footer>
  );
}
