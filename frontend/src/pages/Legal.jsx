import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { RiShieldCheckFill, RiLockLine, RiQuestionLine, RiBookOpenLine, RiArrowLeftLine } from 'react-icons/ri';
import { useEffect } from 'react';

const Legal = () => {
    const { hash } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                const navHeight = 80;
                const offset = element.offsetTop - navHeight;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        }
    }, [hash]);

    return (
        <div 
            className="pb-20 min-h-screen transition-colors duration-500 relative dark:bg-[#0a0a0a]"
            style={{ paddingTop: '180px' }}
        >
            <div className="max-w-4xl mx-auto px-6 relative z-[60]">
                <motion.button 
                    onClick={() => navigate(-1)}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center gap-2 text-slate-500 hover:text-teal-500 font-black mb-12 transition-colors group cursor-pointer"
                    style={{ position: 'relative', zIndex: 100 }}
                >
                    <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg group-hover:bg-teal-500/10 transition-colors">
                        <RiArrowLeftLine />
                    </div>
                    <span>Go Back</span>
                </motion.button>

                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
                        Legal & <span className="text-teal-600">Support</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-neutral-400 font-medium">Compliance, security, and help center for CertiVerify.</p>
                </motion.div>

                <div className="space-y-12">
                    {/* Privacy Policy */}
                    <motion.section 
                        id="privacy"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="glass-card p-10 relative overflow-hidden scroll-mt-24"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-teal-500/10 rounded-xl text-teal-600 shadow-inner">
                                <RiLockLine size={28} />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Privacy Policy</h2>
                        </div>
                        <div className="text-slate-600 dark:text-neutral-400 space-y-4 text-lg font-medium leading-relaxed">
                            <p>At CertiVerify, we prioritize the protection of student and organizational data. This policy outlines how we handle information:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Data Security</strong>: All certificate data is encrypted and stored in secure cloud environments.</li>
                                <li><strong>No Redundant Storage</strong>: We do not store personal student data longer than necessary for verification.</li>
                                <li><strong>User Control</strong>: Organizations have full control over the data they upload and can delete records at any time.</li>
                                <li><strong>Transparency</strong>: We do not sell or share your data with third-party advertisers.</li>
                            </ul>
                        </div>
                    </motion.section>

                    {/* Terms of Use */}
                    <motion.section 
                        id="terms"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="glass-card p-10 relative overflow-hidden scroll-mt-24"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 shadow-inner">
                                <RiBookOpenLine size={28} />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Terms of Use</h2>
                        </div>
                        <div className="text-slate-600 dark:text-neutral-400 space-y-4 text-lg font-medium leading-relaxed">
                            <p>By using the CertiVerify platform, you agree to the following terms:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Authenticity</strong>: Organizations must only upload authentic internship data.</li>
                                <li><strong>Access</strong>: Students are granted access solely for viewing and downloading their own verified records.</li>
                                <li><strong>Prohibited Use</strong>: Any attempt to forge or manipulate certificate IDs is strictly prohibited.</li>
                                <li><strong>Liability</strong>: CertiVerify is a verification tool; the primary responsibility for certificate content lies with the issuer.</li>
                            </ul>
                        </div>
                    </motion.section>

                    {/* Help Center */}
                    <motion.section 
                        id="help"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="glass-card p-10 bg-gradient-to-br from-teal-600/5 to-transparent border-teal-500/20 scroll-mt-24"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-teal-500/10 rounded-xl text-teal-600 shadow-inner">
                                <RiQuestionLine size={28} />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Help Center</h2>
                        </div>
                        <div className="text-slate-600 dark:text-neutral-400 space-y-6 text-lg font-medium leading-relaxed">
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <h4 className="text-teal-600 font-bold mb-2">How to verify my certificate?</h4>
                                <p>Simply enter your unique Certificate ID on the Home page search bar and click 'Verify'.</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <h4 className="text-teal-600 font-bold mb-2">My ID is not working?</h4>
                                <p>Please double-check the ID from your internship confirmation email. If it still fails, contact your organization's coordinator.</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <h4 className="text-teal-600 font-bold mb-2">Can I update my photo?</h4>
                                <p>Yes, go to your 'Profile' section after logging in to update your personal details and photo.</p>
                            </div>
                        </div>
                    </motion.section>
                </div>
            </div>
        </div>
    );
};

export default Legal;
