import React, { useState, useEffect } from "react";
import { Row, Col, Form, FloatingLabel, Button, Modal } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import toast from "react-hot-toast";
import L from "leaflet";
import "leaflet-control-geocoder";
import { editChefApi } from "../../Services/allApis";
import { useNavigate } from "react-router-dom";
import base_url from "../../Services/base_url";

function EditChefProfile() {
  const [chef, setChef] = useState({
    profile: sessionStorage.getItem("profile") || "",
    chefname: sessionStorage.getItem("name") || "",
    email: sessionStorage.getItem("email") || "",
    whatsapp: sessionStorage.getItem("whatsapp") || "",
    location: sessionStorage.getItem("location") || "",
  });

  const [showMapModal, setShowMapModal] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const nav = useNavigate();

  const handleLocationUpdate = (lat, lng) => {
    const updatedLocation = `Lat: ${lat}, Lng: ${lng}`;
    setChef({ ...chef, location: updatedLocation });
    setShowMapModal(false);
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        handleLocationUpdate(e.latlng.lat, e.latlng.lng);
      },
    });
    return <Marker position={[chef.location.latitude || 0, chef.location.longitude || 0]} />;
  }

  function MapWithSearchControl() {
    const map = useMapEvents({});
    useEffect(() => {
      const geocoder = L.Control.Geocoder.nominatim();
      const searchControl = L.Control.geocoder({
        query: "",
        placeholder: "Search for a location...",
        geocoder,
        defaultMarkGeocode: false,
      }).addTo(map);

      searchControl.on("markgeocode", (e) => {
        const { lat, lng } = e.geocode.center;
        handleLocationUpdate(lat, lng);
        map.setView([lat, lng], 13);
      });

      return () => map.removeControl(searchControl);
    }, [map]);

    return null;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setChef({ ...chef, profile: file });
    }
  };

  const handleProfileUpdation = async () => {
    const { chefname, email, whatsapp, location, profile } = chef;

    if (!chefname || !email || !whatsapp || !location || !profile) {
      toast.error("Please Enter Valid Data");
      return;
    }

    try {
      const header = {
        Authorization: `Token ${sessionStorage.getItem("token")}`,
      };

      if (chef.profile instanceof File) {
        const fd = new FormData();
        fd.append("chefname", chefname);
        fd.append("email", email);
        fd.append("whatsapp", whatsapp);
        fd.append("location", location);
        fd.append("profile", profile);

        const res = await editChefApi(fd, { ...header, "Content-Type": "multipart/form-data" });
        if (res.status === 200) {
          toast.success("Profile Updated");
          sessionStorage.clear();
          nav("/chefauth");
        } else {
          throw new Error("Profile Updation Failed!");
        }
      } else {
        const res = await editChefApi(chef, { ...header, "Content-Type": "application/json" });
        if (res.status === 200) {
          toast.success("Profile Updated");
          sessionStorage.clear();
          nav("/chefauth");
        } else {
          throw new Error("Profile Updation Failed!");
        }
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  const profileImage = () => {
    if (chef.profile instanceof File) {
      return URL.createObjectURL(chef.profile); // For newly uploaded files
    } else if (sessionStorage.getItem("profile")) {
      return `${base_url}/uploads/${sessionStorage.getItem("profile")}`; // For existing profile in session storage
    } else {
      return "https://via.placeholder.com/150"; 
    }
  };
  
    

  return (
    <div
      className="w-100 d-flex align-items-center justify-content-center"
      style={{ height: "150vh", backgroundColor: "#7AB2D3" }}
    >
      <div className="border shadow p-5 w-75 bg-light">
        <h3 className="mb-4 text-center">Edit Chef Profile</h3>
        <Row>
          <Col md={6} sm={12}>
            <FloatingLabel controlId="floatingInput" label="Email Address" className="mb-3">
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={chef.email}
                onChange={(e) => setChef({ ...chef, email: e.target.value })}
              />
            </FloatingLabel>
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
              <Form.Control type="text" placeholder="Kitchen Location" value={chef.location} readOnly />
            </FloatingLabel>
            <Button className="btn btn-primary mb-3" onClick={() => setShowMapModal(true)}>
              Set Location
            </Button>
            {locationError && <p className="text-danger">{locationError}</p>}
          </Col>
          <Col md={6} sm={12} className="d-flex flex-column align-items-center">
            <div className="mb-3 text-center">
              <img
                src={profileImage()}
                alt="Profile"
                className="img-fluid rounded-circle border"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            </div>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload Profile Picture (Optional)</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>
            <Button className="btn btn-success w-100" onClick={handleProfileUpdation}>
              Save Changes
            </Button>
          </Col>
        </Row>
      </div>

      <Modal show={showMapModal} onHide={() => setShowMapModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Location</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "400px" }}>
          <MapContainer center={[0, 0]} zoom={12} style={{ width: "100%", height: "100%" }}>
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
    </div>
  );
}

export default EditChefProfile;
