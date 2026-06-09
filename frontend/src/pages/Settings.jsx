import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setDensity } from '../store/uiSlice';
import { Shield, Key, Eye, EyeOff, Clipboard, Check, Sun, Moon, LayoutGrid } from 'lucide-react';
import { showNotification } from '../store/uiSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const { darkMode, density } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  
  const [showToken, setShowToken] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [mockWebhook, setMockWebhook] = React.useState(true);

  const token = localStorage.getItem('token') || 'jwt-authentication-session-placeholder-token';

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    dispatch(showNotification({ message: 'Token copied to clipboard', type: 'success' }));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="border-b border-[#30363D] pb-5">
        <h1 className="font-heading text-3xl font-bold text-[#F0F6FC]">Settings</h1>
        <p className="text-[#8B949E] text-sm">Configure system themes, personal keys, and database display ratios.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Navigation Sidebar (Settings submenus placeholder) */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#8B949E] px-3 mb-2">User Settings</div>
          <button className="w-full text-left px-3 py-2 bg-[#21262D] text-[#F0F6FC] border border-[#30363D] text-sm font-semibold rounded-lg">
            System Preferences
          </button>
          <button className="w-full text-left px-3 py-2 text-[#8B949E] hover:bg-[#21262D]/40 hover:text-[#F0F6FC] text-sm font-semibold rounded-lg transition-colors">
            Developer API Keys
          </button>
          <button className="w-full text-left px-3 py-2 text-[#8B949E] hover:bg-[#21262D]/40 hover:text-[#F0F6FC] text-sm font-semibold rounded-lg transition-colors">
            Security & Authentication
          </button>
        </div>

        {/* Right Side: Main Config Pane */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Preferences Section */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-6">
            <h3 className="text-base font-semibold text-[#F0F6FC] border-b border-[#30363D] pb-3 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-400" /> Interface Preferences
            </h3>

            {/* Theme Config */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-sm font-semibold text-[#F0F6FC] block">Visual Theme</span>
                <span className="text-xs text-[#8B949E]">Switch between GitHub Dark theme and Light theme environments.</span>
              </div>
              <button
                onClick={() => dispatch(toggleTheme())}
                className="px-4 py-2 bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] rounded-xl text-xs font-bold text-[#c9d1d9] flex items-center gap-2 transition-all cursor-pointer"
              >
                {darkMode ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Layout Density */}
            <div className="flex items-center justify-between border-t border-[#30363D]/40 pt-4">
              <div className="space-y-1">
                <span className="text-sm font-semibold text-[#F0F6FC] block">Explorer Table Density</span>
                <span className="text-xs text-[#8B949E]">Switch between compact and comfortable padding rows inside the datasets table.</span>
              </div>
              <select
                value={density}
                onChange={(e) => dispatch(setDensity(e.target.value))}
                className="px-3 py-2 bg-[#21262D] border border-[#30363D] rounded-xl text-xs text-[#c9d1d9] outline-none cursor-pointer focus:border-[#58A6FF]"
              >
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </div>
          </div>

          {/* Developer Tokens / Keys */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-6">
            <h3 className="text-base font-semibold text-[#F0F6FC] border-b border-[#30363D] pb-3 flex items-center gap-2">
              <Key className="w-5 h-5 text-[#58A6FF]" /> Developer Access Tokens
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-sm font-semibold text-[#F0F6FC] block">JSON Web Token (JWT)</span>
                <span className="text-xs text-[#8B949E] block mb-2">This token authorizes external scripts or IDE plugins to query backend CRUD endpoints.</span>
                
                <div className="relative flex items-center">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={token}
                    readOnly
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-2.5 text-xs font-mono text-[#F0F6FC] outline-none pr-20"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    <button
                      onClick={() => setShowToken(!showToken)}
                      className="p-1.5 text-[#8B949E] hover:text-[#F0F6FC] transition-colors cursor-pointer"
                      title={showToken ? 'Hide token' : 'Show token'}
                    >
                      {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={handleCopyToken}
                      className="p-1.5 text-[#8B949E] hover:text-[#F0F6FC] transition-colors cursor-pointer"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-4 h-4 text-[#3FB950]" /> : <Clipboard className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Webhook toggle */}
            <div className="flex items-center justify-between border-t border-[#30363D]/40 pt-4">
              <div className="space-y-1">
                <span className="text-sm font-semibold text-[#F0F6FC] block">Sync Dispatcher Webhook</span>
                <span className="text-xs text-[#8B949E]">Dispatch notifications to webhook endpoints when import datasets complete.</span>
              </div>
              <button
                onClick={() => setMockWebhook(!mockWebhook)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                  mockWebhook ? 'bg-[#2ea043]' : 'bg-[#30363D]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    mockWebhook ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* RBAC role view */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-[#F0F6FC] border-b border-[#30363D] pb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#3FB950]" /> Administrative Permissions
            </h3>

            <div className="text-xs text-[#8B949E] space-y-2">
              <p>Your current login profile is assigned the role of: <strong className="text-[#3FB950] capitalize">{user?.role || 'User'}</strong></p>
              {user?.role === 'admin' ? (
                <p className="text-[#3FB950]">✓ You hold full administrative permissions. You can perform hard-deletes, restore soft-deleted items, edit user permissions, and clear analytics caches.</p>
              ) : (
                <p>⚠️ Standard Account: Administrative tasks (such as database restorations or hard-deletes) are restricted. Contact a team lead to request higher privileges.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Settings;
