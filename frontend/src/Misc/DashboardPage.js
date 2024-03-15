// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useSelector } from 'react-redux'; // Import useSelector
// import AddVehicleComponent from './../components/AddVehicleComponent';
// import { Button, Form, Segment, Card, Image, Grid, Header } from 'semantic-ui-react';
// import 'semantic-ui-css/semantic.min.css';

// const DashboardPage = () => {
//     const [showAddVehicle, setShowAddVehicle] = useState(false);
//     const [userData, setUserData] = useState({
//         username: '',
//         email: '',
//         vehicles: [],
//         userImage: '',
//     });
//     const [editMode, setEditMode] = useState(false);

//     // Use useSelector to access the current user's ID from the Redux store
//     // const user = useSelector((state) => state.auth.user);
//     // const user = 1;  //hard coded for testing purpose
// // console.log("user",user)
//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 // Include the user's ID in your API call
//                 const response = await axios.get(`http://localhost/tank-topper/backend/getUserDetails.php?id=${1}`);
//                 console.log(response, typeof(response))
//                 setUserData(response.data);
//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//             }
//         };

//         // if (user && user.id) { // Make sure userId is not undefined or null
//             fetchUserData();
//         // }
//     }, []);

//     const handleVehicleAdded = () => {
//         setShowAddVehicle(false);
//         // Optionally, refresh the user's vehicles list
//     };

//     const handleUpdateUserDetails = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post("http://localhost/api/user/update", userData);
//             setEditMode(false);
//             // Optionally, refresh user data here
//         } catch (error) {
//             console.error("Error updating user details:", error);
//         }
//     };

//     // {userData.vehicles.map(vehicle => (
//     //     <Segment key={vehicle.id}>
//     //         <p>{vehicle.vehicleName}</p>
//     //         {/* Add functionality to edit vehicle details */}
//     //     </Segment>
//     // )
//     // )}

//     return (
//         <Segment>
//             <Grid columns={2} relaxed="very">
//                 <Grid.Column>
//                     <Header as="h2">Dashboard</Header>
//                     {editMode ? (
//                         <Form onSubmit={handleUpdateUserDetails}>
//                             <Form.Field>
//                                 <label>Username</label>
//                                 <input
//                                     placeholder='Username'
//                                     value={userData.username}
//                                     onChange={e => setUserData({ ...userData, username: e.target.value })}
//                                 />
//                             </Form.Field>
//                             <Form.Field>
//                                 <label>Email</label>
//                                 <input
//                                     type="email"
//                                     placeholder='Email'
//                                     value={userData.email}
//                                     onChange={e => setUserData({ ...userData, email: e.target.value })}
//                                 />
//                             </Form.Field>
//                             {/* Implement image upload functionality here */}
//                             <Button type="submit" positive>Save Changes</Button>
//                         </Form>
//                     ) : (
//                         <Card>
//                             {userData.userImage && <Image src={userData.userImage} wrapped ui={false} />}
//                             <Card.Content>
//                                 <Card.Header>{userData.username}</Card.Header>
//                                 <Card.Meta>
//                                     <span className='email'>{userData.email}</span>
//                                 </Card.Meta>
//                             </Card.Content>
//                             <Card.Content extra>
//                                 <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
//                             </Card.Content>
//                         </Card>
//                     )}
//                 </Grid.Column>
//                 <Grid.Column>
//                     <Button toggle active={showAddVehicle} onClick={() => setShowAddVehicle(!showAddVehicle)}>
//                         {showAddVehicle ? "Cancel Adding Vehicle" : "Add New Vehicle"}
//                     </Button>
//                     {/* {showAddVehicle && <AddVehicleComponent onVehicleAdded={handleVehicleAdded} />} */}
//                     {/* <Header as="h3">Your Vehicles</Header> */}

//                 </Grid.Column>
//             </Grid>
//         </Segment>
//     );
// };

// export default DashboardPage;




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
} from "semantic-ui-react";
import axios from "axios";
import dummyImage from "./../assets/profile.png";
import "semantic-ui-css/semantic.min.css";
// Mock Data
const initialUserData = {
  // Provide default values or leave as empty strings if no data is available
  username: "", // Assuming you want to show this as empty if no username is available
  email: "", // Assuming you want to show this as empty if no email is available
  userImage: dummyImage, // Use dummy image as the initial state for the userImage
  vehicles: [], // Assuming no vehicles are available initially
};
const DashboardPage = () => {
  const [userData, setUserData] = useState(initialUserData);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editVehicleData, setEditVehicleData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Attempt to fetch user details from backend API
        const { data } = await axios.get(
          "http://localhost/tank-topper/backend/getUserDetails.php?id=1"
        );
        setUserData(data);
        console.log("data", data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        const savedUserData = localStorage.getItem("user");
        if (savedUserData) {
          const parsedData = JSON.parse(savedUserData);
          // Ensure vehicles is an array
          parsedData.vehicles = parsedData.vehicles || [];
          setUserData(parsedData);
        }
      }
    };

    fetchUserData();
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

  const handleSaveVehicle = () => {
    let updatedVehicles;
    if (!editVehicleData.id) {
      // Assign a temporary ID for new vehicles. In a real app, the backend should generate IDs.
      const newVehicle = { ...editVehicleData, id: Date.now() };
      updatedVehicles = [...userData.vehicles, newVehicle];
    } else {
      updatedVehicles = userData.vehicles.map((vehicle) =>
        vehicle.id === editVehicleData.id ? editVehicleData : vehicle
      );
    }

    setUserData({ ...userData, vehicles: updatedVehicles });
    setEditVehicleData(null); // Reset edit form

    // Clear user from localStorage after successful vehicle add/edit
    localStorage.removeItem("user");
  };

  const handleEditUser = () => {
    console.log("Save user details");
    setOpenEditModal(false);
  };

  const openVehicleEditModal = (vehicle) => {
    setEditVehicleData(vehicle);
  };

  const handleDeleteVehicle = (id) => {
    setUserData({
      ...userData,
      vehicles: userData.vehicles.filter((vehicle) => vehicle.id !== id),
    });
  };

  //   const handleSaveVehicle = () => {
  //     const updatedVehicles = userData.vehicles.map(v => {
  //       if (v.id === editVehicleData.id) {
  //         return editVehicleData;
  //       }
  //       return v;
  //     });

  //     if (!editVehicleData.id) {
  //       editVehicleData.id = Date.now(); // simplistic approach for unique ID
  //       updatedVehicles.push(editVehicleData);
  //     }

  //     setUserData({ ...userData, vehicles: updatedVehicles });
  //     setEditVehicleData(null);
  //   };
  if (!userData) {
    return <div>Loading user data...</div>;
  } else {
    return (
      <Segment
        padded
        style={{ minHeight: "100vh", backgroundColor: "#f4f4f4" }}
        textAlign="center"
      >
        <Grid container stackable style={{ justifyContent: "center" }}>
          <Grid.Row>
            <Grid.Column width={16}>
              <Card centered>
                <Image
                  src={userData.userImage}
                  wrapped
                //   ui={false}
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
              <Header as="h2" dividing>
                Vehicles
                <Button
                  icon="add"
                  size="small"
                  floated="right"
                  onClick={() =>
                    openVehicleEditModal({ make: "", model: "", year: "" })
                  }
                />
              </Header>
              <Grid columns={3} divided>
                {userData &&
                  userData.vehicles &&
                  userData.vehicles.map((vehicle) => (
                    <Grid.Column key={vehicle.id}>
                      <Card>
                        <Card.Content>
                          <Card.Header>
                            {vehicle.make} {vehicle.model}
                          </Card.Header>
                          <Card.Meta>{vehicle.year}</Card.Meta>
                          <div className="ui two buttons">
                            <Button
                              icon="edit"
                              onClick={() => openVehicleEditModal(vehicle)}
                            />
                            <Button
                              icon="delete"
                              color="red"
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                            />
                          </div>
                        </Card.Content>
                      </Card>
                    </Grid.Column>
                  )|| <p>Add atleast One vechile </p>)}
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {/* Vehicle Edit/Add Modal */}
        {editVehicleData && (
          <Modal
            open={true}
            onClose={() => setEditVehicleData(null)}
            size="small"
          >
            <Header
              icon="car"
              content={editVehicleData.id ? "Edit Vehicle" : "Add Vehicle"}
            />
            <Modal.Content>
              <Form>{/* Form Fields */}</Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color="red" onClick={() => setEditVehicleData(null)}>
                <Icon name="remove" /> Cancel
              </Button>
              <Button color="green" onClick={handleSaveVehicle}>
                <Icon name="checkmark" /> Save
              </Button>
            </Modal.Actions>
          </Modal>
        )}
      </Segment>
    );
  }
};

export default DashboardPage;
