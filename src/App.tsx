import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import StartPage from './StartPage';
import TransactionPage from './TransactionPage';
import AddressPage from './AddressPage';

const App: React.FC = () => {
  const [startRoute, setStartRoute] = useState<string | null>(null);

  useEffect(() => {
    WebApp.ready();
    const startParam = WebApp.initDataUnsafe.start_param;
    if (startParam) {
      const [type, chainId, hash] = startParam.split('_');
      if (type === 'addr') {
        setStartRoute(`/address?chainId=${chainId}&hash=${hash}`);
      } else if (type === 'tx') {
        setStartRoute(`/transaction?chainId=${chainId}&hash=${hash}`);
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={startRoute ? <Navigate to={startRoute} /> : <StartPage />} />
        <Route path="/transaction" element={<TransactionPage />} />
        <Route path="/address" element={<AddressPage />} />
      </Routes>
    </Router>
  );
}

export default App;
