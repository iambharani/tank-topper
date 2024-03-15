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

  console.log(latitude,
    longitude,
    isFullScreen,
    userLatitude,
    userLongitude,);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapContainerRef = useRef(null); // Assuming you have a ref for the map container
  const containerStyle = {
    width: "100%",
    height: isFullScreen ? "100vh" : "400px", // Full screen height or fixed height
    position: isFullScreen ? "fixed" : "relative", // Make position fixed to cover the full screen
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
        const cleanResponseData = response.data.replace(
          /^\/\/ token_generator\.php\r\n/,
          ""
        );
        const result = JSON.parse(cleanResponseData);
        console.log("Parsed Response Data:", result);

        // Manually parse the JSON string into an object
        console.log("Access Token:", result.access_token); // This should log the actual access token

        if (result.access_token) {
          initializeMap(result.access_token); // Initialize the map with the access token
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
      console.log(accessToken);
      // Assuming mappls and mappls_plugin are correctly initialized and available
      // Replace 'mappls' and 'mappls_plugin' with the actual objects/constructors as necessary
      const mapplsClassObject = new mappls(accessToken);
      const mapplsPluginObject = new mappls_plugin();

      mapplsClassObject.initialize(
        accessToken,
        { map: true, plugins: ["direction"] },
        () => {
          console.log("Mappls Initialization complete");

          if (mapContainerRef.current) {
            const map = new mapplsClassObject.Map(mapContainerRef.current, {
              center: [longitude, latitude],
              zoom: 12,
            });

            map.on("load", () => {
              setIsMapLoaded(true);
              // Once the map is loaded, add direction functionality
              mapplsPluginObject.direction(
                {
                  map: map,
                  start: `${userLongitude},${userLatitude}`,
                  end: `${longitude},${latitude}`,
                },
                (e) => {
                  console.log("Direction response:", e);
                }
              );
            });
          }
        }
      );
    };

    fetchAccessToken();

    // Cleanup function to reset map loaded state if necessary
    return () => {
      // Implement any necessary cleanup
    };
  }, [latitude, longitude, isMapLoaded, userLatitude, userLongitude]); // Ensure dependencies are correctly listed

  return (
    <div id="map" ref={mapContainerRef} style={containerStyle}>
      {/* Map will be attached to this div */}
    </div>
  );
};

export default MapComponent;
