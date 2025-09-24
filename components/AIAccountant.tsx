"use client";

import { ResponsiveContainer, ComposedChart, Bar, Line, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useSpring } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, User, X, TrendingUp, ArrowDown, ArrowUp, Upload, Mic, MicOff, Send, FileText, Calculator, BarChart3, Zap, DollarSign, Receipt, ImageIcon, Search, Camera, Languages, Bell, Server, Info, Lightbulb, ShieldCheck, CheckCircle, AlertTriangle, AlertCircle, Database, BarChartHorizontal, CloudRain, Satellite, BrainCircuit, VolumeX, Volume2 } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useIpfs } from "@/hooks/useIpfs";
import { Input } from "@/components/ui/input";

//================================================================================
// --- LISTENING INDICATOR COMPONENT ---
//================================================================================
const ListeningIndicator = () => {
  return (
    <div className="fixed bottom-24 right-24 z-50 flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-ping"></div>
        <div className="relative rounded-full bg-green-600 p-4 flex items-center justify-center shadow-lg">
          <Mic className="h-6 w-6 text-white" />
        </div>
      </div>
      <span className="ml-3 font-medium text-green-600 bg-white/80 px-3 py-1 rounded-full shadow-sm">
        Listening...
      </span>
    </div>
  );
};

//================================================================================
// --- SHIMMER EFFECT COMPONENT ---
//================================================================================
const GeminiShimmerEffect = () => {
  const thinkingPhrases = [
    "Analyzing financial data...",
    "Processing invoice details...",
    "Extracting key information...",
    "Calculating totals...",
    "Generating insights...",
  ];
  const shimmerLines = [
    { width: "95%", delay: 0 },
    { width: "100%", delay: 0.1 },
    { width: "90%", delay: 0.2 },
    { width: "75%", delay: 0.3 },
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex(
        (prevIndex) => (prevIndex + 1) % thinkingPhrases.length
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const lineVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-start gap-3 max-w-2xl mr-auto"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
        className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg"
      >
        <BrainCircuit className="w-5 h-5 text-white" />
      </motion.div>
      <div className="p-3 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/60 shadow-lg space-y-3 w-full max-w-md">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          {shimmerLines.map((line, index) => (
            <motion.div
              key={index}
              variants={lineVariants}
              className="h-3 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded animate-pulse"
              style={{ width: line.width, animationDelay: `${line.delay}s` }}
            />
          ))}
        </motion.div>
        <div className="flex items-center gap-2 pt-1">
          <div className="flex space-x-1">
            <motion.div
              className="w-1.5 h-1.5 bg-purple-400/60 rounded-full"
              animate={{ y: [0, -2, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="w-1.5 h-1.5 bg-purple-400/60 rounded-full"
              animate={{ y: [0, -2, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.1,
              }}
            />
            <motion.div
              className="w-1.5 h-1.5 bg-purple-400/60 rounded-full"
              animate={{ y: [0, -2, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />
          </div>
          <div className="text-xs text-slate-600 w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentPhraseIndex}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="block"
              >
                {thinkingPhrases[currentPhraseIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

//================================================================================
// --- TOAST NOTIFICATION COMPONENT ---
//================================================================================
const Toast = ({
  message,
  type,
  onDismiss,
}: {
  message: string;
  type: string;
  onDismiss: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);
  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-slate-800";
  const Icon =
    type === "success" ? CheckCircle : type === "error" ? AlertTriangle : Info;
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 p-4 rounded-lg shadow-2xl text-white ${bgColor}`}
    >
      <Icon className="h-6 w-6" />
      <span className="text-lg font-medium">{message}</span>
    </motion.div>
  );
};

//================================================================================
// --- FINANCIAL ANALYSIS CHART COMPONENT ---
//================================================================================
const FinancialAnalysisChart = () => {
  const [activeSeries, setActiveSeries] = useState('all');

  const data = [
    { month: 'Jan', income: 125000, expenses: 87000, profit: 38000, cashFlow: 45000 },
    { month: 'Feb', income: 142000, expenses: 92000, profit: 50000, cashFlow: 52000 },
    { month: 'Mar', income: 138000, expenses: 89000, profit: 49000, cashFlow: 48000 },
    { month: 'Apr', income: 165000, expenses: 95000, profit: 70000, cashFlow: 68000 },
    { month: 'May', income: 152000, expenses: 91000, profit: 61000, cashFlow: 58000 },
    { month: 'Jun', income: 178000, expenses: 98000, profit: 80000, cashFlow: 75000 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg w-64 font-sans">
          <p className="font-bold text-slate-800 text-lg mb-2">{label} 2025 Summary</p>
          <div className="space-y-2">
            {payload.map((pld: any) => (
              <div key={pld.dataKey} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: pld.stroke || pld.fill }}></div>
                  <span className="text-slate-600">{pld.name}:</span>
                </div>
                <span className="font-semibold text-slate-800">₹{pld.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      );
    } 
    return null;
  };

  return (
    <div className="relative overflow-hidden w-full bg-white/80 p-6 rounded-2xl border my-4 backdrop-blur-md shadow-xl font-sans">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-emerald-800"></div>

      <div>
        <h3 className="font-bold text-xl text-slate-800 mb-1 ml-2">Interactive Financial Analysis</h3>
        <p className="text-sm text-slate-500 mb-4 ml-2">Six Month Business Summary (2025)</p>
      </div>
      
      <div className="flex items-center justify-center gap-2 mb-4 p-1 bg-slate-100 rounded-full">
        <button onClick={() => setActiveSeries('all')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${activeSeries === 'all' ? 'bg-slate-800 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}>All</button>
        <button onClick={() => setActiveSeries('income')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${activeSeries === 'income' ? 'bg-green-500 text-white shadow' : 'text-green-700 hover:bg-green-100'}`}>Income</button>
        <button onClick={() => setActiveSeries('expenses')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${activeSeries === 'expenses' ? 'bg-red-500 text-white shadow' : 'text-red-700 hover:bg-red-100'}`}>Expenses</button>
        <button onClick={() => setActiveSeries('profit')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${activeSeries === 'profit' ? 'bg-blue-600 text-white shadow' : 'text-blue-700 hover:bg-blue-100'}`}>Profit</button>
        <button onClick={() => setActiveSeries('cashFlow')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${activeSeries === 'cashFlow' ? 'bg-purple-500 text-white shadow' : 'text-purple-700 hover:bg-purple-100'}`}>Cash Flow</button>
      </div>

      <div className="w-full h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 10 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
              <linearGradient id="colorCashFlow" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} dy={10} tick={{ fill: '#64748b' }} />
            <YAxis yAxisId="left" unit=" ₹" width={80} fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} tickFormatter={(value) => new Intl.NumberFormat('en-IN', { notation: 'compact', compactDisplay: 'short' }).format(value)} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.7)' }} />
            
            {(activeSeries === 'all' || activeSeries === 'income') && <Area yAxisId="left" type="monotone" dataKey="income" name="Income" fill="url(#colorIncome)" stroke="#22c55e" strokeWidth={3} />}
            {(activeSeries === 'all' || activeSeries === 'expenses') && <Area yAxisId="left" type="monotone" dataKey="expenses" name="Expenses" fill="url(#colorExpenses)" stroke="#ef4444" strokeWidth={3} />}
            {(activeSeries === 'all' || activeSeries === 'profit') && <Bar yAxisId="left" dataKey="profit" name="Profit" fill="url(#colorProfit)" />}
            {(activeSeries === 'all' || activeSeries === 'cashFlow') && <Line yAxisId="left" type="monotone" dataKey="cashFlow" name="Cash Flow" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={false} />}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

//================================================================================
// --- PROACTIVE FINANCIAL INSIGHTS CARD ---
//================================================================================
const ProactiveFinancialInsightCard = () => {
  const totalInvoicesProcessed = 247;
  const averageProcessingTime = 2.3;
  const totalAmountProcessed = 12450000;
  const topVendor = "Tech Solutions Ltd.";

  return (
    <Card className="w-full max-w-lg bg-white/80 backdrop-blur-sm border-slate-200/80 shadow-lg text-slate-900">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-xl text-slate-900">
              Financial Analysis Summary
            </h3>
            <p className="text-sm text-slate-500">Q4 2025 Report</p>
          </div>
          <Badge className="bg-emerald-100 text-emerald-800">AI Generated</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-semibold text-slate-500">
              Invoices Processed
            </p>
            <p className="text-lg font-bold text-blue-800 flex items-center justify-center gap-1">
              <Receipt className="h-4 w-4" /> {totalInvoicesProcessed}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <p className="text-xs font-semibold text-slate-500">
              Avg. Processing
            </p>
            <p className="text-lg font-bold text-green-800">
              {averageProcessingTime}s
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-semibold text-slate-500">
              Total Amount
            </p>
            <p className="text-lg font-bold text-slate-800">
              ₹{(totalAmountProcessed / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Lightbulb className="h-4 w-4" /> Key Insight
          </h4>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-700">
              <strong>{topVendor}</strong> represents 23% of total processed invoices with an average 
              amount of ₹89,450. Their payment terms show a consistent 30-day cycle, making them 
              ideal for cash flow planning.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

//================================================================================
// --- ANIMATED COUNTER COMPONENT ---
//================================================================================
const AnimatedCounter = ({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  useEffect(() => {
    if (isInView) spring.set(value);
  }, [spring, value, isInView]);
  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current)
        ref.current.textContent = `${Number(
          latest.toFixed(0)
        ).toLocaleString()}${suffix}`;
    });
    return () => unsubscribe();
  }, [spring, suffix]);
  return <span ref={ref} />;
};

//================================================================================
// --- STAT CARD COMPONENT ---
//================================================================================
const MemoizedStatCard = React.memo(({ stat }: { stat: any }) => (
  <Card className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg hover:shadow-xl transition-all h-full">
    <CardContent className="p-5 relative">
      <div className="flex items-center gap-4">
        <div
          className={`p-2 rounded-lg bg-gradient-to-br ${stat.iconColor
            .replace("text-", "from-")
            .replace("-500", "-400/20")} ${stat.iconColor
            .replace("text-", "to-")
            .replace("-500", "-500/20")}`}
        >
          <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-800">
            <AnimatedCounter value={stat.value} />
          </p>
          <p className="text-sm text-slate-600 font-medium">{stat.title}</p>
        </div>
      </div>
      <Badge className="absolute top-4 right-4 bg-green-100 text-green-800 border-green-200 font-semibold">
        {stat.change}
      </Badge>
    </CardContent>
  </Card>
));
MemoizedStatCard.displayName = "MemoizedStatCard";

//================================================================================
// --- ANIMATED MARKDOWN MESSAGE COMPONENT ---
//================================================================================
const TextGenerateEffect = ({ words, onAnimationComplete }: { words: string; onAnimationComplete: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedText(words.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 30);
      return () => clearTimeout(timer);
    } else {
      onAnimationComplete();
    }
  }, [currentIndex, words, onAnimationComplete]);

  return <div className="whitespace-pre-wrap">{displayedText}</div>;
};

const AnimatedMarkdownMessage = ({ text }: { text: string }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  const plainText = useMemo(() => {
    return text.replace(/[*_#`[\]()]/g, "");
  }, [text]);

  useEffect(() => {
    setAnimationComplete(false);
  }, [text]);

  return (
    <AnimatePresence mode="wait">
      {!animationComplete ? (
        <motion.div
          key="animating"
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          <TextGenerateEffect
            words={plainText}
            onAnimationComplete={() => setAnimationComplete(true)}
          />
        </motion.div>
      ) : (
        <motion.div
          key="formatted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.2 } }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

type ChatMessage = {
  id: number;
  type: string;
  text?: string;
  component?: React.ReactNode;
  analysis?: any;
  loading?: boolean;
};

const AIAccountant = ({ embedded = false }: { embedded?: boolean }) => {
  const [view, setView] = useState("dashboard");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "bot",
      text: "Hello! I'm your AI Financial Assistant powered by Google Gemini. I can help you with:\n\n• Invoice processing and OCR\n• Financial document analysis\n• Expense categorization\n• Budget planning\n• Tax calculations\n• Investment analysis\n• Cash flow forecasting\n• Vendor payment tracking\n\nHow can I assist you today?",
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [currentComparison, setCurrentComparison] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [activeYear, setActiveYear] = useState("Latest (2025)");
  const [language, setLanguage] = useState("en-US");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const commandBarRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState({
    message: "",
    type: "info",
    visible: false,
  });
  const [isCoPilotMode, setIsCoPilotMode] = useState(false);
  const [currentDataContext, setCurrentDataContext] = useState<any | null>(null);
  const [isListeningForFollowUp, setIsListeningForFollowUp] = useState(false);
  const [showListeningIndicator, setShowListeningIndicator] = useState(false);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);

  // Initialize Google Gemini AI
  const genAI = useMemo(() => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Gemini API key not found");
      return null;
    }
    return new GoogleGenerativeAI(apiKey);
  }, []);

  const { uploadFile, isUploading } = useIpfs();

  const {
    text: voiceText,
    startListening,
    stopListening,
    isListening,
    hasRecognitionSupport,
  } = useSpeechRecognition({ lang: language });

  //================================================================================
  // --- FINANCIAL COMMAND BAR COMPONENT ---
  //================================================================================
  const FinancialCommandBar = ({
    inputValue,
    onInputChange,
    onSubmit,
    isListening,
    onMicClick,
    hasSpeechSupport,
    language,
    onLanguageChange,
    activeYear,
    onYearChange,
    isCoPilotMode,
    onCoPilotModeChange,
    onFileSelect
  }: any) => {
    const placeholders = useMemo(
      () =>
        language === "en-US"
          ? [
              "Analyze my Q4 financial report...",
              "Show me expense trends...",
              "Process this invoice...",
              "What's my cash flow forecast?",
              "Compare revenue vs expenses...",
              "Calculate tax liability...",
              "Find duplicate payments...",
              "Show vendor payment analysis...",
              "Generate profit & loss statement...",
              "Categorize business expenses...",
            ]
          : ["मेरी वित्तीय रिपोर्ट का विश्लेषण करें...", "खर्च के रुझान दिखाएं..."],
      [language]
    );
    const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholders[0]);

    useEffect(() => {
      const interval = setInterval(
        () =>
          setCurrentPlaceholder(
            (p) =>
              placeholders[(placeholders.indexOf(p) + 1) % placeholders.length]
          ),
        4000
      );
      return () => clearInterval(interval);
    }, [placeholders]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
      <motion.div className="w-full max-w-3xl mx-auto">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-3xl blur-lg opacity-30"></div>
          <div className="relative bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-4 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-full flex items-center">
                <Search className="h-6 w-6 text-slate-500 absolute left-3" />
                <AnimatePresence mode="wait">
                  {!inputValue && !isListening && (
                    <motion.p
                      key={currentPlaceholder}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-12 text-base text-slate-600 pointer-events-none"
                    >
                      {currentPlaceholder}
                    </motion.p>
                  )}
                </AnimatePresence>
                <Input
                  value={inputValue}
                  onChange={onInputChange}
                  className="w-full bg-transparent border-none text-xl h-auto py-4 pl-12 pr-12 text-slate-900 focus-visible:ring-0"
                  onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                />
                {hasSpeechSupport && (
                  <button
                    onClick={onMicClick}
                    className={`absolute right-3 p-2 rounded-full transition-all duration-200 ${
                      isListening
                        ? "bg-green-100 shadow-md"
                        : "hover:bg-slate-200/60"
                    }`}
                  >
                    <Mic
                      className={`h-6 w-6 ${
                        isListening
                          ? "text-green-600 animate-pulse"
                          : "text-slate-500"
                      }`}
                    />
                  </button>
                )}
              </div>
              <Button
                onClick={onSubmit}
                className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
              >
                Submit
              </Button>
            </div>

            {/* Popular queries suggestion buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/50 hover:bg-white text-emerald-700 border-emerald-200"
                onClick={() => {
                  const query = "Show me financial analysis";
                  onInputChange({ target: { value: query } } as any);
                  onSubmit();
                }}
              >
                Financial Analysis
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/50 hover:bg-white text-blue-700 border-blue-200"
                onClick={() => {
                  const query = "Generate expense report";
                  onInputChange({ target: { value: query } } as any);
                  onSubmit();
                }}
              >
                Expense Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/50 hover:bg-white text-purple-700 border-purple-200"
                onClick={() => {
                  const query = "Show cash flow trends";
                  onInputChange({ target: { value: query } } as any);
                  onSubmit();
                }}
              >
                Cash Flow Analysis
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/50 hover:bg-white text-amber-700 border-amber-200"
                onClick={() => {
                  const query = "Generate financial insights";
                  onInputChange({ target: { value: query } } as any);
                  onSubmit();
                }}
              >
                AI Insights
              </Button>
            </div>

            <div className="flex items-center justify-between pl-2 pr-1">
              <div className="flex items-center gap-2">
                {hasSpeechSupport && (
                  <Button
                    variant="ghost"
                    className="h-auto px-3 py-1.5 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4 text-slate-700" />
                      <select
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value)}
                        className="rounded-lg bg-slate-200/70 px-3 py-1.5 text-sm font-medium text-slate-700 border-none focus:ring-0"
                      >
                        <option value="en-US">English</option>
                        <option value="hi-IN">Hindi</option>
                        <option value="bn-IN">Bengali</option>
                        <option value="gu-IN">Gujarati</option>
                        <option value="ta-IN">Tamil</option>
                        <option value="te-IN">Telugu</option>
                        <option value="mr-IN">Marathi</option>
                        <option value="kn-IN">Kannada</option>
                        <option value="ml-IN">Malayalam</option>
                        <option value="pa-IN">Punjabi</option>
                        <option value="ur-IN">Urdu</option>
                      </select>
                    </div>
                  </Button>
                )}

                {/* Co-Pilot Mode toggle */}
                <Button
                  variant={isCoPilotMode ? "default" : "ghost"}
                  className={`h-auto px-3 py-1.5 rounded-lg ${
                    isCoPilotMode
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "text-slate-700 hover:bg-slate-200/70"
                  }`}
                  onClick={() => onCoPilotModeChange(!isCoPilotMode)}
                >
                  <div className="flex items-center gap-2">
                    {isCoPilotMode ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                    <span>Co-Pilot {isCoPilotMode ? "On" : "Off"}</span>
                  </div>
                </Button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.xlsx,.csv"
                onChange={onFileSelect}
              />
              <Button
                variant="ghost"
                className="h-auto px-3 py-1.5 rounded-lg"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                <span>Upload Document</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Text-to-speech function for Co-Pilot Mode
  const speakText = (text: string, onEnd?: () => void) => {
    if (!isCoPilotMode || !window.speechSynthesis) return;

    // Stop any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Find the best natural-sounding voice
    let selectedVoice;
    
    if (language.startsWith('en')) {
      const preferredVoiceNames = [
        'Google UK English Female',
        'Microsoft Aria Online (Natural)', 
        'Microsoft Libby Online (Natural)',
        'Apple Samantha',
        'Google US English',
        'Alex'
      ];
      
      for (const voiceName of preferredVoiceNames) {
        const voice = voices.find(v => v.name === voiceName);
        if (voice) {
          selectedVoice = voice;
          break;
        }
      }
    }
    
    // If still no voice found, use any voice matching the language
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.startsWith(language.split('-')[0])
      );
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    
    // Process text for more natural speech
    text = text.replace(/([.,!?;:])/g, '$1 ');
    text = text.replace(/\n\n/g, '.\n\n');
    text = text.replace(/(\d+)%/g, '$1 percent');
    text = text.replace(/(\d+)\.(\d+)/g, '$1 point $2');
    text = text.replace(/₹(\d+)/g, 'rupees $1');
    
    utterance.text = text;
    
    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Initialize speech synthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
        loadVoices();
        
        return () => {
          window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        };
      }
    }
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isThinking]);

  // Handle voice input
  useEffect(() => {
    if (voiceText) {
      setInputValue(voiceText);

      // In Co-Pilot Mode, if listening for follow-up, auto-submit the question
      if (
        isCoPilotMode &&
        isListeningForFollowUp &&
        voiceText.trim().length > 5
      ) {
        // Stop listening to prevent duplicate submissions
        stopListening();
        setShowListeningIndicator(false);
        setIsListeningForFollowUp(false);

        // Submit the question
        handleSendMessage(voiceText);
      }
    }
  }, [voiceText, isCoPilotMode, isListeningForFollowUp]);

  // Play welcome message when Co-Pilot Mode is toggled on
  useEffect(() => {
    if (isCoPilotMode) {
      speakText(
        "Voice assistant activated. I'll provide detailed spoken responses to help you analyze financial data."
      );
    }
  }, [isCoPilotMode]);

  // Keyboard shortcut handler for command bar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsCommandBarOpen(!isCommandBarOpen);
      }
      if (event.key === 'Escape') {
        setIsCommandBarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCommandBarOpen]);

  const showToast = (message: string, type: string = "info") => {
    setToast({ message, type, visible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const toggleCommandBar = () => {
    setIsCommandBarOpen(!isCommandBarOpen);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setView("chat");
    
    const userMessage: ChatMessage = {
      id: Date.now(),
      type: "user",
      text: `Analyzing document: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsThinking(true);

    try {
      // Upload to IPFS
      const ipfsHash = await uploadFile(file);
      
      if (ipfsHash) {
        showToast(`Document uploaded to IPFS: ${ipfsHash}`, "success");
      }

      // Process with Gemini AI for OCR and analysis
      await processDocumentWithAI(file);
    } catch (error) {
      console.error("File processing error:", error);
      showToast("Error processing document", "error");
    }

    setIsThinking(false);
    if (event.target) {
      event.target.value = "";
    }
  };

  const processDocumentWithAI = async (file: File) => {
    if (!genAI) return;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Convert file to base64 for Gemini
      const fileData = await fileToGenerativePart(file);
      
      const prompt = `Analyze this financial document and provide:
      1. Document type (invoice, receipt, statement, etc.)
      2. Key financial information (amounts, dates, vendor/client)
      3. Line items and categorization
      4. Any tax information
      5. Recommendations for accounting/bookkeeping
      
      Please format the response in a clear, structured way.`;

      const result = await model.generateContent([prompt, fileData]);
      const response = await result.response;
      const text = response.text();

      const analysisMessage: ChatMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: text,
        analysis: {
          documentType: "Financial Document",
          confidence: 0.95,
          extractedData: {
            // This would be populated by the AI response
          }
        }
      };

      setChatHistory(prev => [...prev, analysisMessage]);
    } catch (error) {
      console.error("AI analysis error:", error);
      showToast("Error analyzing document with AI", "error");
    }
  };

  const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        }
      };
      reader.readAsDataURL(file);
    });

    return {
      inlineData: {
        data: await base64EncodedDataPromise,
        mimeType: file.type,
      },
    };
  };

  const handleFakeDocumentAnalysis = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setView('chat'); 

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: "user",
      text: `Analyzing document: ${file.name}`
    };

    setChatHistory(previousChatHistory => [...previousChatHistory, userMessage]); 
    setIsThinking(true);
    
    setTimeout(() => {
      const graphMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'bot',
        component: <FinancialAnalysisChart />
      };

      setChatHistory(previousChatHistory => [...previousChatHistory, graphMessage]);
      setIsThinking(false);

      // In Co-Pilot Mode, provide spoken summary
      if (isCoPilotMode) {
        speakText("I've analyzed your financial document and generated an interactive chart showing your income, expenses, profit, and cash flow trends over the past six months.", () => {
          setIsListeningForFollowUp(true);
          setShowListeningIndicator(true);
          startListening();
        });
      }
    }, 4000);

    if (event.target) {
        event.target.value = '';
    }
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;
    
    const query = messageText.toLowerCase();
    setView("chat");
    setChatHistory((prev) => [...prev, { id: Date.now(), type: "user", text: messageText }]);
    setInputValue("");
    setIsThinking(true);

    try {
      // Check for financial analysis requests
      if (query.includes("financial analysis") || query.includes("show me financial") || query.includes("financial report")) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const response = {
          id: Date.now() + 1,
          type: "bot",
          component: <FinancialAnalysisChart />,
        };
        setChatHistory((prev) => [...prev, response]);

        if (isCoPilotMode) {
          setCurrentDataContext({ type: "financial_analysis" });
          speakText("Here's your interactive financial analysis chart showing income, expenses, profit, and cash flow trends.", () => {
            setIsListeningForFollowUp(true);
            setShowListeningIndicator(true);
            startListening();
          });
        }
        setIsThinking(false);
        return;
      }

      // Check for insights requests
      if (query.includes("insights") || query.includes("summary") || query.includes("report")) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const response = {
          id: Date.now() + 1,
          type: "bot",
          component: <ProactiveFinancialInsightCard />,
        };
        setChatHistory((prev) => [...prev, response]);

        if (isCoPilotMode) {
          setCurrentDataContext({ type: "financial_insights" });
          speakText("I've generated a comprehensive financial insights summary for Q4 2025, highlighting key metrics and observations.", () => {
            setIsListeningForFollowUp(true);
            setShowListeningIndicator(true);
            startListening();
          });
        }
        setIsThinking(false);
        return;
      }

      // Use Gemini AI for other queries
      await generateAIResponse(messageText);
    } catch (error) {
      console.error("AI response error:", error);
      showToast("Error generating AI response", "error");
    } finally {
      setIsThinking(false);
    }
  };

  const generateAIResponse = async (userMessage: string) => {
    if (!genAI) {
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: "I apologize, but I'm having trouble connecting to the AI service. Please check that your API key is configured correctly.",
      };
      setChatHistory(prev => [...prev, errorMessage]);
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      let contextualPrompt = `You are a professional AI Financial Assistant powered by Google Gemini. The user says: "${userMessage}"
      
      Please provide helpful, accurate financial advice and assistance. If the user is asking about:
      - Invoice processing: Explain how to categorize and process invoices, OCR techniques, and automated workflows
      - Tax calculations: Provide general tax guidance (remind them to consult professionals for specific advice)
      - Budget planning: Give practical budgeting advice, cash flow management, and financial planning
      - Investment analysis: Provide educational information about investments, risk assessment, and portfolio management
      - Expense tracking: Suggest categorization and tracking methods, expense optimization strategies
      - Cash flow forecasting: Help with predicting future financial positions
      - Vendor management: Assist with payment tracking, vendor analysis, and procurement insights
      - Financial reporting: Guide on creating P&L statements, balance sheets, and other financial reports
      
      Keep responses conversational but professional. Use financial terminology appropriately but explain complex concepts clearly.`;

      // Add context from current data if available
      if (currentDataContext) {
        contextualPrompt += `\n\nCurrent context: ${JSON.stringify(currentDataContext)}`;
      }
      
      // Add instructions for more detailed responses when in co-pilot mode
      if (isCoPilotMode) {
        contextualPrompt += `\n\nNote: This response will be read aloud via text-to-speech. Please:
        1. Use conversational language that flows naturally when spoken
        2. Avoid overly technical jargon unless necessary
        3. Structure your response with clear, logical flow
        4. Include practical, actionable advice
        5. Keep sentences relatively short for better speech clarity`;
      }

      const result = await model.generateContent(contextualPrompt);
      const response = await result.response;
      const text = response.text();

      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: text,
      };

      setChatHistory(prev => [...prev, aiMessage]);

      // Text-to-speech for co-pilot mode
      if (isCoPilotMode) {
        speakText(text, () => {
          // Start listening for follow-up questions after speaking
          setIsListeningForFollowUp(true);
          setShowListeningIndicator(true);
          startListening();
        });
      }
    } catch (error) {
      console.error("Gemini AI error:", error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: "I apologize, but I encountered an error while processing your request. Please try again.",
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
      setShowListeningIndicator(false);
      setIsListeningForFollowUp(false);

      // In Co-Pilot Mode, submit the voice text immediately after stopping 
      if (isCoPilotMode && voiceText) {
        setInputValue(voiceText);
        setTimeout(() => {
          handleSendMessage(voiceText);
        }, 300);
      }
    } else {
      // If starting listening and we're in Co-Pilot Mode, provide a voice prompt
      if (isCoPilotMode) {
        speakText("I'm listening now. How can I assist with your financial analysis?", () => {
          startListening();
          setShowListeningIndicator(true);
        });
      } else {
        startListening();
        setShowListeningIndicator(true);
      }
    }
  };

  if (view === "dashboard") {
    return (
      <div className="min-h-screen w-full relative bg-black p-6">
        {/* Pearl Mist Background with Top Glow */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% -20%, rgba(120, 119, 198, 0.3), transparent),
              radial-gradient(ellipse 60% 50% at 80% -10%, rgba(255, 154, 158, 0.3), transparent),
              radial-gradient(ellipse 60% 50% at 40% 10%, rgba(139, 92, 246, 0.3), transparent),
              black
            `,
          }}
        />
        
        {/* Content */}
        <div className="relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                AI Financial Assistant
              </h1>
              <p className="text-slate-400 mt-2">
                Powered by Google Gemini • Advanced OCR & Document Analysis
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={toggleCommandBar}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
              >
                <Bot className="w-4 h-4 mr-2" />
                Command Palette
                <span className="ml-2 text-xs opacity-75">⌘K</span>
              </Button>
            </div>
          </div>

          {/* Financial Dashboard Statistics */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {[
              {
                title: "Invoices Processed",
                value: 1247,
                icon: Receipt,
                iconColor: "text-emerald-500",
                change: "+12%",
              },
              {
                title: "AI Financial Queries", 
                value: 3429,
                icon: Bot,
                iconColor: "text-purple-500",
                change: "+18%",
              },
              {
                title: "OCR Accuracy Rate",
                value: 98.7,
                icon: TrendingUp,
                iconColor: "text-green-500",
                change: "+2.1%",
              },
              {
                title: "Documents Stored",
                value: 2.4,
                icon: Database,
                iconColor: "text-cyan-500",
                change: "GB Total",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <MemoizedStatCard stat={stat} />
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-24 flex-col gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                >
                  <Upload className="w-8 h-8" />
                  <span>Upload Document</span>
                </Button>
                
                <Button
                  onClick={() => setView("chat")}
                  className="h-24 flex-col gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <Bot className="w-8 h-8" />
                  <span>Ask AI Assistant</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => showToast("Tax Calculator coming soon!", "info")}
                  className="h-24 flex-col gap-2 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Calculator className="w-8 h-8" />
                  <span>Tax Calculator</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => showToast("Financial Reports feature in development!", "info")}
                  className="h-24 flex-col gap-2 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <BarChart3 className="w-8 h-8" />
                  <span>Financial Reports</span>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Invoice processed</p>
                    <p className="text-xs text-slate-400">$2,450.00 • 2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Document uploaded to IPFS</p>
                    <p className="text-xs text-slate-400">Receipt_March_2024.pdf • 5 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">AI analysis completed</p>
                    <p className="text-xs text-slate-400">Expense categorization • 12 minutes ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Financial Command Bar */}
        <FinancialCommandBar
          isOpen={isCommandBarOpen}
          onClose={() => setIsCommandBarOpen(false)}
          onFileUpload={handleFileUpload}
          onSendMessage={(message: string) => {
            setInputValue(message);
            setView("chat");
            setTimeout(() => handleSendMessage(message), 100);
          }}
          hasRecognitionSupport={hasRecognitionSupport}
          isListening={isListening}
          onVoiceToggle={handleVoiceToggle}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt"
          className="hidden"
          onChange={handleFileUpload}
        />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative bg-black">
      {/* Pearl Mist Background with Top Glow */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% -20%, rgba(120, 119, 198, 0.3), transparent),
            radial-gradient(ellipse 60% 50% at 80% -10%, rgba(255, 154, 158, 0.3), transparent),
            radial-gradient(ellipse 60% 50% at 40% 10%, rgba(139, 92, 246, 0.3), transparent),
            black
          `,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
      {/* Chat Interface */}
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setView("dashboard")}
                className="text-slate-400 hover:text-white"
              >
                ← Back to Dashboard
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">AI Financial Assistant</h2>
                  <p className="text-sm text-slate-400">Powered by Google Gemini</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                Online
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCoPilotMode(!isCoPilotMode)}
                className={isCoPilotMode ? "bg-blue-600 text-white" : ""}
              >
                {isCoPilotMode ? "Co-Pilot: ON" : "Co-Pilot: OFF"}
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          <AnimatePresence>
            {chatHistory.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-4 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.type === "bot" && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-2xl rounded-2xl px-6 py-4 ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white ml-12"
                      : "bg-slate-800/50 text-slate-100"
                  }`}
                >
                  {message.text && (
                    <div className="prose prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {message.text}
                      </pre>
                    </div>
                  )}
                  {message.component && (
                    <div className="mt-4">
                      {message.component}
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-3">
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>

                {message.type === "user" && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 justify-start"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-slate-800/50 rounded-2xl px-6 py-4">
                <GeminiShimmerEffect />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700 p-4">
          <div className="flex items-end gap-3">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-slate-400 hover:text-white"
              >
                {isUploading ? <div className="w-4 h-4 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" /> : <Upload className="w-4 h-4" />}
              </Button>
              {hasRecognitionSupport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceToggle}
                  className={`text-slate-400 hover:text-white ${
                    isListening ? "bg-red-600 text-white" : ""
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              )}
            </div>
            
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                placeholder="Ask me about invoices, taxes, budgeting, or upload documents..."
                className="pr-12 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500"
                disabled={isThinking}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isThinking}
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showListeningIndicator && <ListeningIndicator />}
      
      {showListeningIndicator && <ListeningIndicator />}
      
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={hideToast}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt"
        className="hidden"
        onChange={handleFileUpload}
      />
      </div>
    </div>
  );
};

export default AIAccountant;
