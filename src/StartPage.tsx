import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from './PageContainer';
import networks from './networks';

const StartPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(Object.keys(networks)[0]);
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

  return (
    <PageContainer title="Blockscout">
      <div className="p-4">
        <div className="mb-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter address or tx hash"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <div className="flex justify-center space-x-4 bg-gray-200 p-2 rounded">
            {Object.entries(networks).map(([id, network]) => (
              <button
                key={id}
                onClick={() => setSelectedNetwork(id)}
                className={`p-2 rounded ${
                  selectedNetwork === id ? 'bg-white' : ''
                }`}
              >
                <img src={network.logoUrl} alt={network.name} className="w-8 h-8" />
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>
    </PageContainer>
  );
};

export default StartPage;
