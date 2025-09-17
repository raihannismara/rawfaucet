import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { MOCK_RWA_TOKEN_ABI } from '../utils/abi';
import { PRUV_TESTNET } from '../utils/contants';

const CONTRACT_ADDRESS =
  import.meta.env.VITE_ADDRESS_MOCK_RWA_TOKEN ||
  '0x0000000000000000000000000000000000000000';

interface TransactionStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  txHash?: string;
}

interface WalletContextProps {
  address: string;
  setAddress: (addr: string) => void;
  isConnected: boolean;
  userAddress: string;
  status: TransactionStatus;
  setStatus: React.Dispatch<React.SetStateAction<TransactionStatus>>;
  isHumanVerified: boolean;
  setIsHumanVerified: (v: boolean) => void;
  connectWallet: () => Promise<void>;
  switchNetwork: () => Promise<void>;
  mintTokens: () => Promise<void>;
  checkWalletConnection: () => Promise<void>;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [address, setAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [status, setStatus] = useState<TransactionStatus>({ type: 'idle' });
  const [isHumanVerified, setIsHumanVerified] = useState(false);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        if (accounts.length > 0) {
          setIsConnected(true);
          setUserAddress(accounts[0]);
          setAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setStatus({
        type: 'error',
        message:
          'MetaMask is not installed. Please install MetaMask to use this faucet.',
      });
      return;
    }

    try {
      setStatus({ type: 'loading', message: 'Connecting to MetaMask...' });

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setIsConnected(true);
        setUserAddress(accounts[0]);
        setAddress(accounts[0]);
        setStatus({ type: 'idle' });
      }
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: `Failed to connect wallet: ${error.message}`,
      });
    }
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: PRUV_TESTNET.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [PRUV_TESTNET],
          });
        } catch (addError) {
          throw new Error('Failed to add Pruv Network to MetaMask');
        }
      } else {
        throw switchError;
      }
    }
  };

  const mintTokens = async () => {
    if (!address || !ethers.isAddress(address)) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid Ethereum address',
      });
      return;
    }

    if (!isHumanVerified) {
      setStatus({
        type: 'error',
        message: 'Please verify that you are human',
      });
      return;
    }

    if (typeof window.ethereum === 'undefined') {
      setStatus({
        type: 'error',
        message: 'MetaMask is not installed',
      });
      return;
    }

    try {
      setStatus({ type: 'loading', message: 'Connecting to wallet...' });

      if (!isConnected) {
        await connectWallet();
      }

      setStatus({ type: 'loading', message: 'Switching to Pruv Network...' });
      await switchNetwork();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      setStatus({ type: 'loading', message: 'Preparing transaction...' });

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        MOCK_RWA_TOKEN_ABI,
        signer,
      );

      let decimals = 18;
      try {
        decimals = await contract.decimals();
      } catch (error) {
        console.warn('Could not get token decimals, using default 18');
      }

      const amount = ethers.parseUnits('10', decimals);

      setStatus({
        type: 'loading',
        message: 'Confirm transaction in MetaMask...',
      });

      const tx = await contract.mint(address, amount);

      setStatus({
        type: 'loading',
        message: 'Transaction submitted. Waiting for confirmation...',
      });

      const receipt = await tx.wait();

      setStatus({
        type: 'success',
        message: 'Successfully minted 10 MockRWATokens!',
        txHash: receipt.hash,
      });

      if (address !== userAddress) {
        setAddress('');
      }
      setIsHumanVerified(false);
    } catch (error: any) {
      console.error('Minting failed:', error);
      let errorMessage = 'Transaction failed';

      if (error.message?.includes('user rejected')) {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for gas fee';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setStatus({
        type: 'error',
        message: errorMessage,
      });
    }
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        setAddress,
        isConnected,
        userAddress,
        status,
        setStatus,
        isHumanVerified,
        setIsHumanVerified,
        connectWallet,
        switchNetwork,
        mintTokens,
        checkWalletConnection,
      }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
};
