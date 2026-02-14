import { useNavigate } from "react-router-dom";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For exploring public repos",
    features: [
      "3 repo scans per month",
      "Basic commit history",
      "Language breakdown",
      "Public repos only",
    ],
    cta: "Get Started",
    ctaStyle: "border border-gray-600 text-gray-300 hover:border-white hover:text-white",
    route: "/",
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    billed: "Billed $228/year",
    badge: "Most Popular",
    description: "For developers and small teams",
    features: [
      "Unlimited repo scans",
      "AI-powered code diagnostic",
      "Hotspot detection",
      "Shareable PDF reports",
      "Private repo access",
      "Historical trend reports",
    ],
    cta: "Start Free Trial",
    ctaStyle: "bg-[#178582] text-white hover:bg-[#1a9d9a]",
    route: "/onboarding/1",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/month",
    billed: "Billed $588/year",
    description: "For engineering teams",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Slack integration alerts",
      "Scheduled weekly scans",
      "Priority support",
      "Custom report branding",
    ],
    cta: "Contact Us",
    ctaStyle: "border border-[#bfa174] text-[#bfa174] hover:bg-[#bfa174] hover:text-[#0A1828]",
    route: "/onboarding/1",
  },
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#0A1828]">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Simple, transparent <span className="text-[#bfa174]">pricing</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Start with a 14-day free trial on any paid plan. No credit card required.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-[#1a2d3d] rounded-xl border p-8 flex flex-col ${
                plan.highlighted
                  ? "border-[#178582] shadow-lg shadow-[#178582]/10"
                  : "border-gray-700"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold uppercase bg-[#178582] text-white rounded-full">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400 text-sm">{plan.period}</span>
                {plan.billed && (
                  <p className="text-gray-600 text-xs mt-1">{plan.billed}</p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-[#178582] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate(plan.route)}
                className={`w-full py-3 font-bold rounded-lg transition-colors ${plan.ctaStyle}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6">
              <h4 className="text-white font-semibold mb-2">What happens after the free trial?</h4>
              <p className="text-gray-400 text-sm">
                We'll send you a reminder 3 days before and again the day before your trial ends.
                If you don't upgrade, your account reverts to the Free plan — no surprise charges.
              </p>
            </div>
            <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6">
              <h4 className="text-white font-semibold mb-2">Can I switch plans later?</h4>
              <p className="text-gray-400 text-sm">
                Absolutely. Upgrade, downgrade, or cancel at any time from your Settings page.
                Changes take effect at the start of your next billing cycle.
              </p>
            </div>
            <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6">
              <h4 className="text-white font-semibold mb-2">Do I need a credit card to start?</h4>
              <p className="text-gray-400 text-sm">
                No. Sign up with GitHub and start your 14-day trial immediately.
                We only ask for payment details if you choose to continue after the trial.
              </p>
            </div>
            <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-6">
              <h4 className="text-white font-semibold mb-2">Is my code ever stored on your servers?</h4>
              <p className="text-gray-400 text-sm">
                No. SustainRx reads your repository data through the GitHub API in real time.
                We never clone, store, or cache your source code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Pricing;
