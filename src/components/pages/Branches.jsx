import { useState, useEffect } from "react";
import { parseGitHubUrl, getBranches, compareBranches } from "../../services/github";
import { useLastRepo } from "../../hooks/useLastRepo";
import { useToast } from "../../context/ToastContext";
import LoadingSpinner from "../shared/LoadingSpinner";

const Branches = () => {
  const { repoUrl, setSearchParams } = useLastRepo();
  const { showToast } = useToast();
  const [repoInput, setRepoInput] = useState("");

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedHead, setSelectedHead] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    if (!repoUrl) return;

    async function fetchBranches() {
      setLoading(true);
      setError(null);
      setComparison(null);

      try {
        const { owner, repo } = parseGitHubUrl(repoUrl);
        const branchList = await getBranches(owner, repo);

        // Enrich branch data with commit details
        const enrichedBranches = branchList.map((branch) => ({
          ...branch,
          shortCommit: branch.commit.sha.substring(0, 7),
          commitUrl: branch.commit.url,
        }));

        setBranches(enrichedBranches);
        setSelectedBase(enrichedBranches[0]?.name); // Default to first branch (usually main)
        setSelectedHead(enrichedBranches[1]?.name || enrichedBranches[0]?.name);

        const prev = parseInt(localStorage.getItem("sustainrx_stats_branches") || "0", 10);
        localStorage.setItem("sustainrx_stats_branches", prev + 1);
      } catch (err) {
        setError(err.message);
        showToast(`Error: ${err.message}`, "error");
      } finally {
        setLoading(false);
      }
    }

    fetchBranches();
  }, [repoUrl, showToast]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!repoInput.trim()) return;

    try {
      setSearchParams(repoInput);
    } catch (err) {
      showToast(`Invalid GitHub URL: ${err.message}`, "error");
    }
  };

  const handleCompare = async () => {
    if (!selectedBase || !selectedHead) {
      showToast("Please select both base and head branches", "error");
      return;
    }

    if (selectedBase === selectedHead) {
      showToast("Please select different branches to compare", "error");
      return;
    }

    setComparing(true);
    setComparison(null);

    try {
      const { owner, repo } = parseGitHubUrl(repoUrl);
      const result = await compareBranches(owner, repo, selectedBase, selectedHead);
      setComparison(result);

      if (result.commits.length === 0) {
        showToast("Branches are identical - no differences found", "info");
      }
    } catch (err) {
      showToast(`Comparison failed: ${err.message}`, "error");
    } finally {
      setComparing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A1828] text-white pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[#bfa174]">Branch Anatomy</h1>
          <p className="text-gray-400 text-lg">
            See what's where across your branches. Detect accidental commits and compare branches before merging.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <input
            type="text"
            placeholder="https://github.com/owner/repo"
            value={repoInput}
            onChange={(e) => setRepoInput(e.target.value)}
            className="flex-1 px-4 py-3 bg-[#1a2a42] text-white rounded-lg border border-[#178582] focus:outline-none focus:border-[#bfa174] transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#0f6b68] hover:bg-[#0d6b66] disabled:opacity-50 text-white font-bold rounded-lg transition"
          >
            {loading ? "Loading..." : "Analyze"}
          </button>
        </form>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-8">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Branches List */}
        {!loading && branches.length > 0 && (
          <div className="space-y-8">
            {/* Branch Comparison Tool */}
            <div className="bg-[#1a2a42] rounded-lg border border-[#178582]/30 p-6">
              <h2 className="text-2xl font-bold text-[#bfa174] mb-6">Compare Branches</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Base Branch Selector */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Base Branch (target)
                  </label>
                  <select
                    value={selectedBase || ""}
                    onChange={(e) => setSelectedBase(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0a1828] text-white rounded-lg border border-[#178582] focus:outline-none focus:border-[#bfa174] transition"
                  >
                    {branches.map((branch) => (
                      <option key={branch.name} value={branch.name}>
                        {branch.name === "main" || branch.name === "master"
                          ? `${branch.name} (default)`
                          : branch.name}{" "}
                        ({branch.shortCommit})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Head Branch Selector */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Head Branch (source - what to merge)
                  </label>
                  <select
                    value={selectedHead || ""}
                    onChange={(e) => setSelectedHead(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0a1828] text-white rounded-lg border border-[#178582] focus:outline-none focus:border-[#bfa174] transition"
                  >
                    {branches.map((branch) => (
                      <option key={branch.name} value={branch.name}>
                        {branch.name === "main" || branch.name === "master"
                          ? `${branch.name} (default)`
                          : branch.name}{" "}
                        ({branch.shortCommit})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleCompare}
                disabled={comparing || !selectedBase || !selectedHead}
                className="w-full md:w-auto px-6 py-3 bg-[#bfa174] hover:bg-[#a68d60] disabled:opacity-50 text-[#0a1828] font-bold rounded-lg transition"
              >
                {comparing ? "Comparing..." : "Compare Branches"}
              </button>
            </div>

            {/* Comparison Results */}
            {comparison && (
              <div className="bg-[#1a2a42] rounded-lg border border-[#178582]/30 p-6">
                <h2 className="text-2xl font-bold text-[#bfa174] mb-6">
                  Comparison: {selectedBase} ← {selectedHead}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-[#0a1828] rounded-lg p-4 border border-[#178582]/20">
                    <p className="text-gray-400 text-sm">Commits in {selectedHead}</p>
                    <p className="text-3xl font-bold text-[#178582]">
                      {comparison.total_commits || 0}
                    </p>
                  </div>
                  <div className="bg-[#0a1828] rounded-lg p-4 border border-[#178582]/20">
                    <p className="text-gray-400 text-sm">Files Changed</p>
                    <p className="text-3xl font-bold text-[#bfa174]">
                      {comparison.files?.length || 0}
                    </p>
                  </div>
                  <div className="bg-[#0a1828] rounded-lg p-4 border border-[#178582]/20">
                    <p className="text-gray-400 text-sm">Additions/Deletions</p>
                    <p className="text-xl font-bold">
                      <span className="text-green-400">+{comparison.additions || 0}</span>{" "}
                      <span className="text-red-400">-{comparison.deletions || 0}</span>
                    </p>
                  </div>
                </div>

                {/* Commits List */}
                {comparison.commits && comparison.commits.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-300 mb-4">
                      Commits in {selectedHead} (not in {selectedBase})
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {comparison.commits.map((commit) => (
                        <div
                          key={commit.sha}
                          className="bg-[#0a1828] rounded-lg p-4 border border-[#178582]/20 hover:border-[#178582]/50 transition"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-gray-200 font-semibold line-clamp-2">
                                {commit.commit.message.split("\n")[0]}
                              </p>
                              <p className="text-gray-400 text-sm mt-1">
                                {commit.commit.author.name} •{" "}
                                {new Date(commit.commit.author.date).toLocaleDateString()}
                              </p>
                            </div>
                            <a
                              href={commit.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#178582] hover:text-[#bfa174] text-xs font-mono transition"
                            >
                              {commit.sha.substring(0, 7)}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Files Changed */}
                {comparison.files && comparison.files.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-300 mb-4">Files Changed</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {comparison.files.map((file) => (
                        <div
                          key={file.filename}
                          className="bg-[#0a1828] rounded-lg p-3 border border-[#178582]/20 flex items-center justify-between gap-4"
                        >
                          <div>
                            <p className="text-gray-200 font-mono text-sm break-all">
                              {file.filename}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              {file.status === "added"
                                ? "Added"
                                : file.status === "removed"
                                  ? "Removed"
                                  : file.status === "modified"
                                    ? "Modified"
                                    : "Renamed"}
                            </p>
                          </div>
                          <div className="flex gap-2 text-xs font-semibold whitespace-nowrap">
                            <span className="text-green-400">+{file.additions}</span>
                            <span className="text-red-400">-{file.deletions}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* All Branches Table */}
            <div className="bg-[#1a2a42] rounded-lg border border-[#178582]/30 p-6">
              <h2 className="text-2xl font-bold text-[#bfa174] mb-6">All Branches</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#178582]/30">
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Branch</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">
                        Latest Commit
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">
                        Commit SHA
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">Protected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.map((branch) => (
                      <tr
                        key={branch.name}
                        className="border-b border-[#178582]/10 hover:bg-[#0a1828]/50 transition"
                      >
                        <td className="py-4 px-4">
                          <span className="text-[#178582] font-semibold">{branch.name}</span>
                          {(branch.name === "main" || branch.name === "master") && (
                            <span className="ml-2 text-xs bg-[#178582]/20 text-[#178582] px-2 py-1 rounded">
                              default
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-gray-400">
                          {new Date(branch.commit.commit?.author?.date).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <a
                            href={branch.commit.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#bfa174] hover:underline font-mono text-xs"
                          >
                            {branch.shortCommit}
                          </a>
                        </td>
                        <td className="py-4 px-4">
                          {branch.protected ? (
                            <span className="text-green-400 text-xs font-semibold">✓ Yes</span>
                          ) : (
                            <span className="text-gray-400 text-xs">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && branches.length === 0 && !error && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">
              Enter a GitHub repository URL above to examine its branches
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Branches;
