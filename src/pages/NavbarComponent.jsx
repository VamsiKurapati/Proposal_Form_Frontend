// components/NavbarComponent.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch, FiBell, FiMenu } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useUser } from "../context/UserContext";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const { role } = useUser();

  const navItems = [
    { name: "Discover", path: "/rfp_discovery" },
    { name: "Proposals", path: "/proposals" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Profile", path: role === "company" ? "/company_profile_dashboard" : "/employee_profile_dashboard" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b shadow-sm h-16 flex items-center justify-between px-8 z-50">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <FiMenu className="text-lg" onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} />
        </div>
        <span
          className="font-bold text-xl cursor-pointer"
          onClick={() => navigate("/")}
        >
          LOGO
        </span>
        <div className="hidden md:flex gap-6 ml-16">
          {navItems.map(({ name, path }) => (
            <button
              key={name}
              onClick={() => navigate(path)}
              className={`text-[18px] hover:text-[#000000] font-medium ${location.pathname === path ? "text-[#2563EB]" : "text-[#4B5563] font-regular"
                }`}
            >
              {name}
            </button>
          ))}
        </div>
        {/* Mobile Nav */}
        {isMobileNavOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-md z-50">
            {navItems.map(({ name, path }) => (
              <button key={name} onClick={() => navigate(path)} className={`block w-full text-left px-4 py-2 text-[18px] hover:text-[#000000] font-medium ${location.pathname === path ? "text-[#2563EB]" : "text-[#4B5563] font-regular"
                }`}>
                {name}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <FiSearch className="text-lg" />
        <FiBell className="text-lg" />
        <FaUserCircle className="text-2xl text-gray-700" />
      </div>
    </nav>
  );
};

export default NavbarComponent;
