import { useState, useCallback, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Link, useNavigate } from 'react-router-dom';
import { RiUploadCloud2Fill, RiFileExcel2Fill, RiCheckDoubleLine, RiCloseCircleLine, RiArrowLeftLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const AdminUpload = () => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select an Excel file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.post('/api/admin/upload-excel', formData, config);
      toast.success(data.message || 'Data uploaded successfully!');
      setFile(null);
      setTimeout(() => navigate('/admin/certificates'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Check file format.');
    } finally {
      setLoading(false);
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in relative z-10 transition-colors duration-300">
      <Link to="/admin/certificates" className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium mb-6 transition-colors">
        <RiArrowLeftLine /> Back to Dashboard
      </Link>
      
      <div className="mb-10">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-3 transition-colors duration-300 tracking-tight">Upload Student Records</h1>
        <p className="text-lg text-slate-500 dark:text-neutral-400 transition-colors duration-300 font-medium">Drag and drop your Excel (.xlsx) file containing student internship records.</p>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-1 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div 
          {...getRootProps()} 
          className={`relative p-12 mt-2 mx-2 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer min-h-[300px]
            ${isDragActive ? 'border-teal-500 bg-teal-50 dark:border-teal-400 dark:bg-teal-500/5' : isDragReject ? 'border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-500/5' : 'border-slate-300 dark:border-neutral-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:border-emerald-400 dark:hover:bg-emerald-500/5'}
            ${file ? 'border-green-500 bg-green-50 dark:border-green-500/50 dark:bg-green-500/5' : ''}
          `}
        >
          <input {...getInputProps()} />

          {file ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center flex flex-col items-center"
            >
              <div className="relative">
                <RiFileExcel2Fill className="text-6xl text-green-500 dark:text-green-400 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)] dark:drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
                <button 
                  onClick={clearFile}
                  className="absolute -top-2 -right-2 p-1 bg-white dark:bg-neutral-900 rounded-full text-slate-400 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shadow-sm border border-slate-200 dark:border-white/5"
                  title="Remove file"
                >
                  <RiCloseCircleLine size={20} />
                </button>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 transition-colors duration-300">{file.name}</h3>
              <p className="text-slate-500 dark:text-neutral-400 text-sm mb-6 transition-colors duration-300">{(file.size / 1024).toFixed(2)} KB</p>
              
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium bg-green-100 dark:bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 dark:border-green-500/20 transition-colors duration-300">
                <RiCheckDoubleLine /> Ready to process
              </div>
            </motion.div>
          ) : (
            <div className="text-center flex flex-col items-center pointer-events-none">
              <div className="w-20 h-20 bg-slate-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-200 dark:border-white/5 relative transition-colors duration-300">
                <div className={`absolute inset-0 rounded-full bg-teal-500/10 dark:bg-teal-500/20 blur-md transition-opacity duration-300 ${isDragActive ? 'opacity-100' : 'opacity-0'}`} />
                <RiUploadCloud2Fill className={`text-4xl transition-colors duration-300 ${isDragActive ? 'text-teal-500 dark:text-teal-400' : 'text-slate-400 dark:text-neutral-500'}`} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3 transition-colors duration-300">
                {isDragActive ? 'Drop your file here...' : 'Drag & Drop your Excel file'}
              </h3>
              <p className="text-lg text-slate-500 dark:text-neutral-400 mb-8 max-w-md transition-colors duration-300">
                or click to browse from your computer. Supports .xlsx and .xls formats only.
              </p>
              <div className="btn-secondary">Browse Files</div>
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50 dark:bg-neutral-900/50 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 mt-2 transition-colors duration-300">
          <div className="text-base text-slate-500 dark:text-neutral-400 mb-2 sm:mb-0 transition-colors duration-300">
            <strong className="text-slate-700 dark:text-neutral-300">Required columns:</strong> Certificate ID, Student Name, Internship Domain, Start Date, End Date
          </div>
          <button 
            onClick={handleUpload} 
            disabled={!file || loading}
            className="btn-primary w-full sm:w-auto min-w-[180px]"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              'Upload Records'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminUpload;
