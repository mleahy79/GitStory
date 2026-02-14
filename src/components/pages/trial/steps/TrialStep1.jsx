import FunnelCard from "../../../shared/FunnelCard";

const FEATURES = [
  "Unlimited repository scans",
  "AI-powered commit analysis",
  "Hotspot detection across your entire codebase",
  "Shareable diagnostic reports",
];

const TrialStep1 = ({ onNext }) => {
  return (
    <FunnelCard>
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#178582]/20 text-[#178582] border border-[#178582]/40 rounded-full mb-4">
          Limited Time Offer
        </span>
        <h2 className="text-3xl font-bold text-white mb-3">
          Try SustainRx free for 14 days.
        </h2>
        <p className="text-gray-400">
          Get full access to Checkup, Hotspot Scan, Code Diagnostic, and
          Documentation — no credit card required.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {FEATURES.map((feature) => (
          <div key={feature} className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#178582] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-300 text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full py-3 bg-[#178582] text-white font-bold rounded-lg hover:bg-[#1a9d9a] transition-colors text-lg"
      >
        Start My Free Trial
      </button>
    </FunnelCard>
  );
};

export default TrialStep1;
