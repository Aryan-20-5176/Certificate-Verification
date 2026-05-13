import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { RiSearchLine, RiDownloadCloud2Fill, RiShieldCheckFill, RiFileList3Line, RiBarChartGroupedLine, RiShareBoxLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Sparkline from '../components/Sparkline';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [myCertificates, setMyCertificates] = useState([]);
  const [stats, setStats] = useState({ 
    totalStudents: 0, 
    totalCertificates: 0, 
    totalDownloads: 0, 
    recentUploads: 0 
  });

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/certificates/stats/summary');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchMyCertificates = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.get('/api/certificates/my-certificates', config);
      setMyCertificates(data);
    } catch (err) {
      console.error('Failed to fetch my certificates:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    if (user) {
      fetchMyCertificates();
    }
  }, [user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await axios.get(`/api/certificates/${searchId}`);
      setResult(data);
      toast.success('Certificate Found!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Certificate not found');
      setResult({ error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 pt-24 min-h-screen">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <p className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-sm mb-2 italic">CertiVerify Student Portal</p>
          <h1 className="text-5xl font-black text-slate-800 dark:text-white transition-colors duration-300 tracking-tight">
            Welcome back, <span className="text-teal-600 dark:text-teal-400">{user?.name}</span>
          </h1>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="glass-card p-6 bg-gradient-to-br from-red-500/5 to-transparent dark:from-red-500/10 border-red-500/20 shadow-lg overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-xl text-red-600 dark:text-red-400">
              <RiDownloadCloud2Fill size={28} />
            </div>
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          </div>
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1 italic">Total Certificates Issued</p>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2">{stats.totalCertificates}</h2>
              <p className="text-sm text-slate-500 dark:text-neutral-500 transition-colors duration-300">Verified credentials on platform</p>
            </div>
            <div className="flex items-end pb-1 w-24 h-12 shrink-0">
              <Sparkline data={[40, 70, 45, 90, 65, 80, 55]} color="#ef4444" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 bg-gradient-to-br from-blue-500/5 to-transparent dark:from-blue-500/10 border-blue-500/20 shadow-lg transition-colors duration-300 overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 transition-colors duration-300">
              <RiShieldCheckFill size={28} />
            </div>
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          </div>
          <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1 italic">Global Downloads</p>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2">{stats.totalDownloads}</h2>
              <p className="text-sm text-slate-500 dark:text-neutral-500 transition-colors duration-300">Successful certificate downloads</p>
            </div>
            <div className="flex items-end pb-1 w-24 h-12 shrink-0">
              <Sparkline data={[30, 50, 80, 60, 95, 75, 40]} color="#3b82f6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-12">
        {/* Search & Snapshot Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="glass-card p-8 border-slate-200 dark:border-white/10 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-3xl -z-10" />
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-3 transition-colors duration-300 tracking-tight">Manual Verification</h3>
            <p className="text-lg text-slate-500 dark:text-neutral-400 mb-8 transition-colors duration-300 font-medium">Verify any certificate by entering its unique ID.</p>

            <form onSubmit={handleSearch} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest ml-1">Certificate ID</label>
                <div className="flex gap-3">
                  <div className="relative flex-1 group">
                    <input
                      type="text"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      placeholder="e.g. CV-2026-X01"
                      className="w-full bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-white/5 rounded-xl py-4 px-6 text-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-teal-500/50 outline-none transition-all placeholder-slate-400 dark:placeholder-neutral-700 font-bold"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="px-10 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 text-lg">
                    {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Search'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <AnimatePresence mode="wait">
            {result && !result.error ? (
              <motion.div 
                key="result"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="glass-card p-6 border-teal-500/20 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full bg-slate-900 text-white"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-xl font-bold text-white tracking-tight">Search Result</h4>
                    <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest mt-1">Verified Authenticated Data</p>
                  </div>
                  <div className="px-3 py-1 bg-teal-500/20 text-teal-400 text-[10px] font-black uppercase rounded-full border border-teal-500/30">Found</div>
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                  <div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Student</p>
                    <p className="font-bold text-white">{result.studentName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Domain</p>
                    <p className="font-bold text-white">{result.internshipDomain}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">ID</p>
                    <p className="font-bold text-white font-mono text-sm">{result.certificateId}</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/5">
                  <Link to={`/certificate/${result.certificateId}`} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2">
                    <RiDownloadCloud2Fill /> View Details
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-6 border-slate-200 dark:border-white/5 shadow-inner flex flex-col items-center justify-center min-h-[320px] text-center bg-slate-50/50 dark:bg-neutral-900/20"
              >
                <div className="w-16 h-16 bg-slate-200 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-neutral-600 mb-4 transition-colors duration-300">
                  <RiFileList3Line size={32} />
                </div>
                <h4 className="text-lg font-bold text-slate-400 dark:text-neutral-700 transition-colors duration-300">Verification Result</h4>
                <p className="text-sm text-slate-400 dark:text-neutral-700 max-w-[240px] transition-colors duration-300">Search for an ID to see results here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* My Certificates List Section */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card overflow-hidden shadow-2xl border-white/5">
          <div className="p-8 border-b border-white/5 bg-gradient-to-r from-teal-600 to-emerald-600">
            <h3 className="text-3xl font-black text-white tracking-tight">Your Certificates</h3>
            <p className="text-teal-50 font-medium opacity-80 mt-1 italic">Automatically matched based on your registered email: {user?.email}</p>
          </div>

          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-neutral-900/80 text-slate-400 dark:text-neutral-500 text-[10px] font-black uppercase tracking-widest transition-colors duration-300">
                  <th className="px-8 py-5 border-b border-slate-200 dark:border-white/5">Certificate ID</th>
                  <th className="px-8 py-5 border-b border-slate-200 dark:border-white/5">Domain</th>
                  <th className="px-8 py-5 border-b border-slate-200 dark:border-white/5">Issue Date</th>
                  <th className="px-8 py-5 border-b border-slate-200 dark:border-white/5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {myCertificates.length > 0 ? (
                  myCertificates.map((cert) => (
                    <tr key={cert._id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors duration-200">
                      <td className="px-8 py-6 font-mono text-sm font-bold text-slate-700 dark:text-neutral-300">{cert.certificateId}</td>
                      <td className="px-8 py-6 text-slate-600 dark:text-neutral-400 font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-teal-500" />
                          {cert.internshipDomain}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-slate-600 dark:text-neutral-400 font-medium">{new Date(cert.issueDate).toLocaleDateString()}</td>
                      <td className="px-8 py-6 text-right">
                        <Link 
                          to={`/certificate/${cert.certificateId}`} 
                          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-teal-500/20 active:scale-95"
                        >
                          <RiDownloadCloud2Fill /> Download
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center text-slate-400 dark:text-neutral-600 font-bold italic">
                      No certificates found for your email yet. Please contact admin if this is a mistake.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <footer className="mt-20 py-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest transition-colors duration-300">
        <div>&copy; 2026 CertiVerify – Secure Certificate Platform</div>
        <div className="flex gap-6">
          <Link to="/legal#privacy" className="hover:text-teal-500 transition-colors">Privacy Policy</Link>
          <Link to="/legal#terms" className="hover:text-teal-500 transition-colors">Terms of Use</Link>
          <Link to="/legal#help" className="hover:text-teal-500 transition-colors">Help Center</Link>
        </div>
      </footer>
    </div>
  );
};

export default StudentDashboard;
