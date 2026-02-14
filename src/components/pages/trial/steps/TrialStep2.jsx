import FunnelCard from "../../../shared/FunnelCard";

const REASSURANCES = [
  {
    icon: "\u{1F514}",
    title: "Reminder email 3 days before trial ends",
    description: "So you're never caught off guard",
  },
  {
    icon: "\u{1F4C5}",
    title: "Another reminder the day before",
    description: "We want you to make an informed decision",
  },
  {
    icon: "\u{1F6AB}",
    title: "Cancel anytime in one click",
    description: "No forms. No phone calls. No dark patterns.",
  },
];

const TrialStep2 = ({ onNext }) => {
  return (
    <FunnelCard>
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#178582]/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#178582]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          We'll never surprise you with a charge.
        </h2>
        <p className="text-gray-400 text-sm">
          Your 14-day trial starts the moment you sign up. We'll send you a
          reminder 3 days before it ends — and again the day before.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {REASSURANCES.map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-4 bg-[#0A1828] rounded-lg p-4"
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-white font-semibold text-sm">{item.title}</p>
              <p className="text-gray-500 text-xs mt-0.5">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full py-3 bg-[#178582] text-white font-bold rounded-lg hover:bg-[#1a9d9a] transition-colors text-lg"
      >
        Sounds good — continue
      </button>

      <p className="text-center text-gray-600 text-xs mt-4">
        Used by engineering teams who care about long-term code quality
      </p>
    </FunnelCard>
  );
};

export default TrialStep2;
