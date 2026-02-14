const Privacy = () => {
  return (
    <main className="min-h-screen bg-[#0A1828]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-[#bfa174] mb-2">Privacy Policy</h2>
        <p className="text-gray-500 text-sm mb-8">Last updated: February 2026</p>

        <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-8 space-y-6 text-gray-400 text-sm leading-relaxed">
          <section>
            <h3 className="text-white font-semibold text-lg mb-2">Information We Collect</h3>
            <p>
              When you sign in with GitHub, we receive your public profile information
              including your username, email address, and avatar URL. This is provided
              by GitHub's OAuth flow and is used solely for account identification within
              SustainRx.
            </p>
          </section>

          <section>
            <h3 className="text-white font-semibold text-lg mb-2">Repository Data</h3>
            <p>
              SustainRx accesses repository data (commits, issues, contributors, file trees)
              through the GitHub REST API using your OAuth token. This data is processed in
              your browser in real time and is never transmitted to or stored on our servers.
              Your source code is never cloned, copied, or cached.
            </p>
          </section>

          <section>
            <h3 className="text-white font-semibold text-lg mb-2">AI-Powered Features</h3>
            <p>
              The Code Diagnostic feature sends repository metadata (commit messages, file
              names, and selected file contents) to our AI service for analysis. This data
              is processed in real time and is not stored after the session ends.
            </p>
          </section>

          <section>
            <h3 className="text-white font-semibold text-lg mb-2">Local Storage</h3>
            <p>
              We use your browser's local storage to persist your GitHub OAuth token and
              your most recently viewed repository URL. This data stays on your device
              and is never transmitted to third parties.
            </p>
          </section>

          <section>
            <h3 className="text-white font-semibold text-lg mb-2">Third-Party Services</h3>
            <p>
              SustainRx uses the following third-party services:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>GitHub API — for repository data access and OAuth authentication</li>
              <li>Firebase — for authentication and cloud functions</li>
              <li>Anthropic (Claude) — for AI-powered code analysis</li>
            </ul>
          </section>

          <section>
            <h3 className="text-white font-semibold text-lg mb-2">Data Retention</h3>
            <p>
              We retain your account profile information only while your account is active.
              You can delete your account at any time from the Settings page, which will
              remove all associated data.
            </p>
          </section>

          <section>
            <h3 className="text-white font-semibold text-lg mb-2">Contact</h3>
            <p>
              For privacy-related questions or data deletion requests, please contact us
              through our GitHub repository.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Privacy;
