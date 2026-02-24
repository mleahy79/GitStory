import { useState } from "react";
import { deleteUser } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../services/firebase";

const SETTINGS_KEY = "sustainrx_settings";

const loadSettings = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { emailNotifs: true, trialReminder: true, weeklyDigest: false, darkMode: true };
};

const Settings = () => {
  const { logout } = useAuth();

  const [saved, setSaved] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(() => loadSettings().emailNotifs);
  const [trialReminder, setTrialReminder] = useState(() => loadSettings().trialReminder);
  const [weeklyDigest, setWeeklyDigest] = useState(() => loadSettings().weeklyDigest);
  const [darkMode, setDarkMode] = useState(() => loadSettings().darkMode);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ emailNotifs, trialReminder, weeklyDigest, darkMode }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteUser(auth.currentUser);
      await logout();
    } catch (err) {
      if (err.code === "auth/requires-recent-login") {
        setDeleteError("For security, please sign out and sign back in before deleting your account.");
      } else {
        setDeleteError("Failed to delete account. Please try again.");
      }
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
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
          {deleteError && (
            <p className="text-red-400 text-sm mb-4 bg-red-900/20 border border-red-900/50 rounded-lg px-4 py-3">
              {deleteError}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium text-sm">Delete Account</p>
              <p className="text-gray-500 text-xs">Permanently delete your account and all data</p>
            </div>
            <button
              onClick={() => { setDeleteError(null); setShowDeleteConfirm(true); }}
              className="px-4 py-2 text-sm border border-red-500 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors font-semibold"
            >
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1a2d3d] border border-red-900/50 rounded-xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-red-400 mb-2">Delete Account</h3>
            <p className="text-gray-300 mb-2">
              This will permanently delete your account and all associated data.
            </p>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-5 py-2 text-sm border border-gray-600 text-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-5 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors font-semibold disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete My Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Settings;
