import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="min-h-screen bg-[#0A1828] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-[#178582] text-8xl font-bold mb-2">404</p>
        <h2 className="text-3xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          This page doesn't exist or may have been moved.
          Let's get you back to a healthy state.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-[#178582] text-white font-semibold rounded-lg hover:bg-[#1a9d9a] transition-colors"
          >
            Back to Home
          </Link>
          <Link
            to="/analyze"
            className="px-6 py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:border-white hover:text-white transition-colors"
          >
            Run a Checkup
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
