import { createContext, useContext, useState, useEffect } from "react";
import { parseGitHubUrl, getRepoInfo, getCommits, getContributors, getLanguages, getIssues } from "../services/github";

const SESSION_KEY = "sustainrx_currentRepo";

const RepoContext = createContext(null);

export function RepoProvider({ children }) {
  const [activeRepo, setActiveRepoState] = useState(() => sessionStorage.getItem(SESSION_KEY) || null);
  const [repoInfo, setRepoInfo] = useState(null);
  const [commits, setCommits] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [languages, setLanguages] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(() => !!sessionStorage.getItem(SESSION_KEY));
  const [error, setError] = useState(null);

  const setActiveRepo = (url) => {
    if (url) {
      sessionStorage.setItem(SESSION_KEY, url);
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
    setActiveRepoState(url);
  };

  useEffect(() => {
    if (!activeRepo) return;

    setRepoInfo(null);
    setCommits([]);
    setContributors([]);
    setLanguages({});
    setIssues([]);
    setLoading(true);
    setError(null);

    async function fetchData() {
      try {
        const { owner, repo } = parseGitHubUrl(activeRepo);
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
  }, [activeRepo]);

  return (
    <RepoContext.Provider value={{ activeRepo, setActiveRepo, repoInfo, commits, contributors, languages, issues, loading, error }}>
      {children}
    </RepoContext.Provider>
  );
}

export function useRepo() {
  return useContext(RepoContext);
}
