const OptionPill = ({ label, description, selected, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
      selected
        ? "border-[#178582] bg-[#178582]/10 text-white"
        : "border-gray-600 bg-[#0A1828] text-gray-400 hover:border-gray-400 hover:text-gray-300"
    }`}
  >
    <div className="flex items-center gap-3">
      {icon && <span className="text-xl">{icon}</span>}
      <div className="flex-1">
        <p className="font-semibold text-sm">{label}</p>
        {description && <p className="text-xs mt-0.5 opacity-75">{description}</p>}
      </div>
      {selected && (
        <div className="ml-auto w-5 h-5 rounded-full bg-[#178582] flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  </button>
);

export default OptionPill;
