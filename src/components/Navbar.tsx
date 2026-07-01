import { useState } from 'react';
import { Stethoscope, LogIn, LogOut, Menu, X, User, Shield } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface NavbarProps {
  user: UserProfile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSignIn: () => void;
  onSignOut: () => void;
  loading: boolean;
}

export default function Navbar({
  user,
  activeTab,
  setActiveTab,
  onSignIn,
  onSignOut,
  loading
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'doctors', label: 'Doctors' }
  ];

  if (user) {
    if (user.role === UserRole.ADMIN) {
      navLinks.push({ id: 'admin', label: 'Admin Panel' });
    } else {
      navLinks.push({ id: 'dashboard', label: 'Patient Dashboard' });
    }
  }

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav id="navbar" className="sticky top-0 z-50 bg-white border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              id="nav-logo-btn"
              onClick={() => handleNavClick('home')} 
              className="flex items-center gap-2 text-emerald-700 font-bold text-xl cursor-pointer"
            >
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="font-sans tracking-tight text-emerald-900">
                Hospital<span className="text-emerald-600 font-normal">Portal</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleNavClick(link.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === link.id
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop User Panel */}
          <div className="hidden md:flex items-center space-x-3">
            {loading ? (
              <span className="text-sm text-slate-400 font-mono animate-pulse">Checking credentials...</span>
            ) : user ? (
              <div className="flex items-center space-x-3 border-l border-slate-100 pl-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
                    {user.role === UserRole.ADMIN ? (
                      <Shield className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1 max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider">
                      {user.role}
                    </p>
                  </div>
                </div>
                <button
                  id="nav-signout-btn"
                  onClick={onSignOut}
                  className="p-2 bg-slate-50 text-slate-500 rounded-lg hover:bg-rose-50 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="nav-signin-btn"
                onClick={onSignIn}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all border border-emerald-700 shadow-sm cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Patient Portal Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              id="nav-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="nav-mobile-menu" className="md:hidden border-t border-emerald-100 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              id={`nav-mobile-link-${link.id}`}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                activeTab === link.id
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100 mt-2">
            {loading ? (
              <span className="text-sm text-slate-400 font-mono animate-pulse block text-center">Checking credentials...</span>
            ) : user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    {user.role === UserRole.ADMIN ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs font-mono text-emerald-600 uppercase tracking-wider">{user.role}</p>
                  </div>
                </div>
                <button
                  id="nav-mobile-signout-btn"
                  onClick={() => {
                    onSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-100 border border-rose-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                id="nav-mobile-signin-btn"
                onClick={() => {
                  onSignIn();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full justify-center px-4 py-3 bg-emerald-600 text-white rounded-lg text-base font-medium hover:bg-emerald-700 border border-emerald-700 shadow-sm cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Patient Portal Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
