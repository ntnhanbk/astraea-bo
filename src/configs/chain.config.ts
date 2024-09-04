import type { Chain } from '@wagmi/core'

const amoyChain: Chain = {
  id: 80002, // Your custom chain ID
  name: 'Amoy',
  network: 'amoy',
  nativeCurrency: {
    name: 'Amoy',
    symbol: 'MATIC', // Symbol of the currency
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-amoy.polygon.technology'], // Your custom chain RPC URL
    },
    public: {
      http: ['https://rpc-amoy.polygon.technology'],
      webSocket: undefined,
    },
  },
  blockExplorers: {
    default: {
      name: 'Amoy Explorer',
      url: 'https://www.oklink.com/amoy',
    },
  },
  testnet: false, // Set to true if this is a testnet
}

export { amoyChain }
