import { Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex w-full pt-16">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-[calc(100vh-64px)] relative w-full overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent blur-3xl -z-10 pointer-events-none transition-colors duration-300" />
        <Outlet />
      </main>
    </div>
  );
};
export default AdminLayout;
