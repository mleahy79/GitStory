import React from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-[#0A1828] flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-red-400 text-6xl font-bold mb-2">Oops</p>
            <h2 className="text-3xl font-bold text-white mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              An unexpected error occurred. Try refreshing the page
              or heading back to safety.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                className="px-6 py-3 bg-[#178582] text-white font-semibold rounded-lg hover:bg-[#1a9d9a] transition-colors"
              >
                Refresh Page
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false })}
                className="px-6 py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:border-white hover:text-white transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
