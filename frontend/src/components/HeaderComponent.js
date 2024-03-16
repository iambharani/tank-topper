import React, { useEffect } from 'react';
import { Menu, Dropdown, Icon, Image} from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector
import { logoutUser } from './../actions/authActions';
import { useNavigate } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './../css/HeaderComponent.css';

import logo from './../assets/logo.png'

const HeaderComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => !!state.auth.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Menu className="custom-menu">
      <Menu.Item name='home' onClick={() => navigate('/')} className="custom-menu-item">
        {/* <Icon name='home' />  */}
        <Image src={logo} alt="Logo" size='tiny' style={{width:"35px"}} />
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
