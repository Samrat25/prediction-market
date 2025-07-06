import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuizSection from './components/QuizSection';
import BettingSection from './components/BettingSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import './App.css';
import './components/Navbar.css';
import './components/Hero.css';
import './components/QuizSection.css';
import './components/BettingSection.css';
import './components/AboutSection.css';
import './components/ContactSection.css';
import './components/Footer.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <i className="fas fa-brain"></i>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          BetVerse
        </motion.h2>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <Hero />
      <QuizSection />
      <BettingSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default App; 