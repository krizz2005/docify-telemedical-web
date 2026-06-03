import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiFileText, FiVideo, FiCheckCircle } from 'react-icons/fi';

const demoScreens = {
  dashboard: { title: "Your Dashboard", icon: null, content: "Select an action from the sidebar to see how it works." },
  appointments: { title: "Book Appointment", icon: <FiCalendar/>, content: "Appointment confirmed with Dr. Emily Carter for tomorrow at 10:30 AM!" },
  reports: { title: "Upload Report", icon: <FiFileText/>, content: "Your blood test report has been successfully uploaded and stored securely." },
  consult: { title: "Start Consultation", icon: <FiVideo/>, content: "Your virtual consultation room is ready. A link has been sent to your email." },
};

export default function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    const screen = demoScreens[activeTab];
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center h-full text-center p-4"
        >
          {activeTab !== 'dashboard' && (
             <motion.div initial={{scale: 0}} animate={{scale: 1}}>
                <FiCheckCircle className="text-4xl text-green-500 mb-4" />
             </motion.div>
          )}
          <h4 className="text-xl font-bold text-slate-800 mb-2">{screen.title}</h4>
          <p className="text-slate-600 max-w-sm">{screen.content}</p>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-indigo-100 max-w-5xl mx-auto">
      <h2 className="text-3xl font-extrabold text-indigo-900 text-center mb-8">
        Experience Docify in Action
      </h2>
      <div className="flex flex-col md:flex-row gap-6 bg-slate-50/50 rounded-xl p-4 border">
        <aside className="w-full md:w-1/3 bg-white rounded-lg p-4 space-y-2 border shadow-sm">
          {Object.keys(demoScreens).slice(1).map((key) => {
            const screen = demoScreens[key];
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center space-x-3 p-3 rounded-md text-left font-semibold transition-all duration-200 ${
                  activeTab === key 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'hover:bg-indigo-100 text-slate-700'
                }`}
              >
                {screen.icon}
                <span>{screen.title}</span>
              </button>
            )
          })}
        </aside>
        <main className="w-full md:w-2/3 bg-white rounded-lg p-8 border min-h-[200px] flex items-center justify-center shadow-inner bg-dots-pattern">
          {renderContent()}
        </main>
      </div>
       <p className="text-center text-xs text-slate-500 mt-4">This is a simplified demo. Full functionality is available after login.</p>
    </div>
  );
}
