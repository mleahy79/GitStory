import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { parseGitHubUrl, getRepoInfo, getCommits, getContributors, getLanguages, getIssues } from "../../services/github";

const Document = () => {
  const [searchParams] = useSearchParams();
  const repoUrl = searchParams.get("repo");

  const [repoInfo, setRepoInfo] = useState(null);
  const [commits, setCommits] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [languages, setLanguages] = useState({});
  const [issues, setIssues] = useState([]);
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

        const [repoData, commitsData, contributorsData, languagesData, issuesData] = await Promise.all([
          getRepoInfo(owner, repo),
          getCommits(owner, repo, 1, 100),
          getContributors(owner, repo, 20),
          getLanguages(owner, repo),
          getIssues(owner, repo, "all", 50),
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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto text-center py-16">
          <p className="text-gray-600">Loading repository data...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto text-center py-16">
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  const openIssues = issues.filter(i => i.state === "open" && !i.pull_request);
  const closedIssues = issues.filter(i => i.state === "closed" && !i.pull_request);
  const openPRs = issues.filter(i => i.state === "open" && i.pull_request);
  const generatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* Print Button - Hidden when printing */}
      <div className="print:hidden bg-[#0A1828] p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h2 className="text-white font-semibold">Repository Health Report</h2>
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-[#178582] text-white font-semibold rounded-lg hover:bg-[#1a9d9a] transition-colors"
          >
            Print Report
          </button>
        </div>
      </div>

      {/* Printable Document */}
      <main className="bg-white min-h-screen p-8 print:p-0">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="border-b-2 border-[#178582] pb-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-[#0A1828] mb-2">
                  Repository Health Report
                </h1>
                <p className="text-xl text-[#178582] font-semibold">{repoInfo?.full_name}</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>Generated: {generatedDate}</p>
                <p className="text-[#bfa174] font-semibold mt-1">SustainRx</p>
              </div>
            </div>
            {repoInfo?.description && (
              <p className="mt-4 text-gray-600 italic">{repoInfo.description}</p>
            )}
          </header>

          {/* Executive Summary */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#0A1828] border-b border-gray-300 pb-2 mb-4">
              Executive Summary
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded text-center">
                <p className="text-2xl font-bold text-[#178582]">{repoInfo?.stargazers_count || 0}</p>
                <p className="text-sm text-gray-600">Stars</p>
              </div>
              <div className="bg-gray-50 p-4 rounded text-center">
                <p className="text-2xl font-bold text-[#178582]">{repoInfo?.forks_count || 0}</p>
                <p className="text-sm text-gray-600">Forks</p>
              </div>
              <div className="bg-gray-50 p-4 rounded text-center">
                <p className="text-2xl font-bold text-[#178582]">{contributors.length}</p>
                <p className="text-sm text-gray-600">Contributors</p>
              </div>
              <div className="bg-gray-50 p-4 rounded text-center">
                <p className="text-2xl font-bold text-[#178582]">{openIssues.length}</p>
                <p className="text-sm text-gray-600">Open Issues</p>
              </div>
            </div>
          </section>

          {/* Vital Signs */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#0A1828] border-b border-gray-300 pb-2 mb-4">
              Vital Signs
            </h2>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Primary Language</td>
                  <td className="py-2 font-semibold text-right">{repoInfo?.language || "N/A"}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Default Branch</td>
                  <td className="py-2 font-semibold text-right">{repoInfo?.default_branch || "main"}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Created</td>
                  <td className="py-2 font-semibold text-right">
                    {repoInfo?.created_at ? new Date(repoInfo.created_at).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Last Updated</td>
                  <td className="py-2 font-semibold text-right">
                    {repoInfo?.updated_at ? new Date(repoInfo.updated_at).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">License</td>
                  <td className="py-2 font-semibold text-right">{repoInfo?.license?.name || "None"}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Language Breakdown */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#0A1828] border-b border-gray-300 pb-2 mb-4">
              Lab Results (Language Breakdown)
            </h2>
            <div className="space-y-2">
              {Object.entries(languages)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 8)
                .map(([lang, bytes]) => {
                  const percentage = ((bytes / totalBytes) * 100).toFixed(1);
                  return (
                    <div key={lang} className="flex items-center gap-4">
                      <span className="w-24 text-sm text-gray-600">{lang}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-[#178582] h-4 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-16 text-sm text-right font-semibold">{percentage}%</span>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* Care Team */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#0A1828] border-b border-gray-300 pb-2 mb-4">
              Care Team (Top Contributors)
            </h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {contributors.slice(0, 10).map((contributor, index) => (
                <div key={contributor.id} className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-700">
                    {index + 1}. {contributor.login}
                  </span>
                  <span className="font-semibold">{contributor.contributions} commits</span>
                </div>
              ))}
            </div>
          </section>

          {/* Issue Summary */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#0A1828] border-b border-gray-300 pb-2 mb-4">
              Symptom Report (Issues & PRs)
            </h2>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-green-50 p-3 rounded text-center">
                <p className="text-xl font-bold text-green-700">{openIssues.length}</p>
                <p className="text-xs text-gray-600">Open Issues</p>
              </div>
              <div className="bg-purple-50 p-3 rounded text-center">
                <p className="text-xl font-bold text-purple-700">{closedIssues.length}</p>
                <p className="text-xs text-gray-600">Closed Issues</p>
              </div>
              <div className="bg-blue-50 p-3 rounded text-center">
                <p className="text-xl font-bold text-blue-700">{openPRs.length}</p>
                <p className="text-xs text-gray-600">Open PRs</p>
              </div>
              <div className="bg-gray-50 p-3 rounded text-center">
                <p className="text-xl font-bold text-gray-700">{issues.length}</p>
                <p className="text-xs text-gray-600">Total Tracked</p>
              </div>
            </div>
            {openIssues.length > 0 && (
              <>
                <h3 className="font-semibold text-gray-700 mb-2">Active Issues:</h3>
                <ul className="text-sm space-y-1">
                  {openIssues.slice(0, 10).map(issue => (
                    <li key={issue.id} className="text-gray-600">
                      #{issue.number}: {issue.title}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          {/* Recent Activity */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#0A1828] border-b border-gray-300 pb-2 mb-4">
              Medical History (Recent Commits)
            </h2>
            <div className="text-sm space-y-2">
              {commits.slice(0, 15).map(commit => (
                <div key={commit.sha} className="border-b border-gray-100 pb-2">
                  <p className="text-gray-800 font-medium truncate">
                    {commit.commit?.message?.split("\n")[0]}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {commit.commit?.author?.name} - {new Date(commit.commit?.author?.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
            <p>Generated by <span className="text-[#178582] font-semibold">SustainRx</span></p>
            <p className="text-xs mt-1">Repository Health Analysis Platform</p>
          </footer>
        </div>
      </main>
    </>
  );
};

export default Document;
