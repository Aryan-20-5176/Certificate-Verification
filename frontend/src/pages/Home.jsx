import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiSearchLine, RiShieldCheckFill, RiUploadCloud2Line, RiFileSettingsLine, RiSearch2Line, RiDownload2Line, RiLockPasswordLine, RiBarChartFill } from 'react-icons/ri';
import toast from 'react-hot-toast';

const Home = () => {
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) {
      toast.error('Please enter a valid Certificate ID');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      navigate(`/certificate/${searchId}`);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section id="verify-section" className="flex-center page-wrapper relative overflow-hidden pt-24 pb-16 min-h-[90vh]">
        {/* Intensified Teal Radial Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1400px] h-[900px] pointer-events-none -z-10 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.45)_0%,rgba(16,185,129,0.2)_40%,transparent_80%)] blur-[120px] animate-pulse opacity-80" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[600px] pointer-events-none -z-10 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.3)_0%,transparent_70%)] blur-[80px]" />
        
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl text-center px-4"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto w-24 h-24 mb-8 relative"
          >
            <div className="absolute inset-0 bg-teal-500/20 rounded-2xl blur-xl animate-pulse" />
            <div className="relative h-full w-full bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-xl">
              <RiShieldCheckFill className="text-teal-500 dark:text-teal-400 text-6xl drop-shadow-[0_0_15px_rgba(20,184,166,0.3)]" />
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-tight">
            Certi<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500 dark:from-teal-400 dark:to-emerald-300">Verify</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-neutral-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            A secure platform for issuing and verifying internship certificates instantly using <span className="text-teal-600 dark:text-teal-400 font-bold border-b-2 border-teal-500/30">Certificate ID authentication</span>.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group mb-12">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition duration-500" />
            <div className="relative flex items-center bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
              <div className="pl-6 text-slate-400">
                <RiSearchLine size={28} className="group-hover:text-teal-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. CV-2026-X01)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full bg-transparent border-none text-slate-800 dark:text-white px-6 py-6 text-xl focus:outline-none placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-0"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white px-10 py-6 text-xl font-bold transition-all active:scale-95 disabled:opacity-50 shadow-inner group-hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]"
              >
                {loading ? (
                  <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Verify'
                )}
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500 dark:text-neutral-500 font-semibold mt-16 scale-110">
            <div className="flex items-center gap-3"><RiLockPasswordLine className="text-teal-500 text-xl" /> Secure Connection</div>
            <div className="flex items-center gap-3 relative"><div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" /><RiBarChartFill className="text-emerald-500 text-xl" /> Instant Result</div>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-slate-50 dark:bg-[#050505] transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">How It Works</h2>
            <div className="w-24 h-1.5 bg-teal-500 mx-auto rounded-full" />
            <p className="text-slate-500 dark:text-neutral-400 max-w-2xl mx-auto text-lg pt-4">
              Our automated system ensures a seamless experience for both organizations and students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Upload Data', text: 'Upload student details securely via Excel files.', icon: <RiUploadCloud2Line /> },
              { step: '02', title: 'Auto Generate', text: 'Systems automatically process and generate certificates.', icon: <RiFileSettingsLine /> },
              { step: '03', title: 'Search ID', text: 'Students search using their unique Certificate ID.', icon: <RiSearch2Line /> },
              { step: '04', title: 'Instant Download', text: 'Verified students download their PDF instantly.', icon: <RiDownload2Line /> },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-[#0a0a0a] p-10 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl hover:shadow-2xl hover:border-teal-500/30 transition-all group"
              >
                <div className="text-6xl text-teal-500/20 dark:text-teal-400/10 font-black mb-6 flex justify-between items-start">
                  {item.step}
                  <div className="text-teal-600 dark:text-teal-400 p-4 bg-slate-50 dark:bg-neutral-900 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-slate-500 dark:text-neutral-400 leading-relaxed font-medium">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 relative overflow-hidden dark:bg-[#080808]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 md:p-20 text-center relative z-10 overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-teal-500/50 rounded-full" />
            <RiShieldCheckFill className="text-7xl text-teal-500 mx-auto mb-10 opacity-80" />
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-8">About the Platform</h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-neutral-300 leading-relaxed max-w-4xl mx-auto font-medium">
              CertiVerify helps organizations securely generate, manage, and verify internship certificates. 
              It prevents certificate forgery and enables <span className="text-teal-600 dark:text-teal-400 font-bold">instant verification</span> through unique certificate IDs. 
              Built with security first, we ensure that every credential is cryptographically tied to its recipient.
            </p>
          </motion.div>
        </div>
        
        {/* Background Decorations */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-500/10 blur-[100px] rounded-full" />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full" />
      </section>

      {/* Footer (Quick placeholder) */}
      <footer className="py-12 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#050505] text-center px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 dark:text-neutral-500 font-bold tracking-widest text-xs uppercase">
            © {new Date().getFullYear()} CertiVerify Platform • Secure Digital Records
          </p>
          <div className="flex gap-8 text-xs font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest">
            <Link to="/legal#privacy" className="hover:text-teal-500 transition-colors">Privacy Policy</Link>
            <Link to="/legal#terms" className="hover:text-teal-500 transition-colors">Terms of Use</Link>
            <Link to="/legal#help" className="hover:text-teal-500 transition-colors">Help Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
