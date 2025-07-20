// src/pages/RedirectHome.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return null;
};

export default RedirectHome;
