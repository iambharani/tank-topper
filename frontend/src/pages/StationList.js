import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Header, Card,Button } from "semantic-ui-react";
import StationCard from "../components/StationCard"; // Adjust the path as necessary
import * as turf from "@turf/turf";
import MapComponent from "../components/MapComponent";
const StationList = () => {
  const [stations, setStations] = useState([]);
  const [sortedStations, setSortedStations] = useState([]);
  const [userLocationCord, setUserLocationCord] = useState({
    latitude: null,
    longitude: null,
  });
  const [selectedStation, setSelectedStation] = useState(null);

  const apiUrl = "http://localhost/tank-topper/backend/getStations.php";
  // Replace 'YOUR_OPENCAGE_API_KEY' with your actual OpenCage API key.
  const reverseGeocodingUrl = `https://api.opencagedata.com/geocode/v1/json?key=82a7ceb08abf48009f857023ebf4bdac`;

  useEffect(() => {
    // Attempt to fetch stations either from localStorage or the API
    const storedStations = localStorage.getItem("stations");
    if (storedStations) {
      setStations(JSON.parse(storedStations));
    } else {
      axios
        .get(apiUrl)
        // Right after fetching and setting stations data
        .then((response) => {
          const result = response.data;
          if (result.status === "SCS") {
            const normalizedStations = result.data.map((station) => ({
              ...station,
              latitude: station.LATITUDE,
              longitude: station.LONGITUDE,
            }));
            localStorage.setItem(
              "stations",
              JSON.stringify(normalizedStations)
            );
            setStations(normalizedStations);
          } else {
            console.error("Failed to fetch stations:", result);
          }
        })

        .catch((error) => console.error("There was an error!", error));
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocationCord({ longitude, latitude });
        },
        (error) => {
          console.error("Error obtaining location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (
      userLocationCord.latitude &&
      userLocationCord.longitude &&
      stations.length > 0
    ) {
      const sorted = sortStationsByProximity();
      setSortedStations(sorted);
    }
  }, [userLocationCord, stations]); // Dependency array includes both userLocationCord and stations

  const safelyParseFloat = (str) => {
    const num = parseFloat(str);
    return isNaN(num) ? null : num;
  };
  function keysToLowerCase(obj) {
    return Object.keys(obj).reduce((accumulator, currentKey) => {
      accumulator[currentKey.toLowerCase()] = obj[currentKey];
      return accumulator;
    }, {});
  }
  const handleBackToList = () => {
    setSelectedStation(null);
  };

  const sortStationsByProximity = () => {
    if (!userLocationCord || stations.length === 0) return [];
  
    console.log("Sorting stations with user location:", userLocationCord);
  
    const latitude = safelyParseFloat(userLocationCord.latitude);
    const longitude = safelyParseFloat(userLocationCord.longitude);
  
    if (latitude === null || longitude === null) {
      console.error("User location coordinates must be valid numbers", userLocationCord);
      return [];
    }
  
    const userPoint = turf.point([longitude, latitude]);
  
    console.log("userPoint",userPoint);
    return stations.map((station) => {
      const normalizedStationData = keysToLowerCase(station);

      console.log("station",station);
      const stationLatitude = safelyParseFloat(normalizedStationData.latitude);
      const stationLongitude = safelyParseFloat(normalizedStationData.longitude);
  
      if (stationLongitude === null || stationLatitude === null) {
        console.error("Station coordinates must be valid numbers", station);
        return { ...normalizedStationData, distance: Infinity };
      }
  
      const stationPoint = turf.point([stationLongitude, stationLatitude]);
      const distance = turf.distance(userPoint, stationPoint, { units: "kilometers" });
      return { ...normalizedStationData, distance };
    }).sort((a, b) => a.distance - b.distance);
  };

  const handleSelectStation = (station) => {
    console.log("station", station);
    setSelectedStation(station);
  };
  return (
    <Container className="container">
    <Header as="h2">Stations Near You</Header>
    {selectedStation ? (
      // Show map and a back button when a station is selected
      <>
        <Button onClick={handleBackToList}>Back to List</Button>
        <MapComponent
          latitude={selectedStation.latitude}
          longitude={selectedStation.longitude}
        />
      </>
    ) : (
      // Show the list of stations when none is selected
      <Card.Group>
        {sortedStations.map((station, index) => (
          <StationCard
            key={index}
            station={station}
            onSelect={handleSelectStation}
          />
        ))}
      </Card.Group>
    )}
  </Container>
  );
};

export default StationList;
