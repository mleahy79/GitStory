const FunnelCard = ({ children, className = "" }) => (
  <div className={`bg-[#1a2d3d] rounded-xl border border-gray-700 p-8 shadow-xl ${className}`}>
    {children}
  </div>
);

export default FunnelCard;
