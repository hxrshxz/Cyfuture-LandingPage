import { Mic } from "lucide-react";

const ListeningIndicator = () => {
  return (
    <div className="fixed top-32 right-6 z-[10000]">
      <div className="bg-card text-card-foreground flex items-center gap-3 rounded-xl border px-4 py-3 card-glow border-blue-500/20 shadow-2xl shadow-blue-500/10 relative min-w-fit">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-ping"></div>
          <div className="relative rounded-full bg-green-600 p-3 flex items-center justify-center shadow-lg">
            <Mic className="h-4 w-4 text-white" />
          </div>
        </div>
        <span className="font-medium text-green-600 bg-white/80 px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
          Listening...
        </span>
      </div>
    </div>
  );
};

export default ListeningIndicator;
