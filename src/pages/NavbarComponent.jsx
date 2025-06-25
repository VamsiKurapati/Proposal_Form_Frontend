// components/NavbarComponent.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch, FiBell } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Discover", path: "/discover" },
    { name: "My Proposals", path: "/my_proposals" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b shadow-sm h-16 flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-4">
        <span
          className="font-bold text-xl cursor-pointer"
          onClick={() => navigate("/")}
        >
          LOGO
        </span>
        <div className="hidden md:flex gap-6 text-sm ml-6">
          {navItems.map(({ name, path }) => (
            <button
              key={name}
              onClick={() => navigate(path)}
              className={`hover:text-[#2563EB] text-gray-700 font-medium ${
                location.pathname === path ? "text-[#2563EB]" : ""
              }`}
            >
              {name}
            </button>
          ))}
        </div>
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
