import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const VerificationHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/verify/history");
      setHistory(res.data);
    } catch (error) {
      toast.error("Failed to fetch verification history");
    } finally {
      setLoading(false);
    }
  };

  const getResultBadge = (result) => {
    const badges = {
      authentic: <span className="text-[11px] bg-[#30d158]/10 text-[#30d158] px-2.5 py-1 rounded-full font-medium">Authentic</span>,
      tampered: <span className="text-[11px] bg-[#ff453a]/10 text-[#ff453a] px-2.5 py-1 rounded-full font-medium">Tampered</span>,
      revoked: <span className="text-[11px] bg-[#ff9f0a]/10 text-[#ff9f0a] px-2.5 py-1 rounded-full font-medium">Revoked</span>,
      not_found: <span className="text-[11px] bg-[#ff453a]/10 text-[#ff453a] px-2.5 py-1 rounded-full font-medium">Unauthorized</span>,
    };
    return badges[result] || <span className="text-[11px] bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b] px-2.5 py-1 rounded-full font-medium">{result}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[14px] text-[#86868b] pt-8">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        Loading history...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-[28px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">Verification History</h1>
          <p className="text-[15px] text-[#86868b] mt-1">Your past certificate verification attempts</p>
        </div>
        <span className="text-[13px] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] px-3.5 py-1.5 rounded-full font-medium">
          {history.length} total
        </span>
      </div>

      {history.length === 0 ? (
        <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl p-12 text-center">
          <svg className="w-12 h-12 text-[#d2d2d7] dark:text-[#48484a] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-[14px] text-[#86868b]">No verifications performed yet.</p>
        </div>
      ) : (
        <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="border-b border-[#d2d2d7] dark:border-[#38383a]">
              <tr>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">File Hash</th>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Result</th>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8ed] dark:divide-[#38383a]">
              {history.map((item) => (
                <tr key={item._id} className="hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-[11px] text-[#1d1d1f] dark:text-[#f5f5f7] max-w-[220px] truncate" title={item.fileHash}>{item.fileHash?.slice(0, 20)}...</td>
                  <td className="px-5 py-3.5">{getResultBadge(item.result)}</td>
                  <td className="px-5 py-3.5 text-[#86868b]">
                    {new Date(item.createdAt).toLocaleDateString()}{" "}
                    <span className="text-[#a1a1a6]">{new Date(item.createdAt).toLocaleTimeString()}</span>
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

export default VerificationHistory;
