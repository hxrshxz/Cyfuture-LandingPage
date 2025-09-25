"use client";

import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";

export function IPFSLinks({ cid }: { cid: string }) {
  const gateways = [{ name: "IPFS.io", base: "https://ipfs.io/ipfs" }];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      {gateways.map(({ name, base }) => {
        const url = `${base}/${cid}`;
        return (
          <div key={name} className="flex items-center gap-2">
            <Button
              onClick={() => window.open(url, "_blank")}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white h-9"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              {name}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-9 border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={() => navigator.clipboard.writeText(url)}
              title={`Copy ${name} URL`}
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
