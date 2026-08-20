"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-8 bg-[#111113] border border-red-500/20 rounded-3xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-lg font-bold text-white">Something went wrong in this module</h3>
          <p className="text-sm text-gray-400 max-w-md">
            {this.state.error?.message || "An unexpected rendering error occurred."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            <RefreshCw size={14} /> Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
