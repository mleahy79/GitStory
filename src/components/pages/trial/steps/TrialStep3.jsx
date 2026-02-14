import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import FunnelCard from "../../../shared/FunnelCard";

const FEATURES = [
  "Everything in the free trial",
  "Historical trend reports",
  "Slack integration alerts",
  "Priority support",
];

const TrialStep3 = () => {
  const { signInWithGitHub } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("annual");

  const handleSignUp = async () => {
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

  if (isLoading) {
    return (
      <FunnelCard>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#178582] mx-auto mb-4"></div>
          <p className="text-gray-400">Setting up your account...</p>
        </div>
      </FunnelCard>
    );
  }

  return (
    <FunnelCard>
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#bfa174]/20 text-[#bfa174] border border-[#bfa174]/40 rounded-full mb-4">
          Best Value
        </span>
        <h2 className="text-2xl font-bold text-white mb-2">
          We'd really love for you to experience this fully.
        </h2>
        <p className="text-gray-400 text-sm">
          Sign up for the full year today — and your trial is completely free.
          No charge until Day 15, and you've already locked in our best rate.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Plan comparison */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Monthly */}
        <button
          onClick={() => setSelectedPlan("monthly")}
          className={`p-4 rounded-lg border text-left transition-all ${
            selectedPlan === "monthly"
              ? "border-[#178582] bg-[#178582]/10"
              : "border-gray-600 bg-[#0A1828]"
          }`}
        >
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Monthly</p>
          <p className="text-white text-2xl font-bold">$29</p>
          <p className="text-gray-500 text-xs">per month</p>
          <p className="text-gray-600 text-xs mt-2">Billed monthly</p>
        </button>

        {/* Annual */}
        <button
          onClick={() => setSelectedPlan("annual")}
          className={`p-4 rounded-lg border text-left transition-all relative ${
            selectedPlan === "annual"
              ? "border-[#bfa174] bg-[#bfa174]/10"
              : "border-gray-600 bg-[#0A1828]"
          }`}
        >
          <span className="absolute -top-2.5 right-3 px-2 py-0.5 text-[10px] font-bold uppercase bg-[#bfa174] text-[#0A1828] rounded-full">
            Save 34%
          </span>
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Annual</p>
          <p className="text-white text-2xl font-bold">$19</p>
          <p className="text-gray-500 text-xs">per month</p>
          <p className="text-gray-600 text-xs mt-2">Billed $228/year</p>
        </button>
      </div>

      {/* Features */}
      <div className="space-y-2 mb-6">
        {FEATURES.map((feature) => (
          <div key={feature} className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#bfa174] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-300 text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <p className="text-gray-500 text-xs text-center mb-4">
        Your card is not charged for 14 days. Cancel before then and you owe nothing.
      </p>

      {/* Primary CTA */}
      <button
        onClick={handleSignUp}
        className="w-full flex items-center justify-center gap-3 py-3 bg-[#bfa174] text-[#0A1828] font-bold rounded-lg hover:bg-[#d4b68a] transition-colors text-lg"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
        Sign Up with GitHub — Start Free Trial
      </button>

      {/* Secondary option */}
      <button
        onClick={handleSignUp}
        className="w-full mt-3 text-center text-gray-500 hover:text-gray-300 text-sm transition-colors"
      >
        Just start the monthly trial instead
      </button>
    </FunnelCard>
  );
};

export default TrialStep3;
