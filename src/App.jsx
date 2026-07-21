import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TimerPage from './pages/TimerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AuthPage from './pages/AuthPage';
import VerifyPage from './pages/VerifyPage';
import { useStore } from './store';

export default function App() {
  const initAuth      = useStore(s => s.initAuth);
  const selectedTheme = useStore(s => s.selectedTheme);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', selectedTheme || 'midnight');
  }, [selectedTheme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TimerPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/verify" element={<VerifyPage />} />
      </Routes>
    </BrowserRouter>
  );
}
