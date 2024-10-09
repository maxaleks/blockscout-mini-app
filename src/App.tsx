import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HelloPage from './HelloPage';
import TransactionPage from './TransactionPage';
import AddressPage from './AddressPage';

const App: React.FC = () => {
  const [startRoute, setStartRoute] = useState<string | null>(null);

  useEffect(() => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      const startParam = window.Telegram.WebApp.initDataUnsafe.start_param;
      if (startParam) {
        const [type, hash] = startParam.split('_');
        if (type === 'addr') {
          setStartRoute(`/address/${hash}`);
        } else if (type === 'tx') {
          setStartRoute(`/transaction/${hash}`);
        }
      }
    }
  }, []);

  if (startRoute === null) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={startRoute ? <Navigate to={startRoute} /> : <HelloPage />} />
        <Route path="/transaction/:hash" element={<TransactionPage />} />
        <Route path="/address/:address" element={<AddressPage />} />
      </Routes>
    </Router>
  );
}

export default App;
