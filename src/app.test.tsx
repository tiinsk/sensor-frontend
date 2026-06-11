import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { test, vi } from 'vitest';
import App from './app';

vi.mock('webfontloader', () => ({
  default: { load: vi.fn() },
}));

test('renders without crashing', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});
