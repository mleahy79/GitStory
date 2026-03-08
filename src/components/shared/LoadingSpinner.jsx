const LoadingSpinner = ({ message = "Loading..." }) => (
  <main className="min-h-screen bg-[#0A1828] flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#178582] mx-auto mb-4" />
      <p className="text-gray-400">{message}</p>
    </div>
  </main>
);

export default LoadingSpinner;
