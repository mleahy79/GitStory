import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './Home';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockSetActiveRepo = jest.fn();
jest.mock('../../context/RepoContext', () => ({
  useRepo: () => ({ activeRepo: null, setActiveRepo: mockSetActiveRepo }),
}));

describe('Home repo checkup form', () => {
  test('renders an empty URL input and submit button', () => {
    render(<Home />);
    expect(
      screen.getByPlaceholderText(/https:\/\/github.com\/username\/repository/i)
    ).toHaveValue('');
    expect(screen.getByRole('button', { name: /start checkup/i })).toBeInTheDocument();
  });

  test('typing a repo URL and submitting saves it and navigates to /analyze', async () => {
    render(<Home />);

    const input = screen.getByPlaceholderText(/https:\/\/github.com\/username\/repository/i);
    await userEvent.type(input, 'https://github.com/mleahy79/gitstory');
    await userEvent.click(screen.getByRole('button', { name: /start checkup/i }));

    expect(mockSetActiveRepo).toHaveBeenCalledWith('https://github.com/mleahy79/gitstory');
    expect(mockNavigate).toHaveBeenCalledWith('/analyze');
  });

  test('submitting a blank or whitespace-only URL does nothing', async () => {
    render(<Home />);

    await userEvent.type(screen.getByPlaceholderText(/https:\/\/github.com\/username\/repository/i), '   ');
    await userEvent.click(screen.getByRole('button', { name: /start checkup/i }));

    expect(mockSetActiveRepo).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
