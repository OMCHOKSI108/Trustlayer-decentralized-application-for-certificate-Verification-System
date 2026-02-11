import { BRANDING } from "../constants/text";

const About = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <div className="max-w-[680px] mx-auto px-6 py-20">
                <h1 className="text-[40px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight mb-6">About TrustLayer</h1>
                <p className="text-[17px] text-[#86868b] mb-8 leading-relaxed">
                    {BRANDING.description}
                </p>
                <div className="text-[15px] text-[#424245] dark:text-[#a1a1a6] leading-relaxed space-y-4">
                    <p>
                        TrustLayer was founded with a simple mission: to make academic and professional credentials tamper-proof and instantly verifiable anywhere in the world.
                    </p>
                    <p>
                        By leveraging the Ethereum blockchain, we eliminate certificate fraud and reduce the administrative burden on universities and employers.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
