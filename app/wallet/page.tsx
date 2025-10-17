"use client";

import { ProtectedRoute } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { FocusCards } from "@/components/ui/focus-cards";
import { useState } from "react";
import { Wallet, Users } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";

function WalletContent() {
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const { select, wallets, connected, disconnect } = useWallet();

  const walletOptions = [
    {
      id: "phantom",
      title: "Phantom",
      image: "/w4.png",
      description: "The friendly Solana wallet built for everyone",
      features: ["Easy to use", "Secure", "Mobile friendly"],
      category: "Recommended",
      categoryColor: "bg-purple-500/20 text-purple-300",
      adapterName: "Phantom",
    },
    {
      id: "solflare",
      title: "Solflare",
      image: "/w1.png",
      description: "A comprehensive Solana wallet with advanced features",
      features: ["Multi-chain support", "NFT storage", "DeFi integration"],
      category: "Popular",
      categoryColor: "bg-orange-500/20 text-orange-300",
      adapterName: "Solflare",
    },
    {
      id: "backpack",
      title: "Backpack",
      image: "/w3.png",
      description: "Modern wallet built for the next generation of Web3",
      features: ["Social features", "Portfolio tracking", "Cross-chain"],
      category: "New",
      categoryColor: "bg-green-500/20 text-green-300",
      adapterName: "Backpack",
    },
    {
      id: "metamask",
      title: "MetaMask",
      image: "/w2.png",
      description: "Connect via MetaMask Solana Snap",
      features: ["Browser extension", "Familiar interface", "Multi-chain"],
      category: "Ethereum",
      categoryColor: "bg-blue-500/20 text-blue-300",
      adapterName: "MetaMask",
    },
  ];

  const handleConnectWallet = async (walletId: string) => {
    try {
      setConnectingWallet(walletId);
      
      // Find the wallet option
      const walletOption = walletOptions.find(w => w.id === walletId);
      if (!walletOption) {
        console.error(`Wallet ${walletId} not found`);
        return;
      }

      // Find the corresponding wallet adapter
      const walletAdapter = wallets.find(
        wallet => wallet.adapter.name.toLowerCase().includes(walletOption.adapterName.toLowerCase())
      );

      if (walletAdapter) {
        // If already connected to a different wallet, disconnect first
        if (connected) {
          await disconnect();
          // Wait a bit for disconnect to complete
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Select and connect to the new wallet
        await select(walletAdapter.adapter.name);
        
        // The wallet adapter will handle the connection automatically
        console.log(`Successfully initiated connection to ${walletOption.title}`);
      } else {
        // If wallet adapter not found, show error
        console.error(`${walletOption.title} wallet adapter not found. Please install the ${walletOption.title} browser extension.`);
        alert(`Please install the ${walletOption.title} browser extension first, then refresh the page.`);
      }
    } catch (error) {
      console.error(`Error connecting to wallet:`, error);
      alert(`Failed to connect to wallet. Please make sure the wallet extension is installed and try again.`);
    } finally {
      setConnectingWallet(null);
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <div className="p-8">
              {/* Header */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <Wallet className="w-8 h-8 text-blue-400" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Connect Your Wallet</h2>
                    <p className="text-muted-foreground">
                      Choose your preferred wallet to start using CyFuture AI
                    </p>
                  </div>
                </div>
                
                {/* Connection Status */}
                {connected && (
                  <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm font-medium">Wallet Connected Successfully!</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Focus Cards */}
              <div className="mb-16">
                <FocusCards 
                  cards={walletOptions} 
                  onConnect={handleConnectWallet}
                  isConnecting={connectingWallet}
                />
              </div>

              {/* Info Section */}
              <div className="mt-12 p-6 bg-black/20 rounded-lg border border-gray-800/50">
                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">Why Connect a Wallet?</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        Securely store and manage your crypto assets
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        Interact with DeFi protocols and smart contracts
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        Access premium features and AI-powered insights
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        Track your portfolio performance in real-time
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function WalletPage() {
  return (
    <ProtectedRoute>
      <WalletContent />
    </ProtectedRoute>
  );
}