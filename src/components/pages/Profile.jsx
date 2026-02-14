import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-[#0A1828]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-[#bfa174] mb-8">Profile</h2>

        {/* Avatar & Name */}
        <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-8 mb-6">
          <div className="flex items-center gap-6">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-20 h-20 rounded-full border-2 border-[#178582]"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#178582]/20 flex items-center justify-center text-3xl text-[#178582] font-bold">
                {(user?.displayName || "U")[0].toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-2xl font-bold text-white">
                {user?.displayName || "User"}
              </h3>
              <p className="text-gray-400">{user?.email || "No email on file"}</p>
              <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold bg-[#178582]/20 text-[#178582] border border-[#178582]/40 rounded-full">
                Free Trial
              </span>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-8 mb-6">
          <h3 className="text-lg font-semibold text-[#bfa174] mb-4">Account Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <span className="text-gray-400">Display Name</span>
              <span className="text-white font-medium">{user?.displayName || "—"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <span className="text-gray-400">Email</span>
              <span className="text-white font-medium">{user?.email || "—"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <span className="text-gray-400">Provider</span>
              <span className="text-white font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <span className="text-gray-400">Member Since</span>
              <span className="text-white font-medium">
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Plan</span>
              <span className="text-[#178582] font-semibold">Free Trial — 14 days remaining</span>
            </div>
          </div>
        </div>

        {/* Usage Stats (facade) */}
        <div className="bg-[#1a2d3d] rounded-lg border border-gray-700 p-8">
          <h3 className="text-lg font-semibold text-[#bfa174] mb-4">Usage This Month</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#0A1828] rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#178582]">3</p>
              <p className="text-xs text-gray-500 mt-1">Repo Scans</p>
            </div>
            <div className="bg-[#0A1828] rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#178582]">12</p>
              <p className="text-xs text-gray-500 mt-1">AI Queries</p>
            </div>
            <div className="bg-[#0A1828] rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#178582]">1</p>
              <p className="text-xs text-gray-500 mt-1">Reports</p>
            </div>
            <div className="bg-[#0A1828] rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#178582]">2</p>
              <p className="text-xs text-gray-500 mt-1">Hotspot Scans</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
