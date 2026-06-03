import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaTwitter, FaComments, FaHeartbeat, FaStethoscope, FaFileMedicalAlt, FaQuoteLeft } from 'react-icons/fa';
import { FiVideo } from 'react-icons/fi';

// Component & Asset Imports
import docifyLogo from '../assets/docify-logo.png'; // Make sure you have a logo file here
import Chatbot from '../components/Chatbot';
import InteractiveDemo from '../components/InteractiveDemo';
import HeroIllustration from '../components/HeroIllustration'; 

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Mock data for sections
const topDoctors = [
  { name: 'Dr. Emily Carter', specialty: 'Cardiologist', image: 'https://placehold.co/300x300/a5b4fc/4c51bf?text=Dr.+C' },
  { name: 'Dr. Ben Adams', specialty: 'Dermatologist', image: 'https://placehold.co/300x300/fca5a5/991b1b?text=Dr.+A' },
  { name: 'Dr. Chloe Davis', specialty: 'Pediatrician', image: 'https://placehold.co/300x300/818cf8/312e81?text=Dr.+D' },
];

const testimonials = [
    { name: 'Priya Sharma', location: 'Mumbai, MH', quote: 'Docify has been a lifesaver! Booking appointments is so easy, and the video consultations are crystal clear. Highly recommended!', image: 'https://placehold.co/100x100/fbcfe8/9d2667?text=PS' },
    { name: 'Raj Verma', location: 'Delhi, DL', quote: 'Managing my parents\' health records has never been simpler. All their reports are in one place, secure and accessible anytime.', image: 'https://placehold.co/100x100/cce7f1/1e40af?text=RV' },
    { name: 'Anjali Singh', location: 'Bengaluru, KA', quote: 'As a doctor, this platform has streamlined my workflow. I can manage my schedule and view patient histories effortlessly.', image: 'https://placehold.co/100x100/d1fae5/065f46?text=AS' },
    { name: 'Vikram Patel', location: 'Ahmedabad, GJ', quote: 'The chatbot is surprisingly helpful for quick questions, and the support team is very responsive. Great service!', image: 'https://placehold.co/100x100/fee2e2/991b1b?text=VP' },
];


export default function LandingPage() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full animated-gradient opacity-20 -z-10"></div>

      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <img src={docifyLogo} alt="Docify Logo" className="w-10 h-10" />
            <span className="text-2xl font-extrabold text-indigo-900">Docify</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6 text-indigo-900 font-medium">
            <a href="#features" className="hover:text-indigo-600 transition">Features</a>
            <a href="#demo" className="hover:text-indigo-600 transition">Demo</a>
            <a href="#doctors" className="hover:text-indigo-600 transition">Doctors</a>
            <a href="#testimonials" className="hover:text-indigo-600 transition">Testimonials</a>
            <Link to="/login" className="hover:text-indigo-600 transition">Login</Link>
            <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg">Register</Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-16 px-6">
        <motion.section
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-24 text-center lg:text-left"
          variants={containerVariants} initial="hidden" animate="visible"
        >
          <motion.div className="lg:pr-10" variants={itemVariants}>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-800 mb-4 leading-tight">
              Intelligent Healthcare,
              <span className="text-indigo-600"> Instantly Accessible.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Docify is your all-in-one platform for seamless virtual consultations, secure health record management, and effortless appointment scheduling.
            </p>
            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg shadow-lg transition transform hover:scale-105 inline-block">
              Get Started for Free
            </Link>
          </motion.div>
          <div className="w-full h-full">
            <HeroIllustration />
          </div>
        </motion.section>

        <motion.section id="features" className="max-w-5xl mx-auto mb-24" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">Everything You Need for Modern Healthcare</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="md:col-span-2 bg-white/70 p-8 rounded-2xl shadow-lg border backdrop-blur-sm"><FaStethoscope className="text-3xl text-indigo-500 mb-4"/><h3 className="text-2xl font-bold mb-2">Smart Appointments</h3><p>Book, manage, and track consultations effortlessly. Get reminders and sync with your calendar.</p></motion.div>
                <motion.div variants={itemVariants} className="bg-white/70 p-8 rounded-2xl shadow-lg border backdrop-blur-sm"><FaFileMedicalAlt className="text-3xl text-green-500 mb-4"/><h3 className="text-xl font-bold mb-2">Secure Reports</h3><p>Upload and view medical files with end-to-end encryption.</p></motion.div>
                <motion.div variants={itemVariants} className="bg-white/70 p-8 rounded-2xl shadow-lg border backdrop-blur-sm"><FaHeartbeat className="text-3xl text-pink-500 mb-4"/><h3 className="text-xl font-bold mb-2">Digital Prescriptions</h3><p>Access your digital prescriptions anytime, anywhere.</p></motion.div>
                <motion.div variants={itemVariants} className="md:col-span-2 bg-white/70 p-8 rounded-2xl shadow-lg border backdrop-blur-sm"><FiVideo className="text-3xl text-red-500 mb-4"/><h3 className="text-2xl font-bold mb-2">Live Consultations</h3><p>Connect with certified doctors via high-quality video calls from the comfort of your home.</p></motion.div>
            </div>
        </motion.section>

        <motion.section id="demo" className="mb-24" variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            <InteractiveDemo />
        </motion.section>

        <motion.section id="doctors" className="max-w-5xl mx-auto mb-24" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">Meet Our Top Doctors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {topDoctors.map((doctor, index) => (
                    <motion.div key={index} variants={itemVariants} className="bg-white/70 p-6 rounded-2xl shadow-lg border backdrop-blur-sm text-center group">
                        <img src={doctor.image} alt={`Portrait of ${doctor.name}`} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-md transform group-hover:scale-110 transition-transform duration-300" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x300/cccccc/333333?text=Doc'; }}/>
                        <h3 className="text-xl font-bold text-gray-800">{doctor.name}</h3>
                        <p className="text-indigo-600 font-semibold">{doctor.specialty}</p>
                    </motion.div>
                ))}
            </div>
        </motion.section>

        {/* --- NEW: Testimonials Section --- */}
        <section id="testimonials" className="py-20 bg-indigo-50/50">
            <div className="container mx-auto px-6">
                <motion.h2 variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-4xl font-extrabold text-center text-gray-800 mb-12">What Our Patients Say</motion.h2>
                <div className="relative w-full overflow-hidden">
                    <motion.div
                        className="flex"
                        animate={{
                            x: ['-0%', '-100%'],
                            transition: {
                                ease: 'linear',
                                duration: 20,
                                repeat: Infinity,
                            }
                        }}
                    >
                        {[...testimonials, ...testimonials].map((testimonial, index) => (
                            <div key={index} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 p-4">
                                <div className="bg-white p-8 rounded-2xl shadow-lg h-full">
                                    <FaQuoteLeft className="text-3xl text-indigo-200 mb-4" />
                                    <p className="text-slate-600 mb-6 italic">"{testimonial.quote}"</p>
                                    <div className="flex items-center">
                                        <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 border-2 border-indigo-200" />
                                        <div>
                                            <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                                            <p className="text-sm text-slate-500">{testimonial.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>

      </main>

      <button onClick={() => setShowChatbot(!showChatbot)} className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl p-4 transition z-[60] transform hover:scale-110 hover:rotate-12"><FaComments size={24} /></button>
      {showChatbot && <Chatbot />}

      <footer className="bg-white border-t py-12 px-6 text-sm text-indigo-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-left">
           <div><h4 className="font-semibold text-lg mb-4">Docify</h4><p className="text-slate-600">Your Health, Simplified.</p></div>
           <div><h4 className="font-semibold mb-4">Quick Links</h4><ul className="space-y-2 text-slate-600"><li><Link to="/login" className="hover:text-indigo-600">Login</Link></li><li><Link to="/register" className="hover:text-indigo-600">Register</Link></li></ul></div>
           <div><h4 className="font-semibold mb-4">Help</h4><ul className="space-y-2 text-slate-600"><li><Link to="/faq" className="hover:text-indigo-600">FAQs</Link></li><li><Link to="/support" className="hover:text-indigo-600">Support</Link></li><li><a href="mailto:support@docify.com" className="hover:text-indigo-600">Contact Us</a></li></ul></div>
           <div><h4 className="font-semibold mb-4">Follow Us</h4><div className="flex space-x-4 text-slate-600"><a href="#" className="hover:text-indigo-600"><FaFacebookF size={20} /></a><a href="#" className="hover:text-pink-600"><FaInstagram size={20} /></a><a href="#" className="hover:text-sky-500"><FaTwitter size={20} /></a></div></div>
         </div>
         <div className="text-center text-xs text-gray-500 pt-8 mt-8 border-t">&copy; {new Date().getFullYear()} Docify. All rights reserved.</div>
       </footer>
    </div>
  );
}
