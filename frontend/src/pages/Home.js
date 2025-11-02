import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/restaurants?location=New York`);
      setRestaurants(response.data.businesses || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="bi bi-star-fill"></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half"></i>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<i key={i} className="bi bi-star"></i>);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading restaurants...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-section">
        <div className="container">
          <div className="text-center">
            <h1 className="display-4 mb-3">
              BRINGING PEOPLE TOGETHER
            </h1>
            <p className="lead">
              Over great food to create outstanding memories!
            </p>
          </div>
        </div>
      </div>

      {/* Restaurants Section */}
      <div className="container my-5">
        <h2 className="section-title">OUR RESTAURANTS</h2>
        <div className="row">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <div key={restaurant.id} className="col-md-6 col-lg-4 mb-4">
                <Link to={`/restaurant/${restaurant.id}`} className="text-decoration-none">
                  <div className="restaurant-card">
                    <img
                      src={restaurant.image_url || 'https://via.placeholder.com/400x300?text=Restaurant'}
                      alt={restaurant.name}
                      className="restaurant-poster"
                    />
                    <div className="restaurant-card-body">
                      <h5 className="restaurant-title">{restaurant.name}</h5>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="star-rating">
                          {renderStars(restaurant.rating)}
                        </div>
                        <span className="rating-badge">
                          {restaurant.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-muted small mb-2">
                        <i className="bi bi-geo-alt me-1"></i>
                        {restaurant.location.city}
                      </p>
                      <p className="small mb-0">
                        {restaurant.categories?.slice(0, 2).map(cat => cat.title).join(', ')}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p className="text-muted">No restaurants found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;