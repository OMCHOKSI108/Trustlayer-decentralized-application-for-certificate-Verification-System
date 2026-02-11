import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <nav className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-[#d2d2d7] dark:border-[#38383a] px-6 py-3 sticky top-0 z-50">
                <div className="max-w-[980px] mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo2.png" alt="TrustLayer" className="w-7 h-7 object-contain" />
                        <span className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">TrustLayer</span>
                    </Link>
                </div>
            </nav>
            <div className="max-w-[680px] mx-auto px-6 py-20">
                <h1 className="text-[32px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight mb-8">Privacy Policy</h1>
                <div className="text-[15px] text-[#424245] dark:text-[#a1a1a6] leading-relaxed space-y-4">
                    <p className="text-[13px] text-[#86868b] mb-4">Last updated: {new Date().toLocaleDateString()}</p>
                    <p>
                        Your privacy is important to us. It is TrustLayer's policy to respect your privacy regarding any information we may collect from you across our website.
                    </p>
                    <h2 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mt-8 mb-3">1. Information we collect</h2>
                    <p>
                        We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

