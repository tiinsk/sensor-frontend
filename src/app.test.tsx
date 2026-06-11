import React from 'react';
import ReactDOM from 'react-dom/client';
import { test } from 'vitest';
import App from './app';

test('renders without crashing', () => {
  const root = ReactDOM.createRoot(document.createElement('div'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
