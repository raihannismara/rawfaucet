import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WalletProvider } from './context/Transaction.tsx';

createRoot(document.getElementById('root')!).render(
  <WalletProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </WalletProvider>,
);
