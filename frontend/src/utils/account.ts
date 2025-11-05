import type { Address } from "viem";

// CELO Chain Bridge and Token Addresses 
export const CELO_BRIDGE = `${import.meta.env.VITE_CELO_BRIDGE}` as Address;
export const CELO_TOKEN = `${import.meta.env.VITE_CELO_TOKEN}` as Address;

// SEPOLIA Chain Bridge and Token Addresses 
export const SEPOLIA_BRIDGE = `${import.meta.env.VITE_SEPOLIA_BRIDGE}` as Address;
export const SEPOLIA_TOKEN = `${import.meta.env.VITE_SEPOLIA_TOKEN}` as Address;

export const TOKEN_ALLOWANCE_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const BRIDGE_ABI = [
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "bridge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

