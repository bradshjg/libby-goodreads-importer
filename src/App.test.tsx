import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const exportElement = screen.getByText(/download goodreads csv/i);
  expect(exportElement).toBeInTheDocument();
});
