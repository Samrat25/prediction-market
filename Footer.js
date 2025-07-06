import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert('Thank you for subscribing to our newsletter!');
      setEmail('');
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickLinks = [
    { id: 'home', label: 'Home' },
    { id: 'quiz', label: 'Quiz Game' },
    { id: 'betting', label: 'Yes/No Betting' },
    { id: 'about', label: 'About Us' }
  ];

  const supportLinks = [
    { href: '#', label: 'Help Center' },
    { href: '#', label: 'Terms of Service' },
    { href: '#', label: 'Privacy Policy' },
    { href: '#contact', label: 'Contact Us' }
  ];

  const socialLinks = [
    { href: '#', icon: 'fab fa-facebook' },
    { href: '#', icon: 'fab fa-twitter' },
    { href: '#', icon: 'fab fa-instagram' },
    { href: '#', icon: 'fab fa-linkedin' }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="footer">
      <div className="container">
        <motion.div 
          className="footer-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="footer-section"
            variants={itemVariants}
          >
            <motion.div 
              className="footer-logo"
              whileHover={{ scale: 1.05 }}
            >
              <i className="fas fa-brain"></i>
              <span>BetVerse</span>
            </motion.div>
            <p>Making learning fun and profitable through interactive quizzes and strategic betting.</p>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className={social.icon}></i>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="footer-section"
            variants={itemVariants}
          >
            <h3>Quick Links</h3>
            <ul>
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.id);
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div 
            className="footer-section"
            variants={itemVariants}
          >
            <h3>Support</h3>
            <ul>
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div 
            className="footer-section"
            variants={itemVariants}
          >
            <h3>Newsletter</h3>
            <p>Stay updated with our latest features and news.</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <motion.button 
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-arrow-right"></i>
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p>&copy; 2024 QuizBet. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 