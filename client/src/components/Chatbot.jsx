import React, { useState } from 'react';

const conversationTree = {
  root: {
    response: 'Welcome to Docify Advanced Support! How can I assist you?\n\n1. Appointments 📅\n2. My Health Records 📂\n3. Billing & Payments 💳\n4. Find a Doctor or Service 🔍',
    options: { '1': 'appointmentMenu', '2': 'recordsMenu', '3': 'billingMenu', '4': 'findMenu' },
  },
  appointmentMenu: {
    response: 'Appointment Services:\n\n1. Book a New Appointment\n2. Reschedule an Appointment\n3. Cancel an Appointment',
    options: { '1': 'bookAppointmentDept', '2': 'rescheduleInfo', '3': 'cancelInfo' },
  },
  recordsMenu: {
    response: 'Health Records:\n\n1. View Lab Reports\n2. View Prescriptions\n3. Upload a Document',
    options: { '1': 'viewReportsInfo', '2': 'viewPrescriptionsInfo', '3': 'uploadInfo' },
  },
  billingMenu: {
    response: 'Billing & Payments:\n\n1. View Outstanding Bills\n2. Pay a Bill\n3. See Payment History',
    options: { '1': 'viewBillsInfo', '2': 'payBillInfo', '3': 'paymentHistoryInfo' },
  },
  findMenu: {
    response: 'Find a Doctor or Service:\n\n1. Find Doctor by Department\n2. Find Doctor by Name',
    options: { '1': 'findDoctorByDept', '2': 'findDoctorByNameInfo' },
  },
  bookAppointmentDept: {
    response: 'Please select a department:\n\n1. Cardiology\n2. Orthopedics\n3. Dermatology',
    options: { '1': 'bookingConfirmation', '2': 'bookingConfirmation', '3': 'bookingConfirmation' },
  },
  bookingConfirmation: { response: 'To finalize your appointment, please log in and confirm the date and time from the "Bookings" section.' },
  rescheduleInfo: { response: 'To reschedule, please go to "My Appointments" in your dashboard, select the appointment, and click "Reschedule".' },
  cancelInfo: { response: 'To cancel, please find the appointment in "My Appointments" and click "Cancel". Note the cancellation policy.' },
  viewReportsInfo: { response: 'All your lab reports are available under the "Health Records" -> "Lab Reports" section after you log in.' },
  viewPrescriptionsInfo: { response: 'Past and current prescriptions can be viewed in the "Health Records" -> "Prescriptions" section of your dashboard.' },
  uploadInfo: { response: 'You can upload documents like external reports via the "Upload Document" feature in your Health Records.' },
  viewBillsInfo: { response: 'Outstanding bills are listed in the "Billing" section of your dashboard.' },
  payBillInfo: { response: 'To pay a bill, navigate to the "Billing" section and select "Pay Now".' },
  paymentHistoryInfo: { response: 'A complete history of all your past payments is available under "Billing" -> "Payment History".' },
  findDoctorByNameInfo: { response: 'To find a doctor by name, please use the search bar at the top of the "Find a Doctor" page on our main website.' },
};

const getResponse = (path) => conversationTree[path]?.response || 'An error occurred.';

export default function Chatbot() {
  const [pathHistory, setPathHistory] = useState(['root']);
  const [messages, setMessages] = useState([{ from: 'bot', text: getResponse('root') }]);
  const [input, setInput] = useState('');

  const currentPath = pathHistory[pathHistory.length - 1];

  const handleUserMessage = () => {
    const trimmedInput = input.trim().toLowerCase();
    if (!trimmedInput) return;

    const userMessage = { from: 'user', text: trimmedInput };
    let newPathHistory = [...pathHistory];
    let botResponseText = '';

    if (trimmedInput === 'menu') {
      newPathHistory = ['root'];
    } else if (trimmedInput === 'back') {
      if (pathHistory.length > 1) newPathHistory.pop();
    } else {
      const currentNode = conversationTree[currentPath];
      if (currentNode?.options && currentNode.options[trimmedInput]) {
        newPathHistory.push(currentNode.options[trimmedInput]);
      } else {
        botResponseText = 'Invalid option. Please choose a number from the list.';
      }
    }

    const newCurrentPath = newPathHistory[newPathHistory.length - 1];
    if (!botResponseText) botResponseText = getResponse(newCurrentPath);
    
    const newCurrentNode = conversationTree[newCurrentPath];
    if (newCurrentNode.options) {
      botResponseText += '\n\n(Type "back" to return or "menu" for the main menu)';
    } else {
      botResponseText += '\n\n(Type "back" or "menu" to continue)';
    }

    const botMessage = { from: 'bot', text: botResponseText };
    setMessages([...messages, userMessage, botMessage]);
    setPathHistory(newPathHistory);
    setInput('');
  };

  return (
    <div className="fixed bottom-24 right-4 bg-white border shadow-2xl rounded-lg w-96 max-h-[500px] flex flex-col overflow-hidden z-[100]">
      <div className="bg-indigo-600 text-white font-semibold p-3 text-lg">Docify Support Bot</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`text-sm p-3 rounded-lg whitespace-pre-wrap max-w-[90%] ${msg.from === 'bot' ? 'bg-indigo-100 text-left self-start' : 'bg-gray-200 text-right self-end'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex border-t">
        <input type="text" className="flex-1 px-4 py-2 text-sm outline-none" placeholder="Type a number, 'back', or 'menu'..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUserMessage()} />
        <button className="bg-indigo-500 hover:bg-indigo-700 text-white px-5 font-semibold transition-colors" onClick={handleUserMessage}>Send</button>
      </div>
    </div>
  );
}
