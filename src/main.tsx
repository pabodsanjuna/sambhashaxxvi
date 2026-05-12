import { ClerkProvider } from '@clerk/clerk-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Patch window.fetch to avoid errors when third-party libraries (like Clerk) try to override it in an environment where it only has a getter.
try {
  const descriptor = Object.getOwnPropertyDescriptor(window, 'fetch');
  if (descriptor && !descriptor.set) {
    let currentFetch = window.fetch;
    Object.defineProperty(window, 'fetch', {
      get: () => currentFetch,
      set: (newFetch) => {
        currentFetch = newFetch;
      },
      configurable: true,
      enumerable: true,
    });
  }
} catch (e) {
  console.warn('Could not patch window.fetch', e);
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error('Missing Publishable Key: VITE_CLERK_PUBLISHABLE_KEY environment variable is required.');
}

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();

  return (
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      afterSignOutUrl="/sign-in"
    >
      <App />
    </ClerkProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {PUBLISHABLE_KEY ? (
      <BrowserRouter>
        <ClerkProviderWithRoutes />
      </BrowserRouter>
    ) : (
      <div className="flex items-center justify-center min-h-screen bg-white text-black">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Missing Clerk Configuration</h1>
          <p className="text-zinc-500">Please add your <code className="bg-zinc-100 px-1 py-0.5 rounded border border-zinc-200">VITE_CLERK_PUBLISHABLE_KEY</code> to the environment variables.</p>
        </div>
      </div>
    )}
  </StrictMode>,
);
