interface Network {
  name: string;
  decimals: number;
  symbol: string;
  logoUrl: string;
  explorerUrl: string;
}

const networks: { [key: string]: Network } = {
  1: {
    name: "Ethereum",
    decimals: 18,
    symbol: "ETH",
    logoUrl: "/networks/ethereum.svg",
    explorerUrl: "https://eth.blockscout.com"
  },
  10: {
    name: "Optimism",
    decimals: 18,
    symbol: "ETH",
    logoUrl: "/networks/optimism.svg",
    explorerUrl: "https://optimism.blockscout.com"
  },
  42161: {
    name: "Arbitrum",
    decimals: 18,
    symbol: "ETH",
    logoUrl: "/networks/arbitrum.svg",
    explorerUrl: "https://arbitrum.blockscout.com"
  },
  // Add more networks as needed
};

export default networks;
