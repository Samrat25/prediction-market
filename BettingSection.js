import React from 'react';
import { motion } from 'framer-motion';

const BettingSection = () => {
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
      name: "David Thompson",
      rating: 5,
      comment: "Incredible betting platform! The odds are competitive and the payouts are instant. I've made some great profits here!",
      avatar: "DT"
    },
    {
      name: "Lisa Wang",
      rating: 5,
      comment: "Best prediction platform I've found. The markets are diverse and the interface is so user-friendly. Love it!",
      avatar: "LW"
    },
    {
      name: "James Martinez",
      rating: 5,
      comment: "Amazing experience! The real-time odds updates and secure platform give me confidence to place bigger bets.",
      avatar: "JM"
    }
  ];

  const handleBettingRedirect = () => {
    // Redirect to the separate betting tab/application
    window.open('/betting', '_blank');
  };

  return (
    <section id="betting" className="betting-section">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">
            <span className="gradient-text">Yes/No</span> Betting Platform
          </h2>
          <p className="section-description">
            Make strategic predictions on current events and earn profits. 
            Join thousands of successful bettors in our prediction markets!
          </p>
        </motion.div>
        
        <motion.div 
          className="betting-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="betting-content-wrapper">
            <motion.div 
              className="customer-reviews"
              variants={itemVariants}
            >
              <h3>What Our Bettors Say</h3>
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
              className="betting-redirect-section"
              variants={itemVariants}
            >
              <div className="redirect-card">
                <div className="redirect-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>Ready to Bet?</h3>
                <p>Access our full betting platform with live markets, real-time odds, and instant payouts!</p>
                <motion.button 
                  className="btn btn-primary redirect-btn"
                  onClick={handleBettingRedirect}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fas fa-external-link-alt"></i>
                  Launch Betting Platform
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BettingSection; 