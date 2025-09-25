"use client";

import React, { Component } from "react";
import type { ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm border border-red-500/20 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>

            <h2 className="text-xl font-bold text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-slate-400 mb-6">
              We encountered an unexpected error. Please try refreshing the
              page.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Page
              </button>

              <button
                onClick={() => this.setState({ hasError: false })}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Try Again
              </button>
            </div>

            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                  Error Details
                </summary>
                <pre className="mt-2 p-3 bg-slate-900/50 rounded-lg text-xs text-red-400 overflow-x-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
