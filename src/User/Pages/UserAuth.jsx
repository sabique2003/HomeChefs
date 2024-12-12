import React, { useState,useContext } from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import './UserAuth.css';
import toast from 'react-hot-toast';
import { registerApi,loginApi } from '../../Services/allApis';
import { useNavigate } from 'react-router-dom';
import { tokenContext } from '../../Contextapi/TokenContext';


function UserAuth() {
    const [state, setState] = useState(false);
    const [location, setLocation] = useState({ latitude: '', longitude: '' });
    const [locationError, setLocationError] = useState(null);
    const [showMapModal, setShowMapModal] = useState(false);
    const {tokenStatus,setTokenStatus}=useContext(tokenContext)

    const [user, setUser] = useState({
        email: "", password: "", mobile: "", name: "", location: "",userImage:""
    });
    const nav=useNavigate()

    const handleRegister = async() => {
        console.log(user);
        const {email,password,mobile,name,location}=user
        if(!email || !password || !mobile || !name || !location){
            toast.error("Enter Valid Input !!")
        }
        else{
            const res=await registerApi(user)
            console.log(res);
            if(res.status==200){
                toast.success("Registered Successfully")
                setUser({
                    email: "", password: "", mobile: "", name: "", location: ""
                })
                changeState()
            }
            else if(res.status==400){
                toast.error("Registration Failed !!")
         
            }
            else{
                toast.error(res.response.data)
            }
        }
    };

    const handleLogin=async()=>{
        const {email,password}=user
        if(!email || !password){
            toast.error("Enter Valid Inputs")
        }
        else{
            const res=await loginApi(user)
            console.log(res);
            if(res.status==200){
                toast.success("Login Successfull")
                setUser({
                    email: "", password: "", mobile: "", name: "", location: "",userImage:""
                })
                sessionStorage.setItem("token",res.data.token)
                sessionStorage.setItem("name",res.data.name)
                sessionStorage.setItem("email",res.data.email)
                sessionStorage.setItem("mobile",res.data.mobile)
                sessionStorage.setItem("location",res.data.location)
                sessionStorage.setItem("userImage",res.data.userImage)
                setTokenStatus(true)
                nav('/home')
            }
            else{
                toast.error(res.response.data)
            }
            
        }
    }

    const changeState = () => {
        setUser({
            email: "", password: "", mobile: "", name: "", location: ""
        })
        setState(!state)
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
                    setUser({
                        ...user,
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
                setUser({
                    ...user,
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

        React.useEffect(() => {
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
                setUser({
                    ...user,
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
            <div className="w-100 d-flex justify-content-center align-items-center" style={{ height: '150vh', backgroundColor: '#B9E5E8' }}>
                <div className="w-75 border shadow p-5 bg-light">
                    <Row>
                        <Col  md={6} sm={12} className='d-flex align-items-center'>
                            <img
                                src="https://static.vecteezy.com/system/resources/previews/001/991/652/non_2x/sign-in-page-flat-design-concept-illustration-icon-account-login-user-login-abstract-metaphor-can-use-for-landing-page-mobile-app-ui-posters-banners-free-vector.jpg"
                                className="img-fluid"
                                alt=""
                            />
                        </Col>
                        <Col md={6} sm={12} className="d-flex flex-column justify-content-center">
                            {state ? <h3 className="mb-4">User Registration</h3> : <h3 className="mb-4">User Login</h3>}
                            <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                                <Form.Control type="email" value={user.email} placeholder="name@example.com" onChange={(e) => setUser({ ...user, email: e.target.value })} />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                                <Form.Control type="password" value={user.password} placeholder="Password" onChange={(e) => setUser({ ...user, password: e.target.value })} />
                            </FloatingLabel>
                            {state && (
                                <>
                                    <FloatingLabel controlId="floatingInput" label="Mobile Number" className="mb-3">
                                        <Form.Control type="number" value={user.mobile} placeholder="1234567890" onChange={(e) => setUser({ ...user, mobile: e.target.value })} />
                                    </FloatingLabel>
                                    <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
                                        <Form.Control type="name" value={user.name} placeholder="Your Name" onChange={(e) => setUser({ ...user, name: e.target.value })} />
                                    </FloatingLabel>
                                    <FloatingLabel controlId="floatingInput" label="Location" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Location"
                                            value={user.location}
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
                                {state ? <Link onClick={handleRegister} className="btn btn-danger">Register</Link> : <Link onClick={handleLogin} className="btn btn-success">Login</Link>}
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

            {/* Map Modal */}
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

export default UserAuth;

