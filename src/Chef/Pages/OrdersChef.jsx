import React, { useState, useEffect, useContext } from "react";
import { Card, Container, Dropdown, DropdownButton, Badge, Spinner, Pagination } from "react-bootstrap";
import { getOrderApi, updateStatusApi, deleteUserOrderApi } from "../../Services/allApis";
import { StatusResponseContext } from "../../Contextapi/ChefContextApi";
import base_url from "../../Services/base_url";
import toast from "react-hot-toast";

function OrdersChef() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { StatusResponse, setStatusResponse } = useContext(StatusResponseContext);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${sessionStorage.getItem("token")}`,
    };

    try {
      const res = await getOrderApi(headers);
      if (res.status === 200) {
        const ordersWithAddress = await Promise.all(
          res.data.map(async (order) => {
            const address = await fetchAddress(order.location);
            return { ...order, address };
          })
        );
        setOrders(ordersWithAddress);
      } else {
        console.error("Error fetching data:", res);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddress = async (location) => {
    try {
      const latLngMatch = location.match(/Lat:\s*([-+]?[0-9]*\.?[0-9]+),\s*Lng:\s*([-+]?[0-9]*\.?[0-9]+)/);
      if (latLngMatch) {
        const lat = latLngMatch[1];
        const lng = latLngMatch[2];
        const controller = new AbortController(); // Abort signal for timeout
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout
  
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId); // Clear timeout if fetch succeeds
  
        if (!response.ok) {
          console.error(`Nominatim error: ${response.status}`);
          return 'Unknown Location';
        }
  
        const data = await response.json();
        if (data && data.address) {
          const { road, city, town, village, state, postcode } = data.address;
          const locationName = town || village || city;
          const formattedAddress = `${road || ''} ${locationName || ''}, ${state || ''}, ${postcode || ''}`.replace(/, ,| ,| ,|,,/g, '');
          return formattedAddress.trim();
        }
        return 'Unknown Location';
      } else {
        return 'Invalid Location Format';
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Error fetching location';
    }
  };
  
  const updateOrderStatus = async (id, newStatus) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${sessionStorage.getItem("token")}`,
    };
    try {
      const res = await updateStatusApi(id, newStatus, headers);
      if (res.status === 200) {
        setStatusResponse(res);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, orderStatus: newStatus } : order
          )
        );
        toast.success("Order status updated");
      } else {
        console.error("Failed to update order status:", res);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleDeleteOrder = async (id) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${sessionStorage.getItem("token")}`,
    };
    try {
      const res = await deleteUserOrderApi(id, headers);
      if (res.status === 200) {
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
        toast.success('Order deleted successfully.');
      } else {
        toast.error('Failed to delete order.');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('An error occurred while deleting the order.');
    }
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  return (
    <Container className="my-4">
      <h2>Orders for Me</h2>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="dark" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center my-5">
          <h4>No orders for you</h4>
        </div>
      ) : (
        <>
          <div className="d-flex flex-wrap gap-4">
            {currentOrders.map((order) => (
              <Card key={order._id} style={{ width: "16rem" }}>
                {order.cancelled && (
                  <Badge bg="danger" className="position-absolute" style={{ top: "10px", left: "10px" }}>
                    Cancelled Order
                  </Badge>
                )}
                <Card.Img
                  variant="top"
                  src={`${base_url}/uploads/${order.itemimage}`}
                  alt={order.itemname}
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{order.itemname}</Card.Title>
                  <Card.Text>
                    <strong>Quantity:</strong> {order.quantity} <br />
                    <strong>Price:</strong> ₹{order.price} <br />
                    <strong>Payment Status:</strong> {order.paymentStatus} <br />
                    <strong>Order Time:</strong> {formatDateTime(order.currentTime)} <br />
                    <strong>Delivery Type:</strong> {order.delivery} <br />
                    <strong>User:</strong> {order.username} <br />
                    <strong>Location:</strong>{" "}
                    <a
                      href={`https://www.google.com/maps?q=${order.location.replace('Lat:', '').replace('Lng:', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {order.address || 'Loading...'}
                    </a>{" "}
                    <br />
                    <strong>Phone:</strong> {order.contact || "N/A"}
                  </Card.Text>
                  <div className="d-flex justify-content-between mt-2">
                    <DropdownButton
                      id={`dropdown-${order._id}`}
                      title={order.orderStatus || "Just Ordered"}
                      onSelect={(status) => updateOrderStatus(order._id, status)}
                      size="sm"
                    >
                      <Dropdown.Item eventKey="Just Ordered">Just Ordered</Dropdown.Item>
                      <Dropdown.Item eventKey="Preparing">Preparing</Dropdown.Item>
                      <Dropdown.Item eventKey="Out For Delivery">Out For Delivery</Dropdown.Item>
                      <Dropdown.Item eventKey="Ready For Pickup">Ready For Pickup</Dropdown.Item>
                      <Dropdown.Item eventKey="Delivered">Delivered</Dropdown.Item>
                    </DropdownButton>
                    <button
                      size="sm"
                      className="text-danger btn"
                      onClick={() => handleDeleteOrder(order._id)}
                    >
                      <i className="fas fa-trash fa-xl"></i>
                    </button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
          <Pagination className="mt-4 justify-content-center ">
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </Container>
  );
}

export default OrdersChef;
