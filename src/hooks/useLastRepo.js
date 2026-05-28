import { useRepo } from "../context/RepoContext";

export function useLastRepo() {
  const { activeRepo, setActiveRepo } = useRepo();

  const setSearchParams = (params) => {
    const url = params?.repo;
    if (url) setActiveRepo(url);
    else setActiveRepo(null);
  };

  return { repoUrl: activeRepo, setSearchParams };
}
