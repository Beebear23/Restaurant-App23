import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function AddReview({ user }) {
  const { restaurantId, reviewId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    rating: 4,
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (reviewId && location.state?.review) {
      setIsEdit(true);
      setFormData({
        rating: location.state.review.rating,
        comment: location.state.review.comment
      });
    }
  }, [reviewId, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' ? Number(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    setLoading(true);

    try {
      if (isEdit) {
        await axios.put(`${API_URL}/reviews/${reviewId}`, {
          rating: formData.rating,
          comment: formData.comment,
          userId: user.uid
        });
        alert('Review updated successfully!');
        navigate('/dashboard');
      } else {
        await axios.post(`${API_URL}/reviews`, {
          restaurantId: restaurantId,
          restaurantName: location.state?.restaurantName || 'Restaurant',
          restaurantImage: location.state?.restaurantImage || '',
          userId: user.uid,
          userName: user.displayName || user.email || 'Anonymous',
          rating: Number(formData.rating),
          comment: formData.comment.trim()
        });
        
        alert('Review submitted successfully!');
        navigate(`/restaurant/${restaurantId}`);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStarInput = () => {
    return [1, 2, 3, 4, 5].map((value) => (
      <React.Fragment key={value}>
        <input
          type="radio"
          className="btn-check"
          name="rating"
          id={`rating-${value}`}
          value={value}
          checked={formData.rating === value}
          onChange={handleChange}
        />
        <label className="btn btn-outline-warning" htmlFor={`rating-${value}`}>
          <i className="bi bi-star-fill"></i> {value}
        </label>
      </React.Fragment>
    ));
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">
                {isEdit ? 'EDIT YOUR REVIEW' : 'WRITE A REVIEW'}
              </h2>

              {!isEdit && location.state?.restaurantName && (
                <div className="alert alert-info mb-4">
                  <i className="bi bi-info-circle me-2"></i>
                  Reviewing: <strong>{location.state.restaurantName}</strong>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label">Your Rating (1-5 stars)</label>
                  <div className="btn-group w-100" role="group">
                    {renderStarInput()}
                  </div>
                  <small className="text-muted d-block mt-2">
                    Selected: {formData.rating} star{formData.rating !== 1 ? 's' : ''}
                  </small>
                </div>

                <div className="mb-4">
                  <label htmlFor="comment" className="form-label">
                    Your Review
                  </label>
                  <textarea
                    className="form-control"
                    id="comment"
                    name="comment"
                    rows="6"
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="Share your dining experience..."
                    required
                  ></textarea>
                  <small className="text-muted">
                    {formData.comment.length} characters
                  </small>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-warning flex-grow-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        {isEdit ? 'Update Review' : 'Submit Review'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddReview;