import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/api/query-client';
import { warmUpApi } from './lib/api/api-client';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import App from './App.tsx';

// Acorda o backend (Render free tier tem cold start de ~25s) assim que o app
// carrega — em paralelo ao boot do React — para reduzir a latência percebida
// na primeira ação real do usuário (ex.: cadastrar itens em sequência).
void warmUpApi();

createRoot(document.getElementById('root')!).render(
 <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
 </StrictMode>,
);
