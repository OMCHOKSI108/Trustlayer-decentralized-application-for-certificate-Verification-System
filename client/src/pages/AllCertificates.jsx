import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AllCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCertificates(); }, []);

  const fetchCertificates = async () => {
    try {
      const res = await api.get("/certificates");
      setCertificates(res.data);
    } catch (error) {
      toast.error("Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (certId) => {
    if (!window.confirm("Are you sure you want to revoke this certificate?")) return;
    try {
      await api.put(`/certificates/revoke/${certId}`);
      toast.success("Certificate revoked");
      fetchCertificates();
    } catch (error) {
      toast.error("Failed to revoke certificate");
    }
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
          <h1 className="text-[28px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">All Certificates</h1>
          <p className="text-[15px] text-[#86868b] mt-1">All certificates across all universities</p>
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
          <p className="text-[14px] text-[#86868b]">No certificates have been issued yet.</p>
        </div>
      ) : (
        <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="border-b border-[#d2d2d7] dark:border-[#38383a]">
              <tr>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Cert ID</th>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Issued By</th>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8ed] dark:divide-[#38383a]">
              {certificates.map((cert) => (
                <tr key={cert._id} className="hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-[11px] text-[#1d1d1f] dark:text-[#f5f5f7]">{cert.certId}</td>
                  <td className="px-5 py-3.5 font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{cert.issuedBy?.organization || cert.issuedBy?.name || "-"}</td>
                  <td className="px-5 py-3.5 text-[#86868b]">{new Date(cert.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    {cert.revoked ? (
                      <span className="text-[11px] bg-[#ff453a]/10 text-[#ff453a] px-2.5 py-1 rounded-full font-medium">Revoked</span>
                    ) : (
                      <span className="text-[11px] bg-[#30d158]/10 text-[#30d158] px-2.5 py-1 rounded-full font-medium">Active</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
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
    </div>
  );
};

export default AllCertificates;
