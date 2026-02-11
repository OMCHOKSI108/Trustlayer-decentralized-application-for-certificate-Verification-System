import { Link } from "react-router-dom";

const TermsOfService = () => {
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
                <h1 className="text-[32px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight mb-6">
                    Terms of Service
                </h1>

                <p className="text-[13px] text-[#86868b] mb-10">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <div className="space-y-8 text-[15px] text-[#424245] dark:text-[#a1a1a6] leading-relaxed">

                    <section>
                        <h2 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
                            1. Acceptance of Terms
                        </h2>
                        <p>
                            By accessing or using TrustLayer (\u201cthe Platform\u201d), you agree to be
                            bound by these Terms of Service and all applicable laws and
                            regulations. If you do not agree with any part of these terms,
                            you must not use the Platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
                            2. Description of Service
                        </h2>
                        <p>
                            TrustLayer provides a blockchain-based certificate verification
                            system that allows authorized institutions to issue digital
                            certificates whose cryptographic hashes are recorded on a public
                            blockchain. Users may verify certificate authenticity through the
                            Platform.
                        </p>
                        <p className="mt-2">
                            The Platform does not store the full certificate on-chain and does
                            not guarantee the accuracy of information provided by issuing
                            institutions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
                            3. User Responsibilities
                        </h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>You agree to provide accurate and complete information during registration.</li>
                            <li>Institutions are solely responsible for the authenticity of certificates they issue.</li>
                            <li>Users must not upload malicious, fraudulent, or illegal content.</li>
                            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
                            4. Blockchain & Technology Disclaimer
                        </h2>
                        <p>
                            TrustLayer relies on public blockchain infrastructure for
                            recording certificate hashes. Blockchain networks are decentralized
                            and operate independently of the Platform.
                        </p>
                        <p className="mt-2">
                            We do not control blockchain availability, transaction delays,
                            gas fees, or network outages. The Platform is not liable for
                            issues arising from blockchain network disruptions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
                            5. Limitation of Liability
                        </h2>
                        <p>
                            To the fullest extent permitted by law, TrustLayer shall not be
                            liable for any indirect, incidental, special, or consequential
                            damages arising from the use or inability to use the Platform.
                        </p>
                        <p className="mt-2">
                            The Platform does not guarantee employment decisions, academic
                            recognition, or third-party acceptance of certificates.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
                            6. Data & Privacy
                        </h2>
                        <p>
                            Personal data collected through the Platform is handled in
                            accordance with applicable data protection laws. Certificate
                            hashes stored on blockchain are publicly visible and cannot be
                            modified or deleted.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
                            7. Account Suspension & Termination
                        </h2>
                        <p>
                            We reserve the right to suspend or terminate accounts that violate
                            these terms, engage in fraudulent activity, or misuse the Platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
                            8. Modifications to Terms
                        </h2>
                        <p>
                            TrustLayer may revise these Terms of Service at any time without
                            prior notice. Continued use of the Platform constitutes acceptance
                            of the revised terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
                            9. Governing Law
                        </h2>
                        <p>
                            These terms shall be governed by and interpreted in accordance
                            with the applicable laws of the jurisdiction in which the Platform
                            operates.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
                            10. Contact Information
                        </h2>
                        <p>
                            For questions regarding these Terms of Service, please contact
                            the platform administrator through the official communication
                            channels provided within the Platform.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
