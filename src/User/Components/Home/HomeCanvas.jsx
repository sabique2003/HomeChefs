import React, { useState,useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import { tokenContext } from '../../../Contextapi/TokenContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function HomeCanvas({ name, ...props }) {
    const [show, setShow] = useState(false);
    const {tokenStatus,setTokenStatus}=useContext(tokenContext)
    const nav=useNavigate()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleLogout=()=>{
        sessionStorage.clear()
        toast.success("User Logged Out")
        setTokenStatus(false)
        nav('/')
      }

    return (
        <>
            <Button variant="light" onClick={handleShow}>
                <i className="fa-solid fa-bars" />
            </Button>
            <Offcanvas show={show} onHide={handleClose} {...props} placement='end' style={{ backgroundColor: '#B9E5E8' }}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>HomeChefs</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="d-flex flex-column" style={{ backgroundColor: '#DFF2EB' }}>
                    <Link to='/cart' className='btn'>Cart</Link>
                    <hr />
                    <Link to='/userorder' className='btn'>My Orders</Link>
                    <hr />
                    <Link to='/useracc' className='btn'>My Account</Link>
                    <hr />
                    <Link className='btn mt-auto' onClick={handleLogout}><hr /><i className="fa-solid fa-arrow-right-from-bracket me-2" style={{color: "#000000",}} />Sign Out</Link>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default HomeCanvas;
