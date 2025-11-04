import { Contract, Wallet, JsonRpcProvider } from "ethers";
import { ABI } from "../contract/ABI";

export const transferToken = async (
    isCELLO: boolean,
    amount: string,
    sender: string,
    nonce: number 
) => {
    const RPC = !isCELLO ? process.env.CELLO_RPC! : process.env.SEPOLIA_RPC!;
    const pk = process.env.PK!;
    const contractAddress = !isCELLO
        ? process.env.BRIDGE_CONTRACT_ADDRESS_CELLO!
        : process.env.BRIDGE_CONTRACT_ADDRESS_SEPOLIA!;

    const provider = new JsonRpcProvider(RPC);
    const wallet = new Wallet(pk, provider);
    const contractInstance = new Contract(contractAddress, ABI, wallet);

    const testToken = !isCELLO
        ? process.env.TESTTOKEN_CELLO!
        : process.env.TESTTOKEN_SEPOLIA!;

    const tx = await contractInstance.redeem(testToken, sender, amount, nonce);
    await tx.wait();
};
