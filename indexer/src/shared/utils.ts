import { Contract, Wallet, JsonRpcProvider } from "ethers";
import { ABI } from "../contract/ABI";

export const transferToken = async (
    isCELO: boolean,
    amount: string,
    sender: string,
    nonce: number 
) => {
    const RPC = !isCELO ? process.env.CELO_RPC! : process.env.SEPOLIA_RPC!;
    const pk = process.env.PK!;
    const contractAddress = !isCELO
        ? process.env.BRIDGE_CONTRACT_ADDRESS_CELO!
        : process.env.BRIDGE_CONTRACT_ADDRESS_SEPOLIA!;

    const provider = new JsonRpcProvider(RPC);
    const wallet = new Wallet(pk, provider);
    const contractInstance = new Contract(contractAddress, ABI, wallet);

    const testToken = !isCELO
        ? process.env.TESTTOKEN_CELO!
        : process.env.TESTTOKEN_SEPOLIA!;

    const tx = await contractInstance.redeem(testToken, sender, amount, nonce);
    console.log("token redeemed successfully. txn hash: ", tx.hash);
    await tx.wait();
};
