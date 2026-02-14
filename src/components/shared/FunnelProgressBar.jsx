const FunnelProgressBar = ({ currentStep, totalSteps, label }) => (
  <div className="mb-8">
    <div className="flex justify-between text-sm text-gray-400 mb-2">
      <span>{label || `Step ${currentStep} of ${totalSteps}`}</span>
      <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
    </div>
    <div className="flex gap-1">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
            i < currentStep ? "bg-[#178582]" : "bg-gray-700"
          }`}
        />
      ))}
    </div>
  </div>
);

export default FunnelProgressBar;
