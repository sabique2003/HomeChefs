import React, { useEffect, useState } from 'react';
import { getChefsApi } from '../../../Services/allApis'; 
import chefImg from '../../../Images/chef.jpg'

const PopularChefs = () => {
  const [chefs, setChefs] = useState([]); 
  const [error, setError] = useState(null); 

  const fetchChefs = async () => {
    try {
      const response = await getChefsApi(); 

      if (Array.isArray(response.data)) {
        setChefs(response.data.slice(0, 3)); 
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (err) {
      setError('Failed to fetch chefs. Please try again later.');
      console.error('Error fetching chefs:', err);
    }
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  return (
    <section className="popular-chefs" style={{ backgroundColor: '#b8dbc7' }}>
      <div className="container">
        <h2 className="text-center pb-5" style={{ color: '#041e47' }}>Popular Home Chefs</h2>
        <div className="row">
          {error && <div className="alert alert-danger">{error}</div>}
          {chefs.length > 0 ? (
            chefs.map((chef) => (
              <div className="col-md-4" key={chef._id}>
                <div className="card border shadow" style={{ backgroundColor: '#DFF2EB' }}>
                  {/* Use a fallback image if the image property is missing */}
                  <img 
                    src={chef.image || chefImg } 
                    className="card-img-top" 
                    alt={chef.chefname || 'Chef'} 
                  />
                  <div className="card-body">
                    <h5 className="card-title">{chef.chefname || 'Unknown Chef'}</h5>
                    <p className="card-text">WhatsApp: {chef.whatsapp || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            !error && <p className="text-center">Loading chefs...</p>
          )}
        </div>
        <div className="d-flex justify-content-center">
          <button className="btn border mb-3" onClick={fetchChefs}>View More</button>
        </div>
      </div>
    </section>
  );
};

export default PopularChefs;
