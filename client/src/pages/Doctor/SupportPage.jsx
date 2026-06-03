import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get("https://docify-telemedical-web-1.onrender.com/api/support/my-tickets", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTickets(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.post("https://docify-telemedical-web-1.onrender.com/api/support", { subject, description, priority }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSubject("");
    setDescription("");
    fetchTickets();
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Raise a Support Ticket</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Describe your issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
            Submit Ticket
          </button>
        </form>

        <h3 className="text-xl font-bold mt-6">My Tickets</h3>
        <ul className="space-y-3">
          {tickets.map(ticket => (
            <li key={ticket._id} className="p-4 border rounded bg-white shadow">
              <p className="font-semibold">{ticket.subject}</p>
              <p className="text-sm">{ticket.description}</p>
              <p className="text-xs text-gray-500">Priority: {ticket.priority} | Status: {ticket.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
