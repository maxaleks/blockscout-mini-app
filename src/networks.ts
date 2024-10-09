interface Network {
  name: string;
  decimals: number;
  symbol: string;
  logoUrl: string;
  apiEndpoint: string;
}

const networks: { [key: string]: Network } = {
  1: {
    name: "Ethereum",
    decimals: 18,
    symbol: "ETH",
    logoUrl: "/networks/ethereum.svg",
    apiEndpoint: "https://eth.blockscout.com/api/v2"
  },
  10: {
    name: "Optimism",
    decimals: 18,
    symbol: "ETH",
    logoUrl: "/networks/optimism.svg",
    apiEndpoint: "https://optimism.blockscout.com/api/v2"
  },
  42161: {
    name: "Arbitrum",
    decimals: 18,
    symbol: "ETH",
    logoUrl: "/networks/arbitrum.svg",
    apiEndpoint: "https://arbitrum.blockscout.com/api/v2"
  },
  // Add more networks as needed
};

export default networks;
