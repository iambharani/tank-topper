import React from "react";
import { Button, Container, Header, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "./../css/WelcomePage.css"; // Import the CSS for additional styling
import welcomeImage from "./../assets/welcomeImage.jpg"; // Adjust the path as necessary

const WelcomePage = () => {
  return (
    <div className="welcome-backdrop">
      <Container text className="overlay-content">
        <Header as="h1" inverted>
          Welcome to Our Service
        </Header>
        <Button.Group size="huge">
          <Button as={Link} to="/login" inverted>
            Login
          </Button>
          <Button.Or />
          <Button as={Link} to="/signup" positive>
            Sign Up
          </Button>
        </Button.Group>
      </Container>
    </div>
  );
};

export default WelcomePage;
