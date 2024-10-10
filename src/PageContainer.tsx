import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import { Search, Share, Loader2 } from 'lucide-react';

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
  const [logoLoaded, setLogoLoaded] = useState(false);

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

      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/generate`, {
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
    <div className="flex flex-col h-screen">
      <div className="flex-shrink-0 flex justify-between items-center p-4 h-[60px] bg-white z-10">
        {title && (
          <>
            {showSearchButton ? (
              <button onClick={handleSearch} className="p-2 rounded-full border-blue-500">
                <Search size={20} />
              </button>
            ) : <div className="w-9"></div>}
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{title}</h1>
              {networkLogo && (
                <div className="w-6 h-6 relative">
                  {!logoLoaded && (
                    <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse"></div>
                  )}
                  <img
                    src={networkLogo}
                    alt={title}
                    className={`w-full h-full object-contain ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setLogoLoaded(true)}
                  />
                </div>
              )}
            </div>
            {showShareButton ? (
              <button onClick={handleShare} className="p-2 rounded-full border-blue-500">
                <Share size={20} />
              </button>
            ) : <div className="w-9"></div>}
          </>
        )}
      </div>
      <div className="flex-grow overflow-y-auto">
        {loading ? (
          <div className="flex p-2 pt-24 justify-center">
            <div className="animate-spin">
              <Loader2 size={40} />
            </div>
          </div>
        ) : (
          <div className="h-full">
            {error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              children
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageContainer;
