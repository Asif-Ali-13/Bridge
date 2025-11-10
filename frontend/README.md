# Bridge Frontend  

This folder contains the **React-based frontend** for the Cross‑Chain ERC20 Token Bridge project.  
It allows users to interact with smart contracts deployed on multiple EVM-compatible networks and initiate cross‑chain token transfers.  

## 🧾 Overview  
The frontend provides a clean and intuitive interface for:  
- Connecting wallets (MetaMask, WalletConnect, Coinbase, etc.)  
- Selecting source and destination networks  
- Entering token amount for bridging  
- Viewing transaction status in real-time  

It uses **wagmi**, **viem**, and **ConnectKit** for wallet integration and blockchain communication.


## 🧰 Tech Stack  
- **React.js** – Frontend framework  
- **TypeScript** – Type safety  
- **TailwindCSS** – Styling  
- **Wagmi + ConnectKit** – Wallet connection & EVM interactions  
- **Ethers.js / Viem** – Contract read/write   


## 📦 Folder Structure  
```
frontend/
├── src/
│   ├── components/      
│   └── utils/           
├── public/               # Static assets
└── package.json          # Dependencies & scripts
```

## ⚙️ Setup Instructions  

1. Navigate to the frontend folder:  
   ```bash
   cd frontend
   ```  

2. Install dependencies:  
   ```bash
   npm install
   ```  

3. Configure environment variables in `.env`:  
   ```env
   VITE_WALLETCONNECT_PROJECT_ID=
   VITE_ALCHEMY_API_KEY=
   VITE_CELO_BRIDGE=
   VITE_CELO_TOKEN=
   VITE_SEPOLIA_BRIDGE=
   VITE_SEPOLIA_TOKEN=
   ```  

4. Run the development server:  
   ```bash
   npm run dev
   ```  


## 🧩 Key Features  
- 🪙 **Token Approval Flow** – Automatically checks and prompts ERC20 approval.  
- 🔄 **Cross-Chain Transfer UI** – Intuitive transfer panel for locking and minting tokens.  
- 💅 **Responsive Design** – Works seamlessly across devices.  


## 🧪 Testing  
- Connect to Sepolia and Celo testnets.  
- Try bridging test tokens from one chain to another.  
- Verify confirmations in MetaMask and the destination block explorer.


## ⚠️ Notes  
- The frontend assumes the indexer service is running and accessible.  
- Ensure that both contracts (Bridge and MockERC20) are deployed and configured correctly.  


## 📝 License  
This project is released under the **MIT License**.  
