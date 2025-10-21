import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, Wind, LogOut } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const NavBar = () => {
  const { user, cart, logoutUser } = useAppContext(); // <-- Added logout
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // === Scroll Hide/Show Logic ===
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(window.scrollY);
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } ${
        scrolled
          ? "bg-gradient-to-r from-green-700/90 to-blue-700/90 shadow-lg backdrop-blur-lg"
          : "bg-transparent"
      }`}
      onMouseEnter={() => setVisible(true)}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 hover:scale-105 transition-transform"
        >
          <Wind className="w-7 h-7 text-green-400" />
          AQ Monitor
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center font-medium text-gray-100">
          {[
            { name: "Home", to: "/" },
            { name: "Shop", to: "/shop" },
            { name: "Dashboard", to: "/dashboard" },
            { name: "Recent", to: "/recent" },
            { name: "About", to: "/about" },
            { name: "Contact", to: "/contact" },
          ].map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="relative group text-gray-200 hover:text-white transition-colors"
            >
              {link.name}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-green-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}

          {/* Cart */}
          <Link
            to="/cart"
            className="flex items-center gap-1 text-gray-200 hover:text-blue-300 transition-colors"
          >
            <ShoppingCart size={18} />
            <span>({cart?.length || 0})</span>
          </Link>

          {/* Login / Greeting + Logout */}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="italic text-green-300">Hi, {user.name}</span>
              <button
                onClick={logoutUser}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 transition"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-green-300 hover:text-blue-300 transition-colors"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-b from-green-800/95 to-blue-800/95 backdrop-blur-lg border-t border-white/20 py-4 animate-slideDown">
          <div className="flex flex-col items-center gap-4 text-gray-100 font-medium">
            {[
              { name: "Home", to: "/" },
              { name: "Shop", to: "/shop" },
              { name: "Dashboard", to: "/dashboard" },
              { name: "Recent", to: "/recent" },
              { name: "About", to: "/about" },
              { name: "Contact", to: "/contact" },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="hover:text-green-300 transition-colors"
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 hover:text-blue-300 transition-colors"
            >
              <ShoppingCart size={18} />
              <span>Cart ({cart?.length || 0})</span>
            </Link>

            {/* Login / Logout for mobile */}
            {user ? (
              <>
                <span className="italic text-green-300">Hi, {user.name}</span>
                <button
                  onClick={() => {
                    logoutUser();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 transition"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
