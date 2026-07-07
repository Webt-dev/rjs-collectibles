import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Hook this up to Sentry/LogRocket later if you want
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen grid place-items-center bg-white dark:bg-zinc-950 px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 grid place-items-center mb-6">
            <AlertTriangle className="w-8 h-8 text-[#dc2626]" />
          </div>
          <h1 className="text-2xl font-display font-black text-zinc-950 dark:text-white mb-2">
            Something broke
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
            We hit an unexpected error. Your cart is safe — try going back to the homepage.
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b8901f] text-white font-display font-bold text-sm hover:scale-[1.02] active:scale-95 transition-transform shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            Back to home
          </button>
        </div>
      </div>
    );
  }
}