import React, { useState } from "react";
import axios from 'axios';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { setCurrentUser } from '../actions/authActions'; // Import the setCurrentUser action
import { Button, Form, Grid, Header, Segment } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

const SignupComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Use useDispatch hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { username, email, password };

    try {
      const response = await axios.post('http://localhost/tank-topper/backend/register.php', JSON.stringify(userData), {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.success) {
        dispatch(setCurrentUser(userData)); // Dispatch the setCurrentUser action with userData
        navigate("/dashboard");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed: " + (error.response?.data?.message || "An error occurred."));
    }
  };


  return (
    <div className="backDrop">
      <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            Sign up for a new account
          </Header>
          <Form size="large" onSubmit={handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Form.Input
                fluid
                icon="mail"
                iconPosition="left"
                placeholder="E-mail address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button color="teal" fluid size="large">
                Sign Up
              </Button>
            </Segment>
          </Form>
          <div style={{ marginTop: "1em" }}>
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default SignupComponent;
