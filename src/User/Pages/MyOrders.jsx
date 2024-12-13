import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Badge, Button, Row, Col, Spinner } from 'react-bootstrap';
import { getUserOrderApi, cancelOrderApi, addRatingApi } from '../../Services/allApis';
import { StatusResponseContext } from '../../Contextapi/ChefContextApi';
import toast from 'react-hot-toast';
import base_url from '../../Services/base_url';

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState({});
    const { StatusResponse } = useContext(StatusResponseContext);

    useEffect(() => {
        fetchOrders();
    }, [StatusResponse]);

    useEffect(() => {
        console.log("StatusResponse changed:", StatusResponse);
    }, [StatusResponse]);

    const fetchOrders = async () => {
        setLoading(true); 
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Token ${sessionStorage.getItem('token')}`,
        };

        try {
            const res = await getUserOrderApi(headers);
            if (res.status === 200) {
                const ordersWithAddress = await Promise.all(
                    res.data.map(async (order) => ({
                        ...order,
                        address: await fetchAddress(order.location),
                    }))
                );

                setOrders(ordersWithAddress.filter((order) => !order.cancelled));
            } else {
                toast.error('Failed to fetch orders.');
                console.error('Order Fetch Error:', res);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('An error occurred while fetching orders.');
        } finally {
            setLoading(false); 
        }
    };

    const fetchAddress = async (location) => {
        try {
            const latLngMatch = location.match(/Lat:\s*([-+]?[0-9]*\.?[0-9]+),\s*Lng:\s*([-+]?[0-9]*\.?[0-9]+)/);
            if (latLngMatch) {
                const [lat, lng] = [latLngMatch[1], latLngMatch[2]];
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                const data = await response.json();
                const { road, city, town, village, state, postcode } = data?.address || {};
                return `${road || ''} ${(town || village || city) || ''}, ${state || ''}, ${postcode || ''}`.trim();
            }
        } catch (error) {
            console.error('Error fetching address:', error);
        }
        return 'Unknown Location';
    };

    const handleCancelOrder = async (id) => {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Token ${sessionStorage.getItem('token')}`,
        };

        try {
            const res = await cancelOrderApi(id, headers);
            if (res.status === 200) {
                toast.success('Order cancelled successfully.');
                setOrders((prev) => prev.filter((order) => order._id !== id));
            } else {
                toast.error('Failed to cancel order.');
                console.error('Cancel Order Error:', res);
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error('An error occurred while cancelling the order.');
        }
    };

    const handleRatingChange = (id, value) => {
        setRating((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleRatingSubmit = async (itemId) => {
        const ratingValue = rating[itemId];
        if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
            toast.error('Rating must be a number between 1 and 5');
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Token ${sessionStorage.getItem('token')}`,
        };

        try {
            const res = await addRatingApi(itemId, { rating: ratingValue }, headers);
            if (res.status === 200) {
                toast.success('Rating submitted successfully.');
            } else {
                toast.error('Failed to submit rating.');
                console.error('API Error Response:', res.data);
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error('An error occurred while submitting the rating.');
        }
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const calculateTotalPrice = () =>
        orders.reduce((total, order) => total + order.price * order.quantity, 0);

    return (
        <Container className="my-5">
            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="dark" />
                </div>
            ) : (
                <>
                    <h2 className="mb-4">My Orders</h2>
                    <Row className="mb-4">
                        <Col>
                            <h5>
                                Total Orders: <Badge bg="info">{orders.length}</Badge>
                            </h5>
                        </Col>
                        <Col>
                            <h5>
                                Total Price: <Badge bg="success">₹{calculateTotalPrice()}</Badge>
                            </h5>
                        </Col>
                    </Row>
                    <Table striped bordered hover responsive className="text-center">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Item Image</th>
                                <th>Item Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th>Payment Status</th>
                                <th>Chef Name</th>
                                <th>Delivery Type</th>
                                <th>Order Time</th>
                                <th>Location</th>
                                <th>Rating</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={order._id || index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img
                                            src={`${base_url}/uploads/${order.itemimage}`}
                                            alt={order.itemname}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td>{order.itemname}</td>
                                    <td>₹{order.price}</td>
                                    <td>{order.quantity}</td>
                                    <td>
                                        <Badge bg={order.orderStatus === 'Delivered' ? 'success' : 'danger'}>
                                            {order.orderStatus}
                                        </Badge>
                                    </td>
                                    <td>{order.paymentStatus}</td>
                                    <td>{order.chefname}</td>
                                    <td>{order.delivery}</td>
                                    <td>{formatDateTime(order.currentTime)}</td>
                                    <td>
                                        <a
                                            href={`https://www.google.com/maps?q=${order.location.replace('Lat:', '').replace('Lng:', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {order.address || 'Unknown Location'}
                                        </a>
                                    </td>
                                    <td>
                                        {[...Array(5)].map((_, i) => (
                                            <i
                                                key={i}
                                                className={`fas fa-star ${i < (rating[order.itemId] || 0) ? 'text-warning' : 'text-dark'}`}
                                                onClick={() => handleRatingChange(order.itemId, i + 1)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        ))}
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => handleRatingSubmit(order.itemId)}
                                        >
                                            Submit
                                        </Button>
                                    </td>
                                    <td>
                                    {order.orderStatus !== 'Delivered' && (
                                        <Button
                                         variant="danger"
                                         size="sm"
                                            onClick={() => handleCancelOrder(order._id)}
                                     >
                                         Cancel Order
                                         </Button>
)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
        </Container>
    );
}

export default MyOrders;
