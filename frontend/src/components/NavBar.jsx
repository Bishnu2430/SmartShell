import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext"; // ✅ Corrected import path

const NavBar = () => {
  const { user, cart } = useAppContext();

  return (
    <nav
      style={{
        backgroundColor: "#000",
        color: "#FFD700",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo / Title */}
      <h1 style={{ fontWeight: "bold", fontSize: "1.5rem" }}>AQ Monitor</h1>

      {/* Nav Links */}
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <Link style={{ color: "#FFD700", textDecoration: "none" }} to="/">
          Home
        </Link>
        <Link style={{ color: "#FFD700", textDecoration: "none" }} to="/shop">
          Shop
        </Link>
        <Link
          style={{ color: "#FFD700", textDecoration: "none" }}
          to="/dashboard"
        >
          Dashboard
        </Link>
        <Link style={{ color: "#FFD700", textDecoration: "none" }} to="/recent">
          Recent
        </Link>
        <Link style={{ color: "#FFD700", textDecoration: "none" }} to="/about">
          About
        </Link>
        <Link
          style={{ color: "#FFD700", textDecoration: "none" }}
          to="/contact"
        >
          Contact
        </Link>
        <Link style={{ color: "#FFD700", textDecoration: "none" }} to="/cart">
          Cart ({cart?.length || 0})
        </Link>

        {/* Conditional Login / Greeting */}
        {user ? (
          <span style={{ fontStyle: "italic" }}>Hi, {user.name}</span>
        ) : (
          <Link
            style={{ color: "#FFD700", textDecoration: "none" }}
            to="/login"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
