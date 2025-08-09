import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

import '@fontsource/inter'; // Defaults to 400
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';

import { ProfileProvider } from './context/ProfileContext';
import { EmployeeProfileProvider } from './context/EmployeeProfileContext';

// Import storage utilities for debugging
import './utils/clearStorage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ProfileProvider>
      <EmployeeProfileProvider>
        <App />
      </EmployeeProfileProvider>
    </ProfileProvider>
  </BrowserRouter>
);
