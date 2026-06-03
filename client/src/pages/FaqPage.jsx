import React, { useState } from 'react';
import { motion } from 'framer-motion';

const faqs = [
  {
    question: 'How do I register as a patient or doctor?',
    answer: 'Click on “Register” from the top navigation. Choose your role and complete the signup form.',
  },
  {
    question: 'Can I reschedule or cancel an appointment?',
    answer: 'Yes. Navigate to your dashboard and go to “My Appointments.” You’ll see options to reschedule or cancel.',
  },
  {
    question: 'Are online consultations secure?',
    answer: 'Absolutely. Docify uses encrypted channels and verifies all practitioners.',
  },
];

export default function FaqPage() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f9f9] via-white to-[#dad4ef] px-6 py-20 font-sans">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-indigo-800 mb-4">Frequently Asked Questions</h1>
        <p className="text-slate-600 text-lg">Here are answers to our most common questions.</p>
      </div>
      <div className="max-w-3xl mx-auto space-y-6">
        {faqs.map((item, i) => (
          <div
            key={i}
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
            className="cursor-pointer bg-white border border-indigo-200 rounded-lg p-4 shadow-md"
          >
            <h3 className="text-indigo-700 font-semibold text-lg">{item.question}</h3>
            {activeIndex === i && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-700 mt-2"
              >
                {item.answer}
              </motion.p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}