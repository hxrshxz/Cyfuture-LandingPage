export const theme = {
  colors: {
    gradient: {
      primary: "from-blue-600 to-cyan-500",
      primaryDark: "from-blue-300 to-sky-200",
      text: "bg-[linear-gradient(180deg,_#000_0%,_rgba(0,_0,_0,_0.75)_100%)] dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)]",
      pill: "from-zinc-300/20 via-gray-400/20 to-transparent dark:from-zinc-300/5 dark:via-gray-400/5",
      button:
        "from-zinc-300/20 via-blue-400/30 to-transparent dark:from-zinc-300/5 dark:via-blue-400/20",
      buttonHover:
        "from-zinc-300/30 via-blue-400/40 to-transparent dark:from-zinc-300/10 dark:via-blue-400/30",
      conic:
        "conic-gradient(from_90deg_at_50%_50%,#CBDCFF_0%,#2563EB_50%,#CBDCFF_100%)",
    },
    text: {
      primary: "text-gray-900 dark:text-white",
      secondary: "text-gray-600 dark:text-gray-300",
      muted: "text-gray-600 dark:text-gray-400",
    },
    border: {
      subtle: "border-[2px] border-black/5 dark:border-white/5",
      input: "border-input border-[1px]",
    },
    background: {
      primary: "bg-white dark:bg-gray-950",
      card: "bg-white/95 dark:bg-gray-950/95",
      glass: "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md",
    },
  },
  typography: {
    fontFamily: "font-geist",
    sizes: {
      hero: "text-4xl md:text-6xl",
      section: "text-3xl md:text-5xl",
      subtitle: "text-xl md:text-2xl",
      body: "text-base",
      small: "text-sm",
    },
  },
  spacing: {
    section: "py-28",
    container: "max-w-screen-xl mx-auto px-4 md:px-8",
    content: "max-w-3xl mx-auto",
  },
  animation: {
    hover: "transition-all duration-300",
    spin: "animate-[spin_2s_linear_infinite]",
  },
} as const;

// CSS-in-JS classes for complex gradients
export const gradientClasses = {
  textGradient:
    "bg-clip-text text-transparent bg-[linear-gradient(180deg,_#000_0%,_rgba(0,_0,_0,_0.75)_100%)] dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)]",
  primaryGradient:
    "bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-300 dark:to-sky-200",
  pillGradient:
    "bg-gradient-to-tr from-zinc-300/20 via-gray-400/20 to-transparent dark:from-zinc-300/5 dark:via-gray-400/5",
  buttonGradient:
    "bg-gradient-to-tr from-zinc-300/20 via-blue-400/30 to-transparent dark:from-zinc-300/5 dark:via-blue-400/20",
  buttonHoverGradient:
    "hover:bg-gradient-to-tr hover:from-zinc-300/30 hover:via-blue-400/40 hover:to-transparent dark:hover:from-zinc-300/10 dark:hover:via-blue-400/30",
  conicGradient:
    "bg-[conic-gradient(from_90deg_at_50%_50%,#CBDCFF_0%,#2563EB_50%,#CBDCFF_100%)]",
  cardGradient:
    "bg-gradient-to-tr from-zinc-300/10 via-gray-400/10 to-transparent dark:from-zinc-300/5 dark:via-gray-400/5",
};
