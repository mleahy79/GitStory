import { useState, useEffect } from "react";
import { useRepo } from "../../context/RepoContext";
import { useToast } from "../../context/ToastContext";
import LoadingSpinner from "../shared/LoadingSpinner";

const Analyze = () => {
  const { activeRepo, setActiveRepo, repoInfo, commits, contributors, languages, issues, loading, error } = useRepo();
  const { showToast } = useToast();
  const [repoInput, setRepoInput] = useState("");

  useEffect(() => {
    if (activeRepo && !repoInput) setRepoInput(activeRepo);
  }, [activeRepo, repoInput]);

  // --- Derived signals ---

  const busFactor = (() => {
    if (contributors.length === 0) return null;
    const total = contributors.reduce((sum, c) => sum + c.contributions, 0);
    let cumulative = 0;
    let count = 0;
    for (const c of contributors) {
      cumulative += c.contributions;
      count++;
      if (cumulative / total >= 0.8) break;
    }
    const topPct = Math.round((contributors[0].contributions / total) * 100);
    return { count, topPct };
  })();

  const commitVelocity = (() => {
    if (commits.length < 2) return null;
    const newest = new Date(commits[0].commit.author?.date);
    const oldest = new Date(commits[commits.length - 1].commit.author?.date);
    const weeks = Math.max(1, (newest - oldest) / (1000 * 60 * 60 * 24 * 7));
    return (commits.length / weeks).toFixed(1);
  })();

  const issueSignals = (() => {
    if (issues.length === 0) return null;
    const onlyIssues = issues.filter((i) => !i.pull_request);
    const open = onlyIssues.filter((i) => i.state === "open");
    const openRate = onlyIssues.length > 0
      ? Math.round((open.length / onlyIssues.length) * 100)
      : null;
    const avgAgeDays = open.length > 0
      ? Math.round(open.reduce((sum, i) => sum + (Date.now() - new Date(i.created_at)) / (1000 * 60 * 60 * 24), 0) / open.length)
      : null;
    return { openRate, avgAgeDays, openCount: open.length, total: onlyIssues.length };
  })();

  const busFactorColor = (n) => {
    if (n <= 1) return "text-red-400";
    if (n <= 2) return "text-orange-400";
    return "text-green-400";
  };

  const handleRepoSubmit = (e) => {
    e.preventDefault();
    const url = repoInput.trim();
    if (url) {
      const prev = parseInt(localStorage.getItem("sustainrx_stats_scans") || "0", 10);
      localStorage.setItem("sustainrx_stats_scans", prev + 1);
      setActiveRepo(url);
      showToast("Analyzing repository...", "info");
    }
  };

  if (loading) return <LoadingSpinner message="Analyzing repository..." />;

  if (!activeRepo) {
    return (
      <main className="min-h-screen bg-[#0A1828]">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#178582] mb-4">
              Repository <span className="text-[#bfa174]">Analysis</span>
            </h2>
            <p className="text-xl text-gray-400">
              Enter a GitHub repository URL to run a full analysis.
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
                className="px-6 py-3 bg-[#0f6b68] text-white font-semibold rounded-lg hover:bg-[#1a9d9a] transition-colors disabled:opacity-50"
              >
                Analyze
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
            <h2 className="text-red-400 font-semibold mb-2">Analysis Failed</h2>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A1828]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Repo Header */}
        {repoInfo && (
          <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6 mb-6">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-bold text-[#bfa174]">
                {repoInfo.full_name}
              </h2>
              <button
                onClick={() => setActiveRepo(null)}
                className="px-4 py-1.5 text-sm border border-gray-500 text-gray-400 rounded-lg hover:border-white hover:text-white transition-colors whitespace-nowrap"
              >
                New Analysis
              </button>
            </div>
            <p className="text-gray-400 mb-4">{repoInfo.description}</p>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <span>{repoInfo.stargazers_count.toLocaleString()} stars</span>
              <span>{repoInfo.forks_count.toLocaleString()} forks</span>
              <span>{repoInfo.open_issues_count} open issues</span>
              <span>{commits.length} commits loaded</span>
              {commitVelocity && (
                <span className="text-[#178582] font-medium">{commitVelocity} commits/week</span>
              )}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Contributors */}
          <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-[#bfa174] mb-1">
              Contributors ({contributors.length})
            </h3>
            {busFactor && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mb-4">
                <span>
                  Bus factor:{" "}
                  <span className={`font-semibold ${busFactorColor(busFactor.count)}`}>
                    {busFactor.count}
                  </span>
                  <span className="text-gray-400 ml-1">
                    ({busFactor.count} person{busFactor.count !== 1 ? "s" : ""} own 80% of commits)
                  </span>
                </span>
                <span>
                  Top contributor:{" "}
                  <span className="text-gray-300">{busFactor.topPct}% of commits</span>
                </span>
              </div>
            )}
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
                    <p className="text-gray-400 text-xs">{contributor.contributions} commits</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-[#bfa174] mb-4">
              Language Breakdown
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
                          <span className="text-gray-400">{percentage}%</span>
                        </div>
                        <div className="w-full bg-[#0A1828] rounded-full h-2">
                          <div
                            className="bg-[#0f6b68] h-2 rounded-full"
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

        {/* Issues & PRs */}
        <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#bfa174] mb-1">
            Issues & PRs
          </h3>
          {issueSignals && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mb-4">
              {issueSignals.openRate !== null && (
                <span>
                  Open rate:{" "}
                  <span className={`font-semibold ${issueSignals.openRate > 60 ? "text-orange-400" : "text-green-400"}`}>
                    {issueSignals.openRate}%
                  </span>
                  <span className="text-gray-400 ml-1">
                    ({issueSignals.openCount} of {issueSignals.total} issues open)
                  </span>
                </span>
              )}
              {issueSignals.avgAgeDays !== null && (
                <span>
                  Avg age of open issues:{" "}
                  <span className={`font-semibold ${issueSignals.avgAgeDays > 30 ? "text-orange-400" : "text-gray-300"}`}>
                    {issueSignals.avgAgeDays}d
                  </span>
                </span>
              )}
            </div>
          )}
          {issues.length === 0 ? (
            <p className="text-gray-400">No issues found.</p>
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
                  <div className="flex gap-4 mt-1 text-xs text-gray-400">
                    <span>#{issue.number}</span>
                    <span>by {issue.user?.login}</span>
                    <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Commit History */}
        <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-[#bfa174] mb-1">
            Commit History
          </h3>
          {commitVelocity && (
            <p className="text-xs text-gray-400 mb-4">
              {commits.length} commits spanning{" "}
              {(() => {
                const newest = new Date(commits[0].commit.author?.date);
                const oldest = new Date(commits[commits.length - 1].commit.author?.date);
                const days = Math.round((newest - oldest) / (1000 * 60 * 60 * 24));
                return `${days} days`;
              })()}
              {" "}—{" "}
              <span className="text-[#178582] font-medium">{commitVelocity} commits/week</span>
            </p>
          )}
          <div className="space-y-4">
            {commits.map((commit) => (
              <div
                key={commit.sha}
                className="border-b border-gray-700 pb-4 last:border-0"
              >
                <p className="text-gray-200 font-medium">
                  {commit.commit.message.split("\n")[0]}
                </p>
                <div className="flex gap-4 mt-1 text-sm text-gray-400">
                  <span>{commit.commit.author?.name || "Unknown"}</span>
                  <span>
                    {new Date(commit.commit.author?.date).toLocaleDateString()}
                  </span>
                  <span className="font-mono text-xs text-[#178582]">
                    {commit.sha.substring(0, 7)}
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
