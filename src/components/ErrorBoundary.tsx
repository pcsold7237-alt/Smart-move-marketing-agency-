import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  // Optional label so we know which boundary caught the crash (e.g. "Admin CMS")
  label?: string;
  // If true, renders a small inline fallback instead of a full-screen one.
  // Used for the admin overlay so a crash there doesn't take down the whole homepage.
  compact?: boolean;
}

interface ErrorBoundaryState {
  error: Error | null;
}

// Defensive safety net: without this, ANY uncaught render-time exception anywhere
// in the tree unmounts the entire React app, leaving a blank/black page (the body
// background is #05080c, near-black) with zero indication of what went wrong.
// This catches that, logs the real error to the console, and shows a visible,
// recoverable fallback instead of a silent black screen.
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.label ? `: ${this.props.label}` : ''}] Caught render error:`, error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      if (this.props.compact) {
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="w-full max-w-md p-6 rounded-2xl bg-[#0f1520] border border-red-500/40 text-center space-y-3">
              <p className="text-red-400 font-bold text-sm">Something went wrong loading this panel.</p>
              <p className="text-gray-400 text-xs break-words">{this.state.error.message}</p>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
              >
                Try Again
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#05080c] text-center">
          <div className="max-w-md space-y-4">
            <p className="text-white font-bold text-lg">Something went wrong.</p>
            <p className="text-gray-400 text-xs break-words">{this.state.error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-[#B7FF00] text-black text-xs font-bold"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
