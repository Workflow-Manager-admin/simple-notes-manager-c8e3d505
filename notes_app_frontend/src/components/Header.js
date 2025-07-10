import React from "react";

// PUBLIC_INTERFACE
function Header({ theme, toggleTheme, user, onLogout }) {
  return (
    <header className="header">
      <span className="app-title">Notes App</span>
      <div className="header-actions">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        {user ? (
          <span className="user-block">
            <span className="user-email">{user.email}</span>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </span>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
