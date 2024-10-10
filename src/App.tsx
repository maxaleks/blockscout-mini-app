import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import StartPage from './StartPage';
import TransactionPage from './TransactionPage';
import AddressPage from './AddressPage';
import LoadingPage from './LoadingPage';

import { API_ENDPOINT } from './constants';

const Content: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [startParamUsed, setStartParamUsed] = useState(false);

  useEffect(() => {
    WebApp.ready();
    try {
      WebApp.requestWriteAccess();
    } catch (error) {}

    const handleStartParam = async (startParam: string) => {
      if (startParamUsed) {
        setIsLoading(false);
        return;
      }

      try {
        const userId = WebApp.initDataUnsafe.user?.id.toString();
        const response = await fetch(`${API_ENDPOINT}/info`, {
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
          navigate(`/address?chainId=${chainId}&hash=${hash}`);
        } else if (hash.length === 66) {
          navigate(`/transaction?chainId=${chainId}&hash=${hash}`);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error processing start parameter:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
        setStartParamUsed(true);
      }
    };

    const startParam = WebApp.initDataUnsafe.start_param;
    if (startParam) {
      handleStartParam(startParam);
    } else {
      setIsLoading(false);
    }
  }, [navigate, startParamUsed]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/transaction" element={<TransactionPage />} />
      <Route path="/address" element={<AddressPage />} />
    </Routes>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <Content />
    </Router>
  );
}

export default App;
