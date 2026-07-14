// src/main.jsx  (update)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'  // new

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <AuthProvider>
  <App />
  </AuthProvider>
  </StrictMode>,
)
