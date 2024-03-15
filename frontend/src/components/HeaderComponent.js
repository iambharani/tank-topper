import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Icon } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from './../actions/authActions';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirects
import 'semantic-ui-css/semantic.min.css';
import './HeaderComponent.css';

const HeaderComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Instantiate useNavigate for redirects

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch the logoutUser action
    localStorage.removeItem('user'); // Clear user from localStorage
    setIsLoggedIn(false); // Update the isLoggedIn state
    navigate('/'); // Redirect to the home/welcome page
  };

  return (
    <Menu className="custom-menu">
    <Menu.Item name='home' onClick={() => navigate('/')} className="custom-menu-item">
      <Icon name='home' /> Home
    </Menu.Item>

      {isLoggedIn ? (
        <Menu.Menu position='right'>
          <Dropdown item icon='user' simple>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate('/dashboard')}>
                Profile Settings
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      ) : (
        <Menu.Menu position='right'>
          <Menu.Item name='login' onClick={() => navigate('/login')}>Login</Menu.Item>
          <Menu.Item name='signup' onClick={() => navigate('/signup')}>Signup</Menu.Item>
        </Menu.Menu>
      )}
    </Menu>
  );
};

export default HeaderComponent;
