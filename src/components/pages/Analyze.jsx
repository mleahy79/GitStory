import { useState, useEffect } from "react";
import { parseGitHubUrl, getRepoInfo, getCommits, getContributors, getLanguages, getIssues } from "../../services/github";
import { useLastRepo } from "../../hooks/useLastRepo";

const Analyze = () => {
  const { repoUrl, setSearchParams } = useLastRepo();
  const [repoInput, setRepoInput] = useState("");

  const [repoInfo, setRepoInfo] = useState(null);
  const [commits, setCommits] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [languages, setLanguages] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!repoUrl) return;

      setLoading(true);
      setError(null);

      try {
        const { owner, repo } = parseGitHubUrl(repoUrl);

        // Fetch all data in parallel
        const [repoData, commitsData, contributorsData, languagesData, issuesData] = await Promise.all([
          getRepoInfo(owner, repo),
          getCommits(owner, repo, 1, 50),
          getContributors(owner, repo, 10),
          getLanguages(owner, repo),
          getIssues(owner, repo, "all", 20),
        ]);

        setRepoInfo(repoData);
        setCommits(commitsData);
        setContributors(contributorsData);
        setLanguages(languagesData);
        setIssues(issuesData);
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

  const handleRepoSubmit = (e) => {
    e.preventDefault();
    if (repoInput.trim()) {
      setSearchParams({ repo: repoInput.trim() });
    }
  };

  if (!repoUrl) {
    return (
      <main className="min-h-screen bg-[#0A1828]">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#178582] mb-4">
              Repository <span className="text-[#bfa174]">Checkup</span>
            </h2>
            <p className="text-xl text-gray-400">
              Enter a GitHub repository URL to run a full diagnostic scan.
            </p>
          </div>
          <form onSubmit={handleRepoSubmit} className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <input
                type="text"
                id="analyze-repo-url"
                name="analyze-repo-url"
                autoComplete="off"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="flex-1 px-4 py-3 bg-[#1a2d3d] border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-[#178582] focus:border-transparent outline-none"
              />
              <button
                type="submit"
                disabled={!repoInput.trim()}
                className="px-6 py-3 bg-[#178582] text-white font-semibold rounded-lg hover:bg-[#1a9d9a] transition-colors disabled:opacity-50"
              >
                Start Checkup
              </button>
            </div>
          </form>
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
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-bold text-[#bfa174]">
                Patient: {repoInfo.full_name}
              </h2>
              <button
                onClick={() => setSearchParams({})}
                className="px-4 py-1.5 text-sm border border-gray-500 text-gray-400 rounded-lg hover:border-white hover:text-white transition-colors whitespace-nowrap"
              >
                New Checkup
              </button>
            </div>
            <p className="text-gray-400 mb-4">{repoInfo.description}</p>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <span>Popularity: {repoInfo.stargazers_count} stars</span>
              <span>Forks: {repoInfo.forks_count}</span>
              <span>Open Issues: {repoInfo.open_issues_count}</span>
              <span>Records Loaded: {commits.length}+ commits</span>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Contributors */}
          <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-[#bfa174] mb-4">
              Care Team ({contributors.length} Contributors)
            </h3>
            <div className="flex flex-wrap gap-3">
              {contributors.map((contributor) => (
                <a
                  key={contributor.id}
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#0A1828] px-3 py-2 rounded-lg hover:bg-[#178582]/20 transition-colors"
                >
                  <img
                    src={contributor.avatar_url}
                    alt={contributor.login}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-gray-200 text-sm">{contributor.login}</p>
                    <p className="text-gray-500 text-xs">{contributor.contributions} commits</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-[#bfa174] mb-4">
              Lab Results (Languages)
            </h3>
            <div className="space-y-3">
              {(() => {
                const total = Object.values(languages).reduce((a, b) => a + b, 0);
                return Object.entries(languages)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 6)
                  .map(([lang, bytes]) => {
                    const percentage = ((bytes / total) * 100).toFixed(1);
                    return (
                      <div key={lang}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-200">{lang}</span>
                          <span className="text-gray-500">{percentage}%</span>
                        </div>
                        <div className="w-full bg-[#0A1828] rounded-full h-2">
                          <div
                            className="bg-[#178582] h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  });
              })()}
            </div>
          </div>
        </div>

        {/* Issues */}
        <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#bfa174] mb-4">
            Active Symptoms (Issues & PRs)
          </h3>
          {issues.length === 0 ? (
            <p className="text-gray-500">No issues found - clean bill of health!</p>
          ) : (
            <div className="space-y-3">
              {issues.slice(0, 10).map((issue) => (
                <a
                  key={issue.id}
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border-b border-gray-700 pb-3 last:border-0 hover:bg-[#0A1828]/50 -mx-2 px-2 py-1 rounded transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      issue.state === "open"
                        ? "bg-green-900/50 text-green-400"
                        : "bg-purple-900/50 text-purple-400"
                    }`}>
                      {issue.state}
                    </span>
                    {issue.pull_request && (
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-900/50 text-blue-400">
                        PR
                      </span>
                    )}
                    <span className="text-gray-200 text-sm">{issue.title}</span>
                  </div>
                  <div className="flex gap-4 mt-1 text-xs text-gray-500">
                    <span>#{issue.number}</span>
                    <span>by {issue.user?.login}</span>
                    <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

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
