import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, FloatingLabel } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet-control-geocoder";
import { editUserApi } from "../../Services/allApis";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import base_url from "../../Services/base_url";

function UserAccount() {
  const [user, setUser] = useState({
    userImage: sessionStorage.getItem("userImage") || "",
    name: sessionStorage.getItem("name") || "",
    email: sessionStorage.getItem("email") || "",
    mobile: sessionStorage.getItem("mobile") || "",
    location: sessionStorage.getItem("location") || "",
  });

  const [showMapModal, setShowMapModal] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser({ ...user, userImage: file });
    }
  };

  const handleLocationUpdate = (lat, lng) => {
    const updatedLocation = `Lat: ${lat}, Lng: ${lng}`;
    setUser({ ...user, location: updatedLocation });
    setShowMapModal(false);
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        handleLocationUpdate(e.latlng.lat, e.latlng.lng);
      },
    });

    return user.location ? (
      <Marker position={[parseFloat(user.location.split(", ")[0].split(": ")[1]), parseFloat(user.location.split(", ")[1].split(": ")[1])]} />
    ) : null;
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

      return () => {
        map.removeControl(searchControl);
      };
    }, [map]);

    return null;
  }

  const profileImage = () => {
    if (user.userImage instanceof File) {
      return URL.createObjectURL(user.userImage);
    } else if (sessionStorage.getItem("userImage")) {
      return `${base_url}/uploads/${sessionStorage.getItem("userImage")}`;
    } else {
      return "https://via.placeholder.com/150";
    }
  };

  const handleUserUpdation = async () => {
    const { name, email, mobile, location, userImage } = user;

    if (!name || !email || !mobile || !location || !userImage) {
      toast.error("Please enter valid data");
      return;
    }

    try {
      const header = {
        Authorization: `Token ${sessionStorage.getItem("token")}`,
      };

      if (user.userImage instanceof File) {
        const fd = new FormData();
        fd.append("name", name);
        fd.append("email", email);
        fd.append("mobile", mobile);
        fd.append("location", location);
        fd.append("userImage", userImage);

        const res = await editUserApi(fd, { ...header, "Content-Type": "multipart/form-data" });
        if (res.status === 200) {
          toast.success("Account updated");
          sessionStorage.clear();
          navigate("/userauth");
        } else {
          throw new Error("Account updation failed!");
        }
      } else {
        const res = await editUserApi(user, { ...header, "Content-Type": "application/json" });
        if (res.status === 200) {
          toast.success("Account updated");
          sessionStorage.clear();
          navigate("/");
        } else {
          throw new Error("Account updation failed!");
        }
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  return (
    <>
      <div className="container mt-5">
        <h2 className="mb-4">Edit User Account</h2>
        <Row>
          <Col md={6} sm={12}>
            <FloatingLabel controlId="floatingInput" label="Email Address" className="mb-3">
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </FloatingLabel>
            <FloatingLabel controlId="floatingInput" label="Mobile Number" className="mb-3">
              <Form.Control
                type="number"
                placeholder="1234567890"
                value={user.mobile}
                onChange={(e) => setUser({ ...user, mobile: e.target.value })}
              />
            </FloatingLabel>
            <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Your Name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </FloatingLabel>
            <FloatingLabel controlId="floatingInput" label="Location" className="mb-3">
              <Form.Control type="text" placeholder="Location" value={user.location} readOnly />
            </FloatingLabel>
            <Button className="btn btn-primary mb-3" onClick={() => setShowMapModal(true)}>
              Set Location
            </Button>
            {locationError && <p className="text-danger">{locationError}</p>}
          </Col>
          <Col md={6} sm={12} className="text-center">
            <img
              src={profileImage()}
              alt="User"
              className="img-fluid rounded-circle border"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload Profile Picture</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button className="btn btn-success" onClick={handleUserUpdation}>
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
    </>
  );
}

export default UserAccount;
