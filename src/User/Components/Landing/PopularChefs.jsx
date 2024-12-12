import React, { useEffect, useState } from 'react';
import chef from '../../../Images/chef.jpg'; // Fallback image if the API doesn't return one
import { getChefsApi } from '../../../Services/allApis'; // Assuming this API fetches chefs data.

const PopularChefs = () => {
  const [chefs, setChefs] = useState([]); // State to store the chefs' data
  const [error, setError] = useState(null); // State to store any error messages

  // Function to fetch chefs data
  const fetchChefs = async () => {
    
    try {
      const response = await getChefsApi(); // Call the API
      setChefs(response.data.slice(0, 3)); // Limit the results to the first 3 chefs
    } catch (err) {
      setError('Failed to fetch chefs. Please try again later.');
    }
  };

  // UseEffect to call fetchChefs when the component loads
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
            chefs.map((chef, index) => (
              <div className="col-md-4" key={index}>
                <div className="card border shadow" style={{ backgroundColor: '#DFF2EB' }}>
                  <img src={chef.image || chef} className="card-img-top" alt={chef.name} />
                  <div className="card-body">
                    <h5 className="card-title">{chef.name}</h5>
                    <p className="card-text">{chef.specialty}</p>
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
