import React from 'react';
import { Segment, Container } from 'semantic-ui-react';

const FooterComponent = () => (
  <Segment inverted vertical style={{ padding: '5em 0em', marginTop: '3em' }}>
    <Container textAlign='center'>
      Station Finder © 2024
    </Container>
  </Segment>
);

export default FooterComponent;
