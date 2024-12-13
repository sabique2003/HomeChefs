import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Form, Container } from "react-bootstrap";
import { getCartApi, newOrderApi, razorPayApi, deleteOrderApi } from "../../Services/allApis";
import base_url from "../../Services/base_url";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

const CheckOut = () => {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${sessionStorage.getItem("token")}`,
      };
      const res = await getCartApi(headers);
      if (res.status === 200 && Array.isArray(res.data)) {
        setCartItems(res.data);
      } else {
        throw new Error("Failed to fetch cart items.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load cart items.");
    }
  };

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePaymentSelection = (e) => setPaymentMethod(e.target.value);

  const handleDelete = async (id) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${sessionStorage.getItem("token")}`,
      };
      const response = await deleteOrderApi(id, headers);
      if (response.status === 200) {
        setCartItems(cartItems.filter((item) => item._id !== id));
      } else {
        throw new Error("Failed to delete the order.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove the item.");
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const paymentStatus = paymentMethod === "Cash on Delivery" ? "Pending" : "Fulfilled";
    setLoading(true);
    try {
      if (paymentMethod === "Cash on Delivery") {
        await createOrders(paymentStatus);
        toast.success("Order placed successfully.");
        navigate("/userorder");
      } else if (paymentMethod === "Pay Now") {
        await handlePayNow();
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to complete the payment.");
    } finally {
      setLoading(false);
    }
  };

  const createOrders = async (paymentStatus) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${sessionStorage.getItem("token")}`,
      };
      const currentTime = new Date().toISOString();

      const orderResults = await Promise.all(
        cartItems.map(async (item) => {
          const orderItem = {
            ...item,
            currentTime,
            paymentStatus,
            username: sessionStorage.getItem("name"),
            contact: sessionStorage.getItem("mobile"),
          };

          const res = await newOrderApi(orderItem, headers);
          if (res.status === 200) {
            await handleDelete(item._id);
            return true;
          }
          return false;
        })
      );

      const successfulOrders = orderResults.filter(Boolean).length;
      if (successfulOrders > 0) {
        toast.success(`${successfulOrders} item(s) ordered successfully.`);
      } else {
        throw new Error("No orders were placed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to place the order.");
    }
  };

  const handlePayNow = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${sessionStorage.getItem("token")}`,
      };
      const amount = calculateTotal();
      const res = await razorPayApi({ amount, currency: "INR" }, headers);

      if (res.status === 200 && res.data.success) {
        const { id: order_id, amount, currency } = res.data.order;
        const razorpayKey = "rzp_test_4kAwk6IV0YcZCP";

        const options = {
          key: razorpayKey,
          amount,
          currency,
          order_id,
          name: "HomeChefs",
          description: "Order Payment",
          handler: async (response) => {
            try {
              await createOrders("Fulfilled");
              toast.success("Payment successful!");
              navigate("/userorder");
            } catch (error) {
              console.error("Error after payment:", error);
              toast.error("Something went wrong after payment.");
            }
          },
          modal: {
            ondismiss: () => {
              toast.error("Payment was cancelled.");
            },
          },
          prefill: {
            name: sessionStorage.getItem("name") || "Customer",
            email: sessionStorage.getItem("email") || "example@mail.com",
            contact: sessionStorage.getItem("mobile") || "9999999999",
          },
          theme: { color: "#4A628A" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        throw new Error("Razorpay order creation failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment process failed.");
    }
  };

  return (
    <Container className="my-4">
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <h2>Checkout</h2>
          {cartItems.length > 0 ? (
            <>
              <Row className="gy-4">
                {cartItems.map((item) => (
                  <Col md={6} key={item._id}>
                    <Card>
                      <Row className="g-0">
                        <Col md={4}>
                          <Card.Img
                            variant="top"
                            src={`${base_url}/uploads/${item.itemimage}`}
                            alt={item.itemname}
                          />
                        </Col>
                        <Col md={8}>
                          <Card.Body>
                            <Card.Title>{item.itemname}</Card.Title>
                            <Card.Text>
                              <div className="d-flex align-items-center">
                                <img
                                  src={`${base_url}/uploads/${item.chefimage}`}
                                  alt={item.chefname}
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "50%",
                                    marginRight: "10px",
                                  }}
                                />
                                <span>{item.chefname}</span>
                              </div>
                              <strong>Price:</strong> ₹{item.price} <br />
                              <strong>Quantity:</strong> {item.quantity} <br />
                              <strong>Time to Make:</strong> {item.timetomake}
                            </Card.Text>
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
              <hr />
              <h4>Total: ₹{calculateTotal()}</h4>
              <Form>
                <Form.Check
                  type="radio"
                  id="cashOnDelivery"
                  label="Cash on Delivery"
                  value="Cash on Delivery"
                  name="paymentMethod"
                  onChange={handlePaymentSelection}
                  checked={paymentMethod === "Cash on Delivery"}
                />
                <Form.Check
                  type="radio"
                  id="payNow"
                  label="Pay Now"
                  value="Pay Now"
                  name="paymentMethod"
                  onChange={handlePaymentSelection}
                  checked={paymentMethod === "Pay Now"}
                />
              </Form>
              <Button variant="success" className="mt-3" onClick={handleConfirmPayment}>
                Confirm Payment
              </Button>
            </>
          ) : (
            <div className="text-center mt-4">
              <p>Your cart is empty!</p>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default CheckOut;
