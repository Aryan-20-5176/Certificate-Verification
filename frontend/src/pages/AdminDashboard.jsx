import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RiSearchLine, RiDeleteBin7Line, RiEyeLine, RiFileList3Line, RiUserStarLine, RiCalendarCheckLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Sparkline from '../components/Sparkline';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState({
    totalStudents: 0,
    totalCertificates: 0,
    totalDownloads: 0,
    recentUploads: 0
  });
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/certificates/stats/summary');
      setGlobalStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/admin/certificates', config);
      setCertificates(data);
      fetchStats();
    } catch (err) {
      toast.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/admin/certificates/${id}`, config);
        setCertificates(certificates.filter(c => c._id !== id));
        fetchStats();
        toast.success('Certificate deleted permanently');
      } catch (err) {
        toast.error('Failed to delete certificate');
      }
    }
  };

  const filteredCerts = certificates.filter(c => {
    const matchesSearch = c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.certificateId.toLowerCase().includes(search.toLowerCase()) ||
      c.internshipDomain.toLowerCase().includes(search.toLowerCase());

    if (activeFilter === 'downloads') return matchesSearch && (c.downloadCount > 0);
    if (activeFilter === 'recent') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return matchesSearch && (new Date(c.issueDate) >= sevenDaysAgo);
    }
    return matchesSearch;
  });

  const getTopDomain = () => {
    if (certificates.length === 0) return '-';
    const counts = {};
    let maxCount = 0;
    let topDomain = '-';
    certificates.forEach(c => {
      counts[c.internshipDomain] = (counts[c.internshipDomain] || 0) + 1;
      if (counts[c.internshipDomain] > maxCount) {
        maxCount = counts[c.internshipDomain];
        topDomain = c.internshipDomain;
      }
    });
    return topDomain;
  };

  const stats = [
    { 
      title: 'Total Students', 
      value: globalStats.totalStudents, 
      icon: <RiFileList3Line size={24} className="text-red-600 dark:text-red-400" />, 
      bg: 'from-red-500/5 to-transparent dark:from-red-500/10', 
      border: 'border-red-500/10',
      bars: [40, 70, 45, 90, 65, 80, 55],
      color: 'bg-red-500',
      colorHex: '#ef4444',
      filter: 'all'
    },
    { 
      title: 'Certificates', 
      value: globalStats.totalCertificates, 
      icon: <RiCalendarCheckLine size={24} className="text-blue-600 dark:text-blue-400" />, 
      bg: 'from-blue-500/5 to-transparent dark:from-blue-500/10', 
      border: 'border-blue-500/10',
      bars: [30, 50, 80, 60, 95, 75, 40],
      color: 'bg-blue-500',
      colorHex: '#3b82f6',
      filter: 'all'
    },
    { 
      title: 'Downloads', 
      value: globalStats.totalDownloads, 
      icon: <RiUserStarLine size={24} className="text-emerald-600 dark:text-emerald-400" />, 
      bg: 'from-emerald-500/5 to-transparent dark:from-emerald-500/10', 
      border: 'border-emerald-500/10',
      bars: [50, 40, 70, 85, 60, 90, 75],
      color: 'bg-emerald-500',
      colorHex: '#10b981',
      filter: 'downloads'
    },
    { 
      title: 'Recent Uploads', 
      value: globalStats.recentUploads, 
      icon: <RiFileList3Line size={24} className="text-amber-600 dark:text-amber-400" />, 
      bg: 'from-amber-500/5 to-transparent dark:from-amber-500/10', 
      border: 'border-amber-500/10',
      bars: [20, 60, 40, 30, 80, 50, 90],
      color: 'bg-amber-500',
      colorHex: '#f59e0b',
      filter: 'recent'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in relative z-10 transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500 dark:from-teal-400 dark:to-emerald-300 mb-2 transition-colors duration-300">CertiVerify Admin</h1>
          <p className="text-slate-500 dark:text-neutral-400 transition-colors duration-300 font-medium">Securely manage and monitor all issued internship certificates.</p>
        </div>
        <Link to="/admin/upload" className="btn-primary">
          + Upload New
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setActiveFilter(stat.filter)}
            className={`glass-card p-6 border ${stat.border} bg-gradient-to-br ${stat.bg} overflow-hidden group cursor-pointer transition-all ${activeFilter === stat.filter && stat.filter !== 'all' ? 'ring-2 ring-teal-500 border-teal-500/50 scale-[1.02] shadow-lg shadow-teal-500/10' : 'hover:scale-[1.02]'}`}
          >
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-white dark:bg-neutral-900 shadow-sm dark:shadow-inner border border-slate-200 dark:border-white/5 transition-colors duration-300`}>
                  {stat.icon}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm text-slate-500 dark:text-neutral-400 font-bold uppercase tracking-widest truncate transition-colors duration-300">{stat.title}</p>
                  <h3 className="text-4xl font-black text-slate-800 dark:text-white mt-1 truncate transition-colors duration-300">{loading ? '-' : stat.value}</h3>
                </div>
              </div>
              <div className="flex items-end pb-1 pr-1 w-24 h-12 shrink-0">
                <Sparkline data={stat.bars} color={stat.colorHex} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-neutral-900/50 flex flex-col md:flex-row gap-4 justify-between items-center transition-colors duration-300">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-colors duration-300">All Certificates</h2>

          <div className="relative w-full md:w-96 group">
            <RiSearchLine className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors" />
            <input
              type="text"
              placeholder="Search ID, Name or Domain..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input pl-12 py-2"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-100 dark:bg-neutral-900/80 text-sm uppercase tracking-wider text-slate-500 dark:text-neutral-400 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
                <th className="p-4 font-bold">Certificate ID</th>
                <th className="p-4 font-semibold">Student Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Domain</th>
                <th className="p-4 font-semibold">Issue Date</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-16 text-center text-slate-500 dark:text-neutral-500">
                      <div className="flex flex-col justify-center items-center gap-4">
                        <div className="w-8 h-8 border-2 border-slate-200 dark:border-neutral-700 border-t-teal-500 dark:border-t-teal-500 rounded-full animate-spin" />
                        <span>Loading records...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCerts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-16 text-center text-slate-500 dark:text-neutral-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RiFileList3Line size={40} className="text-slate-300 dark:text-neutral-700 mb-2" />
                        <p>No certificates match your search.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCerts.map((cert) => (
                    <motion.tr
                      key={cert._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-neutral-800/30 transition-colors group"
                    >
                      <td className="p-4 font-bold text-lg text-teal-600 dark:text-teal-400">{cert.certificateId}</td>
                      <td className="p-4 text-base font-bold text-slate-700 dark:text-neutral-200">{cert.studentName}</td>
                      <td className="p-4 text-slate-500 dark:text-neutral-400 text-base">{cert.email || '-'}</td>
                      <td className="p-4 text-slate-600 dark:text-neutral-300 font-medium text-base">{cert.internshipDomain}</td>
                      <td className="p-4 text-slate-500 dark:text-neutral-400 text-base">{new Date(cert.issueDate).toLocaleDateString()}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`/certificate/${cert.certificateId}`}
                            className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 dark:hover:text-emerald-300 rounded-lg transition-colors cursor-pointer"
                            title="Preview Context"
                          >
                            <RiEyeLine size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(cert._id)}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-300 rounded-lg transition-colors cursor-pointer outline-none"
                            title="Delete"
                          >
                            <RiDeleteBin7Line size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <footer className="mt-20 py-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest transition-colors duration-300">
        <div>&copy; 2026 CertiVerify – Admin Management Portal</div>
        <div className="flex gap-6">
          <Link to="/legal#privacy" className="hover:text-teal-500 transition-colors">Privacy Policy</Link>
          <Link to="/legal#terms" className="hover:text-teal-500 transition-colors">Terms of Use</Link>
          <Link to="/legal#help" className="hover:text-teal-500 transition-colors">Help Center</Link>
        </div>
      </footer>
    </div>
  );
};
export default AdminDashboard;
