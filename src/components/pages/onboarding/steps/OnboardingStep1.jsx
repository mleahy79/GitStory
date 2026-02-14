import { useOnboarding } from "../../../../context/OnboardingContext";
import FunnelCard from "../../../shared/FunnelCard";
import OptionPill from "../../../shared/OptionPill";

const OPTIONS = [
  { id: "tech-debt", icon: "\u{1F525}", label: "Uncontrolled tech debt", description: "Issues pile up faster than they get resolved" },
  { id: "old-code", icon: "\u{1F575}\uFE0F", label: "Hard to understand old code", description: "Undocumented decisions, mystery files, no context" },
  { id: "regressions", icon: "\u{1F41B}", label: "Regressions keep slipping through", description: "Changing one thing breaks something else every time" },
  { id: "onboarding", icon: "\u{1F9E9}", label: "Onboarding new devs takes too long", description: "No one can ramp up without tribal knowledge" },
  { id: "velocity", icon: "\u{1F4C9}", label: "Delivery is slowing down", description: "Velocity has dropped and we don't know exactly why" },
];

const OnboardingStep1 = ({ onNext, onBack }) => {
  const { answers, setAnswer } = useOnboarding();

  return (
    <FunnelCard>
      <h2 className="text-2xl font-bold text-white mb-2">
        What's the biggest challenge with your codebase right now?
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        We'll personalize your SustainRx experience based on your answer.
      </p>

      <div className="space-y-3 mb-8">
        {OPTIONS.map((opt) => (
          <OptionPill
            key={opt.id}
            icon={opt.icon}
            label={opt.label}
            description={opt.description}
            selected={answers.step1 === opt.id}
            onClick={() => setAnswer("step1", opt.id)}
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
          disabled={!answers.step1}
          className="px-8 py-3 bg-[#178582] text-white font-semibold rounded-lg hover:bg-[#1a9d9a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </FunnelCard>
  );
};

export default OnboardingStep1;
