import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiDashboardFill, RiFileUploadFill } from 'react-icons/ri';

const Sidebar = () => {
  const navItems = [
    { path: '/admin/certificates', icon: <RiDashboardFill size={20} />, label: 'Dashboard' },
    { path: '/admin/upload', icon: <RiFileUploadFill size={20} />, label: 'Upload Excel' },
  ];

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="hidden md:block w-64 h-[calc(100vh-64px)] fixed left-0 top-16 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-2xl border-r border-slate-200 dark:border-white/5 z-40 p-4 shadow-[10px_0_30px_rgba(0,0,0,0.05)] dark:shadow-[10px_0_30px_rgba(0,0,0,0.5)] transition-colors duration-300"
    >
      <div className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider mb-4 px-2">Admin Menu</div>
      <div className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-teal-500/10 to-emerald-500/5 dark:from-teal-500/20 dark:to-emerald-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 dark:border-teal-500/30' 
                  : 'text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800/50 hover:text-slate-800 dark:hover:text-neutral-200 border border-transparent'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </motion.aside>
  );
};
export default Sidebar;
