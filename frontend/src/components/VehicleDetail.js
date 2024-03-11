import React from 'react';
import { Card, Icon } from 'semantic-ui-react';

const VehicleDetail = ({ vehicle }) => {
  // Define a function or a map to convert fuel type keys to user-friendly strings if necessary
  const getFuelTypeDisplayName = (fuelType) => {
    const fuelTypeMap = {
      electric: 'Electric',
      diesel: 'Diesel',
      petrol: 'Petrol',
      cng: 'CNG',
      cng_with_petrol: 'CNG with Petrol'
    };
    return fuelTypeMap[fuelType] || 'Unknown';
  };

  return (
    <Card>
      <Card.Content header={`Vehicle Number: ${vehicle.number}`} />
      <Card.Content description={`Fuel Type: ${getFuelTypeDisplayName(vehicle.fuelType)}`} />
      <Card.Content extra>
        <Icon name='car' />
        {vehicle.make} {vehicle.model}, {vehicle.year}
      </Card.Content>
    </Card>
  );
};

export default VehicleDetail;
