import { useContext } from 'react';
import React from 'react';
import './ChefHome.css'; 
import { Link } from 'react-router-dom';
import { tokenContext } from '../../Contextapi/TokenContext';
import toast from 'react-hot-toast';

function ChefHome() {
  const adminName = sessionStorage.getItem('name');

  const {tokenStatus,setTokenStatus}=useContext(tokenContext)

  const handleLogout=()=>{
    sessionStorage.clear()
    toast.success("User Logged Out")
    setTokenStatus(false)
    nav('/')
  }

  return (
    <div className="admin-home" style={{ height: "100vh", position: "relative" }}>
      <button className="signout-button" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i>
        <span>Sign Out</span>
      </button>

      <h2 className='welcome'>Welcome, {adminName}!</h2>
      <p className="welcome-message">Manage orders, view items, and update your account settings.</p>

      <div className="admin-options">
        <Link to="/analytics" className="admin-button dashboard">
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </Link>

        <Link to="/ordersforme" className="admin-button orders">
          <i className="fas fa-receipt"></i>
          <span>Orders For Me</span>
        </Link>

        <Link to="/myitems" className="admin-button items">
          <i className="fas fa-utensils"></i>
          <span>My Items</span>
        </Link>

        <Link to="/editchef" className="admin-button manage-account">
          <i className="fas fa-user-cog"></i>
          <span>Manage Account</span>
        </Link>
      </div>
    </div>
  );
}

export default ChefHome;
