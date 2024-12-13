import React, { useState, useContext, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Row, Col } from 'react-bootstrap';
import './AddItems.css';
import { getItemResponseContext } from '../../../Contextapi/ContextApi';
import { editItemApi } from '../../../Services/allApis';
import { toast } from 'react-hot-toast';
import base_url from '../../../Services/base_url';

function EditItems({ item }) {
    const [show, setShow] = useState(false);
    const [data, setData] = useState({ ...item });
    const [preview, setPreview] = useState("");
    const { getResponse, setGetResponse } = useContext(getItemResponseContext);

    useEffect(() => {
        if (data.image && data.image.type) {
            setPreview(URL.createObjectURL(data.image));
        } else {
            setPreview(`${base_url}/uploads/${item.image}`);
        }
    }, [data.image]);

    useEffect(() => 
      { setData({ ...item });
     setPreview(`${base_url}/uploads/${item.image}`); },
     [item,getResponse]);
  
    const handleEdit = async () => {
        const { image, itemname, price, ingredients, time, delivery, description, category } = data;

        if (!image || !itemname || !price || !ingredients || !time || !delivery || !description || !category) {
            toast.warning("Invalid Input");
            return;
        }

        try {
            let res;

            // If image is updated
            if (data.image?.type) {
                const fd = new FormData();
                fd.append("image", image);
                fd.append("itemname", itemname);
                fd.append("price", price);
                fd.append("ingredients", ingredients);
                fd.append("time", time);
                fd.append("delivery", delivery);
                fd.append("description", description);
                fd.append("category", category);

                const header = {
                    "Content-Type":"multipart/formdata",
                    "Authorization": `Token ${sessionStorage.getItem('token')}`
                };

                res = await editItemApi(item._id, header, fd);
            } else {
                // If image is not updated
                const body = { image, itemname, price, ingredients, time, delivery, description, category };
                const header = {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${sessionStorage.getItem('token')}`
                };

                res = await editItemApi(item._id, header, body);
            }

            if (res.status === 200) {
                toast.success("Item Updated!!");
               
                setGetResponse(prev => prev.map(i => (i._id === item._id ? res.data : i)));
                handleClose();
            } else {
                toast.error("Updation failed!!");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    const handleClose = () => {
        setShow(false);
        setData({ ...item }); // Reset to original item data on close
        setPreview(`${base_url}/uploads/${item.image}`);
    };

    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="secondary" size="sm" className="me-2" onClick={handleShow}>
                Edit
            </Button>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                className="modal-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={12} md={4} className="d-flex align-items-center justify-content-center">
                            <div className="add-image">
                                <label className="custom-file-upload">
                                    <input
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={(e) => setData({ ...data, image: e.target.files[0] })}
                                    />
                                    <img
                                        style={{ cursor: "pointer" }}
                                        src={preview}
                                        alt="Item Preview"
                                        className="img-fluid"
                                    />
                                </label>
                            </div>
                        </Col>
                        <Col sm={12} md={8}>
                            <FloatingLabel controlId="floatingInput" label="Item Name" className="mb-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Item Name"
                                    value={data.itemname || ""}
                                    onChange={(e) => setData({ ...data, itemname: e.target.value })}
                                />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingPrice" label="₹ Price" className="mb-2">
                                <Form.Control
                                    type="number"
                                    placeholder="Price"
                                    value={data.price || ""}
                                    onChange={(e) => setData({ ...data, price: e.target.value })}
                                />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingIngredients" label="Ingredients" className="mb-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Ingredients"
                                    value={data.ingredients || ""}
                                    onChange={(e) => setData({ ...data, ingredients: e.target.value })}
                                />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingTime" label="Time to make (In Minutes)" className="mb-2">
                                <Form.Control
                                    type="number"
                                    placeholder="Time to make"
                                    value={data.time || ""}
                                    onChange={(e) => setData({ ...data, time: e.target.value })}
                                />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingDelivery" label="Delivery Type" className="mb-2">
                                <Form.Select
                                    aria-label="Floating label select example"
                                    value={data.delivery || ""}
                                    onChange={(e) => setData({ ...data, delivery: e.target.value })}
                                >
                                    <option>Choose Any One</option>
                                    <option value="Door Step Delivery">Door Step Delivery</option>
                                    <option value="Self Pickup">Self Pickup</option>
                                </Form.Select>
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingDescription" label="Description" className='mb-2'>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Description"
                                    style={{ height: "80px" }}
                                    value={data.description || ""}
                                    onChange={(e) => setData({ ...data, description: e.target.value })}
                                />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingCategory" label="Select Category" className="mb-2">
                                <Form.Select
                                    aria-label="Floating label select example"
                                    name="category"
                                    value={data.category || ""}
                                    onChange={(e) => setData({ ...data, category: e.target.value })}
                                >
                                    <option value=""></option>
                                    <option value="Veg">Veg</option>
                                    <option value="Non-veg">Non-veg</option>
                                    <option value="Rice items">Rice items</option>
                                    <option value="Beverages">Beverages</option>
                                </Form.Select>
                            </FloatingLabel>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="p-3">
                    <Button variant="outline-danger" className="mx-2 px-4 py-2" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" className="mx-2 px-4 py-2" onClick={handleEdit}>
                        Update Item
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditItems;
