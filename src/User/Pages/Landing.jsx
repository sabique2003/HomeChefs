// Landing.jsx
import React from 'react';
import './Landing.css';
import Hero from '../Components/Landing/Hero';
import HowItWorks from '../Components/Landing/HowItWorks';
import PopularChefs from '../Components/Landing/PopularChefs';

function Landing() {
  return (
    <>
      <Hero />
      <div className="bg-land">
        <HowItWorks />
        <div className="spacing-reducer">
          <PopularChefs />
        </div>
      </div>
    </>
  );
}

export default Landing;
