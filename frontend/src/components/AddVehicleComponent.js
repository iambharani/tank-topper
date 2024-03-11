import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddVehicleComponent from './AddVehicleComponent';
import { Button, Form, Segment, Card, Image, Grid, Header } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const Dashboard = () => {
    const [showAddVehicle, setShowAddVehicle] = useState(false);
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        vehicles: [],
        userImage: '', // Assuming you're storing the image URL
    });
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost/api/user/details");
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleVehicleAdded = () => {
        setShowAddVehicle(false);
        // Optionally, refresh the user's vehicles list
    };

    const handleUpdateUserDetails = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost/api/user/update", userData);
            setEditMode(false);
            // Optionally, refresh user data here
        } catch (error) {
            console.error("Error updating user details:", error);
        }
    };

    return (
        <Segment>
            <Grid columns={2} relaxed="very">
                <Grid.Column>
                    <Header as="h2">Dashboard</Header>
                    {editMode ? (
                        <Form onSubmit={handleUpdateUserDetails}>
                            <Form.Field>
                                <label>Username</label>
                                <input
                                    placeholder='Username'
                                    value={userData.username}
                                    onChange={e => setUserData({ ...userData, username: e.target.value })}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder='Email'
                                    value={userData.email}
                                    onChange={e => setUserData({ ...userData, email: e.target.value })}
                                />
                            </Form.Field>
                            {/* Implement image upload functionality here */}
                            <Button type="submit" positive>Save Changes</Button>
                        </Form>
                    ) : (
                        <Card>
                            {userData.userImage && <Image src={userData.userImage} wrapped ui={false} />}
                            <Card.Content>
                                <Card.Header>{userData.username}</Card.Header>
                                <Card.Meta>
                                    <span className='email'>{userData.email}</span>
                                </Card.Meta>
                            </Card.Content>
                            <Card.Content extra>
                                <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
                            </Card.Content>
                        </Card>
                    )}
                </Grid.Column>
                <Grid.Column>
                    <Button toggle active={showAddVehicle} onClick={() => setShowAddVehicle(!showAddVehicle)}>
                        {showAddVehicle ? "Cancel Adding Vehicle" : "Add New Vehicle"}
                    </Button>
                    {showAddVehicle && <AddVehicleComponent onVehicleAdded={handleVehicleAdded} />}
                    <Header as="h3">Your Vehicles</Header>
                    {userData.vehicles.map(vehicle => (
                        <Segment key={vehicle.id}>
                            <p>{vehicle.vehicleName}</p>
                            {/* Add functionality to edit vehicle details */}
                        </Segment>
                    ))}
                </Grid.Column>
            </Grid>
        </Segment>
    );
};

export default Dashboard;
