// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // TailwindCSS
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="125692677673-jhmi1f7kgochjh0jfhkupjp1eajtrr19.apps.googleusercontent.com">
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
