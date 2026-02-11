import { BRANDING } from "../constants/text";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black">
            <div className="flex-1 flex">
                {/* Left Branding Panel */}
                <div className="hidden lg:flex lg:w-1/2 bg-[#1d1d1f] text-white flex-col justify-center px-16 relative overflow-hidden">
                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center gap-3 mb-10 hover:opacity-80 transition-opacity">
                            <img src="/logo2.png" alt="Logo" className="w-10 h-10 object-contain" />
                            <span className="text-xl font-semibold tracking-tight">TrustLayer</span>
                        </Link>
                        <h2 className="text-[32px] font-semibold text-white leading-tight tracking-tight mb-4">
                            {title || "Secure. Verified. Trusted."}
                        </h2>
                        <p className="text-[15px] text-[#86868b] leading-relaxed max-w-md">
                            {subtitle || "Blockchain-powered certificate verification for institutions and employers worldwide."}
                        </p>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className="flex-1 bg-white dark:bg-black flex items-center justify-center px-6 py-10 relative">
                    <Link to="/" className="absolute top-6 right-6 md:top-8 md:right-8 text-[13px] font-medium text-[#0071e3] hover:text-[#0077ed] flex items-center gap-1.5 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <div className="w-full max-w-md">
                        <div className="text-center mb-8 lg:hidden">
                            <Link to="/" className="inline-block">
                                <h1 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-center gap-2 tracking-tight">
                                    <img src="/logo2.png" alt="Logo" className="w-8 h-8 object-contain" />
                                    {BRANDING.name}
                                </h1>
                            </Link>
                            <p className="text-[13px] text-[#86868b] mt-1">{BRANDING.tagline}</p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
