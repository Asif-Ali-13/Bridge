import dotenv from "dotenv";
dotenv.config();

import { JsonRpcProvider, Contract } from "ethers";
import { ABI } from "./contract/ABI";
import { listenToBridgeEvents } from "./worker/eventListener";
import { startProcessingQueue } from "./worker/processor";

const providerCELO = new JsonRpcProvider(process.env.CELO_RPC!);
const providerSEPOLIA = new JsonRpcProvider(process.env.SEPOLIA_RPC!);

const contractCELO = new Contract(
    process.env.BRIDGE_CONTRACT_ADDRESS_CELO!,
    ABI,
    providerCELO
);

const contractSEPOLIA = new Contract(
    process.env.BRIDGE_CONTRACT_ADDRESS_SEPOLIA!,
    ABI,
    providerSEPOLIA
);

// Start Event Listeners
setInterval(async () => 
    {
        try {
            await listenToBridgeEvents(providerCELO, contractCELO, "CELO");
        } catch (error) {
            console.error("Error in CELO event listener:", error);
        }
    }, 5000
);

setInterval(async() => 
    {
        try {
            await listenToBridgeEvents(providerSEPOLIA, contractSEPOLIA, "SEPOLIA");
        } catch (error) {
            console.error("Error in SEPOLIA event listener:", error);
        }
    }, 5000
);

// Start Queue Processor
startProcessingQueue();


import { prisma } from "./shared/prisma";
import { bridgeQueue } from "./shared/redis";

process.on("SIGINT", gracefulShutdown);     // Ctrl + C
process.on("SIGTERM", gracefulShutdown);    // Docker stop
process.on("beforeExit", gracefulShutdown); // Docker stop

async function gracefulShutdown() {
    console.log("\nshutting down indexer...");

    try {
        await prisma.$disconnect();
        if (bridgeQueue) await bridgeQueue.close();
        console.log("shutdown complete.");
    } 
    catch (err) {
        console.error("Error during shutdown:", err);
    } 
    finally {
        process.exit(0);
    }
}
