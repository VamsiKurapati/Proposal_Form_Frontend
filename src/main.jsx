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

import { UserProvider } from './context/UserContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
);
