const Terms = () => {
  return (
    <main className="min-h-screen bg-[#0A1828]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-[#bfa174] mb-2">Terms of Service</h2>
        <p className="text-gray-500 text-sm mb-8">Last updated: February 2026</p>

        <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-8 space-y-6 text-gray-400 text-sm leading-relaxed">
          <section>
            <h3 className="text-white font-semibold text-lg mb-2">1. Acceptance of Terms</h3>
            <p>
              By accessing or using SustainRx ("the Service"), you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h3 className="text-white font-semibold text-lg mb-2">2. Description of Service</h3>
            <p>
              SustainRx provides code health analytics and repository diagnostics through the
              GitHub API. The Service analyzes publicly available repository data and data
              accessible through your authenticated GitHub account.
            </p>
          </section>

          <section>
            <h3 className="text-white font-semibold text-lg mb-2">3. User Accounts</h3>
            <p>
              You may sign in using your GitHub account via OAuth. You are responsible for
              maintaining the security of your account credentials. SustainRx does not store
              your GitHub password.
            </p>
          </section>

          <section>
            <h3 className="text-white font-semibold text-lg mb-2">4. Data & Privacy</h3>
            <p>
              SustainRx does not clone, store, or cache your source code. All repository
              analysis is performed in real time through the GitHub REST API. We only retain
              your basic GitHub profile information (username, email, avatar) for account
              identification purposes.
            </p>
          </section>

          <section>
            <h3 className="text-white font-semibold text-lg mb-2">5. Free Trial & Billing</h3>
            <p>
              Paid plans include a 14-day free trial. You will not be charged during the
              trial period. If you do not upgrade or cancel before the trial ends, your
              account will revert to the Free plan. No automatic charges will be applied.
            </p>
          </section>

          <section>
            <h3 className="text-white font-semibold text-lg mb-2">6. Limitation of Liability</h3>
            <p>
              The Service is provided "as is" without warranties of any kind. SustainRx
              shall not be liable for any damages arising from your use of the Service,
              including but not limited to loss of data or business interruption.
            </p>
          </section>

          <section>
            <h3 className="text-white font-semibold text-lg mb-2">7. Changes to Terms</h3>
            <p>
              We reserve the right to update these terms at any time. Continued use of the
              Service after changes are posted constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h3 className="text-white font-semibold text-lg mb-2">8. Contact</h3>
            <p>
              For questions about these Terms, please reach out through our GitHub repository
              or contact the development team directly.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Terms;
