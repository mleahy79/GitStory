import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { signInWithGitHub, user, loading } = useAuth();

  // Redirect to chat once authenticated (after redirect flow completes)
  useEffect(() => {
    if (!loading && user) {
      navigate("/chat");
    }
  }, [user, loading, navigate]);

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError(null);

    const result = await signInWithGitHub();

    if (result.success) {
      navigate("/chat");
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  // Show full-page loading while popup is open or auth is resolving
  if (isLoading || loading) {
    return (
      <main className="min-h-screen bg-[#0A1828] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#178582] mx-auto mb-4"></div>
          <p className="text-gray-400">Signing you in...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A1828] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#bfa174] mb-2">
            Check In to the Clinic
          </h1>
          <p className="text-gray-400">
            Sign in to access your repository health records
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#1a2d3d] rounded-lg shadow-lg p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* GitHub OAuth Button */}
          <button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#24292e] text-white font-semibold rounded-lg hover:bg-[#2f363d] transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                {/* GitHub Icon */}
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Continue with GitHub
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Continue without login */}
          <a
            href="/"
            className="block w-full text-center px-4 py-3 border border-[#178582] text-[#178582] font-semibold rounded-lg hover:bg-[#178582] hover:text-white transition-colors"
          >
            Continue without signing in
          </a>

          <p className="mt-4 text-center text-gray-500 text-sm">
            Walk-in patients welcome for public repo checkups
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-500 text-sm">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </main>
  );
};

export default Login;
