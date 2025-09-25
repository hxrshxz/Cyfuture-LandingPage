"use client";

import React, { useMemo } from "react";
import type { ReactNode } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

interface SolanaWalletProviderProps {
  children: ReactNode;
}

const SolanaWalletProvider = ({ children }: SolanaWalletProviderProps) => {
  // Resolve network from env: 'devnet' | 'testnet' | 'mainnet' | 'mainnet-beta'
  const clusterStr = (
    process.env.NEXT_PUBLIC_SOLANA_CLUSTER || "devnet"
  ).toLowerCase();
  const network: WalletAdapterNetwork =
    clusterStr === "mainnet" || clusterStr === "mainnet-beta"
      ? WalletAdapterNetwork.Mainnet
      : clusterStr === "testnet"
      ? WalletAdapterNetwork.Testnet
      : WalletAdapterNetwork.Devnet;

  // Endpoint can be overridden by NEXT_PUBLIC_SOLANA_RPC, else use clusterApiUrl
  const endpoint = useMemo(() => {
    const custom = process.env.NEXT_PUBLIC_SOLANA_RPC?.trim();
    return custom && custom.length > 0 ? custom : clusterApiUrl(network);
  }, [network]);

  // Memoize the wallets array to avoid re-instantiating wallet adapters on every render
  // Prioritize Phantom wallet to avoid MetaMask Solana snap crashes
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(), // Phantom first - most reliable for Solana
      new SolflareWalletAdapter(), // Solflare as backup
    ],
    // The dependency array is empty, so this is only created once
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>
          <div className="">{children}</div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

// Exporting with React.memo prevents the component from re-rendering if its props (children) do not change.
export default React.memo(SolanaWalletProvider);
