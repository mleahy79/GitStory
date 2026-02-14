import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { chatWithClaude } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { parseGitHubUrl, getRepoInfo, getCommits, getRepoTree, getFileContent, getCommitsWithDetails } from "../../services/github";
import { useLastRepo } from "../../hooks/useLastRepo";

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { repoUrl } = useLastRepo();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [repoContext, setRepoContext] = useState(null);
  const [repoInput, setRepoInput] = useState(repoUrl || "");
  const [loadingRepo, setLoadingRepo] = useState(false);

  // File browser state
  const [showFileBrowser, setShowFileBrowser] = useState(false);
  const [fileTree, setFileTree] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loadedFileContents, setLoadedFileContents] = useState({});
  const [repoOwner, setRepoOwner] = useState("");
  const [repoName, setRepoName] = useState("");

  // Commit analysis state
  const [showCommitBrowser, setShowCommitBrowser] = useState(false);
  const [detailedCommits, setDetailedCommits] = useState([]);
  const [loadingCommits, setLoadingCommits] = useState(false);
  const [selectedCommits, setSelectedCommits] = useState([]);

  // Load repo context if URL provided
  useEffect(() => {
    if (repoUrl) {
      loadRepoContext(repoUrl);
    }
  }, [repoUrl]);

  const loadRepoContext = async (url) => {
    setLoadingRepo(true);
    setError(null);
    try {
      const { owner, repo } = parseGitHubUrl(url);
      setRepoOwner(owner);
      setRepoName(repo);

      const [repoData, commitsData] = await Promise.all([
        getRepoInfo(owner, repo),
        getCommits(owner, repo, 1, 20),
      ]);

      const context = {
        name: repoData.full_name,
        description: repoData.description,
        stars: repoData.stargazers_count,
        language: repoData.language,
        openIssues: repoData.open_issues_count,
        defaultBranch: repoData.default_branch,
        recentCommits: commitsData.slice(0, 10).map(c => ({
          message: c.commit?.message?.split("\n")[0],
          author: c.commit?.author?.name,
          date: c.commit?.author?.date,
        })),
        files: [], // Will be populated when files are loaded
      };

      setRepoContext(context);
      setRepoInput(url);
      setSelectedFiles([]);
      setLoadedFileContents({});
      setFileTree([]);
    } catch (err) {
      setError("Failed to load repository. Check the URL and try again.");
    } finally {
      setLoadingRepo(false);
    }
  };

  const loadDetailedCommits = async () => {
    if (!repoOwner || !repoName) return;
    setLoadingCommits(true);
    try {
      const commits = await getCommitsWithDetails(repoOwner, repoName, 20);
      setDetailedCommits(commits);
      setShowCommitBrowser(true);
    } catch (err) {
      setError("Failed to load commit details.");
    } finally {
      setLoadingCommits(false);
    }
  };

  const toggleCommitSelection = (sha) => {
    if (selectedCommits.includes(sha)) {
      setSelectedCommits(prev => prev.filter(s => s !== sha));
    } else {
      if (selectedCommits.length >= 5) {
        setError("Maximum 5 commits can be selected at once.");
        return;
      }
      setSelectedCommits(prev => [...prev, sha]);
    }
  };

  const analyzeSelectedCommits = () => {
    if (selectedCommits.length === 0) return;

    const commitsToAnalyze = detailedCommits.filter(c =>
      selectedCommits.includes(c.sha)
    );

    // Build a detailed prompt for commit analysis
    let analysisPrompt = "Please analyze the following commit(s) and evaluate if the commit message(s) accurately describe the scope and scale of the actual code changes. For each commit, provide:\n\n1. A summary of what the code actually changed\n2. Whether the commit message accurately describes these changes\n3. A suggested improved commit message if needed\n\n";

    commitsToAnalyze.forEach((commit, idx) => {
      analysisPrompt += `---\n**Commit ${idx + 1}:**\n`;
      analysisPrompt += `SHA: ${commit.sha.substring(0, 7)}\n`;
      analysisPrompt += `Message: "${commit.message}"\n`;
      analysisPrompt += `Author: ${commit.author}\n`;
      analysisPrompt += `Date: ${new Date(commit.date).toLocaleDateString()}\n`;

      if (commit.stats) {
        analysisPrompt += `Stats: +${commit.stats.additions} -${commit.stats.deletions} (${commit.stats.total} total changes)\n`;
      }

      if (commit.files && commit.files.length > 0) {
        analysisPrompt += `\nFiles changed (${commit.files.length}):\n`;
        commit.files.forEach(f => {
          analysisPrompt += `- ${f.filename} (${f.status}): +${f.additions} -${f.deletions}\n`;
          if (f.patch) {
            analysisPrompt += `\`\`\`diff\n${f.patch}\n\`\`\`\n`;
          }
        });
      }
      analysisPrompt += "\n";
    });

    // Set the message and trigger submission
    setMessage(analysisPrompt);
    setShowCommitBrowser(false);
  };

  const loadFileTree = async () => {
    if (!repoOwner || !repoName) return;
    setLoadingFiles(true);
    try {
      const branch = repoContext?.defaultBranch || "main";
      const tree = await getRepoTree(repoOwner, repoName, branch);

      // Filter to only show relevant files (code files, not too deep)
      const relevantFiles = tree.tree
        .filter(item =>
          item.type === "blob" &&
          !item.path.includes("node_modules") &&
          !item.path.includes(".git") &&
          !item.path.startsWith(".") &&
          item.path.split("/").length <= 4
        )
        .sort((a, b) => a.path.localeCompare(b.path));

      setFileTree(relevantFiles);
      setShowFileBrowser(true);
    } catch (err) {
      setError("Failed to load file tree. The repository might be empty or private.");
    } finally {
      setLoadingFiles(false);
    }
  };

  const loadFileContent = async (path) => {
    if (loadedFileContents[path]) return; // Already loaded

    try {
      const content = await getFileContent(repoOwner, repoName, path);
      setLoadedFileContents(prev => ({
        ...prev,
        [path]: content.decodedContent,
      }));
    } catch (err) {
      setError(`Failed to load ${path}`);
    }
  };

  const toggleFileSelection = async (path) => {
    if (selectedFiles.includes(path)) {
      setSelectedFiles(prev => prev.filter(f => f !== path));
    } else {
      if (selectedFiles.length >= 5) {
        setError("Maximum 5 files can be selected at once to stay within context limits.");
        return;
      }
      setSelectedFiles(prev => [...prev, path]);
      await loadFileContent(path);
    }
  };

  const handleLoadRepo = (e) => {
    e.preventDefault();
    if (repoInput.trim()) {
      loadRepoContext(repoInput.trim());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    const userMessage = message.trim();
    setMessage("");
    setError(null);

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      // Build enhanced context with file contents
      const enhancedContext = repoContext ? {
        ...repoContext,
        files: selectedFiles.map(path => ({
          path,
          content: loadedFileContents[path] || "[Loading...]",
        })),
      } : null;

      const response = await chatWithClaude(userMessage, enhancedContext);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (err) {
      console.error("Chat error:", err);
      setError("Failed to get response. Please try again.");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handlePrintConversation = () => {
    const printWindow = window.open("", "_blank");
    const generatedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const conversationHtml = messages.map(msg => `
      <div style="margin-bottom: 16px; padding: 12px; border-radius: 8px; background: ${msg.role === "user" ? "#178582" : "#f3f4f6"}; color: ${msg.role === "user" ? "white" : "#1f2937"};">
        <p style="font-weight: 600; margin-bottom: 4px;">${msg.role === "user" ? "You" : "SustainRx AI"}</p>
        <p style="white-space: pre-wrap; margin: 0;">${msg.content}</p>
      </div>
    `).join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>SustainRx AI Consultation - ${repoContext?.name || "General"}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
          h1 { color: #0A1828; border-bottom: 2px solid #178582; padding-bottom: 16px; }
          .meta { color: #6b7280; font-size: 14px; margin-bottom: 24px; }
          .repo-info { background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
          .repo-info h3 { margin: 0 0 8px 0; color: #178582; }
          footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>AI Consultation Report</h1>
        <div class="meta">
          <p>Generated: ${generatedDate}</p>
          ${repoContext ? `<p>Repository: ${repoContext.name}</p>` : ""}
        </div>
        ${repoContext ? `
          <div class="repo-info">
            <h3>Repository Context</h3>
            <p><strong>Name:</strong> ${repoContext.name}</p>
            <p><strong>Language:</strong> ${repoContext.language || "N/A"}</p>
            <p><strong>Stars:</strong> ${repoContext.stars}</p>
            <p><strong>Open Issues:</strong> ${repoContext.openIssues}</p>
            ${selectedFiles.length > 0 ? `<p><strong>Files Analyzed:</strong> ${selectedFiles.join(", ")}</p>` : ""}
          </div>
        ` : ""}
        <h2>Conversation</h2>
        ${conversationHtml}
        <footer>
          <p>Generated by <strong style="color: #178582;">SustainRx</strong></p>
          <p>Repository Health Analysis Platform</p>
        </footer>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getFileIcon = (path) => {
    const ext = path.split(".").pop()?.toLowerCase();
    const icons = {
      js: "JS",
      jsx: "JSX",
      ts: "TS",
      tsx: "TSX",
      json: "{}",
      md: "MD",
      css: "CSS",
      html: "HTML",
      py: "PY",
      go: "GO",
      rs: "RS",
    };
    return icons[ext] || "F";
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-[#0A1828]">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#178582] mb-4">
              AI <span className="text-[#bfa174]">Assistant</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Please log in to access the AI assistant
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-[#178582] text-white font-semibold rounded-lg hover:bg-[#1a9d9a] transition-colors"
            >
              Log In
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A1828]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#178582] mb-4">
            AI <span className="text-[#bfa174]">Assistant</span>
          </h1>
          <p className="text-xl text-gray-400">
            Get personalized insights and recommendations for your codebase
          </p>
        </div>

        {/* Repository Context Input */}
        <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-4 mb-6">
          <form onSubmit={handleLoadRepo} className="flex gap-3">
            <input
              type="text"
              id="repo-url"
              name="repo-url"
              autoComplete="off"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="Enter GitHub repository URL (e.g., https://github.com/facebook/react)"
              className="flex-1 px-4 py-2 bg-[#0A1828] border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-[#178582] focus:border-transparent outline-none"
            />
            <button
              type="submit"
              disabled={loadingRepo || !repoInput.trim()}
              className="px-4 py-2 bg-[#bfa174] text-white font-semibold rounded-lg hover:bg-[#d4b68a] transition-colors disabled:opacity-50"
            >
              {loadingRepo ? "Loading..." : "Load Repo"}
            </button>
          </form>
          {repoContext && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-gray-400">
                  <span className="text-[#178582] font-semibold">{repoContext.name}</span>
                  <span>{repoContext.language}</span>
                  <span>{repoContext.stars} stars</span>
                  <span>{repoContext.openIssues} issues</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={loadFileTree}
                    disabled={loadingFiles}
                    className="text-[#bfa174] text-sm hover:underline"
                  >
                    {loadingFiles ? "Loading..." : "Browse Files"}
                  </button>
                  <button
                    type="button"
                    onClick={loadDetailedCommits}
                    disabled={loadingCommits}
                    className="text-[#178582] text-sm hover:underline"
                  >
                    {loadingCommits ? "Loading..." : "Analyze Commits"}
                  </button>
                  <button
                    onClick={() => {
                      setRepoContext(null);
                      setRepoInput("");
                      setFileTree([]);
                      setSelectedFiles([]);
                      setShowFileBrowser(false);
                      setDetailedCommits([]);
                      setSelectedCommits([]);
                      setShowCommitBrowser(false);
                    }}
                    className="text-gray-500 hover:text-gray-300"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-gray-500 text-xs">Loaded files:</span>
                  {selectedFiles.map(path => (
                    <span
                      key={path}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-[#178582]/20 text-[#178582] rounded text-xs"
                    >
                      {path.split("/").pop()}
                      <button
                        onClick={() => toggleFileSelection(path)}
                        className="hover:text-red-400 ml-1"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* File Browser Modal */}
        {showFileBrowser && (
          <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">
                Select Files to Analyze (max 5)
              </h3>
              <button
                onClick={() => setShowFileBrowser(false)}
                className="text-gray-500 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {fileTree.length === 0 ? (
                <p className="text-gray-500 text-sm">No files found</p>
              ) : (
                fileTree.slice(0, 100).map(file => (
                  <button
                    key={file.path}
                    onClick={() => toggleFileSelection(file.path)}
                    className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors ${
                      selectedFiles.includes(file.path)
                        ? "bg-[#178582]/30 text-[#178582]"
                        : "hover:bg-[#0A1828] text-gray-300"
                    }`}
                  >
                    <span className="w-8 h-5 flex items-center justify-center bg-[#0A1828] rounded text-xs font-mono">
                      {getFileIcon(file.path)}
                    </span>
                    <span className="truncate">{file.path}</span>
                    {selectedFiles.includes(file.path) && (
                      <span className="ml-auto text-[#178582]">+</span>
                    )}
                  </button>
                ))
              )}
              {fileTree.length > 100 && (
                <p className="text-gray-500 text-xs text-center py-2">
                  Showing first 100 files...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Commit Browser Modal */}
        {showCommitBrowser && (
          <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">
                Select Commits to Analyze (max 5)
              </h3>
              <div className="flex items-center gap-3">
                {selectedCommits.length > 0 && (
                  <button
                    onClick={analyzeSelectedCommits}
                    className="px-3 py-1 bg-[#178582] text-white text-sm rounded hover:bg-[#1a9d9a] transition-colors"
                  >
                    Analyze {selectedCommits.length} Commit(s)
                  </button>
                )}
                <button
                  onClick={() => setShowCommitBrowser(false)}
                  className="text-gray-500 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-2">
              {detailedCommits.length === 0 ? (
                <p className="text-gray-500 text-sm">No commits found</p>
              ) : (
                detailedCommits.map(commit => (
                  <button
                    key={commit.sha}
                    onClick={() => toggleCommitSelection(commit.sha)}
                    className={`w-full text-left px-3 py-3 rounded transition-colors ${
                      selectedCommits.includes(commit.sha)
                        ? "bg-[#178582]/30 border border-[#178582]"
                        : "bg-[#0A1828] hover:bg-[#0A1828]/70 border border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-200 text-sm font-medium truncate">
                          {commit.message?.split("\n")[0]}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span>{commit.sha.substring(0, 7)}</span>
                          <span>{commit.author}</span>
                          <span>{new Date(commit.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        {commit.stats && (
                          <div className="text-xs">
                            <span className="text-green-400">+{commit.stats.additions}</span>
                            {" / "}
                            <span className="text-red-400">-{commit.stats.deletions}</span>
                          </div>
                        )}
                        {commit.files && (
                          <p className="text-xs text-gray-500 mt-1">
                            {commit.files.length} file(s)
                          </p>
                        )}
                      </div>
                    </div>
                    {selectedCommits.includes(commit.sha) && commit.files && commit.files.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-700">
                        <p className="text-xs text-gray-400 mb-1">Files changed:</p>
                        <div className="flex flex-wrap gap-1">
                          {commit.files.slice(0, 5).map(f => (
                            <span
                              key={f.filename}
                              className="text-xs px-2 py-0.5 bg-[#0A1828] rounded text-gray-400"
                            >
                              {f.filename.split("/").pop()}
                            </span>
                          ))}
                          {commit.files.length > 5 && (
                            <span className="text-xs text-gray-500">
                              +{commit.files.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6 mb-6 min-h-[300px] max-h-[500px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p>Start a conversation with the AI assistant.</p>
              <p className="text-sm mt-2">
                {repoContext
                  ? selectedFiles.length > 0
                    ? `Ready to analyze ${selectedFiles.length} file(s) from ${repoContext.name}.`
                    : `Click "Browse Files" to select code files to analyze.`
                  : "Load a repository above to get context-aware insights."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-[#178582] text-white"
                        : "bg-[#0A1828] text-gray-200 border border-gray-700"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#0A1828] text-gray-400 px-4 py-3 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#178582]"></div>
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Input Form */}
        <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6">
          <form onSubmit={handleSubmit}>
            <textarea
              id="chat-message"
              name="chat-message"
              autoComplete="off"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={repoContext
                ? selectedFiles.length > 0
                  ? `Ask about the selected files...`
                  : `Ask about ${repoContext.name}...`
                : "Ask me anything about code health..."}
              rows={3}
              disabled={loading}
              className="w-full px-4 py-3 bg-[#0A1828] border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-[#178582] focus:border-transparent outline-none resize-none disabled:opacity-50"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <p className="text-gray-500 text-sm">Press Enter to send</p>
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handlePrintConversation}
                    className="text-[#bfa174] text-sm hover:underline"
                  >
                    Print Conversation
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="px-6 py-3 bg-[#178582] text-white font-semibold rounded-lg hover:bg-[#1a9d9a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Chat;
