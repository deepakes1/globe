import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import reactLogo from './assets/react.svg';  // Import the SVG

// Add favicon link to the document head
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/svg+xml';  // Changed to SVG type
favicon.href = reactLogo;  // Use the imported SVG
document.head.appendChild(favicon);

// Import your Publishable Key

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;


if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>
  </BrowserRouter>
);


