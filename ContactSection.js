import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      alert('Thank you for your message! We\'ll get back to you soon.');
    }, 2000);
  };

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

  const contactItems = [
    {
      icon: 'fas fa-envelope',
      title: 'Email Us',
      info: 'support@betverse.com'
    },
    {
      icon: 'fas fa-phone',
      title: 'Call Us',
      info: '+1 (555) 123-4567'
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Visit Us',
      info: '123 Innovation Street\nTech City, TC 12345'
    }
  ];

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title contact-title">
            <span style={{color: '#181f2a', fontWeight: 700}}>Get in</span> <span className="contact-gradient-text">Touch</span>
          </h2>
          <p className="section-description">
            Have questions or suggestions? We'd love to hear from you!
          </p>
        </motion.div>
        
        <motion.div 
          className="contact-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="contact-info"
            variants={itemVariants}
          >
            {contactItems.map((item, index) => (
              <motion.div 
                key={index}
                className="contact-item"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="contact-icon"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <i className={item.icon}></i>
                </motion.div>
                <div className="contact-details">
                  <h3>{item.title}</h3>
                  <p>{item.info}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="contact-form"
            variants={itemVariants}
          >
            <form onSubmit={handleSubmit}>
              <motion.div 
                className="form-group"
                variants={itemVariants}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </motion.div>
              
              <motion.div 
                className="form-group"
                variants={itemVariants}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </motion.div>
              
              <motion.div 
                className="form-group"
                variants={itemVariants}
              >
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </motion.div>
              
              <motion.div 
                className="form-group"
                variants={itemVariants}
              >
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </motion.div>
              
              <motion.button 
                type="submit" 
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
              >
                <i className="fas fa-paper-plane"></i>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection; 