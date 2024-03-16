import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../css/LoginPage.css';
import { setCurrentUser } from './../actions/authActions';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost/tank-topper/backend/login.php', {
        email,
        password,
      });

      console.log("response", response.data);

      if (response.data.success) {
        const { user } = response.data;
        dispatch(setCurrentUser(user));
        localStorage.setItem('user', JSON.stringify(user));
        alert(response.data.message);

        if (!user.isActive) {
          navigate('/dashboard');
        } else if (user.vehicles && user.vehicles.length > 0) {
          navigate('/stations');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className='backDrop'>
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='teal' textAlign='center'>
            Log-in to your account
          </Header>
          <Form size='large' onSubmit={handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                icon='user'
                iconPosition='left'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button color='teal' fluid size='large'>
                Login
              </Button>
            </Segment>
          </Form>
          <div style={{ marginTop: '1em' }}>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default LoginComponent;
