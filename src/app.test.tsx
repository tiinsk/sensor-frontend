import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

it('renders without crashing', () => {
  const root = ReactDOM.createRoot(document.createElement('div'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
