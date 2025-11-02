import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function RestaurantDetails({ user }) {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchRestaurantDetails();
    fetchReviews();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/restaurants/${id}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/reviews/${id}`);
      setReviews(response.data);
      
      if (response.data.length > 0) {
        const avg = response.data.reduce((sum, review) => sum + review.rating, 0) / response.data.length;
        setAverageRating(avg.toFixed(1));
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
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

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    try {
      if (timestamp._seconds) {
        const date = new Date(timestamp._seconds * 1000);
        return date.toLocaleDateString();
      }
      return 'Recently';
    } catch (error) {
      return 'Recently';
    }
  };

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">Restaurant not found</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="restaurant-hero" style={{ backgroundImage: `url(${restaurant.image_url})` }}>
        <div className="restaurant-hero-content">
          <div className="container">
            <Link to="/" className="btn btn-outline-warning mb-4">
              <i className="bi bi-arrow-left me-2"></i>
              Back to Restaurants
            </Link>
            
            <div className="row">
              <div className="col-md-4">
                <img
                  src={restaurant.image_url || 'https://via.placeholder.com/400x300'}
                  alt={restaurant.name}
                  className="restaurant-poster-large"
                />
              </div>
              
              <div className="col-md-8">
                <div className="restaurant-info">
                  <h1>{restaurant.name}</h1>
                  
                  <div className="restaurant-meta mb-3">
                    <span className="rating-badge me-3">
                      <i className="bi bi-star-fill"></i>
                      {restaurant.rating.toFixed(1)}/5
                    </span>
                    <span className="me-3">
                      <i className="bi bi-chat-dots me-1"></i>
                      {restaurant.review_count} reviews
                    </span>
                    <span>
                      <i className="bi bi-currency-dollar me-1"></i>
                      {restaurant.price || '$$'}
                    </span>
                  </div>

                  <div className="mb-3">
                    {restaurant.categories?.map((cat, index) => (
                      <span key={index} className="category-badge">
                        {cat.title}
                      </span>
                    ))}
                  </div>

                  <p className="lead">
                    <i className="bi bi-geo-alt text-warning me-2"></i>
                    {restaurant.location.display_address?.join(', ')}
                  </p>

                  {restaurant.phone && (
                    <p className="lead">
                      <i className="bi bi-telephone text-warning me-2"></i>
                      {restaurant.display_phone}
                    </p>
                  )}

                  {user ? (
                    <Link
                      to={`/add-review/${id}`}
                      state={{ 
                        restaurantName: restaurant.name,
                        restaurantImage: restaurant.image_url
                      }}
                      className="btn btn-warning btn-lg mt-3"
                    >
                      <i className="bi bi-pencil-square me-2"></i>
                      Write a Review
                    </Link>
                  ) : (
                    <Link to="/login" className="btn btn-outline-warning btn-lg mt-3">
                      Login to Write a Review
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container my-5">
        <div className="reviews-section">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Customer Reviews ({reviews.length})</h2>
            {reviews.length > 0 && (
              <div className="text-end">
                <h4 className="mb-0">
                  <span className="star-rating me-2">
                    {renderStars(parseFloat(averageRating))}
                  </span>
                  <span>{averageRating}/5</span>
                </h4>
              </div>
            )}
          </div>

          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div>
                    <h5 className="review-author">{review.userName || 'Anonymous'}</h5>
                    <div className="star-rating">
                      {renderStars(review.rating)}
                      <span className="ms-2">{review.rating}/5</span>
                    </div>
                  </div>
                  <small className="text-muted">
                    {formatDate(review.createdAt)}
                  </small>
                </div>
                <p className="review-text">{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              No reviews yet. Be the first to review this restaurant!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetails;