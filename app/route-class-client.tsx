"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// This client component applies either the landing palette (dark) or mono-dark for app pages.
export default function ClientRouteClass({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  useEffect(() => {
    const html = document.documentElement;
    if (isLanding) {
      html.classList.remove("mono-dark");
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
      html.classList.add("mono-dark");
    }
  }, [isLanding]);

  return <>{children}</>;
}
