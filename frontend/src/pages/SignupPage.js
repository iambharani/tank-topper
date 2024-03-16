import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../actions/authActions";
import { Button, Form, Grid, Header, Segment, Modal } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import "./../css/LoginPage.css";

const SignupComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [latitude, setLatitude] = useState(0);
const [longitude, setLongitude] = useState(0);
const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const [locationAccess, setLocationAccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setModalOpen(true);
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setHasLocationPermission(true);
                setModalOpen(false);
            },
            (error) => {
                console.error("Error Code = " + error.code + " - " + error.message);
                setHasLocationPermission(false);
                setModalOpen(true);
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      username,
      email,
      password,
      hasLocationPermission, // Updated to send permission flag
  };
  
    

    try {
      const response = await axios.post(
        "http://localhost/tank-topper/backend/register.php",
        JSON.stringify(userData),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        console.log("afterSignup",response.data)
        localStorage.setItem('user', JSON.stringify(response.data.user));
        dispatch(setCurrentUser(userData));
        navigate("/dashboard");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert(
        "Signup failed: " +
          (error.response?.data?.message || "An error occurred.")
      );
    }
  };

  return (
    <div className="backDrop">
      <Modal
        open={modalOpen}
        size="small"
        closeOnEscape={false}
        closeOnDimmerClick={false}
      >
        <Header icon="location arrow" content="Location Access Required" />
        <Modal.Content>
          <p>
            This application requires access to your location. Please allow
            location access to continue.
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" onClick={requestLocation}>
            Grant Access
          </Button>
        </Modal.Actions>
      </Modal>
      {locationAccess && (
        <Grid
          textAlign="center"
          style={{ height: "100vh" }}
          verticalAlign="middle"
        >
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
      )}
    </div>
  );
};

export default SignupComponent;
