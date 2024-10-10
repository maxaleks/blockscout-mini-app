import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import { Search, Share2 } from 'lucide-react';

import { API_ENDPOINT } from './constants';

interface PageContainerProps {
  title: string;
  children: ReactNode;
  showSearchButton?: boolean;
  showShareButton?: boolean;
  shareData?: {
    hash: string;
    chainId: number;
  };
}

const PageContainer: React.FC<PageContainerProps> = ({
  title,
  children,
  showSearchButton = false,
  showShareButton = false,
  shareData
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

      const response = await fetch(`${ API_ENDPOINT }/generate`, {
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
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        {showSearchButton ? (
          <button onClick={handleSearch} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <Search size={20} />
          </button>
        ) : <div className="w-9"></div>}
        <h1 className="text-2xl font-bold">{title}</h1>
        {showShareButton ? (
          <button onClick={handleShare} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <Share2 size={20} />
          </button>
        ) : <div className="w-9"></div>}
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
