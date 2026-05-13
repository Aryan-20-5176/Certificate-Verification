import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { RiUser3Line, RiMailLine, RiPhoneLine, RiShieldUserLine, RiUploadCloud2Line, RiSave3Line, RiArrowLeftSLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'student',
    profilePic: user?.profilePic || ''
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(user?.profilePic || '');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        profilePic: user.profilePic || ''
      });
      setPreview(user.profilePic || '');
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put('/api/auth/profile', formData, config);
      login(data); // Update context and localStorage
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (user?.role === 'admin') {
      navigate('/admin/certificates');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 pt-24 min-h-screen">
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="mb-8"
      >
        <button onClick={handleBack} className="inline-flex items-center gap-2 text-slate-500 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 font-bold uppercase tracking-widest text-xs mb-6 transition-all outline-none cursor-pointer">
          <RiArrowLeftSLine className="text-xl" /> Go Back to Dashboard
        </button>
        <p className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-sm mb-2">Account Settings</p>
        <h1 className="text-5xl font-black text-slate-800 dark:text-white transition-colors duration-300">
          Manage your <span className="text-teal-600 dark:text-teal-400">{user?.role === 'admin' ? 'Admin' : 'Student'}</span> account
        </h1>
      </motion.div>

      <div className="glass-card p-6 md:p-10 border-slate-200 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl transition-all duration-300">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <p className="text-xs font-black text-slate-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-6">Basic Information</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-8 transition-colors duration-300">
              {user?.role === 'admin' ? 'Admin Identity' : 'Student Identity'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500 dark:text-neutral-400 px-1">Full Name</label>
                <div className="relative group">
                  <RiUser3Line className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-neutral-900/50 border border-slate-200 dark:border-white/5 rounded-xl py-3 pl-12 pr-4 text-slate-800 dark:text-white focus:ring-2 focus:ring-teal-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-neutral-400 px-1">Email Address</label>
                <div className="relative">
                  <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full bg-slate-200/50 dark:bg-neutral-800/30 border border-slate-200 dark:border-white/5 rounded-xl py-3 pl-12 pr-4 text-slate-500 dark:text-neutral-500 cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-neutral-400 px-1">Phone Number</label>
                <div className="relative group">
                  <RiPhoneLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 9876543210"
                    className="w-full bg-slate-100 dark:bg-neutral-900/50 border border-slate-200 dark:border-white/5 rounded-xl py-3 pl-12 pr-4 text-slate-800 dark:text-white focus:ring-2 focus:ring-teal-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-neutral-400 px-1">Account Role</label>
                <div className="relative">
                  <RiShieldUserLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                    disabled
                    className="w-full bg-slate-200/50 dark:bg-neutral-800/30 border border-slate-200 dark:border-white/5 rounded-xl py-4 pl-12 pr-4 text-slate-500 dark:text-neutral-500 cursor-not-allowed outline-none text-lg font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="border-t border-slate-200 dark:border-white/5 pt-8">
            <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 transition-colors duration-300">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-teal-500/30 group-hover:border-teal-500 transition-all duration-300">
                  {preview ? (
                    <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 dark:bg-neutral-800 flex items-center justify-center text-slate-400">
                      <RiUser3Line size={32} />
                    </div>
                  )}
                </div>
                <label htmlFor="photo-upload" className="absolute -bottom-2 -right-2 bg-teal-500 text-white p-2 rounded-lg cursor-pointer hover:scale-110 transition-transform shadow-lg">
                  <RiUploadCloud2Line size={16} />
                </label>
                <input id="photo-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-bold text-slate-800 dark:text-white transition-colors duration-300">Profile Photo Upload</h4>
                <p className="text-sm text-slate-500 dark:text-neutral-400 transition-colors duration-300">Update your avatar to personalize your workspace.</p>
              </div>
              <button 
                type="button" 
                onClick={() => document.getElementById('photo-upload').click()}
                className="px-6 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-white font-medium hover:bg-slate-200 dark:hover:bg-white/5 transition-all text-sm"
              >
                Upload New Photo
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary min-w-[180px] flex items-center justify-center gap-2 py-4 shadow-xl shadow-teal-500/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <RiSave3Line className="text-xl" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <footer className="mt-12 text-center text-xs text-slate-400 dark:text-neutral-600 transition-colors duration-300">
        <p>Built for campuses, training partners, and internship teams.</p>
        <p className="mt-1">Email: support@certiverify.com</p>
      </footer>
    </div>
  );
};

export default Profile;
