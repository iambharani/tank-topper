import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Icon, Modal, Button, Form } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const HeaderComponent = ({ user, onLogout, vehicles, onAddVehicle, onEditVehicle, onRemoveVehicle }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Assume a user object with an isAuthenticated method or property
    if (user && user.isAuthenticated) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  // Vehicle list dropdown items
  const vehicleDropdownItems = vehicles.map((vehicle) => ({
    key: vehicle.id,
    text: `${vehicle.make} ${vehicle.model} - ${vehicle.number}`,
    value: vehicle.id,
    onClick: () => console.log('Vehicle selected:', vehicle)
  }));

  return (
    <Menu>
      <Menu.Item name='home'>
        <Icon name='home' /> Home
      </Menu.Item>

      {isLoggedIn ? (
        <>
          <Dropdown item text='Vehicles'>
            <Dropdown.Menu>
              {vehicleDropdownItems.map((item) => (
                <Dropdown.Item key={item.key} {...item} />
              ))}
              <Dropdown.Divider />
              <Dropdown.Item onClick={onAddVehicle}>Add New Vehicle</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Menu.Menu position='right'>
            <Dropdown item icon='user' simple>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => console.log('Profile Settings')}>
                  Profile Settings
                </Dropdown.Item>
                <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </>
      ) : (
        <Menu.Menu position='right'>
          <Menu.Item name='login'>Login</Menu.Item>
          <Menu.Item name='signup'>Signup</Menu.Item>
        </Menu.Menu>
      )}
    </Menu>
  );
};

export default HeaderComponent;
