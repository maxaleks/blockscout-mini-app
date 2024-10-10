import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import networks from './networks';
import PageContainer from './PageContainer';
import { shortenHash } from './utils';

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
  token_transfers: TokenTransfer[];
  exchange_rate: string;
}

interface TokenTransfer {
  from: {
    hash: string;
  };
  to: {
    hash: string;
  };
  token: {
    symbol: string;
    decimals: string;
    exchange_rate: string;
  };
  total: {
    value: string;
  };
}

const TransactionPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const chainId = Number(searchParams.get('chainId') || '1');
  const txHash = searchParams.get('hash') || '';
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactionData = async () => {
      setLoading(true);
      setError(null);
      try {
        const network = networks[chainId];
        if (!network) {
          throw new Error('Invalid network');
        }
        const response = await fetch(`${network.explorerUrl}/api/v2/transactions/${txHash}`);
        if (!response.ok) {
          throw new Error('Failed to fetch transaction data');
        }
        const data = await response.json();
        setTransaction(data);
      } catch (err) {
        setError('Error fetching transaction data.');
      } finally {
        setLoading(false);
      }
    };

    if (txHash) {
      fetchTransactionData();
    }
  }, [txHash, chainId]);

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

  const formatValue = (value: string, decimals: number, symbol: string, exchangeRate: string): string => {
    const formattedValue = (parseFloat(value) / Math.pow(10, decimals)).toFixed(6);
    const usdValue = (parseFloat(formattedValue) * parseFloat(exchangeRate)).toFixed(2);
    return `${formattedValue} ${symbol} ($${usdValue})`;
  };

  return (
    <PageContainer
      title="Transaction"
      networkLogo={networks[chainId].logoUrl}
      showSearchButton
      showShareButton
      shareData={{ hash: txHash, chainId }}
      loading={loading}
      error={error}
    >
      {transaction && (
        <div className="flex flex-col h-full">
          <div className="flex-shrink-0 p-4">
            <div className="mb-2">
              <span className="font-bold">Hash:</span> {shortenHash(transaction.hash, 10)}
            </div>
            <div className="mb-2">
              <span className="font-bold">Timestamp:</span> {formatTimestamp(transaction.timestamp)[0]}
              <div className="text-sm text-gray-600">{formatTimestamp(transaction.timestamp)[1]}</div>
            </div>
            <div className="mb-2">
              <span className="font-bold">From:</span> {shortenHash(transaction.from.hash)}
            </div>
            <div className="mb-2">
              <span className="font-bold">To:</span> {shortenHash(transaction.to.hash)}
            </div>
            <div className="mb-2">
              <span className="font-bold">Value:</span> {formatValue(transaction.value, networks[chainId].decimals, networks[chainId].symbol, transaction.exchange_rate)}
            </div>
            <div className="flex-shrink-0 text-center mt-1">
              <a
                href={`${networks[chainId].explorerUrl}/tx/${transaction.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                View on Blockscout
              </a>
            </div>
          </div>

          <div className="flex-grow flex flex-col overflow-hidden">
            <h2 className="text-lg font-semibold p-4 bg-white">Token Transfers</h2>
            <div className="flex-grow overflow-y-auto">
              {transaction.token_transfers && transaction.token_transfers.length > 0 ? (
                <ul className="divide-y px-4">
                  {transaction.token_transfers.map((transfer, index) => (
                    <li key={index} className="py-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm">{shortenHash(transfer.from.hash)}</div>
                        <ArrowRight className="mx-2" size={16} />
                        <div className="text-sm">{shortenHash(transfer.to.hash)}</div>
                      </div>
                      <div className="text-sm text-gray-600 text-center">
                        {formatValue(transfer.total.value, parseInt(transfer.token.decimals), transfer.token.symbol, transfer.token.exchange_rate)}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500 p-4">No token transfers in this transaction</p>
              )}
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default TransactionPage;
