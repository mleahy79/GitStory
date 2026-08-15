import { render, screen } from '@testing-library/react';
import { onAuthStateChanged } from 'firebase/auth';
import App from './App';

// Real Firebase SDK calls (network/IndexedDB) don't work under jsdom, so the
// auth layer is stubbed at the module boundary rather than exercised here.
jest.mock('./services/firebase', () => ({
  auth: {},
  githubProvider: {},
  functions: {},
  chatWithClaude: jest.fn(),
}));
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  GithubAuthProvider: { credentialFromResult: jest.fn() },
}));

// The markdown renderer pulls in an ESM-only dependency chain (unified,
// remark, hast) that isn't worth wiring through react-scripts' Jest 27
// transform config just to smoke-test routing — stub it instead.
jest.mock('react-markdown', () => () => null);
jest.mock('remark-gfm', () => () => null);

// react-scripts runs with `resetMocks: true`, which wipes the implementation
// jest.mock's factory set up above before every test — so it's reapplied here.
beforeEach(() => {
  onAuthStateChanged.mockImplementation((auth, callback) => {
    callback(null);
    return () => {};
  });
});

test('renders the homepage at the root route', () => {
  render(<App />);
  expect(
    screen.getByText(/Check Your Repository's Vital Signs/i)
  ).toBeInTheDocument();
});

test('renders the 404 page for an unknown route', async () => {
  window.history.pushState({}, '', '/this-route-does-not-exist');
  render(<App />);
  // NotFound is code-split (React.lazy), so it resolves after a microtask.
  expect(await screen.findByText(/page not found/i)).toBeInTheDocument();
});
