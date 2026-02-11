import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Shield, Upload, CheckCircle, X } from "lucide-react";
import { calculateFileHash } from "../utils/fileHash";
import toast from "react-hot-toast";

const PublicVerify = () => {
    const { certId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (certId) verifyById(certId);
    }, [certId]);

    const verifyById = async (id) => {
        setLoading(true);
        setResult(null);
        try {
            const res = await api.get(`/public/certificate/${id}`);
            setResult({ result: res.data.status, details: res.data });
        } catch (error) {
            setResult({ result: 'not_found', details: { message: "Certificate not found" } });
        } finally {
            setLoading(false);
        }
    };

    const handleFileVerify = async (file) => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            toast.error("Please upload a PDF or Image (JPG/PNG) file.");
            return;
        }
        setLoading(true);
        setResult(null);
        try {
            const hash = await calculateFileHash(file);
            const res = await api.post("/public/verify", { fileHash: hash });
            setResult(res.data);
        } catch (error) {
            toast.error("Verification failed");
            setResult({ result: 'error', details: { message: "Verification failed" } });
        } finally {
            setLoading(false);
        }
    };

    const getResultColor = (r) => {
        if (r === 'authentic') return '#30d158';
        if (r === 'expired') return '#ff9f0a';
        return '#ff453a';
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black flex flex-col">
            <nav className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-[#d2d2d7] dark:border-[#38383a] px-6 py-3 sticky top-0 z-50">
                <div className="max-w-[980px] mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo2.png" alt="TrustLayer" className="w-7 h-7 object-contain" />
                        <span className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">TrustLayer</span>
                    </Link>
                </div>
            </nav>

            <div className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-[680px]">
                    <div className="text-center mb-8">
                        <h1 className="text-[32px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight mb-2">Certificate Verification</h1>
                        <p className="text-[15px] text-[#86868b]">Verify authenticity instantly on the blockchain</p>
                    </div>

                    <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl overflow-hidden">
                        <div className="p-8">
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="w-14 h-14 border-4 border-[#e8e8ed] dark:border-[#38383a] border-t-[#0071e3] rounded-full animate-spin mx-auto mb-4"></div>
                                    <h3 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Verifying Certificate...</h3>
                                    <p className="text-[13px] text-[#86868b]">Querying Ethereum Blockchain</p>
                                </div>
                            ) : result ? (
                                <div className="animate-fadeIn">
                                    <div className={`rounded-2xl p-6 mb-6`} style={{ backgroundColor: `${getResultColor(result.result)}15` }}>
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${getResultColor(result.result)}25`, color: getResultColor(result.result) }}>
                                                {result.result === 'authentic' ? <CheckCircle className="w-6 h-6" /> : <X className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h2 className="text-[19px] font-semibold" style={{ color: getResultColor(result.result) }}>
                                                    {result.result === 'authentic' ? 'Valid Certificate' :
                                                        result.result === 'expired' ? 'Certificate Expired' :
                                                            result.result === 'revoked' ? 'Certificate Revoked' : 'Verification Failed'}
                                                </h2>
                                                <p className="text-[13px] text-[#86868b] mt-1">{result.details?.message}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {result.details && result.details.certId && (
                                        <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[10px] text-[#86868b] uppercase tracking-wider font-semibold">Student Name</p>
                                                    <p className="text-[14px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5">{result.details.studentName || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-[#86868b] uppercase tracking-wider font-semibold">Certificate ID</p>
                                                    <p className="font-mono text-[12px] text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5">{result.details.certId}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-[#86868b] uppercase tracking-wider font-semibold">Issue Date</p>
                                                    <p className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5">{result.details.issueDate ? new Date(result.details.issueDate).toLocaleDateString() : 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-[#86868b] uppercase tracking-wider font-semibold">Expiry Date</p>
                                                    <p className={`text-[14px] mt-0.5 ${result.result === 'expired' ? 'text-[#ff453a] font-semibold' : 'text-[#1d1d1f] dark:text-[#f5f5f7]'}`}>
                                                        {result.details.expiryDate ? new Date(result.details.expiryDate).toLocaleDateString() : 'Never'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-[#d2d2d7] dark:border-[#38383a]">
                                                <p className="text-[10px] text-[#86868b] uppercase tracking-wider font-semibold mb-1.5">Issued By</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-[#0071e3]/10 rounded-lg flex items-center justify-center text-[#0071e3] font-semibold text-[11px]">
                                                        {result.details.issuedBy?.organization?.[0] || "U"}
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{result.details.issuedBy?.organization || "Unknown Institution"}</p>
                                                        <p className="text-[11px] text-[#86868b]">Verified Issuer</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button onClick={() => { setResult(null); navigate("/public-verify"); }} className="mt-6 w-full py-3 bg-[#0071e3] text-white font-medium rounded-full hover:bg-[#0077ed] transition-colors text-[15px]">
                                        Verify Another
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className="border-2 border-dashed border-[#d2d2d7] dark:border-[#48484a] rounded-2xl p-12 text-center hover:border-[#0071e3] hover:bg-[#0071e3]/5 transition-all cursor-pointer"
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileVerify(e.dataTransfer.files[0]);
                                    }}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => e.target.files[0] && handleFileVerify(e.target.files[0])} />
                                    <div className="w-14 h-14 bg-[#0071e3]/10 text-[#0071e3] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Upload className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">Upload Certificate File</h3>
                                    <p className="text-[#86868b] text-[13px]">Drag & drop or click to upload PDF/JPG</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-center text-[#86868b] text-[12px] mt-8">
                        &copy; 2026 TrustLayer. Blockchain Powered Verification.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PublicVerify;
