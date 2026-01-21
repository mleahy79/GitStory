import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { parseGitHubUrl, getRepoInfo, getCommits } from "../../services/github";

const Analyze = () => {
  const [searchParams] = useSearchParams();
  const repoUrl = searchParams.get("repo");

  const [repoInfo, setRepoInfo] = useState(null);
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!repoUrl) {
        setError("No repository URL provided");
        setLoading(false);
        return;
      }

      try {
        const { owner, repo } = parseGitHubUrl(repoUrl);

        // Fetch repo info and commits in parallel
        const [repoData, commitsData] = await Promise.all([
          getRepoInfo(owner, repo),
          getCommits(owner, repo, 1, 50), // Get first 50 commits
        ]);

        setRepoInfo(repoData);
        setCommits(commitsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [repoUrl]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A1828] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#178582] mx-auto mb-4"></div>
          <p className="text-gray-400">Running diagnostic scans...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0A1828]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-6">
            <h2 className="text-red-400 font-semibold mb-2">Diagnosis Failed</h2>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A1828]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Patient Chart Header */}
        {repoInfo && (
          <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6 mb-6">
            <h2 className="text-2xl font-bold text-[#bfa174] mb-2">
              Patient: {repoInfo.full_name}
            </h2>
            <p className="text-gray-400 mb-4">{repoInfo.description}</p>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <span>Popularity: {repoInfo.stargazers_count} stars</span>
              <span>Forks: {repoInfo.forks_count}</span>
              <span>Open Issues: {repoInfo.open_issues_count}</span>
              <span>Records Loaded: {commits.length}+ commits</span>
            </div>
          </div>
        )}

        {/* Medical History */}
        <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-[#bfa174] mb-4">
            Medical History (Recent Activity)
          </h3>
          <div className="space-y-4">
            {commits.map((commit) => (
              <div
                key={commit.sha}
                className="border-b border-gray-700 pb-4 last:border-0"
              >
                <p className="text-gray-200 font-medium">
                  {commit.commit.message.split("\n")[0]}
                </p>
                <div className="flex gap-4 mt-1 text-sm text-gray-500">
                  <span>Dr. {commit.commit.author?.name || "Unknown"}</span>
                  <span>
                    {new Date(commit.commit.author?.date).toLocaleDateString()}
                  </span>
                  <span className="font-mono text-xs text-[#178582]">
                    #{commit.sha.substring(0, 7)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Analyze;
