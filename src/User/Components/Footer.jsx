import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer text-light" style={{backgroundColor:'#4A628A'}}>
    <div className="container py-5">
      <div className="row">
        {/* About Section */}
        <div className="col-md-4">
          <h5 className="mb-4">About HomeChefs</h5>
          <p>
            HomeChefs connects local chefs with food enthusiasts seeking authentic, homemade meals. 
            We empower chefs to share their passion while bringing fresh, wholesome food to your table.
          </p>
        </div>

        {/* Quick Links */}
        <div className="col-md-4">
          <h5 className="mb-4">Quick Links</h5>
          <ul className="list-unstyled">
            <li><a href="/about" className="text-light">About Us</a></li>
            <li><a href="/contact" className="text-light">Contact Us</a></li>
            <li><a href="/terms" className="text-light">Terms & Conditions</a></li>
            <li><a href="/privacy" className="text-light">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social Media and Contact */}
        <div className="col-md-4">
          <h5 className="mb-4">Connect with Us</h5>
          <p>Stay connected on social media:</p>
          <div className="social-icons">
            <a href="https://facebook.com" className="text-light me-3"><i className="fab fa-facebook-f"></i></a>
            <a href="https://twitter.com" className="text-light me-3"><i className="fab fa-twitter"></i></a>
            <a href="https://instagram.com" className="text-light me-3"><i className="fab fa-instagram"></i></a>
            <a href="https://linkedin.com" className="text-light"><i className="fab fa-linkedin"></i></a>
          </div>
          <p className="mt-3">Email: support@homechefs.com</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-4">
        <p>&copy; {new Date().getFullYear()} HomeChefs. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
