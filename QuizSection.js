import React from 'react';
import { motion } from 'framer-motion';

const QuizSection = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const customerReviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Amazing quiz platform! The current affairs questions are always up-to-date and challenging. I've learned so much while having fun!",
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      rating: 5,
      comment: "Best quiz app I've ever used. The daily challenges keep me engaged and the rewards system is fantastic. Highly recommended!",
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      rating: 5,
      comment: "Love the interactive features and how the questions are updated daily. It's both educational and entertaining!",
      avatar: "ER"
    }
  ];

  const handleQuizRedirect = () => {
    // Redirect to the separate quiz tab/application
    window.open('/quiz', '_blank');
  };

  return (
    <section id="quiz" className="quiz-section">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">
            <span className="gradient-text">Current Affairs</span> Quiz Game
          </h2>
          <p className="section-description">
            Test your knowledge about the latest world events and current affairs. 
            Join thousands of players in our interactive quiz platform!
          </p>
        </motion.div>
        
        <motion.div 
          className="quiz-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="quiz-content-wrapper">
            <motion.div 
              className="customer-reviews"
              variants={itemVariants}
            >
              <h3>What Our Players Say</h3>
              <div className="reviews-grid">
                {customerReviews.map((review, index) => (
                  <motion.div 
                    key={index}
                    className="review-card"
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                  >
                    <div className="review-header">
                      <div className="avatar">{review.avatar}</div>
                      <div className="review-info">
                        <h4>{review.name}</h4>
                        <div className="stars">
                          {[...Array(review.rating)].map((_, i) => (
                            <i key={i} className="fas fa-star"></i>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="review-text">"{review.comment}"</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="quiz-redirect-section"
              variants={itemVariants}
            >
              <div className="redirect-card">
                <div className="redirect-icon">
                  <i className="fas fa-gamepad"></i>
                </div>
                <h3>Ready to Play?</h3>
                <p>Experience our full interactive quiz platform with daily challenges, leaderboards, and rewards!</p>
                <motion.button 
                  className="btn btn-primary redirect-btn"
                  onClick={handleQuizRedirect}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fas fa-external-link-alt"></i>
                  Launch Quiz Platform
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuizSection; 