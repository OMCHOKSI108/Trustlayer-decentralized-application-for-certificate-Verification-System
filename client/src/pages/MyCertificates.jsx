import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQr, setSelectedQr] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await api.get("/certificates");
      setCertificates(res.data);
    } catch (error) {
      toast.error("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (certId) => {
    if (!window.confirm("Are you sure you want to revoke this certificate?")) return;
    try {
      await api.put(`/certificates/${certId}/revoke`);
      toast.success("Certificate revoked");
      fetchCertificates();
    } catch (error) {
      toast.error(error.response?.data?.message || "Revocation failed");
    }
  };

  const handleDownloadQr = (cert) => {
    const link = document.createElement("a");
    link.href = cert.qrCode;
    link.download = `QR-${cert.certId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[14px] text-[#86868b] pt-8">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        Loading certificates...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-[28px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">My Certificates</h1>
          <p className="text-[15px] text-[#86868b] mt-1">Certificates issued by your institution</p>
        </div>
        <span className="text-[13px] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] px-3.5 py-1.5 rounded-full font-medium">
          {certificates.length} total
        </span>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl p-12 text-center">
          <svg className="w-12 h-12 text-[#d2d2d7] dark:text-[#48484a] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-[14px] text-[#86868b]">No certificates issued yet.</p>
        </div>
      ) : (
        <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="border-b border-[#d2d2d7] dark:border-[#38383a]">
              <tr>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Cert ID</th>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">SHA-256 Hash</th>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Student</th>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Expiry</th>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8ed] dark:divide-[#38383a]">
              {certificates.map((cert) => (
                <tr key={cert._id} className="hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-[11px] text-[#1d1d1f] dark:text-[#f5f5f7]">{cert.certId}</td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-[#86868b] max-w-[100px] truncate" title={cert.sha256Hash}>{cert.sha256Hash?.slice(0, 12)}...</td>
                  <td className="px-5 py-3.5 text-[#1d1d1f] dark:text-[#f5f5f7]">{cert.studentName || "N/A"}</td>
                  <td className="px-5 py-3.5 text-[#86868b]">{new Date(cert.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5 text-[#86868b]">{cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : "Never"}</td>
                  <td className="px-5 py-3.5">
                    {cert.revoked ? (
                      <span className="text-[11px] bg-[#ff453a]/10 text-[#ff453a] px-2.5 py-1 rounded-full font-medium">Revoked</span>
                    ) : (cert.isExpired || (cert.expiryDate && new Date(cert.expiryDate) < new Date())) ? (
                      <span className="text-[11px] bg-[#ff9f0a]/10 text-[#ff9f0a] px-2.5 py-1 rounded-full font-medium">Expired</span>
                    ) : (
                      <span className="text-[11px] bg-[#30d158]/10 text-[#30d158] px-2.5 py-1 rounded-full font-medium">Active</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 flex items-center gap-3">
                    {cert.qrCode && (
                      <button onClick={() => setSelectedQr(cert)} className="text-[12px] text-[#0071e3] hover:underline font-medium">QR</button>
                    )}
                    {!cert.revoked && (
                      <button onClick={() => handleRevoke(cert.certId)} className="text-[12px] text-[#ff453a] hover:underline font-medium">Revoke</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* QR Modal */}
      {selectedQr && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedQr(null)}>
          <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl max-w-sm w-full p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[19px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Certificate QR Code</h3>
            <p className="text-[13px] text-[#86868b] mb-4">Scan to verify certificate authenticity</p>

            <div className="bg-white p-2 border border-[#d2d2d7] rounded-xl inline-block mb-4">
              <img src={selectedQr.qrCode} alt="QR Code" className="w-48 h-48" />
            </div>

            <div className="space-y-2">
              <button onClick={() => handleDownloadQr(selectedQr)} className="w-full py-2.5 bg-[#0071e3] text-white font-medium rounded-full text-[14px] hover:bg-[#0077ed] transition-colors">
                Download QR Image
              </button>
              <button onClick={() => setSelectedQr(null)} className="w-full py-2.5 text-[#86868b] font-medium text-[14px] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] rounded-full transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCertificates;
