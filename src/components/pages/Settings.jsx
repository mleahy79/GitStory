import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  // Facade toggles — not wired to anything
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [trialReminder, setTrialReminder] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-700 last:border-0">
      <div>
        <p className="text-white font-medium text-sm">{label}</p>
        {description && <p className="text-gray-500 text-xs mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          enabled ? "bg-[#178582]" : "bg-gray-600"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0A1828]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-[#bfa174]">Settings</h2>
          {saved && (
            <span className="text-[#178582] text-sm font-semibold animate-pulse">
              Settings saved!
            </span>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-8 mb-6">
          <h3 className="text-lg font-semibold text-[#bfa174] mb-2">Notifications</h3>
          <Toggle
            enabled={emailNotifs}
            onChange={setEmailNotifs}
            label="Email Notifications"
            description="Get notified about scan results and account updates"
          />
          <Toggle
            enabled={trialReminder}
            onChange={setTrialReminder}
            label="Trial Reminders"
            description="Receive reminders before your free trial ends"
          />
          <Toggle
            enabled={weeklyDigest}
            onChange={setWeeklyDigest}
            label="Weekly Health Digest"
            description="A summary of your tracked repositories each week"
          />
        </div>

        {/* Appearance */}
        <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-8 mb-6">
          <h3 className="text-lg font-semibold text-[#bfa174] mb-2">Appearance</h3>
          <Toggle
            enabled={darkMode}
            onChange={setDarkMode}
            label="Dark Mode"
            description="Use dark theme across the application"
          />
        </div>

        {/* Subscription */}
        <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-8 mb-6">
          <h3 className="text-lg font-semibold text-[#bfa174] mb-4">Subscription</h3>
          <div className="flex items-center justify-between bg-[#0A1828] rounded-lg p-4">
            <div>
              <p className="text-white font-semibold">Free Trial</p>
              <p className="text-gray-500 text-sm">14 days remaining — no charge until trial ends</p>
            </div>
            <button className="px-4 py-2 text-sm border border-[#bfa174] text-[#bfa174] rounded-lg hover:bg-[#bfa174] hover:text-[#0A1828] transition-colors font-semibold">
              Upgrade Plan
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#1a2d3d] rounded-lg border border-red-900/50 p-8 mb-6">
          <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium text-sm">Delete Account</p>
              <p className="text-gray-500 text-xs">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 text-sm border border-red-500 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors font-semibold">
              Delete Account
            </button>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-[#178582] text-white font-bold rounded-lg hover:bg-[#1a9d9a] transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </main>
  );
};

export default Settings;
