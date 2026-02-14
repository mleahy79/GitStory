import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const STORAGE_KEY = "sustainrx_lastRepo";

export function useLastRepo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const repoUrl = searchParams.get("repo");

  // If we have a repo URL in params, save it
  useEffect(() => {
    if (repoUrl) {
      localStorage.setItem(STORAGE_KEY, repoUrl);
    }
  }, [repoUrl]);

  // If no repo URL in params, restore from localStorage
  useEffect(() => {
    if (!repoUrl) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSearchParams({ repo: saved }, { replace: true });
      }
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { repoUrl, setSearchParams };
}
