import { JsonRpcProvider, Interface, Contract } from "ethers";
import { ABI } from "../contract/ABI";
import { prisma } from "../shared/prisma";
import { bridgeQueue } from "../shared/redis";

const bridgeInterface = new Interface(ABI);

const contractAddress = process.env.BRIDGE_CONTRACT_ADDRESS_CELO!;

export const listenToBridgeEvents = async (
    provider: JsonRpcProvider,
    contract: Contract,
    network: "CELO" | "SEPOLIA"
) => {
    let lastProcessedBlock = await prisma.networkStatus.findUnique({
        where: { network },
    });

    const latestBlock = await provider.getBlockNumber();

    if (!lastProcessedBlock) {
        const data = await prisma.networkStatus.create({
            data: { network, lastProcessedBlock: latestBlock },
        });
        lastProcessedBlock = { ...data };
    }

    if (lastProcessedBlock.lastProcessedBlock >= latestBlock) return;
    const filter = contract.filters.Bridge();

    // Batch size to stay within RPC free-tier limits
    const BATCH_SIZE = 10;
    let fromBlock = lastProcessedBlock.lastProcessedBlock + 1;

    // Helper: delay
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    // Helper: retry with exponential backoff
    const safeGetLogs = async (params: any, retries = 3, delay = 1000): Promise<any[]> => {
        try {
            return await provider.getLogs(params);
        } catch (err: any) {
            const isRateLimit = err?.error?.code === 429 || err?.code === 429;
            if (isRateLimit && retries > 0) {
                console.warn(`Rate limited (429). Retrying in ${delay}ms...`);
                await sleep(delay);
                return safeGetLogs(params, retries - 1, delay * 2); // exponential backoff
            }
            console.error("Error fetching logs:", err);
            return [];
        }
    };

    while (fromBlock <= latestBlock) {
        const toBlock = Math.min(fromBlock + BATCH_SIZE - 1, latestBlock);
        // console.log(`Fetching logs from block ${fromBlock} to ${toBlock}`);

        try {
            const logs = await safeGetLogs(
                {
                    ...filter,
                    fromBlock,
                    toBlock,
                },
                3, // retries
                1000 // initial delay 1s
            );

            for (const log of logs) {
                try {
                    const parsedLog = bridgeInterface.parseLog(log);
                    if(!parsedLog || log.address !== contractAddress) continue;

                    const [ token, amount, sender ] = parsedLog.args;
                    try {
                        await bridgeQueue.add(
                            {
                                txhash: log.transactionHash.toLowerCase(),
                                tokenAddress: token.toString(),
                                amount: amount.toString(),
                                sender: sender.toString(),
                                network,
                            },
                            { jobId: log.transactionHash.toLowerCase() } // ensures no duplicates
                        );
                        console.log(`from ${network} : ${log.transactionHash} is added to queue`);
                    } 
                    catch (err) {
                        console.error("Failed to add job to queue:", err);
                    }

                } catch (err) {
                    console.warn("Skipping log: unable to parse event", log, err);
                }
            }
        } catch (err) {
            console.error(`Error in listenToBridgeEvents for ${network}:`, err);
            throw err;
        }

        fromBlock = toBlock + 1;
        // small delay to avoid RPC rate limits
        await new Promise((r) => setTimeout(r, 1000));
    }

    await prisma.networkStatus.update({
        where: { network },
        data: { lastProcessedBlock: latestBlock },
    });
};
