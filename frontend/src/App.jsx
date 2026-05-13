import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminUpload from './pages/AdminUpload';
import CertificateView from './pages/CertificateView';
import AdminLayout from './components/AdminLayout';
import Profile from './pages/Profile';
import StudentDashboard from './pages/StudentDashboard';
import Legal from './pages/Legal';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <div className="min-h-screen relative overflow-x-hidden bg-slate-50 text-slate-800 dark:bg-[#0a0a0a] dark:text-neutral-200 transition-colors duration-300">
            <Toaster 
              position="top-right" 
              toastOptions={{ 
                className: 'glass-card text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-2xl', 
                style: { background: 'var(--toast-bg, rgba(20, 20, 20, 0.8))' },
                success: { iconTheme: { primary: '#10b981', secondary: '#fff' } }
              }} 
            />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/certificate/:id" element={<CertificateView />} />
              <Route path="/legal" element={<Legal />} />
              
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/certificates" replace />} />
                <Route path="certificates" element={<AdminDashboard />} />
                <Route path="upload" element={<AdminUpload />} />
              </Route>
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
    </ThemeProvider>
  );
}

export default App;
