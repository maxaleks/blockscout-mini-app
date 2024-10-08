import React, { useState, useEffect } from 'react';
import networks from './networks';

interface Transaction {
  hash: string;
  timestamp: string;
  from: {
    hash: string;
  };
  to: {
    hash: string;
  };
  value: string;
  // Add more fields as needed
}

const TransactionPage: React.FC = () => {
  const [txHash, setTxHash] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.Telegram.WebApp) {
      const hash = window.Telegram.WebApp.initDataUnsafe.start_param;
      if (hash) {
        setTxHash(hash);
        fetchTransactionData(hash);
      }
    }
  }, []);

  const fetchTransactionData = async (hash: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://eth.blockscout.com/api/v2/transactions/${hash}`);
      const data = await response.json();
      if (data) {
        setTransaction(data);
      } else {
        setError('Transaction not found or error in API response');
      }
    } catch (err) {
      setError('Error fetching transaction data.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string): [string, string] => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let timeAgo: string;
    if (diffInSeconds < 60) timeAgo = `${diffInSeconds} seconds ago`;
    else if (diffInSeconds < 3600) timeAgo = `${Math.floor(diffInSeconds / 60)} minutes ago`;
    else if (diffInSeconds < 86400) timeAgo = `${Math.floor(diffInSeconds / 3600)} hours ago`;
    else timeAgo = `${Math.floor(diffInSeconds / 86400)} days ago`;

    const formattedDate = date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });

    return [timeAgo, formattedDate];
  };

  const formatValue = (value: string, networkId: number): string => {
    const network = networks[networkId];
    if (!network) return value;

    const formattedValue = (parseFloat(value) / Math.pow(10, network.decimals)).toFixed(6);
    return `${formattedValue} ${network.symbol}`;
  };

  if (!txHash) {
    return <div className="text-center mt-10">No transaction hash provided</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transaction Details</h1>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      {transaction && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <span className="font-bold">Hash:</span>
            <div className="break-all">{transaction.hash}</div>
          </div>
          <div className="mb-4">
            <span className="font-bold">Timestamp:</span>
            <div>{formatTimestamp(transaction.timestamp)[0]}</div>
            <div>{formatTimestamp(transaction.timestamp)[1]}</div>
          </div>
          <div className="mb-4">
            <span className="font-bold">From:</span>
            <div className="break-all">{transaction.from.hash}</div>
          </div>
          <div className="mb-4">
            <span className="font-bold">To:</span>
            <div className="break-all">{transaction.to.hash}</div>
          </div>
          <div className="mb-4">
            <span className="font-bold">Value:</span>
            <div>{formatValue(transaction.value, 1)}</div>
          </div>
          {/* Add more transaction details as needed */}
          <div className="text-center mt-6">
            <a
              href={`https://eth.blockscout.com/tx/${transaction.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              View on Blockscout
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
