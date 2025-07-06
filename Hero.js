import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="gradient-text">Test Your Knowledge</span>
            <br />
            Win Big Rewards
          </motion.h1>
          
          <motion.p 
            className="hero-description"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Challenge yourself with current affairs quizzes and strategic yes/no betting. 
            Learn, earn, and have fun with our interactive platform.
          </motion.p>
          
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.a 
              href="#quiz" 
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('quiz');
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-play"></i>
              Start Quiz
            </motion.a>
            
            <motion.a 
              href="#betting" 
              className="btn btn-secondary"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('betting');
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-coins"></i>
              Start Betting
            </motion.a>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="floating-cards">
            <motion.div 
              className="card card-1"
              animate={{ 
                y: [-10, 10, -10],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <i className="fas fa-question-circle"></i>
              <span>Quiz</span>
            </motion.div>
            
            <motion.div 
              className="card card-2"
              animate={{ 
                y: [10, -10, 10],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <i className="fas fa-chart-line"></i>
              <span>Bet</span>
            </motion.div>
            
            <motion.div 
              className="card card-3"
              animate={{ 
                y: [-5, 15, -5],
                rotate: [0, 3, 0]
              }}
              transition={{ 
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <i className="fas fa-trophy"></i>
              <span>Win</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      <div className="hero-bg-animation">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="particle"
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3 + index,
              repeat: Infinity,
              delay: index * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero; 