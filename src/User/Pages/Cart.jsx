import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { getCartApi, deleteCartApi, editCartApi } from '../../Services/allApis';
import base_url from '../../Services/base_url';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    getCart();
  }, []);

  const nav = useNavigate();

  const getCart = async () => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Token ${sessionStorage.getItem('token')}`,
    };

    try {
      const res = await getCartApi(headers);
      if (res.status === 200) {
        setCartItems(res.data);
        console.log('Fetched cart data:', res.data);
      } else {
        console.error('Error fetching data:', res);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      toast.error('Quantity cannot be less than 1');
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleDelete = async (id) => {
    const header = {
      'Content-Type': 'application/json',
      Authorization: `Token ${sessionStorage.getItem('token')}`,
    };
    try {
      const res = await deleteCartApi(id, header);
      if (res.status === 200) {
        toast.success('Item Deleted!!');
        getCart();
      } else {
        toast.warning('Something went wrong!!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCheckout = async () => {
    const header = {
      'Content-Type': 'application/json',
      Authorization: `Token ${sessionStorage.getItem('token')}`,
    };

    try {
      const body = cartItems.map((item) => ({
        id: item._id,
        itemId: item.itemId,
        quantity: item.quantity,
      }));

      const res = await editCartApi(header, body);
      if (res.status === 200) {
        nav('/checkout')
      } else {
        toast.error('Failed to update cart. Please try again!');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('An error occurred while processing the checkout.');
    }
  };

  return (
    <div className="container my-4">
      <h2>Shopping Cart</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => {
            const itemImage = `${base_url}/uploads/${item.itemimage}`;
            return (
              <tr key={item._id}>
                <td className="cart-image">
                  <img
                    src={itemImage}
                    alt={item.itemname}
                    className="img-fluid"
                  />
                </td>
                <td className="cart-title">{item.itemname}</td>
                <td className="cart-price">₹{parseFloat(item.price).toFixed(2)}</td>
                <td className="cart-quantity">
                  <Form.Control
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item._id, parseInt(e.target.value, 10))
                    }
                    className="quantity-input"
                  />
                </td>
                <td className="cart-subtotal">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                <td className="cart-actions">
                  <Button variant="danger" onClick={() => handleDelete(item._id)} className="btn-delete">
                    <i className="fa-solid fa-trash"></i>
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="text-end">
        <h5>Total Amount: ₹{calculateTotal().toFixed(2)}</h5>
        <Button variant="success" onClick={handleCheckout}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

export default Cart;
