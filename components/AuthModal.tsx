"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, signup, isLoading } = useAuth();
  const router = useRouter();

  // Demo values for quick testing
  const demoLoginData = {
    email: "john@example.com",
    password: "password123",
  };

  const demoSignupData = {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    confirmPassword: "password123",
  };

  const [loginData, setLoginData] = useState({
    email: demoLoginData.email,
    password: demoLoginData.password,
  });

  const [signupData, setSignupData] = useState({
    name: demoSignupData.name,
    email: demoSignupData.email,
    password: demoSignupData.password,
    confirmPassword: demoSignupData.confirmPassword,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        const success = await login(loginData.email, loginData.password);
        if (success) {
          onClose();
          router.push("/dashboard");
        } else {
          setError("Invalid credentials. Try the demo values!");
        }
      } else {
        if (signupData.password !== signupData.confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        if (signupData.password.length < 6) {
          setError("Password must be at least 6 characters long");
          return;
        }

        const success = await signup(
          signupData.name,
          signupData.email,
          signupData.password
        );
        if (success) {
          onClose();
          router.push("/dashboard");
        } else {
          setError("Email already exists. Try a different email.");
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  const fillDemoData = () => {
    if (mode === "login") {
      setLoginData(demoLoginData);
    } else {
      setSignupData(demoSignupData);
    }
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {mode === "login" ? "Welcome back!" : "Create account"}
            </h2>
            <p className="text-zinc-400">
              {mode === "login"
                ? "Sign in to continue"
                : "Get started with CyFuture AI"}
            </p>
          </div>

          {/* Demo Data Button */}
          <div className="mb-6">
            <Button
              type="button"
              onClick={fillDemoData}
              variant="outline"
              className="w-full bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20"
            >
              🚀 Fill Demo Data (Quick Test)
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            {mode === "signup" && (
              <div>
                <Label htmlFor="name" className="text-white text-sm">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={signupData.name}
                  onChange={(e) =>
                    setSignupData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="mt-1 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500 focus:ring-orange-500/20"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-white text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={mode === "login" ? loginData.email : signupData.email}
                onChange={(e) => {
                  if (mode === "login") {
                    setLoginData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));
                  } else {
                    setSignupData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));
                  }
                }}
                className="mt-1 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500 focus:ring-orange-500/20"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white text-sm">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={
                    mode === "login" ? loginData.password : signupData.password
                  }
                  onChange={(e) => {
                    if (mode === "login") {
                      setLoginData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));
                    } else {
                      setSignupData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));
                    }
                  }}
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500 focus:ring-orange-500/20 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <Label htmlFor="confirmPassword" className="text-white text-sm">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={signupData.confirmPassword}
                  onChange={(e) =>
                    setSignupData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="mt-1 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500 focus:ring-orange-500/20"
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 rounded-xl transition-colors"
            >
              {isLoading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-zinc-400 text-sm">
              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setError("");
                }}
                className="text-orange-400 hover:text-orange-300 font-medium"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          {/* Demo Info */}
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-blue-400 text-xs text-center">
              💡 <strong>Demo Credentials:</strong> john@example.com /
              password123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
