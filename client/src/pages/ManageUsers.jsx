import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/admin/university/${id}`, { status });
      toast.success(`University ${status}`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/user/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filter === "all") return true;
    if (filter === "pending") return u.role === "university" && u.status === "pending";
    return u.role === filter;
  });

  const pendingCount = users.filter(u => u.role === "university" && u.status === "pending").length;

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[14px] text-[#86868b] pt-8">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        Loading users...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">Manage Users</h1>
          <p className="text-[15px] text-[#86868b] mt-1">{users.length} total users</p>
        </div>
        {pendingCount > 0 && (
          <span className="text-[11px] bg-[#ff9f0a]/10 text-[#ff9f0a] px-3 py-1.5 rounded-full font-medium">
            {pendingCount} pending
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {["all", "pending", "university", "user"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[12px] px-4 py-2 rounded-full font-medium transition-all ${filter === f
                ? "bg-[#1d1d1f] dark:bg-[#f5f5f7] text-white dark:text-[#1d1d1f]"
                : "bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]"
              }`}
          >
            {f === "all" && "All"}
            {f === "pending" && "Pending Approval"}
            {f === "university" && "Universities"}
            {f === "user" && "Users"}
          </button>
        ))}
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl p-12 text-center">
          <svg className="w-12 h-12 text-[#d2d2d7] dark:text-[#48484a] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <p className="text-[14px] text-[#86868b]">No users found for this filter.</p>
        </div>
      ) : (
        <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="border-b border-[#d2d2d7] dark:border-[#38383a]">
              <tr>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Organization</th>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Joined</th>
                <th className="text-left px-5 py-3.5 text-[#86868b] font-semibold text-[11px] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8ed] dark:divide-[#38383a]">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{u.name}</td>
                  <td className="px-5 py-3.5 text-[#86868b]">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-[11px] bg-white/80 dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] px-2.5 py-1 rounded-full capitalize font-medium">{u.role}</span>
                  </td>
                  <td className="px-5 py-3.5 text-[#1d1d1f] dark:text-[#f5f5f7]">{u.organization || "-"}</td>
                  <td className="px-5 py-3.5">
                    {u.status === "pending" && <span className="text-[11px] bg-[#ff9f0a]/10 text-[#ff9f0a] px-2.5 py-1 rounded-full font-medium">Pending</span>}
                    {u.status === "approved" && <span className="text-[11px] bg-[#30d158]/10 text-[#30d158] px-2.5 py-1 rounded-full font-medium">Approved</span>}
                    {u.status === "rejected" && <span className="text-[11px] bg-[#ff453a]/10 text-[#ff453a] px-2.5 py-1 rounded-full font-medium">Rejected</span>}
                  </td>
                  <td className="px-5 py-3.5 text-[#86868b]">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      {u.role === "university" && u.status === "pending" && (
                        <>
                          <button onClick={() => handleStatusUpdate(u._id, "approved")} className="text-[11px] bg-[#30d158] text-white px-3 py-1.5 rounded-full hover:bg-[#28c04d] font-medium transition-colors">Approve</button>
                          <button onClick={() => handleStatusUpdate(u._id, "rejected")} className="text-[11px] text-[#ff453a] border border-[#ff453a]/30 px-3 py-1.5 rounded-full hover:bg-[#ff453a]/10 font-medium transition-colors">Reject</button>
                        </>
                      )}
                      {u.role !== "admin" && (
                        <button onClick={() => handleDelete(u._id)} className="text-[12px] text-[#ff453a] hover:underline font-medium">Delete</button>
                      )}
                    </div>
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

export default ManageUsers;
