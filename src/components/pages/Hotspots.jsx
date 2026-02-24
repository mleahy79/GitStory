import { useState, useEffect } from "react";
import { parseGitHubUrl, getCommitsWithDetails, getIssues } from "../../services/github";
import { useLastRepo } from "../../hooks/useLastRepo";

const Hotspots = () => {
  const { repoUrl, setSearchParams } = useLastRepo();
  const [repoInput, setRepoInput] = useState("");

  const [fileHotspots, setFileHotspots] = useState([]);
  const [staleIssues, setStaleIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!repoUrl) return;

    async function fetchHotspots() {
      setLoading(true);
      setError(null);

      try {
        const { owner, repo } = parseGitHubUrl(repoUrl);

        const [commits, issues] = await Promise.all([
          getCommitsWithDetails(owner, repo, 50),
          getIssues(owner, repo, "open", 100),
        ]);

        // Build file churn map
        const fileMap = {};
        commits.forEach((commit) => {
          commit.files.forEach((file) => {
            if (!fileMap[file.filename]) {
              fileMap[file.filename] = {
                filename: file.filename,
                commitCount: 0,
                totalAdditions: 0,
                totalDeletions: 0,
                totalChanges: 0,
                authors: new Set(),
                lastModified: commit.date,
              };
            }
            const entry = fileMap[file.filename];
            entry.commitCount++;
            entry.totalAdditions += file.additions || 0;
            entry.totalDeletions += file.deletions || 0;
            entry.totalChanges += file.changes || 0;
            if (commit.author) entry.authors.add(commit.author);
            if (commit.date > entry.lastModified) {
              entry.lastModified = commit.date;
            }
          });
        });

        // Sort by commit count (most churned files first)
        const hotspots = Object.values(fileMap)
          .map((f) => ({ ...f, authors: Array.from(f.authors) }))
          .sort((a, b) => b.commitCount - a.commitCount)
          .slice(0, 20);

        setFileHotspots(hotspots);
        const prev = parseInt(localStorage.getItem("sustainrx_stats_hotspots") || "0", 10);
        localStorage.setItem("sustainrx_stats_hotspots", prev + 1);

        // Find stale issues (open for 30+ days, no PR association)
        const now = new Date();
        const stale = issues
          .filter((issue) => {
            if (issue.pull_request) return false;
            const created = new Date(issue.created_at);
            const daysOpen = (now - created) / (1000 * 60 * 60 * 24);
            return daysOpen > 30;
          })
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .slice(0, 15);

        setStaleIssues(stale);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchHotspots();
  }, [repoUrl]);

  const handleRepoSubmit = (e) => {
    e.preventDefault();
    if (repoInput.trim()) {
      setSearchParams({ repo: repoInput.trim() });
    }
  };

  const getDaysOpen = (dateStr) => {
    const days = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    if (days > 365) return `${Math.floor(days / 365)}y ${days % 365}d`;
    return `${days}d`;
  };

  const getHeatColor = (commitCount, maxCommits) => {
    const ratio = commitCount / maxCommits;
    if (ratio > 0.7) return "text-red-400";
    if (ratio > 0.4) return "text-orange-400";
    if (ratio > 0.2) return "text-yellow-400";
    return "text-green-400";
  };

  const getHeatBarColor = (commitCount, maxCommits) => {
    const ratio = commitCount / maxCommits;
    if (ratio > 0.7) return "bg-red-500";
    if (ratio > 0.4) return "bg-orange-500";
    if (ratio > 0.2) return "bg-yellow-500";
    return "bg-green-500";
  };

  // No repo URL — show input form
  if (!repoUrl) {
    return (
      <main className="min-h-screen bg-[#0A1828]">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#178582] mb-4">
              Hotspot <span className="text-[#bfa174]">Scan</span>
            </h2>
            <p className="text-xl text-gray-400">
              Identify high-churn files and stale issues that signal tech debt.
            </p>
          </div>
          <form onSubmit={handleRepoSubmit} className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <input
                type="text"
                id="hotspots-repo-url"
                name="hotspots-repo-url"
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
                Scan Hotspots
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A1828] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#178582] mx-auto mb-4"></div>
          <p className="text-gray-400">Scanning for hotspots...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0A1828]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-6">
            <h2 className="text-red-400 font-semibold mb-2">Scan Failed</h2>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  const maxCommits = fileHotspots.length > 0 ? fileHotspots[0].commitCount : 1;

  return (
    <main className="min-h-screen bg-[#0A1828]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6 mb-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold text-[#bfa174]">
              Hotspot Scan Results
            </h2>
            <button
              onClick={() => setSearchParams({})}
              className="px-4 py-1.5 text-sm border border-gray-500 text-gray-400 rounded-lg hover:border-white hover:text-white transition-colors whitespace-nowrap"
            >
              New Scan
            </button>
          </div>
          <p className="text-gray-400">
            High-churn files and stale issues from the last 50 commits.
            Files touched frequently may indicate areas of instability or tech debt.
          </p>
        </div>

        {/* File Hotspots */}
        <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#bfa174] mb-4">
            High-Churn Files ({fileHotspots.length})
          </h3>
          {fileHotspots.length === 0 ? (
            <p className="text-gray-500">No file hotspots detected.</p>
          ) : (
            <div className="space-y-3">
              {fileHotspots.map((file) => (
                <div
                  key={file.filename}
                  className="bg-[#0A1828] rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-200 font-mono text-sm truncate mr-4">
                      {file.filename}
                    </span>
                    <span className={`text-sm font-semibold whitespace-nowrap ${getHeatColor(file.commitCount, maxCommits)}`}>
                      {file.commitCount} commits
                    </span>
                  </div>
                  <div className="w-full bg-[#1a2d3d] rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${getHeatBarColor(file.commitCount, maxCommits)}`}
                      style={{ width: `${(file.commitCount / maxCommits) * 100}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span className="text-green-400">+{file.totalAdditions}</span>
                    <span className="text-red-400">-{file.totalDeletions}</span>
                    <span>{file.authors.length} contributor{file.authors.length !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stale Issues */}
        <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-[#bfa174] mb-4">
            Stale Issues ({staleIssues.length})
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Open issues older than 30 days — potential unresolved debt.
          </p>
          {staleIssues.length === 0 ? (
            <p className="text-gray-500">No stale issues found — looking healthy!</p>
          ) : (
            <div className="space-y-3">
              {staleIssues.map((issue) => (
                <a
                  key={issue.id}
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-[#0A1828] rounded-lg p-4 hover:bg-[#178582]/10 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded bg-yellow-900/50 text-yellow-400">
                      {getDaysOpen(issue.created_at)} old
                    </span>
                    <span className="text-gray-200 text-sm">{issue.title}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>#{issue.number}</span>
                    <span>by {issue.user?.login}</span>
                    <span>opened {new Date(issue.created_at).toLocaleDateString()}</span>
                    {issue.labels?.length > 0 && (
                      <span>{issue.labels.map((l) => l.name).join(", ")}</span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Hotspots;
