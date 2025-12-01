import React from 'react';

import { Navigate } from 'react-router-dom';

import { ADMIN_ROUTE } from '../utils/constants';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    return <Navigate to={`${ADMIN_ROUTE}/login`} replace />;
  }

  return children;
};

export default ProtectedRoute;