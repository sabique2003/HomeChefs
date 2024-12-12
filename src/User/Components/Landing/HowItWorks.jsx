import React from 'react'

function HowItWorks() {
  return (
    <>
     <div className="how-it-works text-center p-5" style={{backgroundColor:'#b8dbc7'}} >
    <div className="container">
      <h2 style={{color:"#041e47"}}>How It Works?</h2>
      <div className="row mt-5" style={{color:"#4A628A"}}>
        <div className="col-md-4">
          <i className="icon fas fa-search"></i>
          <h4>Browse Meals</h4>
          <p>Find delicious homemade meals in your area.</p>
        </div>
        <div className="col-md-4">
          <i className="icon fas fa-shopping-cart"></i>
          <h4>Place an Order</h4>
          <p>Select meals and place an order with ease.</p>
        </div>
        <div className="col-md-4">
          <i className="icon fas fa-utensils"></i>
          <h4>Enjoy Your Meal</h4>
          <p>Receive your meal and enjoy!</p>
        </div>
      </div>
    </div>
    <div className="text-center mt-4">
      <h2 style={{color:"#041e47"}}>Our Mission</h2>
      <p style={{textAlign:"center",color:'#4A628A'}} className='mt-3 p-4'>At HomeChefs, our mission is to celebrate the warmth and authenticity of home-cooked meals while supporting local culinary talent. We aim to bridge communities by connecting passionate home chefs with customers seeking nutritious, delicious, and affordable alternatives to restaurant food. By empowering local chefs to share their diverse cuisines and creativity, we strive to foster a sustainable food ecosystem that brings the comforts of home-cooked flavors to every doorstep.</p>
    </div>
  </div>
    </>
  )
}

export default HowItWorks