import { render, screen, waitFor } from '@testing-library/react';
import Branches from './Branches';
import { getBranches, parseGitHubUrl } from '../../services/github';

jest.mock('../../services/github', () => ({
  parseGitHubUrl: jest.fn(() => ({ owner: 'mleahy79', repo: 'gitstory' })),
  getBranches: jest.fn(),
  compareBranches: jest.fn(),
}));

jest.mock('../../hooks/useLastRepo', () => ({
  useLastRepo: () => ({
    repoUrl: 'https://github.com/mleahy79/gitstory',
    setSearchParams: jest.fn(),
  }),
}));

const mockShowToast = jest.fn();
jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

const MOCK_BRANCHES = [
  { name: 'main', commit: { sha: 'abc1234567', url: '', html_url: '' }, protected: true },
  { name: 'feature/tests', commit: { sha: 'def8901234', url: '', html_url: '' }, protected: false },
];

// react-scripts runs with `resetMocks: true`, which wipes the implementation
// jest.mock's factory set up above before every test — so it's reapplied here.
beforeEach(() => {
  parseGitHubUrl.mockReturnValue({ owner: 'mleahy79', repo: 'gitstory' });
});

describe('Branches API-driven list', () => {
  test('shows a loading state, then renders the fetched branch list', async () => {
    getBranches.mockResolvedValue(MOCK_BRANCHES);

    render(<Branches />);

    await waitFor(() => expect(getBranches).toHaveBeenCalledWith('mleahy79', 'gitstory'));

    expect(await screen.findByText('main')).toBeInTheDocument();
    expect(screen.getByText('feature/tests')).toBeInTheDocument();
    expect(screen.getByText('default')).toBeInTheDocument();
  });

  test('shows an error toast and message when the branch fetch fails', async () => {
    getBranches.mockRejectedValue(new Error('Failed to fetch branches: 404'));

    render(<Branches />);

    expect(await screen.findByText(/failed to fetch branches: 404/i)).toBeInTheDocument();
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining('Failed to fetch branches: 404'),
      'error'
    );
  });
});
