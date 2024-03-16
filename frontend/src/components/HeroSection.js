import React from 'react';
import { Container, Header, Button } from 'semantic-ui-react';
import './../css/HeroSection.css'
const HeroSection = () => (
  <div className="hero-section">
    <Container text className="hero-content" >
      <Header as='h1' inverted>Welcome to Station Finder</Header>
      <p>This is a simple application to help you find fuel stations.</p>
      <Button primary className="hero-button">Learn More</Button>
    </Container>
  </div>
);

export default HeroSection;
