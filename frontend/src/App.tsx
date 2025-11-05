import { useEffect, useState } from 'react';
import { ConnectKitButton } from 'connectkit';
import './App.css';

import { 
  useAccount, 
  useReadContract, 
  useWriteContract 
} from 'wagmi';

import { 
  CELO_BRIDGE, 
  CELO_TOKEN, 
  BRIDGE_ABI, 
  SEPOLIA_BRIDGE, 
  SEPOLIA_TOKEN, 
  TOKEN_ALLOWANCE_ABI 
} from "./utils/account.ts";

function App() {
  const [fromNetwork, setFromNetwork] = useState('Sepolia');
  const [toNetwork, setToNetwork] = useState('Celo');
  const [amount, setAmount] = useState(0);
  const [isAllowanceSufficient, setIsAllowanceSufficient] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const { isConnected, chainId, address } = useAccount();
  const [tokenAddress, setTokenAddress] = useState(SEPOLIA_TOKEN);
  const [spenderAddress, setSpenderAddress] = useState(SEPOLIA_BRIDGE);

  const { writeContract } = useWriteContract();

  useEffect(() => {
    if (chainId === 11142220) { // Celo Sepolia
      setFromNetwork('Celo')
      setToNetwork('Sepolia')
      setTokenAddress(CELO_TOKEN);
      setSpenderAddress(CELO_BRIDGE);
    } else if (chainId === 11155111) { // Ethereum Sepolia
      setFromNetwork('Sepolia')
      setToNetwork('Celo')
      setTokenAddress(SEPOLIA_TOKEN);
      setSpenderAddress(SEPOLIA_BRIDGE);
    } else {
      setFromNetwork('Sepolia')
      setToNetwork('Celo')
      setTokenAddress(SEPOLIA_TOKEN);
      setSpenderAddress(SEPOLIA_BRIDGE);
    }
  }, [chainId]);

  const { data: allowance, refetch } = useReadContract({
    address: tokenAddress,
    abi: TOKEN_ALLOWANCE_ABI,
    functionName: 'allowance',
    args: [address, spenderAddress] as [`0x${string}`, `0x${string}`],
    query: {
      enabled: isConnected && !!tokenAddress && !!address && !!spenderAddress
    }
  });

  useEffect(() => {
    setWalletConnected(isConnected);
  }, [isConnected]);

  useEffect(() => {
    if (Number(amount) === 0) {
      setIsAllowanceSufficient(false);
      return;
    }

    setIsAllowanceSufficient(Number(allowance) / 1e9 >= Number(amount));
  }, [allowance, amount]);

  const approve = async () => {
    try {
      if (tokenAddress) {
        writeContract({
          address: tokenAddress,
          abi: TOKEN_ALLOWANCE_ABI,
          functionName: 'approve',
          args: [spenderAddress, BigInt(Number(amount) * 1e9)],
        });
        await refetch();
      }
    } catch (error) {
      console.error("Approval error:", error);
    }
  };

  const handleSwap = async () => {
    try {
      if (spenderAddress) {
        writeContract({
          address: spenderAddress,
          abi: BRIDGE_ABI,
          functionName: 'bridge',
          args: [tokenAddress, BigInt(Number(amount) * 1e9)],
        });
        await refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="top-0 left-0 absolute h-screen w-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-white to-blue-500">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-blue-200/30 via-purple-100/20 to-transparent" />
      
      <div className="relative w-full max-w-5xl mx-4 grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Column - Form */}
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Asset Bridge</h2>
            <ConnectKitButton />
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-black">From Network</label>
              <input
                type="text"
                value={fromNetwork}
                readOnly
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-black">To Network</label>
              <input
                type="text"
                value={toNetwork}
                readOnly
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-black">Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                className="text-black w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
              />
            </div>

            {isConnected && isAllowanceSufficient ? (
              <button
                onClick={handleSwap}
                disabled={!walletConnected || !isAllowanceSufficient}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                Swap Assets
              </button>
            ) : (
              <button
                onClick={approve}
                disabled={!walletConnected}
                className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl font-medium shadow-lg shadow-yellow-500/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                Approve
              </button>
            )}
          </div>
        </div>

        {/* Right Column - Image and Text */}
        <div className="hidden lg:block relative bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold">Bridge Your Assets</h3>
              <p className="text-lg text-blue-100">
                Securely transfer your assets across different blockchain networks with our advanced bridging solution.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-blue-100">Fast & Secure Transfers</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-blue-100">Low Transaction Fees</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-blue-100">Instant Confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

