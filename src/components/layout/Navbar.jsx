import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo-frame.png";

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-[#0a1828] via-blue-950 to-[#0a1828] text-[#178582] border-b borrder-solid border-[#bfa174] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition">
            <img src={logo} alt="SustainRx" className="h-12 w-auto" />
            <h1 className="text-3xl font-bold">
              Sustain<span className="text-[#bfa174]">Rx</span>
            </h1>
          </Link>

          {isAuthenticated && (
            <div className="text-lg font-bold text-[#178582]">
              <ul className="flex list-none justify-between gap-8">
                <li className="hover:text-[#bfa174] cursor-pointer transition">Checkup</li>
                <li className="hover:text-[#bfa174] cursor-pointer transition">Hotspots</li>
                <li className="hover:text-[#bfa174] cursor-pointer transition">Code Diagnostic</li>
                <li className="hover:text-[#bfa174] cursor-pointer transition">Document</li>
              </ul>
            </div>
          )}

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#bfa174] hover:bg-[#0a1828] transition"
                >
                  {user?.photoURL && (
                    <img
                      src={user.photoURL}
                      alt=""
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span>{user?.displayName || "User"}</span>
                  <svg
                    className={`w-4 h-4 transition ${showUserMenu ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0a1828] border border-[#bfa174] rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-blue-950 hover:text-[#bfa174] transition"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate("/settings");
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-blue-950 hover:text-[#bfa174] transition"
                    >
                      Settings
                    </button>
                    <hr className="border-[#bfa174] my-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-blue-950 hover:text-red-400 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 text-[#178582] border border-[#178582] rounded-lg hover:bg-[#178582] hover:text-[#0a1828] transition font-semibold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 bg-[#bfa174] text-[#0a1828] rounded-lg hover:bg-[#a89060] transition font-semibold"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
