import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.jsx';
import '@mantine/core/styles.css';
import './index.css';
import { Notifications } from '@mantine/notifications';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider  
    withGlobalStyles
    withNormalizeCSS
      theme={{
        fontFamily: 'Inter, sans-serif',
        primaryColor: 'brand',
        colors: {
          brand: [
            '#f8f6f4',
            '#eaddd7',
            '#d7c0b4',
            '#c4a492',
            '#b18771',
            '#9e6a50',
            '#854442',
            '#6b3535',
            '#4b3832',
            '#3c2f2f',
          ],
        },
      }}
    >
      <BrowserRouter>
        <AuthProvider>
          <Notifications />
          <App />
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>,
)
