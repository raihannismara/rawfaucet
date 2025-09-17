import { ExternalLink, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { images } from './configs/images';
import { useWallet } from './context/Transaction';

const CONTRACT_ADDRESS =
  import.meta.env.VITE_ADDRESS_MOCK_RWA_TOKEN ||
  '0x0000000000000000000000000000000000000000';

function App() {
  const {
    address,
    setAddress,
    isConnected,
    status,
    isHumanVerified,
    setIsHumanVerified,
    connectWallet,
    mintTokens,
  } = useWallet();

  const getStatusIcon = () => {
    switch (status.type) {
      case 'loading':
        return <Loader2 className="animate-spin" size={20} />;
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={images.logo} alt="RWA Logo" className="w-20 h-20" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Pruv Network Testnet Faucet
          </h1>
        </div>

        <div className="mb-6">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-2">
            Wallet Address
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0xD4c825203f97984e7867F11eeCc813A036089D1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm"
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <input
              type="checkbox"
              id="human-check"
              checked={isHumanVerified}
              onChange={(e) => setIsHumanVerified(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="human-check"
              className="text-sm text-gray-700 flex-1">
              I am human
            </label>
            <div className="bg-blue-500 rounded p-2">
              <CheckCircle className="text-white" size={16} />
            </div>
          </div>
        </div>

        {status.message && (
          <div
            className={`mb-6 p-3 rounded-lg flex items-center space-x-2 ${
              status.type === 'error'
                ? 'bg-red-50 text-red-700'
                : status.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-blue-50 text-blue-700'
            }`}>
            {getStatusIcon()}
            <span className="text-sm">{status.message}</span>
          </div>
        )}

        {status.txHash && (
          <div className="mb-6">
            <a
              href={`https://explorer.testnet.pruv.network/tx/${status.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-500 hover:text-blue-600 text-sm">
              View Transaction <ExternalLink size={14} className="ml-1" />
            </a>
          </div>
        )}

        {!isConnected && (
          <button
            onClick={connectWallet}
            disabled={status.type === 'loading'}
            className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition-colors mb-4">
            {status.type === 'loading' ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" size={16} />
                Connecting...
              </span>
            ) : (
              'Connect Wallet'
            )}
          </button>
        )}

        <button
          onClick={mintTokens}
          disabled={status.type === 'loading' || !address || !isHumanVerified}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium py-3 rounded-lg transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed">
          {status.type === 'loading' ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" size={16} />
              Processing...
            </span>
          ) : (
            'Request Funds'
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">Network: Pruv Network Testnet</p>
          <p className="text-xs text-gray-500">Amount: 10 MockRWATokens</p>
          {CONTRACT_ADDRESS !==
            '0x0000000000000000000000000000000000000000' && (
            <p className="text-xs text-gray-400 mt-1 font-mono break-all">
              Contract: {CONTRACT_ADDRESS}
            </p>
          )}
        </div>

        {CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000' && (
          <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700">
              ⚠️ Please update the CONTRACT_ADDRESS in the code with the actual
              MockRWAToken contract address.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
