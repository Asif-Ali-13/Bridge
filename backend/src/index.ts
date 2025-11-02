import express from "express";
import cors from "cors";
import { config } from "dotenv";
config();

import { Contract, JsonRpcProvider, Wallet } from "ethers";
import Web3 from "web3";

import { ABI, REEDEMTYPE } from './contract';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (_, res) => {
    res.json({
        message: "Success",
    });
});

app.post("/api/v1/redeem/avalanche", async (req, res) => {

    const web3 = new Web3();
    const logData = req?.body?.logs?.[0];

    try {
        if (logData) {
            const decodedData = web3.eth.abi.decodeParameters(
                ["address", "uint256", "address"],
                logData.data
            );

            const to = decodedData[2]?.toString() as string;
            const tokenAddress: string = decodedData[0] as string;

            if (tokenAddress && decodedData[1] && decodedData[2]) {
                if (
                    tokenAddress?.toLocaleLowerCase() ==
                    process.env.TESTTOKEN_AVA?.toLocaleLowerCase()
                ) {
                    await transferToken(true, {
                        to,
                        value: decodedData[1]?.toString(),
                    });
                }
            }
        }
    } catch (error) {
        console.log(error);
    }

    res.status(200).json({
        message: "successfully send",
    });
});

app.post("/api/v1/redeem/bnb", async (req, res) => {

    const web3 = new Web3();
    const logData = req?.body?.logs?.[0];

    if (logData) {
        const decodedData = web3.eth.abi.decodeParameters(
            ["address", "uint256", "address"],
            logData.data
        );

        const to = decodedData[2]?.toString() as string;
        const tokenAddress: string = decodedData[0] as string;

        if (tokenAddress && decodedData[1] && decodedData[2]) {
            if (
                tokenAddress?.toLocaleLowerCase() ==
                process.env.TESTTOKEN_BNB?.toLocaleLowerCase()
            ) {
                await transferToken(false, {
                    to,
                    value: decodedData[1]?.toString(),
                });
            }
        }
    }

    res.status(200).json({
        message: "successfully send",
    });
});

const transferToken = async (isAVA: boolean, transferData: REEDEMTYPE) => {
    try {

        const RPC = isAVA ? process.env.BNB_RPC : process.env.AVA_RPC; 
        const pk = process.env.PK!;

        const contractAddress = isAVA
            ? process.env.BRIDGE_CONTRACT_ADDRESS_BNB!
            : process.env.BRIDGE_CONTRACT_ADDRESS_AVA!;
        const testToken = isAVA
            ? process.env.TESTTOKEN_BNB!
            : process.env.TESTTOKEN_AVA!;
            
        const provider = new JsonRpcProvider(RPC);
        const wallet = new Wallet(pk, provider);
        const contractInstance = new Contract(contractAddress, ABI, wallet);

        const tx = await contractInstance.redeem(
            testToken,
            transferData.to,
            transferData.value
        );
        await tx.wait();

    } catch (error) {
        console.log(error);
    }
};

app.listen(PORT, () => {
    console.log(` listening on http://localhost:${PORT}`);
});