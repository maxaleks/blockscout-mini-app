import React, { useEffect, useState } from 'react';
import HelloPage from './HelloPage';
import TransactionPage from './TransactionPage';

const App: React.FC = () => {
  const [hasStartParam, setHasStartParam] = useState<boolean>(false);

  useEffect(() => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      const startParam = window.Telegram.WebApp.initDataUnsafe.start_param;
      setHasStartParam(!!startParam);
    }
  }, []);

  return (
    <div>
      {hasStartParam ? <TransactionPage /> : <HelloPage />}
    </div>
  );
}

export default App;
