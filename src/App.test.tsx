import { render, screen } from '@testing-library/react';
import App from './App';

test('renders file upload', () => {
  render(<App />);
  const uploadElement = screen.getByText(/Click or drag to upload Libby activity CSV/i);
  expect(uploadElement).toBeInTheDocument();
});
