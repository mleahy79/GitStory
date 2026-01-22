// GitHub API service
// For now, using unauthenticated requests (60 requests/hour limit)
// Later: add authentication for 5,000 requests/hour

const BASE_URL = "https://api.github.com";

// Parse GitHub URL to extract owner and repo name
export function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) {
    throw new Error("Invalid GitHub URL");
  }
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, ""),
  };
}

// Fetch repository info
export async function getRepoInfo(owner, repo) {
  const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch repo: ${response.status}`);
  }
  return response.json();
}

// Fetch commits (paginated, default 30 per page)
export async function getCommits(owner, repo, page = 1, perPage = 30) {
  const response = await fetch(
    `${BASE_URL}/repos/${owner}/${repo}/commits?page=${page}&per_page=${perPage}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch commits: ${response.status}`);
  }
  return response.json();
}

// Fetch all commits (be careful with large repos - rate limits)
export async function getAllCommits(owner, repo, maxPages = 10) {
  const allCommits = [];
  let page = 1;

  while (page <= maxPages) {
    const commits = await getCommits(owner, repo, page, 100);
    if (commits.length === 0) break;
    allCommits.push(...commits);
    if (commits.length < 100) break; // Last page
    page++;
  }

  return allCommits;
}

// Fetch a single commit with full details (includes file changes)
export async function getCommitDetails(owner, repo, sha) {
  const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}/commits/${sha}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch commit details: ${response.status}`);
  }
  return response.json();
}

// Fetch contributors
export async function getContributors(owner, repo, perPage = 30) {
  const response = await fetch(
    `${BASE_URL}/repos/${owner}/${repo}/contributors?per_page=${perPage}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch contributors: ${response.status}`);
  }
  return response.json();
}

// Fetch languages breakdown
export async function getLanguages(owner, repo) {
  const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}/languages`);
  if (!response.ok) {
    throw new Error(`Failed to fetch languages: ${response.status}`);
  }
  return response.json();
}

// Fetch issues (includes PRs by default)
export async function getIssues(owner, repo, state = "all", perPage = 30) {
  const response = await fetch(
    `${BASE_URL}/repos/${owner}/${repo}/issues?state=${state}&per_page=${perPage}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch issues: ${response.status}`);
  }
  return response.json();
}

// Fetch repository file tree
export async function getRepoTree(owner, repo, branch = "main") {
  const response = await fetch(
    `${BASE_URL}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  );
  if (!response.ok) {
    // Try 'master' if 'main' fails
    if (branch === "main") {
      return getRepoTree(owner, repo, "master");
    }
    throw new Error(`Failed to fetch file tree: ${response.status}`);
  }
  return response.json();
}

// Fetch file content (base64 encoded for files up to 1MB)
export async function getFileContent(owner, repo, path) {
  const response = await fetch(
    `${BASE_URL}/repos/${owner}/${repo}/contents/${path}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.status}`);
  }
  const data = await response.json();

  // Decode base64 content
  if (data.content) {
    try {
      const decoded = atob(data.content.replace(/\n/g, ""));
      return {
        ...data,
        decodedContent: decoded,
      };
    } catch {
      return { ...data, decodedContent: "[Binary file - cannot display]" };
    }
  }
  return data;
}
