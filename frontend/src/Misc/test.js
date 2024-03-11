import React, { useState, useEffect } from "react";
import {  Card,  Grid,  Image,  Segment,  Header,  Button,  Icon,  Modal,  Form,} from "semantic-ui-react";
import axios from "axios";
import dummyImage from "./../assets/profile.png";
import "semantic-ui-css/semantic.min.css";
import "./../App.css";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const initialUserData = {
  username: "",
  email: "",
  userImage: dummyImage,
  vehicles: [],
};

const DashboardPage = () => {
  const [userData, setUserData] = useState(initialUserData);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editVehicleData, setEditVehicleData] = useState(null);
  const API_BASE_URL = "http://localhost/tank-topper/backend/";
  const navigate = useNavigate(); 
  useEffect(() => {
    const savedUserData = localStorage.getItem("userDetails");
    if (savedUserData) {
      const parsedData = JSON.parse(savedUserData);

      if (typeof parsedData.vehicles === "string") {
        parsedData.vehicles = JSON.parse(parsedData.vehicles);
      }

      parsedData.vehicles = Array.isArray(parsedData.vehicles)
        ? parsedData.vehicles
        : [];
      parsedData.userImage = parsedData.userImage || dummyImage;

      setUserData(parsedData);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue =
        "You have unsaved changes. Are you sure you want to leave?";
    };

    if (openEditModal) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [openEditModal]);

  const handleSaveVehicle = async () => {
    let updatedVehicles;
    if (!editVehicleData.id) {
        const newVehicle = { ...editVehicleData, id: Date.now() };
        updatedVehicles = [...userData.vehicles, newVehicle];
    } else {
        updatedVehicles = userData.vehicles.map((vehicle) =>
            vehicle.id === editVehicleData.id ? editVehicleData : vehicle
        );
    }

    const isActive = updatedVehicles.length > 0;

    const updatedUserData = { ...userData, vehicles: updatedVehicles, isActive };
    
    console.log("updatedUserData", updatedUserData);
    try {
        const result = await updateUserDetails(updatedUserData);
        console.log("result", result);
        if (result && Array.isArray(result.user.vehicles)) {
            setUserData(result.user);
            localStorage.setItem("userDetails", JSON.stringify(result.user));
        } else {
            console.error("Invalid or missing vehicles data from backend");
        }
    } catch (error) {
        console.error("Failed to update user details:", error);
    }

    setEditVehicleData(null);
};


  const fetchAndUpdateUserDetails = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}getUserDetails.php?id=${userId}`);
      console.log("response",response);
      if (response.data && response.data.user.id) { 
        const updatedUserData = response.data.user;
        updatedUserData.vehicles = Array.isArray(updatedUserData.vehicles) ? updatedUserData.vehicles : JSON.parse(updatedUserData.vehicles || '[]');
        setUserData(updatedUserData);
        localStorage.setItem("userDetails", JSON.stringify(updatedUserData));
      } else {
        console.error("Failed to fetch updated user details or user not found.");
      }
    } catch (error) {
      console.error("Error fetching updated user details:", error);
    }
  };

  const updateUserDetails = async (userData) => {
    try {
      console.log('Sending userData to backend:', userData); // Debug: log data being sent
      const response = await axios.post(
        `${API_BASE_URL}updateUserDetails.php`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data && response.data.message === "User details updated successfully.") {
        await fetchAndUpdateUserDetails(userData.id);
      } else {
        console.error("Update was not successful. Backend response:", response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating user details:", error);
      throw error;
    }
  };
  
  const handleEditUser = async () => {
    try {
      const updatedUserData = await updateUserDetails(userData);
      setUserData(updatedUserData);
      setOpenEditModal(false);
    } catch (error) {
      console.error("Failed to update user details", error);
    }
  };

  const openVehicleEditModal = (vehicle) => {
    setEditVehicleData(vehicle);
  };

  const handleDeleteVehicle = async (id) => {
    const updatedVehicles = userData.vehicles.filter(
      (vehicle) => vehicle.id !== id
    );
    const updatedUserData = { ...userData, vehicles: updatedVehicles };

    try {
      const result = await updateUserDetails(updatedUserData);
      if (result && Array.isArray(result.vehicles)) {
        setUserData(result);
        localStorage.setItem("userDetails", JSON.stringify(result));
      } else {
        console.error(
          "Failed to delete vehicle: Invalid response from backend"
        );
      }
    } catch (error) {
      console.error("Failed to update user details (delete vehicle)", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditVehicleData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFuelNowClick = () => {
    navigate('/stations'); // Use the navigate function to redirect
  };

  return (
    <Segment
      padded
      style={{ minHeight: "100vh", backgroundColor: "#f4f4f4" }}
      textAlign="center"
    >
      <Grid container stackable style={{ justifyContent: "center" }}>
        <Grid.Row>
          <Grid.Column width={16}>
            <Card centered fluid>
              <Image
                bordered
                circular
                spaced
                verticalAlign="middle"
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                }}
                centered
                src={userData.userImage}
                size="small"
                className="customCircularImage"
              />
              <Card.Content>
                <Card.Header>{userData.username}</Card.Header>
                <Card.Meta>{userData.email}</Card.Meta>
              </Card.Content>
              <Card.Content extra>
                <Button
                  basic
                  color="blue"
                  onClick={() => setOpenEditModal(true)}
                >
                  Edit Profile
                </Button>
              </Card.Content>
            </Card>
            <Header
              as="h2"
              dividing
              style={{
                marginBottom: "15px !important", // Added left margin
              }}
            >
              Vehicles
              <Button
                size="medium"
                floated="right"
                circular
                onClick={() =>
                  openVehicleEditModal({
                    vehicleNumber: "",
                    fuelType: "",
                    id: null,
                  })
                }
                style={{
                  backgroundColor: "#21ba45",
                  color: "white",
                  boxShadow: "0px 2px 4px 0px rgba(34, 36, 38, 0.12)",
                  marginTop: "5px",
                  marginRight: "5px", // Added right margin
                  marginLeft: "5px",
                  marginBottom: "5px", // Added left margin
                  padding: "10px", // Added padding around the text
                }}
              >
                Add
              </Button>
            </Header>
            {userData.vehicles.length > 0 ? (
              <Grid columns={3} divided>
                {userData.vehicles.map((vehicle) => (
                  <Grid.Column key={vehicle.id}>
                    <Segment padded>
                      <Header as="h3">
                        {vehicle.vehicleNumber || "Unknown Vehicle Number"}
                      </Header>
                      <p>
                        <strong>Fuel Type:</strong> {vehicle.fuelType}
                      </p>
                      <Button
                        primary
                        style={{ margin: "10px" }}
                        onClick={() => openVehicleEditModal(vehicle)}
                      >
                        Edit
                      </Button>
                      <Button
                        color="red"
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        color="green"
                        onClick={() => handleFuelNowClick()}
                      >
                      <Icon name="fire" /> Fuel Now
                      </Button>
                    </Segment>
                  </Grid.Column>
                ))}
              </Grid>
            ) : (
              <Segment raised textAlign="center" compact color="red">
                <Header icon>
                  <Icon name="car" />
                  No vehicles added yet!
                </Header>
              </Segment>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Modal
        size="mini"
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
      >
        <Modal.Header>Edit Profile</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              label="Username"
              value={userData.username}
              name="username"
              onChange={handleUserFormChange}
            />
            <Form.Input
              label="Email"
              value={userData.email}
              name="email"
              onChange={handleUserFormChange}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
          <Button onClick={handleEditUser} primary>
            Save
          </Button>
        </Modal.Actions>
      </Modal>

      <Modal
        size="mini"
        open={Boolean(editVehicleData)}
        onClose={() => setEditVehicleData(null)}
      >
        <Modal.Header>Edit Vehicle</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              label="Vehicle Number"
              value={editVehicleData?.vehicleNumber || ""}
              name="vehicleNumber"
              onChange={handleFormChange}
            />
            <Form.Input
              label="Fuel Type"
              value={editVehicleData?.fuelType || ""}
              name="fuelType"
              onChange={handleFormChange}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setEditVehicleData(null)}>Cancel</Button>
          <Button onClick={handleSaveVehicle} primary>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    </Segment>
  );
};
export default DashboardPage;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dropdown, Container, Header, Button, List,Card } from "semantic-ui-react";
import StationCard from '../components/StationCard'; // Adjust the path as necessary

const StationList = () => {
  const [stations, setStations] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const apiUrl = "http://localhost/tank-topper/backend/getStations.php";

  useEffect(() => {
    const storedStations = localStorage.getItem("stations");
    if (storedStations) {
      setStations(JSON.parse(storedStations));
    } else {
      axios
        .get(apiUrl)
        .then((response) => {
          const result = response.data;
          if (result.status === "SCS") {
            localStorage.setItem("stations", JSON.stringify(result.data));
            setStations(result.data);
          } else {
            console.error("Failed to fetch stations:", result);
          }
        })
        .catch((error) => console.error("There was an error!", error));
    }
  }, []);

  const stateOptions = [
    ...new Set(stations.map((station) => station.STATE)),
  ].map((state) => ({
    key: state,
    text: state,
    value: state,
  }));

  const districtOptions = stations
    .filter((station) => station.STATE === selectedState)
    .map((station) => station.DISTRICT)
    .filter((value, index, self) => self.indexOf(value) === index)
    .map((district) => ({
      key: district,
      text: district,
      value: district,
    }));

  return (
    <Container>
      <Header as="h2">Stations</Header>
      <Dropdown
        placeholder="Select State"
        fluid
        selection
        options={stateOptions}
        value={selectedState}
        onChange={(_, { value }) => {
          setSelectedState(value);
          setSelectedDistrict("");
        }}
        style={{ marginBottom: '20px' }}

      />
      <Dropdown
  placeholder="Select District/City"
  fluid
  selection
  options={districtOptions} // Use districtOptions directly
  value={selectedDistrict}
  onChange={(_, { value }) => setSelectedDistrict(value)}
  disabled={!selectedState}
  style={{ marginBottom: '20px' }}

/>

{selectedState && selectedDistrict && (
  <Card.Group>
    {stations
      .filter(
        (station) =>
          station.STATE === selectedState &&
          station.DISTRICT === selectedDistrict
      )
      .map((station, index) => (
        <StationCard key={index} station={station} />
      ))}
  </Card.Group>
)}

    </Container>
  );
};
export default StationList;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/DashboardPage';
import StationList from './pages/StationList';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

function App() {
  const user = useSelector(state => state.auth.user);
  const userFromLocalStorage = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  // Check both Redux store and localStorage for user details
  const currentUser = user || userFromLocalStorage;
  return (
    <Router>
      <Routes>
        {/* No current user: Welcome Page. Logged in but isActive is false or undefined: Dashboard. Logged in and isActive is true: Stations. */}
        <Route path="/" element={!currentUser ? <WelcomePage /> : currentUser.isActive ? <Navigate replace to="/stations" /> : <Navigate replace to="/dashboard" />} />
        <Route path="/login" element={currentUser ? <Navigate replace to={currentUser.isActive ? "/stations" : "/dashboard"} /> : <LoginPage />} />
        <Route path="/signup" element={currentUser ? <Navigate replace to={currentUser.isActive ? "/stations" : "/dashboard"} /> : <SignupPage />} />
        <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Navigate replace to="/" />} />
        <Route path="/stations" element={currentUser && currentUser.isActive ? <StationList /> : <Navigate replace to="/dashboard" />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  );
}
export default App;

not redirecting tostations when fuel now button click