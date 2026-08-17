
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter 
        future={{ 
          v7_startTransition: true, 
          v7_relativeSplatPath: true 
        }}
      >
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)