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
