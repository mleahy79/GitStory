import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [repoUrl, setRepoUrl] = useState(
    () => localStorage.getItem("sustainrx_lastRepo") || ""
  );
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      navigate(`/analyze?repo=${encodeURIComponent(repoUrl)}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A1828]">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#178582] mb-6 mt-1">
            Your Prescription for <span className="text-[#bfa174]">Sustainable Code</span>
          </h1>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#178582] mb-4">
            Check Your Repository's Vital Signs
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            A complete health checkup for your codebase. Detect symptoms early,
            diagnose problem areas, and get a treatment plan.
          </p>
        </div>

        {/* Repo input */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="flex-1 px-4 py-3 bg-[#1a2d3d] border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-[#178582] focus:border-transparent outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#178582] text-white font-semibold rounded-lg hover:bg-[#1a9d9a] transition-colors"
            >
              Start Checkup
            </button>
          </div>
        </form>


        {/* Feature cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#1a2d3d] p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-[#bfa174] mb-2">Medical History</h3>
            <p className="text-gray-400">Review your commit timeline with clear, readable case notes</p>
          </div>
          <div className="bg-[#1a2d3d] p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-[#bfa174] mb-2">Hotspot Scan</h3>
            <p className="text-gray-400">Identify inflamed files that show signs of chronic issues</p>
          </div>
          <div className="bg-[#1a2d3d] p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-[#bfa174] mb-2">Treatment Plan</h3>
            <p className="text-gray-400">Prioritized prescriptions to reduce tech debt symptoms</p>
          </div>
        </div>

        {/* Free trial CTA */}
        <div className="text-center mt-20">
          <p className="text-gray-500 text-sm mb-2">Want the full experience?</p>
          <button
            onClick={() => navigate("/onboarding/1")}
            className="px-8 py-3 bg-[#bfa174] text-[#0A1828] font-bold rounded-lg hover:bg-[#d4b68a] transition-colors text-lg"
          >
            Start Your Free Trial
          </button>
          <p className="text-gray-600 text-xs mt-2">14 days free. No credit card required.</p>
        </div>
        {/* AI / Vibe coding section */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Built with AI? <span className="text-[#bfa174]">Built to last?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              AI tools can ship your app in hours. But when something breaks at 2am,
              can you find it? Understand it? Fix it without breaking three other things?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6">
              <div className="text-2xl mb-3">&#x26A1;</div>
              <h3 className="text-lg font-semibold text-[#178582] mb-2">
                Vibe Coding & AI Builders
              </h3>
              <p className="text-gray-400 text-sm">
                Cursor, Bolt, v0, Lovable, Replit Agent — these tools are incredible at
                getting a project off the ground. But the code they generate can grow
                fast and get complex even faster. SustainRx helps you actually
                understand what's in your repo before it becomes a black box.
              </p>
            </div>

            <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6">
              <div className="text-2xl mb-3">&#x1F469;&#x200D;&#x1F4BB;</div>
              <h3 className="text-lg font-semibold text-[#178582] mb-2">
                Solo Devs & Small Teams
              </h3>
              <p className="text-gray-400 text-sm">
                You don't have a dedicated DevOps team or a staff engineer reviewing
                architecture. SustainRx gives you the visibility that big teams take
                for granted — commit patterns, hotspot files, and codebase health
                at a glance.
              </p>
            </div>

            <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6">
              <div className="text-2xl mb-3">&#x1F680;</div>
              <h3 className="text-lg font-semibold text-[#178582] mb-2">
                No-Code to Real Code
              </h3>
              <p className="text-gray-400 text-sm">
                Started with no-code and now you've got a GitHub repo full of
                exported code you didn't write? You're not alone. SustainRx maps
                out what's there, what's changing the most, and where the risks are
                hiding.
              </p>
            </div>

            <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6">
              <div className="text-2xl mb-3">&#x1F91D;</div>
              <h3 className="text-lg font-semibold text-[#178582] mb-2">
                Human + AI Collaboration
              </h3>
              <p className="text-gray-400 text-sm">
                The best apps are built by humans who think and AI that executes.
                But without visibility into what the AI is producing, you lose
                control of your own project. SustainRx keeps you in the driver's seat.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-[#178582]/20 via-[#1a2d3d] to-[#bfa174]/20 rounded-xl border border-gray-700 p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Shipping fast is easy. Staying healthy is the hard part.
            </h2>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Whether you wrote every line by hand or your AI pair programmer did the
              heavy lifting — your codebase deserves a checkup.
            </p>
            <button
              onClick={() => navigate("/onboarding/1")}
              className="px-10 py-4 bg-[#bfa174] text-[#0A1828] font-bold rounded-lg hover:bg-[#d4b68a] transition-colors text-lg"
            >
              Get Started Free
            </button>
            <p className="text-gray-600 text-xs mt-3">No credit card. No commitment. Just clarity.</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
