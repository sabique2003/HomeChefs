import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import './HomeHero.css';
import HomeCanvas from './HomeCanvas';

function HomeHero({ searchQuery, setSearchQuery }) {
  return (
    <>
      <section className="home-hero d-flex align-items-center justify-content-center">
        <div className="text-center" style={{ color: '#DFF2EB' }}>
          <h1>Welcome to HomeChefs</h1>
          <p>Connect with local chefs for a taste of home.</p>

          <InputGroup className="search-bar" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <Form.Control
              type="text"
              placeholder="Search for cuisine, or chefs..."
              aria-label="Search for meals or chefs"
              className="form-control-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-secondary bg-warning">
              <i className="fas fa-search"></i>
            </Button>
          </InputGroup>
        </div>
        <div className="home-canvas-wrapper">
          <HomeCanvas />
        </div>
      </section>
    </>
  );
}

export default HomeHero;
