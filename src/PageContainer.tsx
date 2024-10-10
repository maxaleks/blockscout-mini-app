import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import { Search, Share } from 'lucide-react';

import { API_ENDPOINT } from './constants';

interface PageContainerProps {
  title?: string;
  children: ReactNode;
  networkLogo?: string;
  showSearchButton?: boolean;
  showShareButton?: boolean;
  shareData?: {
    hash: string;
    chainId: number;
  };
  loading?: boolean;
  error?: string | null;
}

const PageContainer: React.FC<PageContainerProps> = ({
  title,
  children,
  networkLogo,
  showSearchButton = false,
  showShareButton = false,
  shareData,
  loading = false,
  error = null
}) => {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/');
  };

  const handleShare = async () => {
    if (!shareData) return;

    try {
      const userId = WebApp.initDataUnsafe.user?.id.toString();
      if (!userId) {
        throw new Error('User ID not available');
      }

      const response = await fetch(`${API_ENDPOINT}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...shareData, userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate share link');
      }

      const { id } = await response.json();
      const shareUrl = `https://t.me/blockscout_test_bot/bs_test_app?startapp=${id}`;
      WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`);
    } catch (error) {
      console.error('Error generating share link:', error);
      alert('Failed to generate share link. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-between items-center p-4 h-[60px]">
        {title && (
          <>
            {showSearchButton ? (
              <button onClick={handleSearch} className="p-2 rounded-full border-blue-500">
                <Search size={20} />
              </button>
            ) : <div className="w-9"></div>}
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{title}</h1>
              {networkLogo && <img src={networkLogo} alt={title} className="w-6 h-6" />}
            </div>
            {showShareButton ? (
              <button onClick={handleShare} className="p-2 rounded-full border-blue-500">
                <Share size={20} />
              </button>
            ) : <div className="w-9"></div>}
          </>
        )}
      </div>
      {loading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500 mb-12"></div>
        </div>
      ) : (
        <div className="flex-grow flex p-2">
          {error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="w-full max-w-md">
              {children}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PageContainer;
