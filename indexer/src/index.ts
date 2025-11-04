import dotenv from "dotenv";
dotenv.config();

import { JsonRpcProvider, Contract } from "ethers";
import { ABI } from "./contract/ABI";
import { listenToBridgeEvents } from "./worker/eventListener";
import { startProcessingQueue } from "./worker/processor";

const providerCELLO = new JsonRpcProvider(process.env.CELLO_RPC!);
const providerSEPOLIA = new JsonRpcProvider(process.env.SEPOLIA_RPC!);

const contractCELLO = new Contract(
    process.env.BRIDGE_CONTRACT_ADDRESS_CELLO!,
    ABI,
    providerCELLO
);

const contractSEPOLIA = new Contract(
    process.env.BRIDGE_CONTRACT_ADDRESS_SEPOLIA!,
    ABI,
    providerSEPOLIA
);

// Start Event Listeners
setInterval(() => listenToBridgeEvents(providerCELLO, contractCELLO, "CELLO"), 5000);
setInterval(() => listenToBridgeEvents(providerSEPOLIA, contractSEPOLIA, "SEPOLIA"), 5000);

// Start Queue Processor
startProcessingQueue();
