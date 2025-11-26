// src/layouts/MainLayout.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png"; // change if needed

export default function MainLayout({ children }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    { name: "Home", path: "/" },
    { name: "Login", path: "/login" },
    { name: "Signup", path: "/signup" },
  ];

  return (
    <div className="min-h-screen flex bg-brand-light">

      {/* ---------------- DESKTOP SIDEBAR ---------------- */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen bg-brand-primary text-white p-5 shadow-lg">
        <div className="flex items-center mb-8 gap-3">
          <img src={logo} alt="Billo Logo" className="w-12 h-12 object-contain" />
          <h2 className="text-xl font-bold">Billo</h2>
        </div>

        <nav className="flex flex-col gap-3">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`p-3 rounded-lg text-lg duration-200 ${
                location.pathname === item.path
                  ? "bg-brand-accent text-black font-semibold"
                  : "hover:bg-brand-mid hover:text-black"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ---------------- MAIN CONTENT AREA ---------------- */}
      <div className="flex flex-col flex-1">
        
        {/* ---------------- TOP NAVBAR (Desktop + Mobile) ---------------- */}
        <nav className="w-full h-16 bg-brand-primary text-white flex items-center justify-between px-6 shadow-md md:justify-between">
          
          {/* Logo + (Mobile Hamburger) */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Billo Logo"
              className="w-10 h-10 object-contain rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50 animate-bounce"
            />
            <h1 className="text-xl font-bold">Billo</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 text-lg font-medium">
            <Link to="/" className="hover:text-brand-accent duration-200">Home</Link>
            <Link to="/login" className="hover:text-brand-accent duration-200">Login</Link>
            <Link to="/signup" className="hover:text-brand-accent duration-200">Signup</Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(true)}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </nav>

        {/* ---------------- MOBILE SIDEBAR DRAWER ---------------- */}
        <div
          className={`fixed top-0 left-0 h-full w-60 bg-brand-primary text-white p-5 transform transition-transform duration-300 z-50 md:hidden ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Billo</h2>
            <button onClick={() => setIsOpen(false)} className="text-xl font-bold">
              X
            </button>
          </div>

          <nav className="flex flex-col gap-3">
            {menu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`p-3 rounded-lg text-lg duration-200 ${
                  location.pathname === item.path
                    ? "bg-brand-accent text-black font-semibold"
                    : "hover:bg-brand-mid hover:text-black"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* ---------------- MAIN PAGE CONTENT ---------------- */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
