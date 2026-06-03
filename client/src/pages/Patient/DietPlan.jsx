import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_BASE_URL = "https://docify-telemedical-web-1.onrender.com";

// --- Mock AuthContext for self-contained component ---
const AuthContext = createContext(null);
const useAuth = () => ({
    user: { 
        _id: 'patient123', 
        name: 'Avinash', 
    },
});

// --- UI Components ---
const UpgradePrompt = ({ currentPlan }) => {
    const navigate = useNavigate();
    const targetPlan = currentPlan === 'Free' ? 'Standard' : 'Premium';
    const message = currentPlan === 'Free' 
        ? "Upgrade to Standard or Premium for more detailed diet plans and variety."
        : "Upgrade to Premium for personalized diet plans from our top nutritionists.";

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-white rounded-2xl shadow-lg border border-indigo-200 text-center"
        >
            <h3 className="text-xl font-bold text-indigo-600">Unlock More Benefits</h3>
            <p className="text-gray-600 my-3">{message}</p>
            <button
                onClick={() => navigate('/patient/subscription')}
                className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
            >
                Upgrade to {targetPlan}
            </button>
        </motion.div>
    );
};

const PlanSection = ({ title, planData }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        {Object.entries(planData).map(([meal, details]) => (
            <div key={meal} className="mb-4">
                <h3 className="text-lg font-semibold text-indigo-600 capitalize">{meal} ({details.time})</h3>
                <ul className="list-disc list-inside text-gray-700">
                    {details.items.map(item => <li key={item}>{item}</li>)}
                </ul>
            </div>
        ))}
    </div>
);

// --- Diet Plan Content based on Tier ---
const dietPlans = {
    Free: {
        title: "Basic Diet Plan (Day 1)",
        plan: {
            breakfast: { time: "8 AM", items: ["Oatmeal with banana"] },
            lunch: { time: "1 PM", items: ["Brown Rice, Dal (Lentils)"] },
            dinner: { time: "8 PM", items: ["2 Chapatis, Mixed Vegetables"] },
        }
    },
    Standard: {
        title: "Advanced Diet Plan (First 3 Days)",
        plan: {
            ...{ breakfast: { time: "8 AM", items: ["Oatmeal with mixed fruits & nuts", "Glass of milk"] } }, // reusing free
            lunch: { time: "1 PM", items: ["Quinoa Salad with chickpeas", "Yogurt"] },
            snack: { time: "4 PM", items: ["Apple slices with peanut butter"] },
            dinner: { time: "8 PM", items: ["Grilled Paneer, Steamed Vegetables"] },
        }
    },
    Premium: {
        title: "Personalized Weekly Diet Plan",
        plan: {
            ...{ breakfast: { time: "8 AM", items: ["Avocado Toast on whole-wheat bread", "Smoothie"] } }, // reusing standard
            lunch: { time: "1 PM", items: ["Grilled Chicken/Tofu Salad", "Glass of Buttermilk"] },
            snack: { time: "4 PM", items: ["Greek Yogurt with berries"] },
            dinner: { time: "8 PM", items: ["Baked Salmon/Lentil soup", "Quinoa and roasted asparagus"] },
        }
    }
};

export default function DietPlan() {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSubscription = async () => {
            try {
                const token = localStorage.getItem("token");
                const { data } = await axios.get(`${API_BASE_URL}/api/subscriptions/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSubscription(data);
            } catch (error) {
                console.error("Failed to fetch subscription status");
            } finally {
                setLoading(false);
            }
        };
        checkSubscription();
    }, []);

    if (loading) {
        return <div className="text-center p-10 font-sans">Loading your diet plan...</div>;
    }

    const currentPlan = subscription?.status === 'active' ? subscription.plan : null;

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-3xl mx-auto">
                 <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Your Diet Plan</h1>
                
                {!currentPlan && <UpgradePrompt currentPlan="None" />}

                {currentPlan === 'Free' && (
                    <>
                        <PlanSection title={dietPlans.Free.title} planData={dietPlans.Free.plan} />
                        <UpgradePrompt currentPlan="Free" />
                    </>
                )}
                
                {currentPlan === 'Standard' && (
                    <>
                        <PlanSection title={dietPlans.Standard.title} planData={dietPlans.Standard.plan} />
                         <UpgradePrompt currentPlan="Standard" />
                    </>
                )}

                {currentPlan === 'Premium' && (
                    <PlanSection title={dietPlans.Premium.title} planData={dietPlans.Premium.plan} />
                )}
            </div>
        </div>
    );
}

