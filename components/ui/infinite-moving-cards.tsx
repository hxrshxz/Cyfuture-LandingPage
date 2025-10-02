"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
    subtitle?: string;
    icon?: string;
    image?: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-2",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="relative w-[320px] max-w-full shrink-0 rounded-2xl border border-b-0 border-zinc-200/50 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] px-5 py-4 md:w-[350px] dark:border-zinc-700/50 dark:bg-[linear-gradient(180deg,#1e293b,#0f172a)] shadow-lg hover:shadow-xl transition-all duration-300"
            key={`${item.name}-${idx}`}
          >
            {/* Header with Icon and Image */}
            <div className="flex items-center justify-between mb-3">
              {item.icon && (
                <div className="text-2xl">{item.icon}</div>
              )}
              {item.image && (
                <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Main Metric Display */}
            <div className="mb-3">
              <h3 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                {item.name}
              </h3>
              <div className="text-2xl font-bold text-neutral-800 dark:text-white mb-1">
                {item.title}
              </div>
              {item.subtitle && (
                <div className={cn(
                  "text-xs font-medium flex items-center gap-1",
                  item.subtitle.includes("+") 
                    ? "text-green-600 dark:text-green-400" 
                    : item.subtitle === "0 from last month"
                    ? "text-neutral-500 dark:text-neutral-400"
                    : "text-red-600 dark:text-red-400"
                )}>
                  <span>{item.subtitle}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <span className="relative z-20 text-xs leading-relaxed font-normal text-neutral-600 dark:text-gray-300 line-clamp-2">
                {item.quote}
              </span>
            </blockquote>

            {/* Decorative gradient border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </li>
        ))}
      </ul>
    </div>
  );
};