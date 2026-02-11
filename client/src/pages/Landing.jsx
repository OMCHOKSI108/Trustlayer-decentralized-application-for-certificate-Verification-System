import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, CheckCircle, Lock, Server, Mail, ArrowRight, Upload, X } from "lucide-react";
import { BRANDING } from "../constants/text";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import { calculateFileHash } from "../utils/fileHash";
import { useTheme } from "../context/ThemeContext";

const Landing = () => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
    const [sending, setSending] = useState(false);

    // Verification State
    const [verifyFile, setVerifyFile] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);
    const fileInputRef = useRef(null);
    const verificationSectionRef = useRef(null);

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await api.post("/contact", contactForm);
            toast.success("Message sent successfully!");
            setContactForm({ name: "", email: "", message: "" });
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
        } finally {
            setSending(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) handleVerify(file);
    };

    const handleVerify = async (file) => {
        if (!file) return;
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            toast.error("Please upload a PDF or Image (JPG/PNG) file.");
            return;
        }
        setVerifyFile(file);
        setVerifying(true);
        setVerificationResult(null);
        try {
            const hash = await calculateFileHash(file);
            const res = await api.post("/public/verify", { fileHash: hash });
            setVerificationResult(res.data);
            if (res.data.result === 'authentic') toast.success("Certificate is Authentic!");
            else if (res.data.result === 'not_found') toast.error("Certificate not found.");
        } catch (error) {
            console.error(error);
            toast.error("Verification failed. Please try again.");
            setVerificationResult({ result: 'error', details: { message: "Network or Server Error" } });
        } finally {
            setVerifying(false);
        }
    };

    const scrollToVerify = () => {
        verificationSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black flex flex-col font-sans">

            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-3 max-w-[980px] mx-auto w-full sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <img src="/logo2.png" alt="TrustLayer" className="w-7 h-7 object-contain" />
                    <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">{BRANDING.name}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
                        title="Toggle Theme"
                    >
                        {theme === "dark" ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>

                    {user ? (
                        <Link to="/dashboard" className="px-5 py-1.5 bg-[#0071e3] text-white text-[13px] font-medium rounded-full hover:bg-[#0077ed] transition-colors">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="hidden sm:block text-[13px] text-[#0071e3] font-medium hover:underline transition-colors">
                                Sign In
                            </Link>
                            <Link to="/register" className="px-5 py-1.5 bg-[#0071e3] text-white text-[13px] font-medium rounded-full hover:bg-[#0077ed] transition-colors">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center">
                <div className="text-center px-4 pt-20 pb-16 max-w-[980px] mx-auto">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
                        className="space-y-6"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] text-[12px] font-medium">
                            <span className="w-2 h-2 rounded-full bg-[#30d158]"></span>
                            Live on Ethereum Sepolia
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-[48px] md:text-[64px] font-semibold tracking-tight leading-[1.05] text-[#1d1d1f] dark:text-[#f5f5f7]">
                            The Standard for<br />
                            Decentralized Verification.
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-[19px] text-[#86868b] max-w-xl mx-auto leading-relaxed">
                            {BRANDING.description}
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            {user ? (
                                <Link to="/dashboard" className="px-7 py-3 bg-[#0071e3] text-white text-[17px] font-medium rounded-full hover:bg-[#0077ed] transition-colors inline-flex items-center gap-2">
                                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register" className="px-7 py-3 bg-[#0071e3] text-white text-[17px] font-medium rounded-full hover:bg-[#0077ed] transition-colors inline-flex items-center gap-2">
                                        Get Started <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <button onClick={scrollToVerify} className="px-7 py-3 text-[#0071e3] text-[17px] font-medium rounded-full border border-[#0071e3] hover:bg-[#0071e3]/5 transition-colors">
                                        Verify a Document
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Verification Widget */}
                <div ref={verificationSectionRef} className="w-full max-w-[680px] mx-auto px-4 pb-24 scroll-mt-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl overflow-hidden"
                    >
                        <div className="bg-[#1d1d1f] p-6 text-white">
                            <h3 className="text-[22px] font-semibold flex items-center gap-2 tracking-tight">
                                <Shield className="w-5 h-5 text-[#0071e3]" />
                                Verify Certificate
                            </h3>
                            <p className="text-[#86868b] text-[14px] mt-1">Upload a digital certificate (PDF/JPG) to instantly verify its authenticity.</p>
                        </div>

                        <div className="p-8">
                            {!verificationResult ? (
                                <div
                                    className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${verifying ? 'bg-[#e8e8ed] dark:bg-[#2c2c2e] border-[#d2d2d7] dark:border-[#48484a]' : 'border-[#d2d2d7] dark:border-[#48484a] hover:border-[#0071e3] hover:bg-[#0071e3]/5'}`}
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleVerify(e.dataTransfer.files[0]);
                                    }}
                                    onClick={() => !verifying && fileInputRef.current?.click()}
                                >
                                    <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />

                                    {verifying ? (
                                        <div className="flex flex-col items-center">
                                            <div className="w-14 h-14 border-4 border-[#e8e8ed] dark:border-[#38383a] border-t-[#0071e3] rounded-full animate-spin mb-4"></div>
                                            <p className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Verifying...</p>
                                            <p className="text-[13px] text-[#86868b]">Querying blockchain</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <div className="w-14 h-14 bg-[#0071e3]/10 text-[#0071e3] rounded-2xl flex items-center justify-center mb-4">
                                                <Upload className="w-7 h-7" />
                                            </div>
                                            <p className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">Click to Upload or Drag & Drop</p>
                                            <p className="text-[#86868b] text-[13px]">Supports PDF, JPG, PNG (Max 10MB)</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="animate-fadeIn">
                                    <div className={`rounded-2xl p-6 ${verificationResult.result === 'authentic' ? 'bg-[#30d158]/10' :
                                        verificationResult.result === 'revoked' ? 'bg-[#ff9f0a]/10' : 'bg-[#ff453a]/10'}`}>
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${verificationResult.result === 'authentic' ? 'bg-[#30d158]/20 text-[#30d158]' :
                                                verificationResult.result === 'revoked' ? 'bg-[#ff9f0a]/20 text-[#ff9f0a]' : 'bg-[#ff453a]/20 text-[#ff453a]'}`}>
                                                {verificationResult.result === 'authentic' ? <CheckCircle className="w-6 h-6" /> : <X className="w-6 h-6" />}
                                            </div>
                                            <div className="text-left flex-1">
                                                <h4 className={`text-[19px] font-semibold mb-1 ${verificationResult.result === 'authentic' ? 'text-[#30d158]' :
                                                    verificationResult.result === 'revoked' ? 'text-[#ff9f0a]' : 'text-[#ff453a]'}`}>
                                                    {verificationResult.result === 'authentic' ? 'Certificate is Authentic' :
                                                        verificationResult.result === 'revoked' ? 'Certificate Revoked' : 'Verification Failed'}
                                                </h4>
                                                <p className="text-[13px] text-[#86868b] mb-4">{verificationResult.details?.message}</p>
                                                {verificationResult.details?.certId && (
                                                    <div className="bg-white/60 dark:bg-white/5 rounded-xl p-3 text-[13px] space-y-1">
                                                        <div className="flex justify-between"><span className="text-[#86868b]">ID:</span> <span className="font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">{verificationResult.details.certId}</span></div>
                                                        <div className="flex justify-between"><span className="text-[#86868b]">Date:</span> <span className="text-[#1d1d1f] dark:text-[#f5f5f7]">{new Date(verificationResult.details.blockchainTimestamp).toLocaleDateString()}</span></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => { setVerificationResult(null); setVerifyFile(null); }} className="mt-6 w-full py-3 bg-[#0071e3] text-white font-medium rounded-full hover:bg-[#0077ed] transition-colors text-[15px]">
                                        Verify Another Document
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Features */}
                <div className="w-full bg-[#f5f5f7] dark:bg-[#1c1c1e] py-20">
                    <div className="max-w-[980px] mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-[40px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">Why TrustLayer.</h2>
                            <p className="text-[17px] text-[#86868b] mt-3">Built on blockchain. Designed for trust.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {BRANDING.features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white dark:bg-[#2c2c2e] p-8 rounded-2xl"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 flex items-center justify-center mb-5">
                                        <Shield className="w-6 h-6 text-[#0071e3]" />
                                    </div>
                                    <h3 className="text-[19px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">{feature.title}</h3>
                                    <p className="text-[14px] text-[#86868b] leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Contact Section */}
            <section className="py-20 bg-white dark:bg-black">
                <div className="max-w-[980px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
                    <div>
                        <p className="text-[12px] font-medium text-[#0071e3] uppercase tracking-wider mb-3">Contact</p>
                        <h2 className="text-[32px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight mb-4">Get in touch.</h2>
                        <p className="text-[15px] text-[#86868b] mb-8 leading-relaxed">
                            Have questions about integrating TrustLayer? Need a custom enterprise solution? We're here to help.
                        </p>

                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Email Us</h4>
                                    <p className="text-[13px] text-[#86868b]">admin@trustlayer.io</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#30d158]/10 flex items-center justify-center text-[#30d158]">
                                    <Server className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Technical Support</h4>
                                    <p className="text-[13px] text-[#86868b]">Available 24/7 for APIs</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] p-8 rounded-2xl">
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={contactForm.name}
                                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border border-[#d2d2d7] dark:border-[#38383a] bg-white dark:bg-[#2c2c2e] text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-colors"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={contactForm.email}
                                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border border-[#d2d2d7] dark:border-[#38383a] bg-white dark:bg-[#2c2c2e] text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Message</label>
                                <textarea
                                    rows="4"
                                    value={contactForm.message}
                                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border border-[#d2d2d7] dark:border-[#38383a] bg-white dark:bg-[#2c2c2e] text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] resize-none focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-colors"
                                    placeholder="How can we help?"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full py-3 bg-[#0071e3] text-white font-medium rounded-full hover:bg-[#0077ed] transition-colors disabled:opacity-50 text-[15px]"
                            >
                                {sending ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#f5f5f7] dark:bg-[#1c1c1e] border-t border-[#d2d2d7] dark:border-[#38383a] py-10">
                <div className="max-w-[980px] mx-auto px-6 grid md:grid-cols-4 gap-10">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/logo2.png" alt="TrustLayer" className="w-7 h-7 object-contain" />
                            <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">TrustLayer</span>
                        </div>
                        <p className="text-[13px] text-[#86868b] max-w-sm leading-relaxed">
                            Building the trust layer for the internet. Secure, decentralized, and verifiable credentials for everyone.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">Platform</h4>
                        <ul className="space-y-2 text-[13px] text-[#424245] dark:text-[#a1a1a6]">
                            <li><Link to="/register" className="hover:text-[#0071e3] transition-colors">Universities</Link></li>
                            <li><Link to="/register" className="hover:text-[#0071e3] transition-colors">Employers</Link></li>
                            <li><Link to="/verify" className="hover:text-[#0071e3] transition-colors">Verification</Link></li>
                            <li><Link to="/login" className="hover:text-[#0071e3] transition-colors">Portal Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">Company</h4>
                        <ul className="space-y-2 text-[13px] text-[#424245] dark:text-[#a1a1a6]">
                            <li><Link to="/about" className="hover:text-[#0071e3] transition-colors">About</Link></li>
                            <li><Link to="/blog" className="hover:text-[#0071e3] transition-colors">Blog</Link></li>
                            <li><Link to="/careers" className="hover:text-[#0071e3] transition-colors">Careers</Link></li>
                            <li><a href="#" className="hover:text-[#0071e3] transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-[980px] mx-auto px-6 mt-8 pt-6 border-t border-[#d2d2d7] dark:border-[#38383a] flex flex-col md:flex-row justify-between items-center gap-3 text-[12px] text-[#86868b]">
                    <p>© {new Date().getFullYear()} TrustLayer Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="hover:text-[#0071e3] transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-[#0071e3] transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
