"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const WalletCard = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
    onConnect,
    isConnecting,
  }: {
    card: any;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    onConnect: (walletId: string) => void;
    isConnecting: string | null;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "rounded-xl relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-700/50 overflow-hidden min-h-[400px] w-full max-w-sm mx-auto transition-all duration-300 ease-out cursor-pointer flex flex-col",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
      )}
    >
      {/* Wallet Image - Always Visible */}
      <div className="flex items-center justify-center pt-6 pb-4 flex-shrink-0">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
          <Image
            src={card.image}
            alt={`${card.title} wallet`}
            width={64}
            height={64}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if image doesn't exist
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Content - Flexible space */}
      <div className="px-5 pb-5 space-y-3 flex-1 flex flex-col">
        {/* Wallet Name and Category */}
        <div className="text-center">
          <div className="text-lg font-bold text-white mb-2">
            {card.title}
          </div>
          <div className={cn(
            "inline-block px-2 py-1 rounded-full text-xs font-medium",
            card.categoryColor
          )}>
            {card.category}
          </div>
        </div>

        {/* Description */}
        <div className="text-gray-300 text-sm text-center leading-relaxed">
          {card.description}
        </div>

        {/* Features */}
        <div className="space-y-1.5 flex-1">
          {card.features.map((feature: string, idx: number) => (
            <div key={idx} className="text-gray-400 text-xs flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0" />
              {feature}
            </div>
          ))}
        </div>

        {/* Connect Button - Always at bottom */}
        <div className="pt-3 mt-auto">
          <Button
            onClick={() => onConnect(card.id)}
            disabled={isConnecting === card.id}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
          >
            {isConnecting === card.id ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting...
              </div>
            ) : (
              `Connect ${card.title}`
            )}
          </Button>
        </div>
      </div>
    </div>
  )
);

WalletCard.displayName = "WalletCard";

type WalletCardType = {
  id: string;
  title: string;
  image: string;
  description: string;
  features: string[];
  category: string;
  categoryColor: string;
};

export function FocusCards({ 
  cards, 
  onConnect, 
  isConnecting 
}: { 
  cards: WalletCardType[];
  onConnect: (walletId: string) => void;
  isConnecting: string | null;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
      {cards.map((card, index) => (
        <WalletCard
          key={card.id}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
          onConnect={onConnect}
          isConnecting={isConnecting}
        />
      ))}
    </div>
  );
}