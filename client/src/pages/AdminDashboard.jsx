import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch admin stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[14px] text-[#86868b] pt-8">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-[28px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">Admin Dashboard</h1>
        <p className="text-[15px] text-[#86868b] mt-1">System overview and management</p>
      </div>

      {stats && (
        <>
          <h2 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest mb-3">Users</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard label="Total Users" value={stats.totalUsers} color="#0071e3" onClick={() => navigate("/admin/users")}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>} />
            <StatCard label="Universities" value={stats.totalUniversities} color="#5e5ce6" onClick={() => navigate("/admin/users")}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
            <StatCard label="Pending Approvals" value={stats.pendingUniversities} color="#ff9f0a" onClick={() => navigate("/admin/users")}
              badge={stats.pendingUniversities > 0 ? "Action needed" : null}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          </div>

          <h2 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest mb-3">Certificates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard label="Total Certificates" value={stats.totalCertificates} color="#30d158" onClick={() => navigate("/admin/certificates")}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            <StatCard label="Total Verifications" value={stats.totalVerifications} color="#5e5ce6" onClick={() => navigate("/verification-history")}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>} />
            <StatCard label="Revoked" value={stats.revokedCertificates} color="#ff453a" onClick={() => navigate("/admin/certificates")}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>} />
          </div>
        </>
      )}

      <h2 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest mb-3">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { to: "/admin/users", title: "Manage Users", desc: "Approve universities, manage user accounts", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" },
          { to: "/admin/certificates", title: "All Certificates", desc: "View and manage all issued certificates", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
          { to: "/verify", title: "Verify Certificate", desc: "Check certificate authenticity", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
          { to: "/verification-history", title: "Verification History", desc: "View past verification records", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl p-5 hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e] transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0071e3]/10 rounded-xl flex items-center justify-center group-hover:bg-[#0071e3]/15 transition-colors">
                <svg className="w-5 h-5 text-[#0071e3]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
              </div>
              <div className="flex-1">
                <h3 className="text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{item.title}</h3>
                <p className="text-[12px] text-[#86868b] mt-0.5">{item.desc}</p>
              </div>
              <svg className="w-4 h-4 text-[#d2d2d7] dark:text-[#48484a] group-hover:text-[#86868b] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color = "#0071e3", onClick, icon, badge }) => {
  return (
    <div onClick={onClick} className={`bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl p-5 ${onClick ? "cursor-pointer hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e] transition-all group" : ""}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] text-[#86868b] uppercase tracking-wider font-semibold">{label}</p>
        <div className="flex items-center gap-2">
          {badge && <span className="text-[10px] font-medium bg-[#ff9f0a]/10 text-[#ff9f0a] px-2 py-0.5 rounded-full">{badge}</span>}
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-[28px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{value}</p>
        {onClick && (
          <svg className="w-4 h-4 text-[#d2d2d7] dark:text-[#48484a] group-hover:text-[#86868b] transition-colors mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
