export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Settings</h1>
        
        <div className="glass-morphism rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <p className="text-gray-300">
            Settings page is coming soon. This will include options for:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-300">
            <li>Language preferences</li>
            <li>Content filtering</li>
            <li>Display settings</li>
            <li>Notification preferences</li>
          </ul>
        </div>
        
        <div className="glass-morphism rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-gray-300">
            TVSHIZ - Your ultimate streaming companion
          </p>
        </div>
      </div>
    </div>
  );
}