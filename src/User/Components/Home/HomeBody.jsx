import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { getItemResponseContext } from '../../../Contextapi/ContextApi';
import { Link, useNavigate } from 'react-router-dom';
import { allItemsApi } from '../../../Services/allApis';
import base_url from '../../../Services/base_url';

function UserHomePage({ searchQuery }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getResponse } = useContext(getItemResponseContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem('token')) {
            getItems();
        }
    }, [getResponse]);

    const getItems = async () => {
        setLoading(true);
        const header = {
            "Content-Type": "application/json",
            "Authorization": `Token ${sessionStorage.getItem('token')}`,
        };
        const res = await allItemsApi(header);
        if (res.status === 200) {
            setItems(res.data);
        }
        setLoading(false);
    };

    const filteredItems = items.filter((item) =>
        item.itemname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.chefname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedItems = filteredItems.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="secondary" />
            </div>
        );
    }

    return (
        <Container className="py-3 mt-3" style={{ backgroundColor: '#DFF2EB' }}>
            {Object.keys(groupedItems).map((category, index) => (
                <div key={index} className="pb-5">
                    <h3 className="mb-4">{category}</h3>
                    <Row>
                        {groupedItems[category].slice(0, 6).map((item, idx) => (
                            <Col key={idx} xs={12} sm={6} md={4} lg={2}>
                                <Link to={`/item/${item._id}`} style={{ textDecoration: 'none' }}>
                                    <Card className="mb-4" style={{ cursor: 'pointer', backgroundColor: '#B9E5E8', height: '250px', width: '100%' }}>
                                        <Card.Img
                                            variant="top"
                                            src={`${base_url}/uploads/${item.image}`}
                                            alt="Card image"
                                            style={{ height: '100px', objectFit: 'cover' }}
                                        />
                                        <Card.Body>
                                            <Card.Title style={{ fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'left' }}>
                                                {item.itemname}
                                            </Card.Title>
                                            <Card.Text style={{ fontSize: '0.9rem', fontWeight: '300', textAlign: 'left', marginBottom: '0.5rem' }}>
                                                {item.chefname}
                                            </Card.Text>
                                            <div className="d-flex align-items-center" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
                                                {[...Array(5)].map((star, i) => (
                                                    <i
                                                        key={i}
                                                        className={`fa${i < item.averageRating ? 's' : 'r'} fa-star`}
                                                        style={{ color: '#916b03', fontSize: '0.9rem', marginRight: '2px' }}
                                                    ></i>
                                                ))}
                                            </div>
                                            <Card.Text
                                                style={{
                                                    fontSize: '1rem',
                                                    fontWeight: 'bold',
                                                    position: 'absolute',
                                                    bottom: '10px',
                                                    left: '15px',
                                                }}
                                            >
                                                ₹{item.price}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                    {groupedItems[category].length > 6 && (
                        <Button
                            variant="success"
                            className="mt-3"
                            onClick={() => navigate(`/category/${category}`)}
                        >
                            View More
                        </Button>
                    )}
                </div>
            ))}
        </Container>
    );
}

export default UserHomePage;
