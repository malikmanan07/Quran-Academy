import './i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { NotificationProvider } from './context/NotificationContext';
import App from './App.jsx';
import './styles/globals.css';

// Set RTL on initial load based on saved language:
const savedLang = localStorage.getItem('i18nextLng') || 'en';
const isRTL = savedLang === 'ar' || savedLang === 'ur';
if (isRTL) {
  document.body.classList.add('rtl-text');
} else {
  document.body.classList.add('ltr-text');
}
document.documentElement.lang = savedLang;
document.documentElement.removeAttribute('dir');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <CurrencyProvider>
          <App />
        </CurrencyProvider>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.warn('Service Worker registration failed:', err);
    });
  });
}