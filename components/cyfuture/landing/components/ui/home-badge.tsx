import React from "react";
import { Badge } from "./badge";
import { cn } from "../../../../lib/utils";

interface HomeBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function HomeBadge({ children, className }: HomeBadgeProps) {
  return (
    <Badge
      className={cn("bg-primary/10 text-primary border-primary/20", className)}
    >
      {children}
    </Badge>
  );
}
