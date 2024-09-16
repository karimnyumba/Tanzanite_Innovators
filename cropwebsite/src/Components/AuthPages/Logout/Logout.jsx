import { useEffect } from 'react';
import './Logout.css'
import { useNavigate } from 'react-router-dom';

const Logout = ({ setToken, setUserId }) => {
  const navigate = useNavigate();

  useEffect(() => {
    setToken('');
    setUserId('');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  }, [setToken, setUserId, navigate]);

  return null;
};

export default Logout;
