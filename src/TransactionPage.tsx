import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import networks from './networks';
import PageContainer from './PageContainer';

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
  const [searchParams] = useSearchParams();
  const chainId = searchParams.get('chainId') || 1;
  const txHash = searchParams.get('hash') || '';
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (txHash) {
      fetchTransactionData(txHash);
    }
  }, [txHash, chainId]);

  const fetchTransactionData = async (hash: string) => {
    setLoading(true);
    setError(null);
    try {
      const network = networks[chainId];
      if (!network) {
        throw new Error('Invalid network');
      }
      const response = await fetch(`${network.apiEndpoint}/transactions/${hash}`);
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

  const formatValue = (value: string): string => {
    const network = networks[chainId];
    if (!network) return value;

    const formattedValue = (parseFloat(value) / Math.pow(10, network.decimals)).toFixed(6);
    return `${formattedValue} ${network.symbol}`;
  };

  if (loading) return <PageContainer title="Transaction Details"><div className="p-4 text-center">Loading...</div></PageContainer>;
  if (error) return <PageContainer title="Transaction Details"><div className="p-4 text-center text-red-500">{error}</div></PageContainer>;
  if (!transaction) return <PageContainer title="Transaction Details"><div className="p-4 text-center">No data found</div></PageContainer>;

  return (
    <PageContainer title="Transaction Details">
      <div className="p-4">
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
          <div>{formatValue(transaction.value)}</div>
        </div>
        {/* Add more transaction details as needed */}
        <div className="text-center mt-6">
          <a
            href={`${networks[chainId].apiEndpoint}/tx/${transaction.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            View on Blockscout
          </a>
        </div>
      </div>
    </PageContainer>
  );
};

export default TransactionPage;
