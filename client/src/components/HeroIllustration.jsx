import React from 'react';
import { motion } from 'framer-motion';

// This is a self-contained SVG illustration component.
// It uses Framer Motion to add subtle, engaging animations to parts of the image.
export default function HeroIllustration() {
  const svgVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  const floatingVariants = {
    hidden: { y: 0, opacity: 0 },
    visible: {
      opacity: 1,
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.svg
      viewBox="0 0 550 450"
      xmlns="http://www.w3.org/2000/svg"
      variants={svgVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background shapes */}
      <motion.circle cx="400" cy="150" r="150" fill="#e0e7ff" variants={itemVariants} />
      <motion.circle cx="150" cy="350" r="100" fill="#c7d2fe" variants={itemVariants} />

      {/* Main Doctor Illustration */}
      <g transform="translate(125, 50)">
        {/* Doctor */}
        <motion.g variants={itemVariants}>
          <path d="M150 320 L 150 180 Q 150 80 220 80 L 280 80 Q 350 80 350 180 L 350 320 Z" fill="#ffffff" stroke="#6366f1" strokeWidth="4" />
          <circle cx="250" cy="140" r="60" fill="#f3e8ff" stroke="#6366f1" strokeWidth="4" />
          <path d="M220 120 L 280 120" stroke="#4c51bf" strokeWidth="4" strokeLinecap="round" />
          <path d="M235 150 L 265 150" stroke="#4c51bf" strokeWidth="4" strokeLinecap="round" />
        </motion.g>

        {/* Floating Icons */}
        <motion.g variants={floatingVariants} style={{ transitionDelay: '0s' }}>
          <rect x="50" y="80" width="50" height="50" rx="10" fill="#a5b4fc" />
          <path d="M65 105 L 75 105 M 70 100 L 70 110" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        </motion.g>

        <motion.g variants={floatingVariants} style={{ transitionDelay: '0.5s' }}>
          <circle cx="400" cy="250" r="30" fill="#fca5a5" />
          <path d="M390 250 L 410 250 M 400 240 L 400 260" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        </motion.g>

        <motion.g variants={floatingVariants} style={{ transitionDelay: '1s' }}>
          <path d="M80 280 L 120 280 L 100 320 Z" fill="#818cf8" />
        </motion.g>
      </g>
    </motion.svg>
  );
}
