import React from "react";
import { useSearchParams } from "react-router-dom";

const Analyze = () => {
  const [searchParams] = useSearchParams();
  const repoUrl = searchParams.get("repo");

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Repository Analysis</h2>
        <p className="text-gray-600 mb-8">
          Analyzing: <span className="font-mono text-blue-600">{repoUrl}</span>
        </p>

        {/* Placeholder for analysis results */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-500">Analysis results will appear here...</p>
        </div>
      </div>
    </main>
  );
};

export default Analyze;
