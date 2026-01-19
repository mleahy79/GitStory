import React from "react";

const Navbar = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">GitStory</h1>
            <p className="text-blue-100 mt-1">
              Code Sustainability & History Analyzer
            </p>
          </div>
          <div className="text-sm text-blue-100"></div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
