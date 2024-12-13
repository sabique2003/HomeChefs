import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../../Images/logo-nobg.png';
import './Header.css';
import { Link } from 'react-router-dom';

function Header() {
  const [address, setAddress] = useState('Your Location');

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.bg');
      if (window.scrollY > 0) {
        navbar.classList.add('navbar-shrink');
      } else {
        navbar.classList.remove('navbar-shrink');
      }
    };

    window.addEventListener('scroll', handleScroll);

    const fetchAddress = async (location) => {
      try {
        const latLngMatch = location.match(/Lat:\s*([-+]?[0-9]*\.?[0-9]+),\s*Lng:\s*([-+]?[0-9]*\.?[0-9]+)/);
        if (latLngMatch) {
          const [lat, lng] = [latLngMatch[1], latLngMatch[2]];
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await response.json();

          if (data && data.address) {
            const { road, city, town, village, state, postcode } = data.address;
            const addressParts = [
              road,
              town || village || city,
              state,
              postcode
            ].filter(part => part);
            return addressParts.join(', ') || 'Unknown Location';
          }
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      }
      return 'Unknown Location';
    };

    const loadAddress = () => {
      const location = sessionStorage.getItem('location');
      if (location) {
        fetchAddress(location).then(setAddress);
      }
    };

    const originalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = function (key, value) {
      originalSetItem.apply(this, arguments); 
      if (key === 'location') {
        loadAddress(); 
      }
    };

    loadAddress();

    return () => {
      sessionStorage.setItem = originalSetItem;
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Navbar className="bg">
        <Container>
          <Navbar.Brand href="/" className="text-light">
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            <span className="home-chef">HomeChefs</span>
          </Navbar.Brand>
          <Link className="me-3 text-light btn border-none">
            <i className="fa-solid fa-location-dot" style={{ color: "#fcfcfc" }} />
            <a
              href={`https://www.google.com/maps?q=${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="location-link"
            >
              {address || 'Your Location'}
            </a>
          </Link>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
