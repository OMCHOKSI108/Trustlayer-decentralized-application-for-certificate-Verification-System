import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, setUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    organization: user?.organization || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const roleLabel = {
    admin: "Administrator",
    university: "University / Institution",
    user: "Employer / Verifier",
  };

  const statusBadge = {
    approved: "bg-[#30d158]/10 text-[#30d158]",
    pending: "bg-[#ff9f0a]/10 text-[#ff9f0a]",
    rejected: "bg-[#ff453a]/10 text-[#ff453a]",
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await api.put("/auth/profile", profileData);
      setUser(res.data.user);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    setPasswordLoading(true);
    try {
      const res = await api.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success(res.data.message);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-[28px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">My Profile</h1>
        <p className="text-[15px] text-[#86868b] mt-1">View and manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl p-6 text-center">
            <div className="w-20 h-20 bg-[#0071e3]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-semibold text-[#0071e3]">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{user?.name}</h2>
            <p className="text-[13px] text-[#86868b] mt-0.5">{user?.email}</p>
            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
              <span className="text-[11px] bg-[#0071e3]/10 text-[#0071e3] px-2.5 py-1 rounded-full font-medium">
                {roleLabel[user?.role] || user?.role}
              </span>
              {user?.role === "university" && user?.status && (
                <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${statusBadge[user.status]}`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              )}
            </div>
            {user?.organization && (
              <div className="mt-4 pt-4 border-t border-[#d2d2d7] dark:border-[#38383a]">
                <p className="text-[10px] text-[#86868b] uppercase tracking-wider font-semibold">Organization</p>
                <p className="text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7] font-medium mt-1">{user.organization}</p>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-[#d2d2d7] dark:border-[#38383a]">
              <p className="text-[10px] text-[#86868b] uppercase tracking-wider font-semibold">Member Since</p>
              <p className="text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7] font-medium mt-1">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Update Profile */}
          <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl p-6">
            <h3 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">Update Profile</h3>
            <p className="text-[12px] text-[#86868b] mb-5">Change your display name and organization details</p>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#2c2c2e] border border-[#d2d2d7] dark:border-[#38383a] rounded-lg text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-[#e8e8ed] dark:bg-[#38383a] border border-[#d2d2d7] dark:border-[#48484a] rounded-lg text-[14px] text-[#86868b] cursor-not-allowed"
                />
                <p className="text-[11px] text-[#86868b] mt-1">Email cannot be changed</p>
              </div>

              {user?.role === "university" && (
                <div>
                  <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Organization Name</label>
                  <input
                    type="text"
                    value={profileData.organization}
                    onChange={(e) => setProfileData({ ...profileData, organization: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#2c2c2e] border border-[#d2d2d7] dark:border-[#38383a] rounded-lg text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Role</label>
                <input
                  type="text"
                  value={roleLabel[user?.role] || user?.role}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-[#e8e8ed] dark:bg-[#38383a] border border-[#d2d2d7] dark:border-[#48484a] rounded-lg text-[14px] text-[#86868b] cursor-not-allowed"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="bg-[#0071e3] text-white px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#0077ed] disabled:opacity-50 transition-colors"
                >
                  {profileLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl p-6">
            <h3 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">Change Password</h3>
            <p className="text-[12px] text-[#86868b] mb-5">Ensure your account stays secure by updating your password</p>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#2c2c2e] border border-[#d2d2d7] dark:border-[#38383a] rounded-lg text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={6}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#2c2c2e] border border-[#d2d2d7] dark:border-[#38383a] rounded-lg text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#2c2c2e] border border-[#d2d2d7] dark:border-[#38383a] rounded-lg text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="bg-[#ff453a] text-white px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#ff6961] disabled:opacity-50 transition-colors"
                >
                  {passwordLoading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
