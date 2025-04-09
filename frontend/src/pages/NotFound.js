import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-container text-center">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2>Page Not Found</h2>
        <p className="not-found-message">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary mt-3">
          <i className="fas fa-home mr-2"></i> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;