import React, { useContext, useState, useEffect } from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import toast from 'react-hot-toast';
import { chefRegisterApi, chefLoginApi } from '../../Services/allApis';
import { useNavigate } from 'react-router-dom';
import { tokenContext } from '../../Contextapi/TokenContext';

function ChefAuth() {
  const [state, setState] = useState(false); // false = Login, true = Registration
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [locationError, setLocationError] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const { tokenStatus, setTokenStatus } = useContext(tokenContext);
  const nav = useNavigate();

  const [chef, setChef] = useState({
    email: '',
    password: '',
    whatsapp: '',
    chefname: '',
    location: ''
  });

  useEffect(() => {
    setChef({ email: '', password: '', whatsapp: '', chefname: '', location: '' });
  }, [state]);

  const clearInputs = () => {
    setChef({ email: '', password: '', whatsapp: '', chefname: '', location: '' });
  };

  const changeState = () => {
    setState(!state);
    clearInputs();
  };

  const handleRegister = async () => {
    const { email, password, whatsapp, chefname, location } = chef;
    if (!email || !password || !whatsapp || !chefname || !location) {
      toast.error('Enter Valid Input !!');
    } else {
      const res = await chefRegisterApi(chef);
      if (res.status === 200) {
        toast.success('Registered Successfully');
        clearInputs(); // Clear inputs after registration
        changeState();
      } else if (res.status === 400) {
        toast.error('Registration Failed !!');
      } else {
        toast.error(res.response?.data || 'An error occurred');
      }
    }
  };

  const handleLogin = async () => {
    const { email, password } = chef;
    if (!email || !password) {
      toast.error('Enter Valid Inputs');
    } else {
      const res = await chefLoginApi(chef);
      if (res.status === 200) {
        toast.success('Login Successful');
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('name', res.data.chefname);
        sessionStorage.setItem('email', res.data.email);
        sessionStorage.setItem('whatsapp', res.data.whatsapp);
        sessionStorage.setItem('location', res.data.location);
        sessionStorage.setItem('profile', res.data.profile);
        setTokenStatus(true);
        nav('/chefhome');
      } else {
        toast.error(res.response?.data || 'An error occurred');
      }
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setLocation(newLocation);
          setChef({
            ...chef,
            location: `Lat: ${newLocation.latitude}, Lng: ${newLocation.longitude}`
          });
          setLocationError(null);
        },
        (error) => setLocationError('Unable to retrieve location. Please enable location permissions.'),
        { enableHighAccuracy: true }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const newLocation = {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng
        };
        setLocation(newLocation);
        setChef({
          ...chef,
          location: `Lat: ${newLocation.latitude}, Lng: ${newLocation.longitude}`
        });
        setShowMapModal(false);
      }
    });

    return location.latitude && location.longitude ? (
      <Marker position={[location.latitude, location.longitude]} />
    ) : null;
  }

  function MapWithSearchControl() {
    const map = useMapEvents({});

    useEffect(() => {
      const geocoder = L.Control.Geocoder.nominatim();
      const searchControl = L.Control.geocoder({
        query: '',
        placeholder: 'Search for a location...',
        geocoder: geocoder,
        defaultMarkGeocode: false
      }).addTo(map);

      searchControl.on('markgeocode', (e) => {
        const { lat, lng } = e.geocode.center;
        const newLocation = { latitude: lat, longitude: lng };
        setLocation(newLocation);
        setChef({
          ...chef,
          location: `Lat: ${newLocation.latitude}, Lng: ${newLocation.longitude}`
        });
        setShowMapModal(false);
        map.setView([lat, lng], 13);
      });

      return () => {
        map.removeControl(searchControl);
      };
    }, [map]);

    return null;
  }

  return (
    <>
      <div className="w-100 d-flex align-items-center justify-content-center" style={{ height: '150vh', backgroundColor: '#7AB2D3' }}>
        <div className="border shadow p-5 w-75 bg-light">
          <Row>
            <Col md={6} sm={12} className="d-flex align-items-center">
              <img
                src="https://img.freepik.com/free-vector/coloured-chefdesign_1152-72.jpg"
                className="img-fluid"
                alt="Chef Illustration"
              />
            </Col>
            <Col md={6} sm={12} className="d-flex flex-column justify-content-center">
              {state ? <h3 className="mb-4">Chef Registration</h3> : <h3 className="mb-4">Chef Login</h3>}
              <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  value={chef.email}
                  onChange={(e) => setChef({ ...chef, email: e.target.value })}
                />
              </FloatingLabel>
              <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={chef.password}
                  onChange={(e) => setChef({ ...chef, password: e.target.value })}
                />
              </FloatingLabel>
              {state && (
                <>
                  <FloatingLabel controlId="floatingInput" label="WhatsApp Number" className="mb-3">
                    <Form.Control
                      type="number"
                      placeholder="1234567890"
                      value={chef.whatsapp}
                      onChange={(e) => setChef({ ...chef, whatsapp: e.target.value })}
                    />
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Your Name"
                      value={chef.chefname}
                      onChange={(e) => setChef({ ...chef, chefname: e.target.value })}
                    />
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingInput" label="Kitchen Location" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Kitchen Location"
                      value={chef.location}
                      readOnly
                    />
                  </FloatingLabel>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-primary mb-3" onClick={getLocation}>
                      Use Current Location
                    </button>
                    <button className="btn btn-primary mb-3" onClick={() => setShowMapModal(true)}>
                      Set Location Manually
                    </button>
                  </div>
                  {locationError && <p className="text-danger">{locationError}</p>}
                </>
              )}
              <div className="d-flex justify-content-between">
                {state ? <Button className="btn btn-danger" onClick={handleRegister}>Register</Button> : <Button className="btn btn-success" onClick={handleLogin}>Login</Button>}
                {state ? (
                  <button className="btn btn-link" style={{ color: 'blue' }} onClick={changeState}>
                    Already a user?
                  </button>
                ) : (
                  <button className="btn btn-link" style={{ color: 'blue' }} onClick={changeState}>
                    New user?
                  </button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <Modal show={showMapModal} onHide={() => setShowMapModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Location</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '400px' }}>
          <MapContainer center={[10.8505, 76.2711]} zoom={12} style={{ width: '100%', height: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
            <MapWithSearchControl />
          </MapContainer>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMapModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChefAuth;
