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
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Diagnose Your Repository's Health
          </h2>
          <p className="text-xl text-gray-600">
            Analyze commit history, identify problem areas, and get actionable insights
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Run Checkup
            </button>
          </div>
        </form>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Commit History</h3>
            <p className="text-gray-600">Track every change with clear, readable summaries</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hotspot Detection</h3>
            <p className="text-gray-600">Find files that need the most attention</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tech Debt Report</h3>
            <p className="text-gray-600">Prioritized list of areas to improve</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
