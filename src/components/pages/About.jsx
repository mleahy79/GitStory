import React from "react";
import logoFrame from "../../assets/logo-frame.png";

const About = () => {
  return (
    <div className="relative min-h-screen bg-[#0A1828]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex flex-col items-center mb-12">
          <img
            src={logoFrame}
            className="opacity-80 w-40 h-40 mb-6"
            alt="SustainRx Logo"
          />
          <h1 className="text-4xl font-bold text-center">
            About <span className="text-[#178582]">Sustain</span>
            <span className="text-[#bfa174]">Rx</span>
          </h1>
          <p className="text-gray-400 text-center text-lg mt-4 max-w-2xl">
            A code health clinic dedicated to diagnosing, treating, and
            preventing chronic issues in your codebase.
          </p>
        </div>

        <section aria-labelledby="mission-heading" className="bg-neutral-800/20 backdrop-blur-lg p-8 rounded-lg border border-neutral-600 shadow-lg shadow-black/50 mb-8">
          <h2 id="mission-heading" className="text-2xl font-bold text-[#bfa174] mb-4">
            Our Mission
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Every codebase tells a story. Over time, technical debt accumulates
            like untreated symptoms — small issues compound into chronic
            conditions that slow teams down and make changes risky. SustainRx
            was built to give developers a clear diagnosis of their
            repository's health and a practical treatment plan to keep their
            code sustainable for the long term.
          </p>
        </section>

        <div className="bg-neutral-800/20 backdrop-blur-lg p-8 rounded-lg border border-neutral-600 shadow-lg shadow-black/50 mb-8">
          <h2 className="text-2xl font-bold text-[#bfa174] mb-6">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3 text-[#178582] font-bold">1</div>
              <h3 className="text-lg font-bold text-gray-300 mb-2">
                Check In
              </h3>
              <p className="text-gray-400 text-sm">
                Sign in with GitHub and submit a repository URL for examination.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3 text-[#178582] font-bold">2</div>
              <h3 className="text-lg font-bold text-gray-300 mb-2">
                Diagnosis
              </h3>
              <p className="text-gray-400 text-sm">
                We scan your commit history, identify hotspots, and assess
                overall code health.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3 text-[#178582] font-bold">3</div>
              <h3 className="text-lg font-bold text-gray-300 mb-2">
                Treatment
              </h3>
              <p className="text-gray-400 text-sm">
                Receive a prioritized prescription of improvements to keep your
                codebase healthy.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-800/20 backdrop-blur-lg p-8 rounded-lg border border-neutral-600 shadow-lg shadow-black/50 mb-8">
          <h2 className="text-2xl font-bold text-[#bfa174] mb-4">
            What We Look For
          </h2>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start gap-3">
              <span className="text-[#178582] font-bold mt-0.5" aria-hidden="true">+</span>
              <span>
                <strong className="text-gray-300">Commit Health</strong> —
                Frequency, size, and consistency of changes over time.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#178582] font-bold mt-0.5" aria-hidden="true">+</span>
              <span>
                <strong className="text-gray-300">Chronic Hotspots</strong> —
                Files that are changed repeatedly, signaling deeper structural
                issues.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#178582] font-bold mt-0.5" aria-hidden="true">+</span>
              <span>
                <strong className="text-gray-300">Code Debt Indicators</strong>{" "}
                — Patterns that suggest accumulating maintenance burden.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#178582] font-bold mt-0.5" aria-hidden="true">+</span>
              <span>
                <strong className="text-gray-300">Contributor Patterns</strong>{" "}
                — How work is distributed across the team and over time.
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-neutral-800/20 backdrop-blur-lg p-8 rounded-lg border border-neutral-600 shadow-lg shadow-black/50">
          <h2 className="text-2xl font-bold text-[#bfa174] mb-4">
            Built With
          </h2>
          <div className="flex flex-wrap gap-3">
            {["React", "Create React App", "Tailwind CSS", "Firebase", "GitHub API", "Claude AI (Diagnostics)"].map(
              (tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 border border-gray-400 text-gray-400 rounded-lg text-sm font-semibold"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
