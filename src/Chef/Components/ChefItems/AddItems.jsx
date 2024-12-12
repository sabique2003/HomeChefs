import React, { useState, useContext,useEffect } from 'react';
import { Button, Modal, Form, FloatingLabel, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { addItemApi } from '../../../Services/allApis';
import { getItemResponseContext } from '../../../Contextapi/ContextApi';

function AddItems() {
    const [show, setShow] = useState(false);
    const [item, setItem] = useState({
        image: "", itemname: "", price: "", ingredients: "", time: "", delivery: "", description: "",category:"",chefname:"",chefimage:""
    });
    const [preview, setPreview] = useState("");
    const { setGetResponse } = useContext(getItemResponseContext);

    useEffect(() => {
        if (item.image) {
            setPreview(URL.createObjectURL(item.image));
        } else {
            setPreview("");
        }
    }, [item.image]);

    const handleAddItem = async () => {
        const { image, itemname, price, ingredients, time, delivery, description, category } = item;
    
        if (!image || !itemname || !price || !ingredients || !time || !delivery || !description || !category) {
            toast.error("Enter Valid Input !!");
        } else {
            const chefname = sessionStorage.getItem('name'); // Retrieve chef name from sessionStorage
            const chefimage = sessionStorage.getItem('profile'); // Retrieve chef image URL from sessionStorage
            const location = sessionStorage.getItem('location'); // Retrieve chef image URL from sessionStorage
            const whatsapp = sessionStorage.getItem('whatsapp'); // Retrieve chef image URL from sessionStorage
    
            if (!chefname || !location || !whatsapp) {
                toast.error("Chef details are missing in session storage!");
                return;
            }
    
            const fd = new FormData();
            fd.append('image', image);
            fd.append('itemname', itemname);
            fd.append('price', price);
            fd.append('ingredients', ingredients);
            fd.append('time', time);
            fd.append('delivery', delivery);
            fd.append('description', description);
            fd.append('category', category);
            fd.append('chefname', chefname); // Add chef name to form data
            fd.append('chefimage', chefimage); // Add chef image URL to form data
            fd.append('whatsapp',whatsapp);
            fd.append('location',location);
    
            const header = {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
            };
            
            try {
                const res = await addItemApi(fd, header);
                console.log(res);
                if (res.status === 200) {
                    toast.success("Item Added");
                    setGetResponse(prevItems => [res.data, ...prevItems]); // Add the new item to the context
                    handleClose();
                } else {
                    toast.error("Item Adding Failed");
                }
            } catch (error) {
                console.error("Error adding item:", error);
                toast.error("An error occurred while adding the item.");
            }
        }
    };
    
    const handleClose = () => 
      {
        setShow(false)
        setItem({
          image: "", itemname: "", price: "", ingredients: "", time: "", delivery: "", description: "",category:""

        })
      };
    const handleShow = () => setShow(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem({
            ...item,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setItem({
            ...item,
            image: e.target.files[0]
        });
    };

    return (
        <>
            <div className="add-button">
                <button className="btn-53" onClick={handleShow}>
                    <div className="original">Add Item +</div>
                    <div className="letters">
                        <span>A</span>
                        <span>D</span>
                        <span>D </span>
                        <span>&nbsp;</span>
                        <span>I</span>
                        <span>T</span>
                        <span>E</span>
                        <span>M</span>
                        <span>&nbsp;</span>
                        <span>+</span>
                    </div>
                </button>
            </div>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                className='modal-lg'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={12} md={4} className="d-flex align-items-center justify-content-center">
                            <div className="add-image">
                                <label className="custum-file-upload">
                                    <input type="file" style={{ display: "none" }} onChange={handleFileChange} />
                                    <img style={{ cursor: "pointer" }} src={preview ? preview : "https://cdn-icons-png.flaticon.com/512/4147/4147103.png"} alt="" className="img-fluid" />
                                </label>
                            </div>
                        </Col>
                        <Col sm={12} md={8}>
                            <FloatingLabel controlId="floatingInput" label="Item Name" className="mb-2">
                                <Form.Control type="text" placeholder="Item Name" name="itemname" onChange={handleChange} />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingPrice" label="₹ Price" className="mb-2">
                                <Form.Control type="number" placeholder="Price" name="price" onChange={handleChange} />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingIngredients" label="Ingredients" className="mb-2">
                                <Form.Control type="text" placeholder="Ingredients" name="ingredients" onChange={handleChange} />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingTime" label="Time to make (In Minutes)" className="mb-2">
                                <Form.Control type="number" placeholder="Time to make" name="time" onChange={handleChange} />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingDelivery" label="Delivery Type" className="mb-2">
                                <Form.Select aria-label="Floating label select example" name="delivery" onChange={handleChange}>
                                    <option disabled selected>Choose any One</option>
                                    <option value="Door Step Delivery">Door Step Delivery</option>
                                    <option value="Self Pickup">Self Pickup</option>
                                </Form.Select>
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingDescription" label="Description" className='mb-2'>
                                <Form.Control as="textarea" placeholder="Leave a comment here" style={{ height: "80px" }} name="description" onChange={handleChange} />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingDelivery" label="Select Category" className="mb-2">
                                <Form.Select aria-label="Floating label select example" name="category" onChange={handleChange}>
                                    <option disabled selected>Choose any One</option>
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
                    <Button variant="primary" className="mx-2 px-4 py-2" onClick={handleAddItem}>
                        Add Item
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddItems;
