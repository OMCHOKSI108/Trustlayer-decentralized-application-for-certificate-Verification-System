import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import UniversityFooter from "./UniversityFooter";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col transition-colors duration-200">
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 pt-16">
        {/* Sidebar: Mobile overlay & Desktop fixed */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 p-4 md:p-8 transition-all duration-300 ${isSidebarOpen ? 'overflow-hidden' : ''} w-full`}>
          <Outlet />
        </main>
      </div>

      <div className="w-full">
        {user?.role === "university" ? <UniversityFooter /> : <Footer />}
      </div>
    </div>
  );
};

export default Layout;
