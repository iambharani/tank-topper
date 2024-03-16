import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
// Ensure you've imported mappls and mappls_plugin as needed
import { mappls, mappls_plugin } from "mappls-web-maps";

const MapComponent = ({
  latitude,
  longitude,
  isFullScreen,
  userLatitude,
  userLongitude,
}) => {
  console.log(latitude, longitude, isFullScreen, userLatitude, userLongitude);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapContainerRef = useRef(null); 
  const containerStyle = {
    width: "100%",
    height: isFullScreen ? "100vh" : "400px",
    position: isFullScreen ? "fixed" : "relative",
    top: 0,
    left: 0,
    zIndex: isFullScreen ? 1000 : 1, // Ensure it's above other content
  };
  useEffect(() => {
    if (isMapLoaded) return;

    const fetchAccessToken = async () => {
      try {
        const response = await axios.post(
          "http://localhost/tank-topper/backend/token_generator.php"
        );

        console.log( response.data);
        // const cleanResponseData = response.data.replace(
        //   /^\/\/ token_generator\.php\r\n/,
        //   ""
        // );
        // const result = JSON.parse(cleanResponseData);
        // const result = JSON.parse(response.data);
        const result = response.data;
        console.log("Parsed Response Data:", result);

        console.log("Access Token:", result.access_token); 

        if (result.access_token) {
          initializeMap(result.access_token);
        } else {
          console.error(
            "Access token is undefined. Check the response structure and parsing."
          );
        }
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    const initializeMap = (accessToken) => {
      console.log("Access Token:", accessToken);
      const mapplsClassObject = new mappls(accessToken);
      const mapplsPluginObject = new mappls_plugin();

      mapplsClassObject.initialize(
        accessToken,
        { map: true, plugins: ["direction"] },
        () => {
          console.log("Mappls Initialization complete");

          if (mapContainerRef.current) {
            const map = new mapplsClassObject.Map(mapContainerRef.current, {
              center: [
                (parseFloat(longitude) + parseFloat(userLongitude)) / 2,
                (parseFloat(latitude) + parseFloat(userLatitude)) / 2,
              ],
              zoom: 12,
            });

            map.on("load", () => {
              setIsMapLoaded(true);

              console.log(
                "Requesting directions from:",
                `${userLongitude},${userLatitude}`,
                "to:",
                `${longitude},${latitude}`
              );
              mapplsPluginObject.direction(
                {
                  map: map,
                  start: `${userLatitude},${userLongitude}`,
                  end: `${latitude},${longitude}`,
                },
                (e) => {
                  console.log("Direction response:", e);
                  if (e.error) {
                    console.error("Direction API error:", e.error);
                  }
                }
              );
            });
          }
        }
      );
    };

    fetchAccessToken();


  }, [latitude, longitude, isMapLoaded, userLatitude, userLongitude]); 

  return (
    <div id="map" ref={mapContainerRef} style={containerStyle}>
      {/* Map will be attached to this div */}
    </div>
  );
};

export default MapComponent;