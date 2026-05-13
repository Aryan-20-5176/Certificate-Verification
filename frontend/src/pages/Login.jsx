import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { RiLockPasswordFill, RiMailFill, RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      login(data);
      toast.success('Successfully logged in!');
      if (data.role === 'admin') {
        navigate('/admin/certificates');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center page-wrapper relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none transition-colors duration-500" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 dark:bg-teal-600/20 rounded-full blur-[120px] pointer-events-none transition-colors duration-500" />

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-card p-10 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/30"
          >
            <RiLockPasswordFill className="text-white text-3xl" />
          </motion.div>
          <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500 dark:from-teal-400 dark:to-emerald-300 mb-2 transition-colors duration-300">CertiVerify</h2>
          <p className="text-slate-500 dark:text-neutral-400 text-sm transition-colors duration-300">Sign in to the secure certificate portal</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative group">
            <RiMailFill className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors" size={20} />
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input pl-12"
              required 
            />
          </div>
          
          <div className="relative group">
            <RiLockPasswordFill className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors" size={20} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`glass-input pl-12 pr-12 ${password && !showPassword ? 'tracking-[0.2em]' : ''}`}
              required 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors focus:outline-none"
            >
              {showPassword ? <RiEyeOffFill size={20} /> : <RiEyeFill size={20} />}
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In securely'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 dark:text-neutral-400 text-sm transition-colors duration-300">
            Don't have an account? <Link to="/register" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold transition-colors hover:underline underline-offset-4">Register here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
export default Login;
