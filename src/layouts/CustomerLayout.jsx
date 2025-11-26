//src/layouts/ShopAdminLayout.jsc
import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function CustomerLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "My Profile", path: "/customer/Profile" },
    { name: "Bill History", path: "/customer/CBills" },

  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");

    navigate("/"); // Redirect to home screen
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
      {/* ---------------- SIDEBAR (DESKTOP) ---------------- */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 shadow-lg p-4 gap-2">
        <h1 className="text-2xl font-bold mb-6 text-center">Billo</h1>

        <nav className="flex flex-col gap-2 flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-xl transition-all text-sm font-medium 
                hover:bg-gray-200 dark:hover:bg-gray-700 
                ${location.pathname === item.path ? "bg-gray-200 dark:bg-brand-accent text-black font-semibold" : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout - Desktop */}
        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* ---------------- MOBILE TOP NAVBAR ---------------- */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center z-50">
        <h1 className="text-xl font-bold">Billo</h1>
        <Menu className="w-6 h-6" onClick={() => setMobileOpen(true)} />
      </div>

      {/* ---------------- MOBILE SIDEBAR OVERLAY ---------------- */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* ---------------- MOBILE SIDEBAR ---------------- */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg p-4 z-50 transform transition-transform duration-200 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Billo</h1>
          <X className="w-6 h-6" onClick={() => setMobileOpen(false)} />
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-2 rounded-xl transition-all text-sm font-medium 
                hover:bg-brand-accent-200 dark:hover:bg-gray-700 
                ${location.pathname === item.path ? "bg-accent-200 dark:brand-accent  font-semibold" : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout - Mobile */}
        <button
          onClick={() => {
            setMobileOpen(false);
            handleLogout();
          }}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 overflow-y-auto p-4 md:ml-0 mt-14 md:mt-0">
        <Outlet />
      </main>
    </div>
  );
}
