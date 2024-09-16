"use client";

import React from "react";

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    // Make a POST request to the logout API
    await fetch("/api/logout", {
      method: "POST",
    });
    // Reload the page to update the UI
    window.location.reload();
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
