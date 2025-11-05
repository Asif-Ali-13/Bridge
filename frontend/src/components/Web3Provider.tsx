import { WagmiProvider, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { defineChain } from "viem";

// --- Define Celo Sepolia Testnet ---
const celoSepolia = defineChain({
  id: 11142220,
  name: "Celo Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "CELO",
    symbol: "CELO",
  },
  rpcUrls: {
    default: {
      http: [`https://celo-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`],
    },
  },
  blockExplorers: {
    default: {
      name: "CeloScan",
      url: "https://celoscan.io/",
    },
  },
  testnet: true,
});

// --- Dynamic app metadata ---
const isProd =
  typeof window !== "undefined" &&
  !["localhost", "127.0.0.1"].includes(window.location.hostname);

const appUrl = isProd ? "<prod_url>" : window.location.origin;
const appIcon = isProd
  ? "<prod_app_icon>"
  : `${window.location.origin}/favicon.ico`;

// --- WalletConnect Project ID ---
const projectId = `${import.meta.env.VITE_WALLETCONNECT_PROJECT_ID}`;

// --- wagmi + connectkit config ---
const config = createConfig(
  getDefaultConfig({
    appName: "Token Bridge",
    appDescription: "Cross-chain token bridge",
    appUrl,
    appIcon,
    walletConnectProjectId: projectId,
    chains: [sepolia, celoSepolia],
  })
);

// --- Query Client ---
const queryClient = new QueryClient();

// --- Web3 Provider Component ---
export const Web3Provider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

