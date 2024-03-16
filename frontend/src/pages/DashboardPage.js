import React, { useState, useEffect } from "react";
import { Card, Grid, Image, Segment, Header, Button } from "semantic-ui-react";
import axios from "axios";
// import dummyImage from "./../assets/profile.png";
import "semantic-ui-css/semantic.min.css";
import "./../css/DashboardPage.css";
import Loader from "./../components/Loader";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "./../components/EditProfileModal";
import EditVehicleModal from "./../components/EditVehicleModal";
const dummyImage = `https://avatar.iran.liara.run/public/29`; // Using the CDN link for the dummy image

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
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = "http://localhost/tank-topper/backend/";
  const navigate = useNavigate();
  useState(false);

  useEffect(() => {
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
      console.log(parsedData);
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

  const handleSaveProfile = async () => {
    setIsLoading(true); // Assuming you have a state to manage loading state

    const formData = new FormData();
    formData.append("id", userData.id);
    formData.append("username", userData.username);
    formData.append("email", userData.email);
    // Append the image file if selected
    if (selectedFile) {
      formData.append("userImage", selectedFile);
    }
    // Append other user details as needed

    try {
      const response = await axios.post(
        `${API_BASE_URL}updateUserDetails.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.user) {
        // Assuming the response will include updated user data
        setUserData(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        // Handle success
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating user details:", error);
      setIsLoading(false);
      // Handle error
    }
  };

  const fetchAndUpdateUserDetails = async (userId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}getUserDetails.php?id=${userId}`
      );
      if (response.data && response.data.user.id) {
        setIsLoading(false);
        const updatedUserData = response.data.user;
        updatedUserData.vehicles = Array.isArray(updatedUserData.vehicles)
          ? updatedUserData.vehicles
          : JSON.parse(updatedUserData.vehicles || "[]");
        setUserData(updatedUserData);
        localStorage.setItem("user", JSON.stringify(updatedUserData));
      }
    } catch (error) {
      console.error("Error fetching updated user details:", error);
      setIsLoading(false);
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

  return isLoading ? (
    <Loader />
  ) : (
    <div className="centeredContent">
      <Grid
        container
        stackable
        className="centeredContent"
        style={{ maxWidth: "900px" }}
      >
        <Grid.Row>
          <Grid.Column width={16}>
            <Card centered fluid className="profile-card">
              <Image
                bordered
                circular
                spaced
                verticalAlign="middle"
                src={userData && userData.userImage ? userData.userImage : dummyImage}
                size="small"
                className="customCircularImage customImageStyle"
              />

              <Card.Content className="profile-card-content">
                <Card.Header className="profile-card-header">
                  {userData.username}
                </Card.Header>
                <Card.Meta className="profile-card-meta">
                  {userData.email}
                </Card.Meta>
              </Card.Content>
              <Card.Content extra className="profile-card-content">
                <Button
                  basic
                  color="blue"
                  onClick={() => setOpenEditProfileModal(true)}
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
                className="addButton"
              >
                Add
              </Button>
            </Header>
            {userData.vehicles.length > 0 ? (
            <Grid columns={3} divided>
            {userData.vehicles.map((vehicle) => (
             <Grid.Column key={vehicle.id}>
             <Segment className="segment-card">
               <div className="segment-content">
                 <div className="vehicle-info">
                   <Header as="h4">{vehicle.vehicleNumber}</Header>
                   <p>{vehicle.fuelType}</p>
                 </div>
                 <div className="segment-action-buttons">
                   <div className="edit-delete-buttons">
                     <Button
                       icon="edit"
                       onClick={() => openVehicleEditModal(vehicle)}
                     />
                     <Button
                       icon="trash"
                       color="red"
                       onClick={() => handleDeleteVehicle(vehicle.id)}
                     />
                   </div>
                   {/* "Fuel Now" button as a separate action */}
                   <Button
                     primary
                     className="fuel-now-button"
                     onClick={() => handleFuelNowClick(vehicle.fuelType)}
                   >
                     Fuel Now
                   </Button>
                 </div>
               </div>
             </Segment>
           </Grid.Column>
           
            ))}
          </Grid>
            ) : (
              <p>No vehicles added yet.</p>
            )}
          </Grid.Column>
        </Grid.Row>
        {/* Modal components here */}
      </Grid>
      <EditVehicleModal
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        editVehicleData={editVehicleData}
        handleFormChange={handleFormChange}
        handleSaveVehicle={handleSaveVehicle}
        fuelTypeOptions={fuelTypeOptions}
      />

      <EditProfileModal
        openEditProfileModal={openEditProfileModal}
        setOpenEditProfileModal={setOpenEditProfileModal}
        userData={userData}
        handleFileChange={handleFileChange}
        handleUserFormChange={handleUserFormChange}
        handleEditUser={handleEditUser}
      />
    </div>
  );
};

export default DashboardPage;
