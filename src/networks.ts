// networks.ts

interface Network {
  name: string;
  decimals: number;
  symbol: string;
}

const networks: { [key: number]: Network } = {
  1: {
    name: "Ethereum",
    decimals: 18,
    symbol: "ETH"
  },
  // Add more networks as needed
};

export default networks;
