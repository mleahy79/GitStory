import { useOnboarding } from "../../../../context/OnboardingContext";
import FunnelCard from "../../../shared/FunnelCard";
import OptionPill from "../../../shared/OptionPill";

const OPTIONS = [
  { id: "code-review", icon: "\u{1F4CB}", label: "Code review checklists" },
  { id: "dashboard", icon: "\u{1F4CA}", label: "Code quality dashboard (SonarQube, etc.)" },
  { id: "audits", icon: "\u{1F4DD}", label: "Periodic manual audits" },
  { id: "sprints", icon: "\u{1F5D3}\uFE0F", label: "Dedicated tech debt sprint every quarter" },
  { id: "guesswork", icon: "\u{1F62C}", label: "We don't — it's largely guesswork" },
  { id: "tribal", icon: "\u{1F9E0}", label: "It lives in our heads (tribal knowledge)" },
];

const OnboardingStep3 = ({ onNext, onBack }) => {
  const { answers, setAnswer } = useOnboarding();
  const selected = answers.step3 || [];

  const toggleOption = (id) => {
    if (selected.includes(id)) {
      setAnswer("step3", selected.filter((s) => s !== id));
    } else {
      setAnswer("step3", [...selected, id]);
    }
  };

  return (
    <FunnelCard>
      <h2 className="text-2xl font-bold text-white mb-2">
        How does your team currently track repo health?
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        Select all that apply. Most teams are flying blind — let's find out where you are.
      </p>

      <div className="space-y-3 mb-8">
        {OPTIONS.map((opt) => (
          <OptionPill
            key={opt.id}
            icon={opt.icon}
            label={opt.label}
            selected={selected.includes(opt.id)}
            onClick={() => toggleOption(opt.id)}
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
          disabled={selected.length === 0}
          className="px-8 py-3 bg-[#178582] text-white font-semibold rounded-lg hover:bg-[#1a9d9a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </FunnelCard>
  );
};

export default OnboardingStep3;
