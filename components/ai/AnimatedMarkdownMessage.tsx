import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AnimatedMarkdownMessage = ({ text }: { text: string }) => {
  const [animationComplete, setAnimationComplete] = useState(true); // Set to true initially

  // When the text content changes, immediately show the content
  useEffect(() => {
    if (text) {
      setAnimationComplete(true);
    }
  }, [text]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </motion.div>
  );
};

export default AnimatedMarkdownMessage;
