export const PRUV_TESTNET = {
  chainId: '0x1ca8', // 485 in hex
  chainName: 'pruvtest',
  nativeCurrency: {
    name: 'MockRWAToken',
    symbol: 'MOCKRWA',
    decimals: 18,
  },
  rpcUrls: [import.meta.env.VITE_RPC_URL || ''],
  blockExplorerUrls: [import.meta.env.VITE_BLOCK_EXPLORER_URL || ''],
};
