import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { Shield, Upload, CheckCircle, X, FileText } from "lucide-react";
import { calculateFileHash } from "../utils/fileHash";

const VerifyCertificate = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) handleVerify(selectedFile);
  };

  const handleVerify = async (selectedFile) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Please upload a PDF or Image (JPG/PNG) file.");
      return;
    }

    setFile(selectedFile);
    setLoading(true);
    setResult(null);

    try {
      const hash = await calculateFileHash(selectedFile);
      const res = await api.post("/verify", { fileHash: hash });

      setResult(res.data);
      if (res.data.result === 'authentic') {
        toast.success("Certificate is Authentic!");
      } else if (res.data.result === 'not_found') {
        toast.error("Certificate not found.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Verification failed");
      setResult({ result: 'error', details: { message: "Verification failed. Please try again." } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10">
        <h1 className="text-[28px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">Verify Certificate</h1>
        <p className="text-[15px] text-[#86868b] mt-1">
          Upload a certificate file to verify its authenticity on the Ethereum blockchain.
        </p>
      </div>

      <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl overflow-hidden">
        <div className="bg-[#1d1d1f] p-6 text-white text-left">
          <h3 className="text-[19px] font-semibold flex items-center gap-2 tracking-tight">
            <Shield className="w-5 h-5 text-[#0071e3]" />
            Instant Verification
          </h3>
          <p className="text-[#86868b] text-[13px] mt-1">Files are hashed securely on your device.</p>
        </div>

        <div className="p-8">
          {!result ? (
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${loading ? 'bg-[#e8e8ed] dark:bg-[#2c2c2e] border-[#d2d2d7] dark:border-[#48484a]' : 'border-[#d2d2d7] dark:border-[#48484a] hover:border-[#0071e3] hover:bg-[#0071e3]/5'}`}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleVerify(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => !loading && fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />

              {loading ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-[#e8e8ed] dark:border-[#38383a] border-t-[#0071e3] rounded-full animate-spin mb-4"></div>
                  <p className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Verifying...</p>
                  <p className="text-[13px] text-[#86868b]">Querying blockchain registry</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#0071e3]/10 text-[#0071e3] rounded-2xl flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8" />
                  </div>
                  <p className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">Click to Upload or Drag & Drop</p>
                  <p className="text-[#86868b] text-[13px]">Supports PDF, JPG, PNG (Max 10MB)</p>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fadeIn">
              <div className={`rounded-2xl p-6 ${result.result === 'authentic' ? 'bg-[#30d158]/10' :
                result.result === 'revoked' ? 'bg-[#ff9f0a]/10' :
                  'bg-[#ff453a]/10'
                }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${result.result === 'authentic' ? 'bg-[#30d158]/20 text-[#30d158]' :
                    result.result === 'revoked' ? 'bg-[#ff9f0a]/20 text-[#ff9f0a]' :
                      'bg-[#ff453a]/20 text-[#ff453a]'
                    }`}>
                    {result.result === 'authentic' ? <CheckCircle className="w-6 h-6" /> : <X className="w-6 h-6" />}
                  </div>
                  <div className="text-left flex-1">
                    <h4 className={`text-[19px] font-semibold mb-1 ${result.result === 'authentic' ? 'text-[#30d158]' :
                      result.result === 'revoked' ? 'text-[#ff9f0a]' :
                        'text-[#ff453a]'
                      }`}>
                      {result.result === 'authentic' ? 'Certificate is Authentic' :
                        result.result === 'revoked' ? 'Certificate Revoked' :
                          'Verification Failed'}
                    </h4>
                    <p className="text-[13px] text-[#86868b] mb-4">
                      {result.details?.message}
                    </p>

                    {result.details?.certId && (
                      <div className="bg-white/60 dark:bg-white/5 rounded-xl p-3 text-[13px] space-y-1">
                        <div className="flex justify-between"><span className="text-[#86868b]">ID:</span> <span className="font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">{result.details.certId}</span></div>
                        <div className="flex justify-between"><span className="text-[#86868b]">Date:</span> <span className="text-[#1d1d1f] dark:text-[#f5f5f7]">{new Date(result.details.blockchainTimestamp).toLocaleDateString()}</span></div>
                        <div className="flex justify-between"><span className="text-[#86868b]">Issuer:</span> <span className="font-mono text-[11px] text-[#1d1d1f] dark:text-[#f5f5f7]">{result.details.issuerAddress?.substring(0, 20)}...</span></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setResult(null); setFile(null); }}
                className="mt-6 w-full py-3 bg-[#0071e3] text-white font-medium rounded-full hover:bg-[#0077ed] transition-colors text-[15px]"
              >
                Verify Another Document
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
