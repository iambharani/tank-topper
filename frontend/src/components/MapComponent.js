import React, { useEffect, useRef, useState } from "react";
import { mappls } from "mappls-web-maps";

const MapComponent = ({ latitude, longitude }) => {
  const mapContainerRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (isMapLoaded) return; // Prevent re-initialization if the map is already loaded
  
    const mapplsClassObject = new mappls();
    let map;
  
    mapplsClassObject.initialize("1012bcddd37d7139c30af8d27d91502e", { map: true }, () => {
      console.log("Initialization complete");
  
      if (mapContainerRef.current) {
        map = new mapplsClassObject.Map(mapContainerRef.current, {
          center: [longitude, latitude],
          zoom: 5,
        });
  
        map.on("load", () => {
          setIsMapLoaded(true);
        });
      }
    });
  
    // return () => {
    // //   if (map) {
    // //     map.remove(); // Assuming `remove` is the method to properly clean up the map instance
    // //   }
    // };
  }, [latitude, longitude]); // Depend on latitude and longitude to re-initialize
  

  return (
    <div
      ref={mapContainerRef}
      id="map-container" // Keep the static ID if only one map instance is expected at a time
      style={{ width: "100%", height: "400px" }}
    >
      {/* {isMapLoaded ? "Map Loaded" : "Loading Map..."} */}
    </div>
  );
};

export default MapComponent;
