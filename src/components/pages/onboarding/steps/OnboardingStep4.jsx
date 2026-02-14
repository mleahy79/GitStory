import { useOnboarding } from "../../../../context/OnboardingContext";
import FunnelCard from "../../../shared/FunnelCard";
import OptionPill from "../../../shared/OptionPill";

const OPTIONS = [
  { id: "faster-delivery", icon: "\u{1F4A1}", label: "Faster delivery and fewer production incidents", description: "Ship with confidence, not crossed fingers" },
  { id: "clear-priorities", icon: "\u{1F9ED}", label: "Clear priorities for our next tech debt sprint", description: "Stop guessing what to fix first" },
  { id: "stakeholders", icon: "\u{1F91D}", label: "Better conversations with non-technical stakeholders", description: "Concrete data to justify refactoring investment" },
  { id: "measurable", icon: "\u{1F4C8}", label: "Measurable improvement over time", description: "Benchmarks we can track sprint over sprint" },
  { id: "onboarding", icon: "\u{1F393}", label: "A faster path to getting new engineers up to speed", description: "Turn repo archaeology into a 5-minute onboarding" },
];

const OnboardingStep4 = ({ onNext, onBack }) => {
  const { answers, setAnswer } = useOnboarding();

  return (
    <FunnelCard>
      <h2 className="text-2xl font-bold text-white mb-2">
        If you could see exactly where your codebase is unhealthy — what would that be worth?
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        No commitment, just helping us understand your situation.
      </p>

      <div className="space-y-3 mb-8">
        {OPTIONS.map((opt) => (
          <OptionPill
            key={opt.id}
            icon={opt.icon}
            label={opt.label}
            description={opt.description}
            selected={answers.step4 === opt.id}
            onClick={() => setAnswer("step4", opt.id)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!answers.step4}
          className="px-8 py-3 bg-[#bfa174] text-[#0A1828] font-bold rounded-lg hover:bg-[#d4b68a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          See Your Personalized Plan
        </button>
      </div>
    </FunnelCard>
  );
};

export default OnboardingStep4;
