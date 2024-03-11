// StationCard.js
import React from 'react';
import { Card } from 'semantic-ui-react';

const StationCard = ({ station }) => {
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>{station.NAME_OF_STATION}</Card.Header>
        <Card.Meta>{station.DISTRICT}, {station.STATE}</Card.Meta>
        <Card.Description>
          <strong>Address:</strong> {station.ADDRESS}<br/>
          <strong>Coordinates:</strong> {station.LONGITUDE}, {station.LATITUDE}<br/>
          <strong>Price:</strong> {station.CNG_PRICE_IN_KG} per KG<br/>
          <strong>GA Name:</strong> {station.GA_NAME}
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

export default StationCard;
