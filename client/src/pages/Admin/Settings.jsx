import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave } from 'react-icons/fi';
import Layout from '../../components/Layout';
// import { updateSettings } from '../../services/adminService'; // To be created

export default function Settings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [theme, setTheme] = useState('light');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      // This is where you would call your service to save settings
      // await updateSettings({ maintenanceMode, theme });
      console.log('Saving settings:', { maintenanceMode, theme });
      setTimeout(() => { // Mocking API call delay
          setMessage('Settings saved successfully!');
          setSaving(false);
      }, 1000);
    } catch (error) {
      setMessage('Failed to save settings.');
      setSaving(false);
    }
  };

  return (
    <Layout>
      <motion.div
        className="p-6 bg-gray-50 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Site Settings</h2>

        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
          <h3 className="text-xl font-semibold text-gray-700 border-b pb-4">General Configuration</h3>

          {/* Maintenance Mode */}
          <div className="flex items-center justify-between">
            <div>
                <p className="font-medium text-gray-700">Maintenance Mode</p>
                <p className="text-sm text-gray-500">Temporarily disable access to the site for non-admins.</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={() => setMaintenanceMode(!maintenanceMode)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Theme Selection */}
          <div className="flex items-center justify-between">
            <div>
                <p className="font-medium text-gray-700">Site Theme</p>
                <p className="text-sm text-gray-500">Set the default color scheme for the application.</p>
            </div>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
        </div>

        {/* Save Button & Message */}
        <div className="max-w-2xl mx-auto mt-6 flex justify-end items-center">
            {message && <p className={`text-sm mr-4 ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
            <motion.button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-md disabled:bg-indigo-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiSave className="mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </motion.button>
        </div>
      </motion.div>
    </Layout>
  );
}
