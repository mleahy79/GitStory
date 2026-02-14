import { useOnboarding } from "../../../../context/OnboardingContext";
import FunnelCard from "../../../shared/FunnelCard";
import OptionPill from "../../../shared/OptionPill";

const OPTIONS = [
  { id: "burnout", icon: "\u{1F630}", label: "Developers are frustrated and burning out", description: "Morale is low and nobody wants to touch legacy code" },
  { id: "firefighting", icon: "\u23F1\uFE0F", label: "We spend more time firefighting than building", description: "Reactive work dominates planned feature work" },
  { id: "tension", icon: "\u{1F4AC}", label: "Engineering and product are constantly at odds", description: "Technical concerns get dismissed as 'just refactoring'" },
  { id: "turnover", icon: "\u{1F504}", label: "High turnover means constant knowledge loss", description: "Institutional knowledge walks out the door regularly" },
  { id: "no-visibility", icon: "\u{1F937}", label: "We don't have full visibility yet", description: "We suspect problems exist but can't quantify them" },
];

const OnboardingStep2 = ({ onNext, onBack }) => {
  const { answers, setAnswer } = useOnboarding();

  return (
    <FunnelCard>
      <h2 className="text-2xl font-bold text-white mb-2">
        How is this affecting your engineering team?
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        Be honest — this helps us show you the right data.
      </p>

      <div className="space-y-3 mb-8">
        {OPTIONS.map((opt) => (
          <OptionPill
            key={opt.id}
            icon={opt.icon}
            label={opt.label}
            description={opt.description}
            selected={answers.step2 === opt.id}
            onClick={() => setAnswer("step2", opt.id)}
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
          disabled={!answers.step2}
          className="px-8 py-3 bg-[#178582] text-white font-semibold rounded-lg hover:bg-[#1a9d9a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </FunnelCard>
  );
};

export default OnboardingStep2;
