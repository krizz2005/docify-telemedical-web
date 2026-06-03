import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "https://docify-telemedical-web-1.onrender.com";

// --- Mock AuthContext for self-contained component ---
const AuthContext = createContext(null);
const useAuth = () => ({
    user: { 
        _id: 'patient123', 
        name: 'Avinash', 
        email: 'avinash@example.com',
    },
    logout: () => console.log('Logged out!'),
});

// --- SVG Icons ---
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>;

const plans = [
  { name: "Free", price: 0, priceFormatted: "₹0", duration: "30 Days", benefits: ["Basic diet plan", "Limited videos"] },
  { name: "Standard", price: 999, priceFormatted: "₹999", duration: "6 Months", benefits: ["Advanced diet plan", "Unlimited videos", "Email support"] },
  { name: "Premium", price: 1999, priceFormatted: "₹1999", duration: "1 Year", benefits: ["Personalized diet plan", "Exclusive health videos", "Priority support"] },
];

export default function Subscription() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myPlan, setMyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState(null); 
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchSub = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/subscriptions/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyPlan(res.data);
      } catch (error) {
          console.error("Could not fetch subscription details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSub();
  }, [user]);

  const handleSubscribe = async (plan) => {
    setProcessingPlan(plan.name);
    setStatusMessage({ type: '', text: '' });

    try {
        const token = localStorage.getItem("token");
        const { data } = await axios.post(
            `${API_BASE_URL}/api/subscriptions/create-order`,
            { plan: plan.name },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (plan.price === 0) {
            setStatusMessage({ type: 'success', text: data.message });
            setMyPlan(data.subscription);
            setProcessingPlan(null);
            return;
        }

        const options = {
            key: data.key,
            amount: data.order.amount,
            currency: "INR",
            name: "Docify+ Subscription",
            description: `Payment for ${plan.name} Plan`,
            order_id: data.order.id,
            handler: async (response) => {
                const verifyRes = await axios.post(`${API_BASE_URL}/api/subscriptions/verify`, 
                { ...response, plan: plan.name },
                { headers: { Authorization: `Bearer ${token}` } });
                
                setStatusMessage({ type: 'success', text: verifyRes.data.message });
                setMyPlan(verifyRes.data.subscription);
                setProcessingPlan(null);
            },
            prefill: { name: user.name, email: user.email },
            theme: { color: "#4F46E5" },
            modal: {
                ondismiss: () => {
                    setProcessingPlan(null); 
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        
        rzp.on('payment.failed', function (response){
            setStatusMessage({ type: 'error', text: 'Payment failed. Please try again.'});
            setProcessingPlan(null);
        });

    } catch (err) {
      console.error("Subscription Error:", err);
      setStatusMessage({ type: 'error', text: err.response?.data?.error || "Subscription process failed. Please try again." });
      setProcessingPlan(null);
    }
  };

  if(loading) {
      return <div className="text-center p-10 font-sans text-gray-600">Loading your subscription details...</div>
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 text-center">Choose Your Plan</h1>
        <p className="text-gray-600 mb-8 text-center">Upgrade to get the most out of Docify+.</p>

        <AnimatePresence>
            {statusMessage.text && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className={`p-4 mb-6 rounded-lg text-center font-semibold ${
                        statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                >
                    {statusMessage.text}
                </motion.div>
            )}
        </AnimatePresence>
        
        {myPlan && myPlan.status === 'active' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl shadow-lg"
          >
            <h3 className="text-2xl font-bold">Your Current Plan: {myPlan.plan}</h3>
            <p className="opacity-90 capitalize">Status: <span className="font-semibold">{myPlan.status}</span></p>
            <p className="opacity-90">Valid Until: <span className="font-semibold">{new Date(myPlan.endDate).toLocaleDateString('en-GB')}</span></p>
            
            {/* *** NEWLY ADDED SECTION *** */}
            <div className="mt-4 pt-4 border-t border-white/20 flex flex-col sm:flex-row gap-4">
                <Link to="/patient/diet-plan" className="flex-1 text-center bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-lg transition">
                    View Diet Plan
                </Link>
                <Link to="/patient/videos" className="flex-1 text-center bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-lg transition">
                    Watch Videos
                </Link>
            </div>
            {/* *** END OF NEW SECTION *** */}

          </motion.div>
        ) : (
             <p className="text-center text-gray-500 mb-8">You currently don't have an active subscription.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p) => (
            <div key={p.name} className={`border rounded-2xl p-8 shadow-lg text-center bg-white flex flex-col transition-all duration-300 ${myPlan?.plan === p.name && myPlan?.status === 'active' ? 'border-indigo-500 border-2' : 'border-gray-200'}`}>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">{p.name}</h3>
              <p className="text-4xl font-extrabold mb-2 text-gray-900">{p.priceFormatted}</p>
              <p className="text-sm text-gray-500 mb-6">{p.duration}</p>
              <ul className="space-y-3 text-left mb-8 flex-grow text-gray-600">
                {p.benefits.map((b, idx) => <li key={idx} className="flex items-start"><CheckIcon/><span className="ml-2">{b}</span></li>)}
              </ul>
              <button
                onClick={() => handleSubscribe(p)}
                disabled={processingPlan || (myPlan?.plan === p.name && myPlan?.status === 'active')}
                className={`w-full font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 ${
                    myPlan?.plan === p.name && myPlan?.status === 'active'
                    ? 'bg-gray-200 text-gray-500 cursor-default'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {processingPlan === p.name ? 'Processing...' : myPlan?.plan === p.name && myPlan?.status === 'active' ? 'Current Plan' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

