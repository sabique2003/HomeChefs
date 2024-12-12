import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { allItemsApi } from '../../../Services/allApis';
import base_url from '../../../Services/base_url';

function CategoryPage() {
    const { category } = useParams(); // Extract category name from the route parameter
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            const header = {
                "Content-Type": "application/json",
                "Authorization": `Token ${sessionStorage.getItem('token')}`,
            };
            const res = await allItemsApi(header);
            if (res.status === 200) {
                const filteredItems = res.data.filter((item) => item.category === category);
                setItems(filteredItems);
            }
            setLoading(false);
        };
        fetchItems();
    }, [category]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="secondary" />
            </div>
        );
    }

    return (
        <Container className="py-3 mt-3">
            <h3 className="mb-4">{category}</h3>
            <Row>
                {items.map((item, idx) => (
                    <Col key={idx} xs={12} sm={6} md={4} lg={2}>
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
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default CategoryPage;
