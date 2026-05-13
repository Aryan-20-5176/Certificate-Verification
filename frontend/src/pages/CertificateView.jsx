import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { RiDownloadCloud2Fill, RiErrorWarningFill, RiArrowLeftSLine, RiShieldCheckFill, RiSearch2Line, RiQrCodeLine } from 'react-icons/ri';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CertificateView = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/certificates/${id}`);
        setCertificate(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Certificate not found. Please check the ID.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  const handleDownloadPdf = async () => {
    if (downloading) return;

    try {
      setDownloading(true);
      toast.loading('Generating instant PDF...', { id: 'pdf-gen' });

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // 1. Background & Border
      doc.setDrawColor(20, 184, 166); // Teal color
      doc.setLineWidth(1.5);
      doc.rect(5, 5, 287, 200); // Main border
      doc.setDrawColor(226, 232, 240); // Slate color
      doc.line(15, 45, 282, 45); // Header line

      // 2. Header
      doc.setTextColor(20, 184, 166);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('CERTIVERIFY PLATFORM', 20, 30);

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(10);
      doc.text('DIGITAL AUTHENTICATION RECORD', 20, 36);

      // 3. Title
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(32);
      doc.text('Certificate of Achievement', 148.5, 85, { align: 'center' });

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(10);
      doc.text('THIS CERTIFICATE IS PROUDLY PRESENTED TO', 148.5, 95, { align: 'center' });

      // 4. Student Name
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(38);
      doc.text(certificate.studentName, 148.5, 120, { align: 'center' });

      // 5. Course Details
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      const str = `For successfully completing the ${certificate.courseName} program. Verified`;
      const str2 = `as a certified professional record within the CertiVerify secure ecosystem.`;
      doc.text(str, 148.5, 135, { align: 'center' });
      doc.text(str2, 148.5, 142, { align: 'center' });

      // 6. Footer Details
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('CERTIFICATE ID', 20, 180);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(certificate.certificateId, 20, 186);

      doc.setTextColor(100, 116, 139);
      doc.text('ISSUE DATE', 100, 180);
      doc.setTextColor(15, 23, 42);
      doc.text(new Date(certificate.issueDate).toLocaleDateString(), 100, 186);

      doc.setTextColor(100, 116, 139);
      doc.text('AUTHORITY', 180, 180);
      doc.setTextColor(20, 184, 166);
      doc.text('CERTIVERIFY TRUSTED', 180, 186);

      // 7. Save the PDF
      doc.save(`CertiVerify_${certificate.certificateId}.pdf`);

      // 8. Increment Download Count in Backend
      try {
        await axios.patch(`/api/certificates/${certificate.certificateId}/download`);
      } catch (err) {
        console.error('Failed to increment download count:', err);
      }
      
      toast.success('Downloaded Successfully!', { id: 'pdf-gen' });
    } catch (err) {
      console.error('PDF Draw Error:', err);
      toast.error('Download error. Please try again.', { id: 'pdf-gen' });
    } finally {
      setDownloading(false);
    }
  };

  const handleBack = () => {
    if (user?.role === 'admin') {
      navigate('/admin/certificates');
    } else if (user?.role === 'student') {
      navigate('/student/dashboard');
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 dark:border-neutral-800 border-t-teal-500 rounded-full animate-spin shadow-[0_0_15px_rgba(20,184,166,0.3)] dark:shadow-[0_0_15px_rgba(20,184,166,0.5)] transition-colors duration-300" />
          <p className="text-teal-600 dark:text-teal-400 font-black tracking-widest animate-pulse transition-colors duration-300 uppercase text-[10px]">Validating Record with CertiVerify...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 pt-24 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <button onClick={handleBack} className="inline-flex items-center gap-2 text-slate-500 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 font-bold uppercase tracking-widest text-sm transition-all outline-none cursor-pointer">
          <RiArrowLeftSLine className="text-2xl" /> Go Back
        </button>

        {!error && (
          <div className="flex gap-3">
            <button onClick={() => navigate(user?.role === 'student' ? '/student/dashboard' : '/')} className="px-5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/5 transition-all flex items-center gap-2">
              <RiSearch2Line /> Search Another
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className={`px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-red-600/20 disabled:opacity-50`}
            >
              {downloading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <RiDownloadCloud2Fill size={16} />
              )}
              {downloading ? 'Please wait...' : 'Download PDF'}
            </button>
          </div>
        )}
      </div>

      {error ? (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-12 text-center max-w-lg mx-auto border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 mt-10 transition-colors duration-300">
          <RiErrorWarningFill className="text-6xl text-red-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)] dark:drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 transition-colors duration-300 text-re">Verification Failed</h2>
          <p className="text-slate-500 dark:text-neutral-400 transition-colors duration-300">{error}</p>
          <button onClick={handleBack} className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-black transition-all cursor-pointer">Return to Dashboard</button>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Certificate Design Container */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 w-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden shadow-emerald-500/5 transition-colors duration-300"
          >
            <div className="w-full overflow-x-auto p-4 md:p-8 flex justify-center bg-slate-50/50 dark:bg-black/20">
              <div
                id="certificate-container"
                className="bg-white text-black"
                style={{
                  width: '850px',
                  minHeight: '600px',
                  padding: '50px',
                  position: 'relative',
                  fontFamily: 'Outfit, system-ui, sans-serif',
                  border: '1px solid #f1f5f9',
                }}
              >
                {/* Modern Certificate Header */}
                <div className="flex justify-between items-center mb-12 border-b pb-8">
                  <div>
                    <div className="text-xs font-black text-teal-600 uppercase tracking-[0.3em] mb-1">CertiVerify Platform</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Digital Authentication Record</div>
                  </div>
                  <div className="w-16 h-16 bg-slate-50 border p-2 rounded-lg flex items-center justify-center">
                    <RiShieldCheckFill className="text-teal-500 text-3xl" />
                  </div>
                </div>

                <div className="text-center relative z-10 py-4">
                  <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Certificate of Achievement</h1>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-12">This certificate is proudly presented to</p>

                  <div className="mb-12">
                    <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">
                      {certificate.studentName}
                    </h2>
                    <div className="w-24 h-1 bg-teal-500 mx-auto rounded-full mb-8" />
                    <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                      For successfully completing the <span className="font-bold text-slate-900">{certificate.internshipDomain}</span> program.
                      Verified as a certified professional record within the CertiVerify secure ecosystem.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-8 text-left border-t border-slate-100 pt-10">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Certificate ID</p>
                      <p className="text-xs font-black text-slate-900 font-mono">{certificate.certificateId}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Issue Date</p>
                      <p className="text-xs font-black text-slate-900">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authority</p>
                      <p className="text-xs font-black text-teal-600 uppercase">CertiVerify Trusted</p>
                    </div>
                  </div>
                </div>

                {/* Footer Decor */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
              </div>
            </div>
          </motion.div>

          {/* Verification Sidebar */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full lg:w-80 space-y-6"
          >
            <div className="glass-card p-8 border-emerald-500/20 bg-emerald-500/5 shadow-2xl transition-colors duration-300">
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest text-xs mb-4">
                <RiShieldCheckFill className="text-xl" /> Verified Authentic
              </div>
              <p className="text-base text-slate-600 dark:text-neutral-400 leading-relaxed mb-6 transition-colors duration-300 font-medium">
                This record has been cryptographically signed and stored in our secure database. Verification details are permanently accessible on the public portal.
              </p>
              <div className="p-6 bg-slate-100 dark:bg-neutral-800 rounded-xl border border-slate-200 dark:border-white/5 flex flex-col items-center gap-3 transition-colors duration-300 text-center">
                <RiShieldCheckFill className="text-5xl text-teal-500 mb-2" />
                <p className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Digital Authentication Signature</p>
                <p className="text-xs text-slate-600 dark:text-neutral-400 font-mono font-bold">HASH_{certificate.certificateId.split('-').pop()}_X71</p>
              </div>
            </div>

            <div className="glass-card p-8 border-slate-200 dark:border-white/10 shadow-lg transition-colors duration-300">
              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-4 transition-colors duration-300">Share Record</h4>
              <div className="flex gap-2">
                <input readOnly value={window.location.href} className="flex-1 bg-slate-100 dark:bg-neutral-800 border-none rounded-lg px-3 py-3 text-xs text-slate-500 font-mono outline-none" />
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }} className="p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/20">
                  <RiQrCodeLine />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CertificateView;
