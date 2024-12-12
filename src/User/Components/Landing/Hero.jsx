import React from 'react';
import './Hero.css';
import { Link } from 'react-router-dom';
import logo from '../../../Images/logo-nobg.png';

const Hero = () => (
  <section className="hero d-flex align-items-center justify-content-center">
    <div className="text-center" style={{ color: "#4A628A" }}>
      <img src={logo} alt="" width="150px" />
      <h1>HomeChefs <br /> Delicious Homemade Meals</h1>
      <p>Connect with local chefs for a taste of home.</p>
      <div className="d-grid gap-2 d-md-inline-flex justify-content-center">
        <Link to='/userauth' className="btn btn-dark btn-custom me-md-2 ">Order Homecooked Meals</Link>
        <Link to='/chefauth' className="btn btn-outline-dark btn-custom btn-chef">Become a Home Chef</Link>
      </div>
    </div>
  </section>
);

export default Hero;
