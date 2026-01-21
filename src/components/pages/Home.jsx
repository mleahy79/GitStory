import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Parse repo URL and navigate to analysis page
    if (repoUrl.trim()) {
      navigate(`/analyze?repo=${encodeURIComponent(repoUrl)}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A1828]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-[#178582] mb-6 mt-1">
              Your Prescription for <span className="text-[#bfa174]">Sustainable Code</span>
            </h1>
          <h2 className="text-4xl font-bold text-[#178582] mb-4">
            Check Your Repository's Vital Signs
          </h2>
          <p className="text-xl text-gray-400">
            A complete health checkup for your codebase. Detect symptoms early,
            diagnose problem areas, and get a treatment plan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="flex-1 px-4 py-3 bg-[#1a2d3d] border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-[#178582] focus:border-transparent outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#178582] text-white font-semibold rounded-lg hover:bg-[#1a9d9a] transition-colors"
            >
              Start Checkup
            </button>
          </div>
        </form>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#1a2d3d] p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-[#bfa174] mb-2">Medical History</h3>
            <p className="text-gray-400">Review your commit timeline with clear, readable case notes</p>
          </div>
          <div className="bg-[#1a2d3d] p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-[#bfa174] mb-2">Hotspot Scan</h3>
            <p className="text-gray-400">Identify inflamed files that show signs of chronic issues</p>
          </div>
          <div className="bg-[#1a2d3d] p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-[#bfa174] mb-2">Treatment Plan</h3>
            <p className="text-gray-400">Prioritized prescriptions to reduce tech debt symptoms</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
