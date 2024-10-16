import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import networks from './networks';
import PageContainer from './PageContainer';
import { shortenHash } from './utils';

interface AddressData {
  coin_balance: string;
  hash: string;
  exchange_rate: string;
}

interface Token {
  token: {
    address: string;
    decimals: string;
    symbol: string;
    exchange_rate: string;
  };
  value: string;
}

const AddressPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const chainId = Number(searchParams.get('chainId') || '1');
  const addressHash = searchParams.get('hash') || '';
  const [addressData, setAddressData] = useState<AddressData>({
    coin_balance: '0',
    hash: '',
    exchange_rate: '0'
  });
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateUsdValue = (balance: string, exchangeRate: string, decimals: number = 18): number => {
    return (parseFloat(balance) / Math.pow(10, decimals)) * parseFloat(exchangeRate);
  };

  const formatBalance = (balance: string, decimals: number = 18): string => {
    return (parseFloat(balance) / Math.pow(10, decimals)).toFixed(4) || '0';
  };

  const formatUsdValue = (usdValue: number): string => {
    return usdValue.toFixed(2) || '0';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const network = networks[chainId];
        if (!network) {
          throw new Error('Invalid network');
        }

        const [addressResponse, tokensResponse] = await Promise.all([
          fetch(`${network.explorerUrl}/api/v2/addresses/${addressHash}`),
          fetch(`${network.explorerUrl}/api/v2/addresses/${addressHash}/tokens?type=ERC-20`)
        ]);

        if (!addressResponse.ok || !tokensResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const addressData: AddressData = await addressResponse.json();
        const tokensData = await tokensResponse.json();

        setAddressData(addressData);

        const filteredAndSortedTokens = tokensData.items
          .filter((token: Token) => {
            const exchangeRate = parseFloat(token.token.exchange_rate);
            const usdBalance = calculateUsdValue(token.value, token.token.exchange_rate, parseInt(token.token.decimals));
            return exchangeRate > 0 && usdBalance > 0.001;
          })
          .sort((a: Token, b: Token) => {
            const aUsdBalance = calculateUsdValue(a.value, a.token.exchange_rate, parseInt(a.token.decimals));
            const bUsdBalance = calculateUsdValue(b.value, b.token.exchange_rate, parseInt(b.token.decimals));
            return bUsdBalance - aUsdBalance;
          });

        setTokens(filteredAndSortedTokens);
      } catch (err: { message: string } | any) {
        if (err?.message === 'Not found') {
          setError('An error occurred while fetching data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addressHash, chainId]);

  return (
    <PageContainer
      title="Address"
      networkLogo={networks[chainId].logoUrl}
      showSearchButton
      showShareButton
      shareData={{ hash: addressHash, chainId}}
      loading={loading}
      error={error}
    >
      {addressData && (
        <div className="flex flex-col h-full">
          <div className="flex-shrink-0 p-4 border-b">
            <h2 className="text-lg font-semibold mb-2">Overview</h2>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <span className="font-medium">Hash:</span> {shortenHash(addressData.hash)}
              </div>
              <div>
                <span className="font-medium">Balance:</span> {formatBalance(addressData.coin_balance, networks[chainId].decimals)} {networks[chainId].symbol}
                <span className="text-gray-500 ml-1">
                  (${formatUsdValue(calculateUsdValue(addressData.coin_balance, addressData.exchange_rate, networks[chainId].decimals))})
                </span>
              </div>
              <div className="text-center mt-1">
                <a
                  href={`${networks[chainId].explorerUrl}/address/${addressData.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  View on Blockscout
                </a>
              </div>
            </div>
          </div>
          <div className="flex-grow flex flex-col overflow-hidden">
            <h2 className="text-lg font-semibold p-4 bg-white">Tokens</h2>
            <div className="flex-grow overflow-y-auto">
              {tokens.length > 0 ? (
                <ul className="divide-y px-4">
                  {tokens.map((token, index) => {
                    const tokenUsdValue = calculateUsdValue(token.value, token.token.exchange_rate, parseInt(token.token.decimals));
                    return (
                      <li key={index} className="py-2">
                        <div className="font-medium">{token.token.symbol}</div>
                        <div>
                          {formatBalance(token.value, parseInt(token.token.decimals))}
                          <span className="text-gray-500 ml-1">
                            (${formatUsdValue(tokenUsdValue)})
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-center text-gray-500 p-4">No tokens found with non-zero balance and exchange rate</p>
              )}
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default AddressPage;
