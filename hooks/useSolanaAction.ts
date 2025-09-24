import { useState, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { createMemoInstruction } from "@solana/spl-memo";

// Define the structure for the hook's return value
interface SolanaActionResult {
  signature: string | null;
  error: Error | null;
}

interface SolanaAction {
  sendTransaction: (memo: string) => Promise<SolanaActionResult>;
  requestAirdrop: () => Promise<SolanaActionResult>;
  getBalance: () => Promise<number>;
  isSending: boolean;
}

export const useSolanaAction = (): SolanaAction => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction: walletSendTransaction } = useWallet();
  const [isSending, setIsSending] = useState(false);

  const sendActionTransaction = useCallback(
    async (memo: string): Promise<SolanaActionResult> => {
      if (!publicKey) {
        const error = new Error(
          "Wallet Not Connected. Please connect your wallet to proceed."
        );
        console.error(error);
        return { signature: null, error };
      }

      setIsSending(true);

      try {
        // Check balance first
        const balance = await connection.getBalance(publicKey);
        console.log("Current balance:", balance / LAMPORTS_PER_SOL, "SOL");

        if (balance < 5000) {
          // Need at least 0.000005 SOL for transaction
          const error = new Error(
            "Insufficient SOL balance. Please request an airdrop first."
          );
          console.error(error);
          return { signature: null, error };
        }

        console.log("Creating transaction for wallet:", publicKey.toBase58());

        // Create a simple memo transaction
        const transaction = new Transaction();

        // Add a memo instruction using the SPL Memo program
        transaction.add(createMemoInstruction(memo));

        // Get recent blockhash
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;

        // Send the transaction
        console.log("Sending memo transaction with text:", memo);
        const signature = await walletSendTransaction(transaction, connection);
        console.log("Transaction sent with signature:", signature);

        // Wait for confirmation
        const confirmation = await connection.confirmTransaction(
          signature,
          "confirmed"
        );
        console.log("Transaction confirmed:", confirmation);

        return { signature, error: null };
      } catch (err) {
        console.error("Solana transaction error:", err);

        // Handle specific wallet errors
        let errorMessage = "Transaction failed";
        const errorStr = (err as Error).message;

        if (
          errorStr.includes("metamask/solana-wallet-snap") ||
          errorStr.includes("Snap crashed")
        ) {
          errorMessage =
            "MetaMask Solana snap crashed. Please try using Phantom wallet instead, or refresh the page and reconnect.";
        } else if (errorStr.includes("User rejected")) {
          errorMessage = "Transaction was cancelled by user";
        } else if (errorStr.includes("Insufficient")) {
          errorMessage = "Insufficient SOL balance for transaction";
        } else if (errorStr.includes("Network")) {
          errorMessage = "Network connection issue. Please try again.";
        }

        const enhancedError = new Error(errorMessage);
        return { signature: null, error: enhancedError };
      } finally {
        setIsSending(false);
      }
    },
    [connection, publicKey, walletSendTransaction]
  );

  const requestAirdrop = useCallback(async (): Promise<SolanaActionResult> => {
    if (!publicKey) {
      const error = new Error(
        "Wallet Not Connected. Please connect your wallet to request an airdrop."
      );
      console.error(error);
      return { signature: null, error };
    }

    setIsSending(true);

    try {
      console.log("Requesting airdrop for wallet:", publicKey.toBase58());
      
      // Request 1 SOL airdrop
      const signature = await connection.requestAirdrop(
        publicKey,
        LAMPORTS_PER_SOL
      );
      
      console.log("Airdrop requested with signature:", signature);

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(
        signature,
        "confirmed"
      );
      console.log("Airdrop confirmed:", confirmation);

      return { signature, error: null };
    } catch (err) {
      console.error("Airdrop error:", err);

      let errorMessage = "Airdrop failed";
      const errorStr = (err as Error).message;

      if (errorStr.includes("airdrop limit")) {
        errorMessage = "Airdrop limit exceeded. Please try again later.";
      } else if (errorStr.includes("Network")) {
        errorMessage = "Network connection issue. Please try again.";
      }

      const enhancedError = new Error(errorMessage);
      return { signature: null, error: enhancedError };
    } finally {
      setIsSending(false);
    }
  }, [connection, publicKey]);

  const getBalance = useCallback(async (): Promise<number> => {
    if (!publicKey) {
      console.error("Wallet not connected");
      return 0;
    }

    try {
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (err) {
      console.error("Error getting balance:", err);
      return 0;
    }
  }, [connection, publicKey]);

  return {
    sendTransaction: sendActionTransaction,
    requestAirdrop,
    getBalance,
    isSending,
  };
};
