import React, { useState, useEffect } from "react";
import {
  Card,
  Grid,
  Image,
  Segment,
  Header,
  Button,
  Icon,
  Modal,
  Form,
  Dropdown,
} from "semantic-ui-react";

import axios from "axios";
import dummyImage from "./../assets/profile.png";
import "semantic-ui-css/semantic.min.css";
import './DashboardPage.css'
// import "./../App.css";
import { useNavigate } from "react-router-dom";

const initialUserData = {
  username: "",
  email: "",
  userImage: dummyImage,
  vehicles: [],
};

const fuelTypeOptions = [
  { key: "diesel", text: "Diesel", value: "diesel" },
  { key: "petrol", text: "Petrol", value: "petrol" },
  { key: "cng", text: "CNG", value: "cng" },
  { key: "cng+petrol", text: "CNG + Petrol", value: "cng+petrol" },
];

const DashboardPage = () => {
  const [userData, setUserData] = useState(initialUserData);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editVehicleData, setEditVehicleData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);

  const API_BASE_URL = "http://localhost/tank-topper/backend/";
  const navigate = useNavigate();
  // const [showLocationPermissionModal, setShowLocationPermissionModal] =
    useState(false);

  useEffect(() => {
    // setShowLocationPermissionModal(true);

    const savedUserData = localStorage.getItem("user");
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

  async function fetchLocation() {
    setShowLocationPermissionModal(false); // Close the modal

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Geocoding logic here (as previously described)
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

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
    const updatedUserData = {
      ...userData,
      vehicles: updatedVehicles,
      isActive,
    };
    try {
      const result = await updateUserDetails(updatedUserData);
      if (result && Array.isArray(result.user.vehicles)) {
        setUserData(result.user);
        localStorage.setItem("user", JSON.stringify(result.user));
      }
    } catch (error) {
      console.error("Failed to update user details:", error);
    }
    setEditVehicleData(null);
    setOpenEditModal(false);
  };
  const fetchAndUpdateUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}getUserDetails.php?id=${userId}`
      );
      if (response.data && response.data.user.id) {
        const updatedUserData = response.data.user;
        updatedUserData.vehicles = Array.isArray(updatedUserData.vehicles)
          ? updatedUserData.vehicles
          : JSON.parse(updatedUserData.vehicles || "[]");
        setUserData(updatedUserData);
        localStorage.setItem("user", JSON.stringify(updatedUserData));
      }
    } catch (error) {
      console.error("Error fetching updated user details:", error);
    }
  };
  const updateUserDetails = async (userData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}updateUserDetails.php`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (
        response.data &&
        response.data.message === "User details updated successfully."
      ) {
        await fetchAndUpdateUserDetails(userData.id);
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
      setOpenEditProfileModal(false); // Updated to use the new state
    } catch (error) {
      console.error("Failed to update user details", error);
    }
  };
  
  const openVehicleEditModal = (vehicle) => {
    setEditVehicleData(vehicle);
    setOpenEditModal(true);
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
        localStorage.setItem("user", JSON.stringify(result));
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
    console.log("Attempting to navigate to /stations");
    navigate("/stations");
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
  onClick={() => setOpenEditProfileModal(true)} // Updated to use the new state
>
  Edit Profile
</Button>

              </Card.Content>
            </Card>
            <Header
              as="h2"
              dividing
              style={{ marginBottom: "15px !important" }}
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
                  marginRight: "5px",
                  marginLeft: "5px",
                  marginBottom: "5px",
                  padding: "10px",
                }}
              >
                Add
              </Button>
            </Header>
            {userData.vehicles.length > 0 ? (
              <Grid columns={3} divided>
                {userData.vehicles.map((vehicle) => (
                  <Grid.Column key={vehicle.id}>
                    <Segment>
                      <Header as="h4">{vehicle.vehicleNumber}</Header>
                      <p>{vehicle.fuelType}</p>
                      <Button
                        icon="edit"
                        onClick={() => openVehicleEditModal(vehicle)}
                      />
                      <Button
                        icon="trash"
                        color="red"
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                      />
                    </Segment>
                  </Grid.Column>
                ))}
              </Grid>
            ) : (
              <p>No vehicles added yet.</p>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        size="tiny"
      >
        <Modal.Header>Edit Vehicle</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Vehicle Number</label>
              <input
                placeholder="Vehicle Number"
                name="vehicleNumber"
                value={editVehicleData?.vehicleNumber || ""}
                onChange={handleFormChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Fuel Type</label>
              <Dropdown
                placeholder="Select Fuel Type"
                fluid
                selection
                options={fuelTypeOptions}
                name="fuelType"
                value={editVehicleData?.fuelType || ""}
                onChange={(e, { name, value }) =>
                  handleFormChange({ target: { name, value } })
                }
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => setOpenEditModal(false)}>
            Cancel
          </Button>
          <Button
            content="Save"
            labelPosition="right"
            icon="checkmark"
            onClick={handleSaveVehicle}
            positive
          />
        </Modal.Actions>
      </Modal>

      <Modal
  open={openEditProfileModal} // Updated to use the new state
  onClose={() => setOpenEditProfileModal(false)} // Updated to use the new state
  size="tiny"
>

        <Modal.Header>Edit Profile</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <div className="image-upload-container">
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
                  src={userData.userImage || "default_profile_image_url"}
                  size="small"
                  className="customCircularImage"
                />
                <div className="upload-icon">
                  <Icon name="upload" />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ cursor: "pointer" }} // Ensures the cursor is a pointer, indicating this is clickable
                  />
                </div>
              </div>

              <label>Username</label>
              <input
                placeholder="Username"
                name="username"
                value={userData.username}
                onChange={handleUserFormChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Email</label>
              <input
                placeholder="Email"
                name="email"
                value={userData.email}
                onChange={handleUserFormChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="black"
            onClick={() => setOpenEditProfileModal(false)}
          >
            Cancel
          </Button>
          <Button
            content="Save"
            labelPosition="right"
            icon="checkmark"
            onClick={handleEditUser}
            positive
          />
        </Modal.Actions>
      </Modal>
      {/* <Modal
        open={showLocationPermissionModal}
        onClose={() => setShowLocationPermissionModal(false)}
        size="tiny"
      >
        <Modal.Header>Location Access Required</Modal.Header>
        <Modal.Content>
          <p>
            We need access to your location to provide localized services. Do
            you agree to share your location with us?
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            onClick={() => setShowLocationPermissionModal(false)}
          >
            No Thanks
          </Button>
          <Button positive onClick={fetchLocation}>
            Yes, Proceed
          </Button>
        </Modal.Actions>
      </Modal> */}

      {userData && userData.isActive && (
        <Button
          primary
          onClick={handleFuelNowClick}
          style={{ marginTop: "20px" }}
        >
          Fuel Now
        </Button>
      )}
    </Segment>
  );
};

export default DashboardPage;
