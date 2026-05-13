import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiShieldCheckFill, RiLogoutBoxRLine, RiDashboardFill, RiMoonFill, 
  RiSunFill, RiUser3Line, RiUserStarFill, RiMenu3Line, RiCloseLine 
} from 'react-icons/ri';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'About', type: 'scroll', target: 'about' },
    { title: 'Verify Certificate', type: 'scroll', target: 'verify-section' },
    ...(user ? [{ title: 'Dashboard' }] : [])
  ];

  const handleNavClick = (link) => {
    setMobileMenuOpen(false);
    if (link.title === 'Dashboard') {
      navigate(user.role === 'admin' ? '/admin/certificates' : '/student/dashboard');
    } else if (link.type === 'scroll') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(link.target);
        if (element) {
          const yOffset = -80; // Account for sticky navbar
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(link.path);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 h-16 md:h-20 flex items-center shadow-sm transition-all duration-300">
      <div className="w-full px-10 flex justify-between items-center max-w-full mx-auto">
        
        {/* Left Side: Brand Logo */}
        <Link to="/" className="flex items-center gap-3 md:gap-4 group shrink-0 active:scale-95 transition-transform">
          <motion.div 
            whileHover={{ rotate: 12, scale: 1.1 }} 
            className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 md:p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20"
          >
            <RiShieldCheckFill className="text-white text-2xl md:text-3xl" />
          </motion.div>
          <span className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-400 dark:from-teal-400 dark:to-emerald-200 tracking-tighter">
            Certi<span className="text-slate-800 dark:text-white">Verify</span>
          </span>
        </Link>

        {/* Right Side: Navigation & Actions */}
        <div className="flex items-center gap-4 md:gap-10">
          
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 border-r border-slate-200 dark:border-white/10 pr-10 mr-2">
            {navLinks.map((link) => (
              <button
                key={link.title}
                onClick={() => handleNavClick(link)}
                className="text-[16px] font-bold text-slate-600 dark:text-neutral-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all relative group"
              >
                {link.title}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* User & Accessibility Actions */}
          <div className="flex items-center gap-3 md:gap-5">
            <button 
              onClick={toggleTheme} 
              title="Toggle Theme"
              className="p-2.5 text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-white transition-all bg-slate-50 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10 hover:shadow-md"
            >
              {theme === 'dark' ? <RiSunFill size={22} /> : <RiMoonFill size={22} />}
            </button>

            {!user ? (
              <Link 
                to="/login" 
                className="px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base font-black text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 rounded-2xl transition-all shadow-xl shadow-emerald-500/25 active:scale-95 whitespace-nowrap"
              >
                Sign In
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-11 h-11 rounded-full border-2 border-emerald-500/30 overflow-hidden hover:border-emerald-500 transition-all shadow-inner"
                >
                  {user.profilePic ? (
                    <img src={user.profilePic} alt="P" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-lg">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.95 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }} 
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-60 glass-card py-2 shadow-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-xl rounded-2xl overflow-hidden z-[60]"
                    >
                      <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 mb-1 bg-slate-50/50 dark:bg-white/[0.02]">
                        <p className="text-sm font-black text-slate-800 dark:text-white truncate">{user.name}</p>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-neutral-400 truncate mt-0.5">{user.email}</p>
                      </div>
                      
                      <Link to={user.role === 'admin' ? '/admin/certificates' : '/student/dashboard'} className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-slate-700 dark:text-neutral-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors">
                        <RiDashboardFill size={18} /> Dashboard
                      </Link>
                      <Link to="/profile" className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-slate-700 dark:text-neutral-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors">
                        <RiUser3Line size={18} /> Profile
                      </Link>
                      <div className="h-px bg-slate-100 dark:bg-white/5 mx-2 my-1" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 text-sm font-black text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                        <RiLogoutBoxRLine size={18} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Hamburger Burger Menu - Visible on md and down */}
            <button 
              className="lg:hidden p-2 text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <RiCloseLine size={32} /> : <RiMenu3Line size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[51] lg:hidden"
            />
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[80%] max-w-sm bg-white dark:bg-[#0a0a0a] z-[52] lg:hidden shadow-2xl p-8 pt-24"
            >
              <div className="flex flex-col gap-8">
                {navLinks.map((link) => (
                  <button
                    key={link.title}
                    onClick={() => handleNavClick(link)}
                    className="text-3xl font-black text-left text-slate-800 dark:text-white active:text-emerald-500"
                  >
                    {link.title}
                  </button>
                ))}
                
                <div className="h-px bg-slate-100 dark:bg-white/5 my-4" />
                
                {!user ? (
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl text-center text-2xl font-black shadow-2xl shadow-emerald-600/30"
                  >
                    Sign In
                  </Link>
                ) : (
                  <div className="flex flex-col gap-4">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Account</p>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black dark:text-white">My Profile</Link>
                    <button onClick={handleLogout} className="text-2xl font-black text-red-600 text-left">Logout</button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
