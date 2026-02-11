const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#f5f5f7] dark:bg-[#1c1c1e] border-t border-[#d2d2d7] dark:border-[#38383a] py-5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <img src="/logo2.png" alt="TrustLayer" className="w-7 h-7 object-contain" />
                            <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">TrustLayer</span>
                        </div>
                        <p className="text-[12px] text-[#86868b] leading-relaxed">
                            Blockchain-powered certificate verification system.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] mb-2">Quick Links</h3>
                        <ul className="space-y-1.5 text-[12px]">
                            <li><a href="/dashboard" className="text-[#424245] dark:text-[#a1a1a6] hover:text-[#0071e3] transition-colors">Dashboard</a></li>
                            <li><a href="/verify" className="text-[#424245] dark:text-[#a1a1a6] hover:text-[#0071e3] transition-colors">Verify Certificate</a></li>
                            <li><a href="/verification-history" className="text-[#424245] dark:text-[#a1a1a6] hover:text-[#0071e3] transition-colors">Verification History</a></li>
                        </ul>
                    </div>

                    {/* Technology */}
                    <div>
                        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] mb-2">Technology</h3>
                        <ul className="space-y-1.5 text-[12px] text-[#424245] dark:text-[#a1a1a6]">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#30d158]"></div>
                                Ethereum Sepolia Testnet
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3]"></div>
                                SHA-256 Hash Verification
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#5e5ce6]"></div>
                                Smart Contract Powered
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[#d2d2d7] dark:border-[#38383a] mt-5 pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
                    <p className="text-[11px] text-[#86868b]">
                        © {currentYear} TrustLayer. All rights reserved.
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-[#86868b]">
                        <span>Built with Blockchain Technology</span>
                        <div className="w-1 h-1 rounded-full bg-[#86868b]"></div>
                        <span>Powered by Ethereum</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
