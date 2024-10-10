import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import StartPage from './StartPage';
import TransactionPage from './TransactionPage';
import AddressPage from './AddressPage';

import { API_ENDPOINT } from './constants';

const App: React.FC = () => {
  const [startRoute, setStartRoute] = useState<string | null>(null);

  useEffect(() => {
    WebApp.ready();
    try {
      WebApp.requestWriteAccess();
    } catch (error) {}

    const handleStartParam = async (startParam: string) => {
      try {
        const userId = WebApp.initDataUnsafe.user?.id.toString();
        const response = await fetch(`${ API_ENDPOINT }/info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: startParam, userId }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch start parameter info');
        }
        const { hash, chainId } = await response.json();
        if (hash.length === 42) {
          setStartRoute(`/address?chainId=${chainId}&hash=${hash}`);
        } else if (hash.length === 66) {
          setStartRoute(`/transaction?chainId=${chainId}&hash=${hash}`);
        }
      } catch (error) {
        console.error('Error processing start parameter:', error);
        // Handle error (e.g., show an error message to the user)
      }
    };

    const startParam = WebApp.initDataUnsafe.start_param;
    if (startParam) {
      handleStartParam(startParam);
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
