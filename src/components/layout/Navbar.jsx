import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo-frame.png";

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    setShowMobileMenu(false);
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Checkup" },
    { to: "/hotspots", label: "Hotspots" },
    { to: "/chat", label: "Code Diagnostic" },
    { to: "/document", label: "Document" },
  ];

  return (
    <header className="bg-gradient-to-r from-[#0a1828] via-blue-950 to-[#0a1828] text-[#178582] border-b border-solid border-[#bfa174] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <img src={logo} alt="SustainRx" className="h-10 lg:h-12 w-auto" />
            <h1 className="text-2xl lg:text-3xl font-bold">
              Sustain<span className="text-[#bfa174]">Rx</span>
            </h1>
          </Link>

          {/* Desktop Nav Links */}
          {isAuthenticated && (
            <div className="hidden lg:block text-lg font-bold text-[#178582]">
              <ul className="flex list-none justify-between gap-8">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="hover:text-[#bfa174] transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Right side: auth buttons + hamburger */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* User dropdown (desktop) */}
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#bfa174] hover:bg-[#0a1828] transition"
                  >
                    {user?.photoURL && (
                      <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
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
                        onClick={() => { navigate("/profile"); setShowUserMenu(false); }}
                        className="block w-full text-left px-4 py-2 hover:bg-blue-950 hover:text-[#bfa174] transition"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => { navigate("/settings"); setShowUserMenu(false); }}
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

                {/* Hamburger button (mobile) */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden p-2 rounded-lg border border-[#bfa174] hover:bg-[#0a1828] transition"
                >
                  {showMobileMenu ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleLogin}
                  className="px-3 py-2 text-sm lg:px-4 lg:text-base text-[#178582] border border-[#178582] rounded-lg hover:bg-[#178582] hover:text-[#0a1828] transition font-semibold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/onboarding/1")}
                  className="px-3 py-2 text-sm lg:px-4 lg:text-base bg-[#bfa174] text-[#0a1828] rounded-lg hover:bg-[#a89060] transition font-semibold"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && showMobileMenu && (
          <div className="lg:hidden mt-4 pt-4 border-t border-[#bfa174]/30">
            <nav className="flex flex-col gap-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setShowMobileMenu(false)}
                  className="px-4 py-3 text-lg font-semibold text-[#178582] hover:text-[#bfa174] hover:bg-[#0a1828] rounded-lg transition"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-[#bfa174]/30 pt-3 flex flex-col gap-1">
              <div className="flex items-center gap-3 px-4 py-2 text-gray-400">
                {user?.photoURL && (
                  <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
                )}
                <span className="font-semibold text-[#178582]">{user?.displayName || "User"}</span>
              </div>
              <button
                onClick={() => { navigate("/profile"); setShowMobileMenu(false); }}
                className="w-full text-left px-4 py-3 hover:bg-[#0a1828] hover:text-[#bfa174] rounded-lg transition"
              >
                Profile
              </button>
              <button
                onClick={() => { navigate("/settings"); setShowMobileMenu(false); }}
                className="w-full text-left px-4 py-3 hover:bg-[#0a1828] hover:text-[#bfa174] rounded-lg transition"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-[#0a1828] hover:text-red-400 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
