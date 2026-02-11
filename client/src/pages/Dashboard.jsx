import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      if (user.role === "university" || user.role === "admin") {
        const endpoint = user.role === "admin" ? "/admin/stats" : "/certificates/stats";
        const res = await api.get(endpoint);
        setStats(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats");
    }
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-[28px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">Dashboard</h1>
        <p className="text-[15px] text-[#86868b] mt-1">
          Welcome back, <span className="text-[#1d1d1f] dark:text-[#f5f5f7]">{user?.name}</span>
          {user?.role === "university" && user?.status === "pending" && (
            <span className="ml-2 text-[11px] bg-[#ff9f0a]/10 text-[#ff9f0a] px-2.5 py-1 rounded-full font-medium">
              Pending Approval
            </span>
          )}
        </p>
      </div>

      {/* University Dashboard */}
      {user?.role === "university" && stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <StatCard label="Total Certificates" value={stats.total} accent="border-l-[#0071e3]" onClick={() => navigate("/my-certificates")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
            <StatCard label="Issued Today" value={stats.today} accent="border-l-[#30d158]" onClick={() => navigate("/my-certificates")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
            <StatCard label="Revoked" value={stats.revoked} accent="border-l-[#ff453a]" valueColor="text-[#ff453a]" onClick={() => navigate("/my-certificates")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>} />
            <StatCard label="Expired" value={stats.expired || 0} accent="border-l-[#ff9f0a]" valueColor="text-[#ff9f0a]" onClick={() => navigate("/my-certificates")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          </div>

          <div className="mb-8">
            <StatCard
              label="Institution Trust Score"
              value={user.trustScore || 100}
              accent="border-l-[#5e5ce6]"
              valueColor={user.trustScore < 50 ? "text-[#ff453a]" : user.trustScore < 80 ? "text-[#ff9f0a]" : "text-[#30d158]"}
              onClick={null}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </div>
        </>
      )}

      {/* Admin Dashboard */}
      {user?.role === "admin" && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <StatCard label="Total Users" value={stats.totalUsers} accent="border-l-[#0071e3]" onClick={() => navigate("/admin/users")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" /></svg>} />
          <StatCard label="Universities" value={stats.totalUniversities} accent="border-l-[#5e5ce6]" onClick={() => navigate("/admin/users")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
          <StatCard label="Pending Approvals" value={stats.pendingUniversities} accent="border-l-[#ff9f0a]" valueColor={stats.pendingUniversities > 0 ? "text-[#ff9f0a]" : undefined} onClick={() => navigate("/admin/users")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          <StatCard label="Total Certificates" value={stats.totalCertificates} accent="border-l-[#30d158]" onClick={() => navigate("/admin/certificates")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          <StatCard label="Total Verifications" value={stats.totalVerifications} accent="border-l-[#64d2ff]" onClick={() => navigate("/verification-history")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>} />
          <StatCard label="Revoked" value={stats.revokedCertificates} accent="border-l-[#ff453a]" valueColor="text-[#ff453a]" onClick={() => navigate("/admin/certificates")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>} />
        </div>
      )}

      {/* User/Employer Dashboard */}
      {user?.role === "user" && (
        <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl p-8 max-w-2xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#0071e3]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#0071e3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">How Verification Works</h2>
              <p className="text-[13px] text-[#86868b] mb-5 leading-relaxed">
                Upload any certificate file and our system will compute its hash and verify it directly against the Ethereum blockchain.
              </p>
              <div className="space-y-3">
                <Step number="1" text='Go to "Verify Certificate" in the sidebar' />
                <Step number="2" text="Upload the certificate file (PDF or Image)" />
                <Step number="3" text="The system hashes the file and queries the blockchain" />
                <Step number="4" text="System confirms: Authentic, Unauthorized, or Revoked" />
              </div>
            </div>
          </div>
        </div>
      )}

      {user?.role === "university" && user?.status === "pending" && (
        <div className="flex items-start gap-3 bg-[#ff9f0a]/5 border border-[#ff9f0a]/20 rounded-xl p-5 text-[13px] max-w-2xl">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#ff9f0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">Account Pending Approval</p>
            <p className="text-[#86868b] mt-1">Your university account is awaiting admin approval. You'll be able to issue certificates once approved.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Step = ({ number, text }) => (
  <div className="flex items-center gap-3">
    <span className="w-6 h-6 bg-[#0071e3] text-white rounded-full text-[11px] flex items-center justify-center font-semibold flex-shrink-0">
      {number}
    </span>
    <span className="text-[13px] text-[#1d1d1f] dark:text-[#d2d2d7]">{text}</span>
  </div>
);

const StatCard = ({ label, value, icon, accent = "border-l-[#0071e3]", valueColor = "text-[#1d1d1f] dark:text-[#f5f5f7]", onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-xl p-5 border-l-[3px] ${accent} ${onClick ? "cursor-pointer hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e] transition-all" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] text-[#86868b] uppercase tracking-wider font-semibold">{label}</p>
        <div className="text-[#86868b]">{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <p className={`text-[28px] font-semibold tracking-tight ${valueColor}`}>{value}</p>
        {onClick && (
          <svg className="w-4 h-4 text-[#86868b] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
