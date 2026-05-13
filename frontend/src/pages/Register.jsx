import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { RiLockPasswordFill, RiMailFill, RiEyeFill, RiEyeOffFill, RiUser3Fill, RiShieldStarFill } from 'react-icons/ri';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password, role });
      login(data);
      toast.success(`Account created as ${role}!`);
      if (data.role === 'admin') {
        navigate('/admin/certificates');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center page-wrapper relative">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/10 dark:bg-amber-600/20 rounded-full blur-[120px] pointer-events-none transition-colors duration-500" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none transition-colors duration-500" />

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-card p-10 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-br from-amber-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30"
          >
            <RiUser3Fill className="text-white text-3xl" />
          </motion.div>
          <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-emerald-500 dark:from-amber-400 dark:to-emerald-300 mb-2 transition-colors duration-300">CertiVerify</h2>
          <p className="text-slate-500 dark:text-neutral-400 text-sm transition-colors duration-300">Join our secure certificate verification ecosystem</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative group">
            <RiUser3Fill className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500 group-focus-within:text-amber-500 dark:group-focus-within:text-amber-400 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Full Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass-input pl-12"
              required 
            />
          </div>

          <div className="relative group">
            <RiMailFill className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500 group-focus-within:text-amber-500 dark:group-focus-within:text-amber-400 transition-colors" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input pl-12"
              required 
            />
          </div>
          
          <div className="relative group">
            <RiLockPasswordFill className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500 group-focus-within:text-amber-500 dark:group-focus-within:text-amber-400 transition-colors" size={20} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`glass-input pl-12 pr-12 ${password && !showPassword ? 'tracking-[0.2em]' : ''}`}
              required 
              minLength="6"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors focus:outline-none"
            >
              {showPassword ? <RiEyeOffFill size={20} /> : <RiEyeFill size={20} />}
            </button>
          </div>

          <div className="relative group">
            <RiShieldStarFill className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500 group-focus-within:text-amber-500 dark:group-focus-within:text-amber-400 transition-colors z-10 pointer-events-none" size={20} />
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="glass-input pl-12 appearance-none cursor-pointer"
            >
              <option value="student">Student Account</option>
              <option value="admin">Admin Account</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary mt-2 bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 dark:text-neutral-400 text-sm transition-colors duration-300">
            Already have an account? <Link to="/login" className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold transition-colors hover:underline underline-offset-4">Sign In here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
export default Register;
