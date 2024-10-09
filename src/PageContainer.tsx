import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import { Search, Share2 } from 'lucide-react';

interface PageContainerProps {
  title: string;
  children: ReactNode;
  showSearchButton?: boolean;
  showShareButton?: boolean;
  shareLink?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  title,
  children,
  showSearchButton = false,
  showShareButton = false,
  shareLink
}) => {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/');
  };

  const handleShare = () => {
    if (!shareLink) return;
    WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(shareLink)}`);
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
