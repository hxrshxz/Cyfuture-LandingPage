"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface AnimatedButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
}

export function AnimatedButton({
  children,
  href,
  className,
  onClick,
}: AnimatedButtonProps) {
  const buttonContent = (
    <span className="relative inline-block overflow-hidden rounded-full p-[1.5px]">
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#CBDCFF_0%,#2563EB_50%,#CBDCFF_100%)]" />
      <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white dark:bg-gray-950 text-xs font-medium backdrop-blur-3xl">
        <span
          className={cn(
            "inline-flex rounded-full text-center group items-center w-full justify-center",
            "bg-gradient-to-tr from-zinc-300/20 via-blue-400/30 to-transparent",
            "dark:from-zinc-300/5 dark:via-blue-400/20",
            "text-gray-900 dark:text-white border-input border-[1px]",
            "hover:bg-gradient-to-tr hover:from-zinc-300/30 hover:via-blue-400/40 hover:to-transparent",
            "dark:hover:from-zinc-300/10 dark:hover:via-blue-400/30",
            "transition-all sm:w-auto py-4 px-10",
            className
          )}
          onClick={onClick}
        >
          {children}
        </span>
      </div>
    </span>
  );

  if (href) {
    return <Link href={href}>{buttonContent}</Link>;
  }

  return buttonContent;
}
