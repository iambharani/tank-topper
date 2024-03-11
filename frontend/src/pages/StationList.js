import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dropdown,
  Container,
  Header,
  Button,
  List,
  Card,
} from "semantic-ui-react";
import StationCard from "../components/StationCard"; // Adjust the path as necessary

const StationList = () => {
  const [stations, setStations] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const apiUrl = "http://localhost/tank-topper/backend/getStations.php";

  useEffect(() => {
    // Attempt to fetch stations either from localStorage or the API
    const storedStations = localStorage.getItem("stations");
    if (storedStations) {
      setStations(JSON.parse(storedStations));
    } else {
      axios
        .get(apiUrl)
        .then((response) => {
          const result = JSON.parse(response.data);
          console.log("API Data:", typeof result);
          if (result.status === "SCS") {
            localStorage.setItem("stations", JSON.stringify(result.data));
            setStations(result.data);
          } else {
            console.error("Failed to fetch stations:", result);
          }
        })
        .catch((error) => console.error("There was an error!", error));
    }
  }, []);

  // useEffect(() => {
  //   axios.get(apiUrl)
  //     .then((response) => {
  //       // console.log("API Data:", response.data);
  //       if (response.data.status === "SCS") {
  //         console.log("Hello")
  //       }
  //       setStations(response.data.data); // Assuming response.data.data is the correct path to your data
  //     })
  //     .catch((error) => console.error("There was an error!", error));
  // }, []); // Ensure dependency array is empty

  // Create dropdown options for states and districts
  const stateOptions = [
    ...new Set(stations.map((station) => station.STATE)),
  ].map((state) => ({
    key: state,
    text: state,
    value: state,
  }));

  const districtOptions = stations
    .filter((station) => station.STATE === selectedState)
    .map((station) => station.DISTRICT)
    .filter((value, index, self) => self.indexOf(value) === index)
    .map((district) => ({
      key: district,
      text: district,
      value: district,
    }));

  return (
    <Container>
      <Header as="h2">Stations</Header>
      <Dropdown
        placeholder="Select State"
        fluid
        selection
        options={stateOptions}
        value={selectedState}
        onChange={(_, { value }) => {
          setSelectedState(value);
          setSelectedDistrict("");
        }}
        style={{ marginBottom: "20px" }}
      />
      <Dropdown
        placeholder="Select District/City"
        fluid
        selection
        options={districtOptions} // Use districtOptions directly
        value={selectedDistrict}
        onChange={(_, { value }) => setSelectedDistrict(value)}
        disabled={!selectedState}
        style={{ marginBottom: "20px" }}
      />

      {selectedState && selectedDistrict && (
        <Card.Group>
          {stations
            .filter(
              (station) =>
                station.STATE === selectedState &&
                station.DISTRICT === selectedDistrict
            )
            .map((station, index) => (
              <StationCard key={index} station={station} />
            ))}
        </Card.Group>
      )}
    </Container>
  );
};

export default StationList;
