import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SidebarLink = ({ to, icon, children, isChild = false, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    end={to === "/admin"}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 text-[13px] rounded-lg transition-colors ${isActive
        ? "bg-[#0071e3]/10 text-[#0071e3] font-medium dark:bg-[#0071e3]/15 dark:text-[#2997ff]"
        : "text-[#1d1d1f] hover:bg-black/5 dark:text-[#f5f5f7] dark:hover:bg-white/5"
      }`
    }
  >
    <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">{icon}</span>
    {children}
  </NavLink>
);

const SectionLabel = ({ children }) => (
  <p className="text-[10px] uppercase text-[#86868b] font-semibold mt-6 mb-2 px-3 tracking-widest">
    {children}
  </p>
);

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  return (
    <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#f5f5f7] dark:bg-[#000000] border-r border-[#d2d2d7] dark:border-[#38383a] pt-20 pb-4
        transition-transform duration-300 ease-in-out transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:inset-auto md:h-[calc(100vh-4rem)] md:pt-4
    `}>
      <div className="h-full overflow-y-auto px-3 py-2">
        <SectionLabel>Main</SectionLabel>
        <nav className="space-y-1">
          <SidebarLink
            to="/dashboard"
            onClick={onClose}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            }
          >
            Dashboard
          </SidebarLink>
          <SidebarLink
            to="/profile"
            onClick={onClose}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          >
            My Profile
          </SidebarLink>

          {/* University links */}
          {user?.role === "university" && (
            <>
              <SectionLabel>Certificates</SectionLabel>
              <SidebarLink
                to="/issue"
                onClick={onClose}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                Issue Certificate
              </SidebarLink>
              <SidebarLink
                to="/my-certificates"
                onClick={onClose}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              >
                My Certificates
              </SidebarLink>
            </>
          )}

          {/* User/Employer links */}
          {user?.role === "user" && (
            <>
              <SectionLabel>Verification</SectionLabel>
              <SidebarLink
                to="/verify"
                onClick={onClose}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                Verify Certificate
              </SidebarLink>
              <SidebarLink
                to="/verification-history"
                onClick={onClose}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                Verification History
              </SidebarLink>
            </>
          )}

          {/* Admin links */}
          {user?.role === "admin" && (
            <>
              <SectionLabel>Administration</SectionLabel>
              <SidebarLink
                to="/admin"
                onClick={onClose}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              >
                Admin Overview
              </SidebarLink>
              <SidebarLink
                to="/admin/users"
                isChild
                onClick={onClose}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                }
              >
                Manage Users
              </SidebarLink>
              <SidebarLink
                to="/admin/certificates"
                isChild
                onClick={onClose}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                }
              >
                All Certificates
              </SidebarLink>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
