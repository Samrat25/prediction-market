import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
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

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const aboutItems = [
    {
      icon: 'fas fa-lightbulb',
      title: 'Our Mission',
      description: 'To make learning current affairs fun and rewarding while providing an exciting betting platform for strategic thinkers.'
    },
    {
      icon: 'fas fa-target',
      title: 'Our Vision',
      description: 'To become the leading platform for interactive learning and prediction-based entertainment.'
    },
    {
      icon: 'fas fa-heart',
      title: 'Our Values',
      description: 'Transparency, fairness, education, and entertainment are at the core of everything we do.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '500+', label: 'Daily Questions' },
    { number: '$100K+', label: 'Total Payouts' }
  ];

  return (
    <section id="about" className="about-section">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">
            About <span className="gradient-text">BetVerse</span>
          </h2>
          <p className="section-description">
            We're passionate about creating engaging, educational, and profitable entertainment experiences.
          </p>
        </motion.div>
        
        <motion.div 
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="about-text"
            variants={itemVariants}
          >
            {aboutItems.map((item, index) => (
              <motion.div 
                key={index}
                className="about-item"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="about-icon"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <i className={item.icon}></i>
                </motion.div>
                <div className="about-details">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="about-stats"
            variants={statsVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="stat"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="stat-number"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true }}
                >
                  {stat.number}
                </motion.div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection; 