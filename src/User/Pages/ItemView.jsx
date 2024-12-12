import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { itemViewApi } from '../../Services/allApis';
import './ItemView.css';
import base_url from '../../Services/base_url';
import { addtocartApi } from '../../Services/allApis';
import toast from 'react-hot-toast';

function ItemView() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [address, setAddress] = useState('Loading location...');

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top
        fetchItem(); // Fetch item details
    }, [id]);

    const fetchItem = async () => {
        try {
            const header = {
                "Content-Type": "application/json",
                "Authorization": `Token ${sessionStorage.getItem('token')}`,
            };
            const res = await itemViewApi(header, id);
            console.log('Fetched Item:', res.data);
            setItem(res.data);

            // Fetch address from latitude and longitude
            if (res.data.location) {
                const fetchedAddress = await fetchAddress(res.data.location);
                setAddress(fetchedAddress);
            }
        } catch (error) {
            console.error('Error fetching item details:', error);
        }
    };

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

    const handleAddToCart = async () => {
        const token = sessionStorage.getItem('token');
    
        // Check if token exists
        if (!token) {
            console.error('No token found in sessionStorage');
            return;
        }
    
        const header = {
            'Content-Type': 'application/json',
            'Authorization': `Token ${sessionStorage.getItem('token')}`,
        };
    
        // Check if item exists
        if (!item) {
            console.error('No item data available');
            return;
        }
    
        // Log the item for debugging
        console.log('Item Data:', item);
    
        // Prepare the cart item
        const cartItem = {
            itemId: id, // Include the itemId (passed as a parameter from the route)
            itemimage: item.image,
            itemname: item.itemname,
            price: item.price,
            delivery: item.delivery,
            quantity: 1, // Pass quantity as a number
            chefname: item.chefname,
            chefimage: item.chefimage,
            location: item.location,
            timetomake: item.time,
            chefId: item.chefId,
        };
    
        // Log the cart item
        console.log('Cart Item:', cartItem);
    
        // Call the API
        try {
            const res = await addtocartApi(cartItem, header);
            console.log(res);
            if (res.status === 200) {
                toast.success("Item Added to Cart");
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Error adding to cart");
        }
    };

    if (!item) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Container>
        );
    }

    const chefImage = item.chefimage ? `${base_url}/uploads/${item.chefimage}` : "https://via.placeholder.com/150";

    return (
        <Container className="my-5">
            <Card className="view-card">
                <Row>
                    <Col md={4} className="d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: '#4A628A' }}>
                        <Card.Img variant="top" className="img-show" src={`${base_url}/uploads/${item.image}`} alt={item.itemname} style={{ borderRadius: '10px' }} />
                        <div className="my-3 pt-5">
                            <div className="rating">
                                {[...Array(5)].map((_, index) => (
                                    <i
                                        key={index}
                                        className={
                                            index < (item.averageRating || 0)
                                                ? "fas fa-star fa-sm text-warning"
                                                : "fas fa-star fa-sm"
                                        }
                                        style={{ fontSize: '1.5em', marginRight: '4px' }}
                                    />
                                ))}
                            </div>
                        </div>
                    </Col>
                    <Col md={8} style={{ backgroundColor: '#B9E5E8' }}>
                        <Card.Body>
                            <h3 className="mb-3">{item.itemname}</h3>
                            <div className="d-flex align-items-center mb-3">
                                <img
                                    src={chefImage}
                                    alt={item.chefname || 'Chef'}
                                    style={{
                                        width: '35px',
                                        height: '35px',
                                        borderRadius: '50%',
                                        marginRight: '10px',
                                        border: '1px solid #4A628A',
                                    }}
                                />
                                <span style={{ fontSize: '1.1rem' }}>{item.chefname || 'Unknown Chef'}</span>
                            </div>
                            <Card.Text style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{item.price}</Card.Text>
                            <Card.Text><strong>Description:</strong> {item.description}</Card.Text>
                            <Card.Text><strong>Ingredients:</strong> {item.ingredients || 'Not available'}</Card.Text>
                            <Card.Text><strong>Time to Make:</strong> {item.time} minutes</Card.Text>
                            <Card.Text><strong>Delivery Type:</strong> {item.delivery}</Card.Text>
                            <Card.Text>
                                <strong>Location:</strong>{' '}
                                <i className="fas fa-map-marker-alt"></i>{' '}
                                {address && address !== 'Unknown Location' ? (
                                    <a
                                        href={`https://www.google.com/maps?q=${item.location.replace('Lat:', '').replace('Lng:', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {address}
                                    </a>
                                ) : (
                                    'Unknown Location'
                                )}
                            </Card.Text>
                            <div className="d-flex justify-content-between my-3">
                                <Button
                                    variant="success"
                                    href={`https://wa.me/${item.whatsapp}`}
                                    target="_blank"
                                    className="me-2"
                                >
                                    <i className="fab fa-whatsapp"></i> Chat with Chef
                                </Button>
                                <Button variant="primary" className="me-2" onClick={handleAddToCart}>Add to Cart</Button>
                            </div>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
}

export default ItemView;
