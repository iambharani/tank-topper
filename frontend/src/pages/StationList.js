import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Header, Card, Grid, Loader } from "semantic-ui-react"; // Import Loader from semantic-ui-react
import StationCard from "../components/StationCard"; // Adjust the path as necessary
import * as turf from "@turf/turf";
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate(); // At the beginning of your StationList component
  const [isLoading, setIsLoading] = useState(true); // New state for tracking loading status

  useEffect(() => {
    setIsLoading(true); // Set loading to true when starting to fetch
    const storedStations = localStorage.getItem("stations");
    if (storedStations) {
      // Simulate a delay with setTimeout
      setTimeout(() => {
        setStations(JSON.parse(storedStations));
        setIsLoading(false); // Set loading to false after the delay
      }, 2000); // Delay in milliseconds, e.g., 2000ms = 2 seconds
    } else {
      axios.get("http://localhost/tank-topper/backend/getStations.php")
        .then((response) => {
          const result = response.data;
          if (result.status === "SCS") {
            const normalizedStations = result.data.map((station) => ({
              ...station,
              latitude: station.LATITUDE,
              longitude: station.LONGITUDE,
            }));
            localStorage.setItem("stations", JSON.stringify(normalizedStations));
            setStations(normalizedStations);
          } else {
            console.error("Failed to fetch stations:", result);
          }
        })
        .catch((error) => console.error("There was an error!", error))
        .finally(() => setIsLoading(false)); // Ensure loading is set to false when fetch is complete
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
    if (userLocationCord.latitude && userLocationCord.longitude && stations.length > 0) {
      const sorted = sortStationsByProximity().slice(0, 3); // Take only the first three
      setSortedStations(sorted);
    }
  }, [userLocationCord, stations]);


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

      // console.log("station",station);
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

  // const handleSelectStation = (station) => {
  //   console.log("station", station);
  //   setSelectedStation(station);
  // };

  const handleSelectStation = (station) => {
    console.log("station", station);
    navigate('/map', {
      state: {
        selectedStation: station,
        userLocationCord: userLocationCord,
      }
    });
  };

  const renderStationList = () => {
    const stationsToDisplay = selectedStation ? [selectedStation] : sortedStations;
    return stationsToDisplay.map((station, index) => (
      <StationCard key={index} station={station} onSelect={handleSelectStation} />
    ));
  };
  if (isLoading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Loader active inline='centered' inverted>Loading Stations...</Loader>
  </div>;
  }

  return (
    <Container className="stationsPageContainer" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Grid textAlign="center" style={{ width: '100%' }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 800 }}>
          <Header as="h2" color="black" textAlign="center">
            Stations Near You
          </Header>
          <Card.Group centered>{renderStationList()}</Card.Group>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default StationList;