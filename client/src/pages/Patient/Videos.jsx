import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_BASE_URL = "http://localhost:5000";

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
        ? "Upgrade to unlock our full library of health and wellness videos."
        : "Upgrade to Premium to access exclusive expert interviews and advanced workout sessions.";

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-white rounded-2xl shadow-lg border border-indigo-200 text-center"
        >
            <h3 className="text-xl font-bold text-indigo-600">Unlock More Videos</h3>
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

const VideoCard = ({ video, index }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-2xl shadow-md overflow-hidden group cursor-pointer"
    >
        <div className="relative">
            <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
            </div>
        </div>
        <div className="p-4">
            <h3 className="font-bold text-gray-800 text-lg">{video.title}</h3>
            <p className="text-sm text-gray-500">{video.duration}</p>
        </div>
    </motion.div>
);

// --- Video Content based on Tier ---
const videos = {
    Free: [
        { title: "Morning Yoga for Energy", duration: "15 min", thumbnail: "https://placehold.co/600x400/818cf8/ffffff?text=Yoga" },
        { title: "Healthy Cooking: Salads", duration: "10 min", thumbnail: "https://placehold.co/600x400/a78bfa/ffffff?text=Cooking" },
    ],
    Standard: [
        { title: "HIIT Workout for Beginners", duration: "20 min", thumbnail: "https://placehold.co/600x400/f472b6/ffffff?text=HIIT" },
        { title: "Meditation for Stress Relief", duration: "12 min", thumbnail: "https://placehold.co/600x400/60a5fa/ffffff?text=Meditation" },
        { title: "Understanding Nutrition Labels", duration: "8 min", thumbnail: "https://placehold.co/600x400/fb923c/ffffff?text=Nutrition" },
    ],
    Premium: [
        { title: "Advanced Strength Training", duration: "45 min", thumbnail: "https://placehold.co/600x400/ef4444/ffffff?text=Strength" },
        { title: "Expert Talk: Mental Wellness", duration: "30 min", thumbnail: "https://placehold.co/600x400/14b8a6/ffffff?text=Expert" },
        { title: "Stretching for Desk Workers", duration: "7 min", thumbnail: "https://placehold.co/600x400/34d399/ffffff?text=Stretching" },
    ]
};


export default function Videos() {
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
        return <div className="text-center p-10 font-sans">Loading available videos...</div>;
    }

    const currentPlan = subscription?.status === 'active' ? subscription.plan : null;
    
    let accessibleVideos = [];
    if (currentPlan === 'Free') accessibleVideos = videos.Free;
    if (currentPlan === 'Standard') accessibleVideos = [...videos.Free, ...videos.Standard];
    if (currentPlan === 'Premium') accessibleVideos = [...videos.Free, ...videos.Standard, ...videos.Premium];

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Health & Wellness Videos</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {accessibleVideos.map((video, index) => (
                        <VideoCard key={video.title} video={video} index={index} />
                    ))}
                </div>

                {!currentPlan && <UpgradePrompt currentPlan="None" />}
                {currentPlan === 'Free' && <UpgradePrompt currentPlan="Free" />}
                {currentPlan === 'Standard' && <UpgradePrompt currentPlan="Standard" />}
            </div>
        </div>
    );
}

