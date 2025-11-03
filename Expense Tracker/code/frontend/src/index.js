import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './improvements.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
