import React from 'react';
import { Card } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGasPump, faCrosshairs, faMoneyBill,faLocationDot } from '@fortawesome/free-solid-svg-icons';
import './../css/StationCard.css'
const StationCard = ({ station, onSelect }) => {
  return (
    <Card className='stationcard-card' fluid onClick={() => onSelect(station)} style={{ cursor: 'pointer', margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
      <Card.Content className='stationcard-card-content'>
        <Card.Header className='stationcard-card-header'>
          <FontAwesomeIcon icon={faGasPump} style={{ marginRight: '10px' }} />
          {station.name_of_station}
        </Card.Header>
        <Card.Meta className='stationcard-card-meta'>
          <FontAwesomeIcon className="card-icon" icon={faCrosshairs} style={{ marginRight: '10px' }} />
          {station.district}, {station.state}
        </Card.Meta>
        <Card.Description className='stationcard-card-description'> 
          <FontAwesomeIcon icon={faMoneyBill} style={{ marginRight: '10px' }} />
          <strong>Price:</strong> {station.cng_price_in_kg} per KG<br/>
          <FontAwesomeIcon icon={faLocationDot}  style={{ marginRight: '10px' }}/>
          <strong>Address:</strong> {station.address}<br/>
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

export default StationCard;
