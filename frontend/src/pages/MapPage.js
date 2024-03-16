import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import { Container, Header, Card, Button } from "semantic-ui-react";

import "./MapPage.css";
const MapPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedStation, userLocationCord } = location.state || {};

  return (
    <div>
      {selectedStation && userLocationCord ? (
        <>
          <MapComponent
            latitude={selectedStation.latitude}
            longitude={selectedStation.longitude}
            userLatitude={userLocationCord.latitude}
            userLongitude={userLocationCord.longitude}
            isFullScreen={true}
          />
          <div className="buttonContainer">
            {/* <button
              onClick={() => navigate("/stations")}
              style={{
                marginBottom: "0",
                backgroundColor: "blue",
                color: "white",
                padding: "10px",
              }}
            >
              Back to List
            </button> */}
            <Button onClick={() => navigate("/stations")} content='Primary' primary >Back to List</Button>

          </div>
        </>
      ) : (
        <p>No station data available. Please select a station from the list.</p>
      )}
    </div>
  );
};

export default MapPage;
