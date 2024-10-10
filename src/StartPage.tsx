import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from './PageContainer';
import networks from './networks';

const StartPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(Object.keys(networks)[0]);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchInput.length === 42 && searchInput.startsWith('0x')) {
      navigate(`/address?chainId=${selectedNetwork}&hash=${searchInput}`);
    } else if (searchInput.length === 66 && searchInput.startsWith('0x')) {
      navigate(`/transaction?chainId=${selectedNetwork}&hash=${searchInput}`);
    } else {
      alert('Invalid input. Please enter a valid address or transaction hash.');
    }
  };

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <PageContainer title="Blockscout">
      <div className="p-4">
        <div className="mb-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter address or tx hash"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <div className="flex gap-2">
            {Object.entries(networks).map(([id, network]) => (
              <button
                key={id}
                onClick={() => setSelectedNetwork(id)}
                className={`flex-1 p-2 rounded-lg border text-gray-700 ${
                  selectedNetwork === id ? 'border-blue-500' : 'border-gray-300'
                }`}
              >
                <div className="w-8 h-8 mx-auto relative">
                  {!loadedImages[id] && (
                    <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse"></div>
                  )}
                  <img
                    src={network.logoUrl}
                    alt={network.name}
                    className={`w-full h-full object-contain ${loadedImages[id] ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => handleImageLoad(id)}
                  />
                </div>
                <span className="text-xs">{network.name}</span>
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </div>
    </PageContainer>
  );
};

export default StartPage;
