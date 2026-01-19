import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} GitStory. Built by Mitchell Leahy.</p>
      </div>
    </footer>
  );
};

export default Footer;
