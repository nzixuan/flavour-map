import { GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";

import { InfoWindow } from "@react-google-maps/api";
import React from "react";
import { defaultCenter } from "../constants";

function Map({
  setMap,
  centerMarker,
  places,
  selectedPlace,
  setSelectedPlace,
}) {
  const [mapContainerStyle, setMapContainerStyle] = useState({
    width: "80vw",
    height: "80vw", // Default values for mobile
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        // Adjust the breakpoint for desktop as needed
        setMapContainerStyle({
          width: "70vw",
          height: "50vh", // Values for desktop
        });
      } else {
        setMapContainerStyle({
          width: "100vw",
          height: "30vh", // Default values for mobile
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  function createKey(location) {
    const roundedLat = location.lat().toFixed(5);
    const roundedLng = location.lng().toFixed(5);
    const key = `${roundedLat}_${roundedLng}`;
    return key;
  }
  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Center Marker */}
      {centerMarker && <Marker position={centerMarker.geometry.location} />}

      {/* Places Markers */}
      {places &&
        places.map((place) => (
          <Marker
            key={createKey(place.geometry.location)}
            position={place.geometry.location}
            onClick={(e) => {
              setSelectedPlace(place);
            }}
          />
        ))}

      {/* InfoWindow for Selected Place */}
      {selectedPlace && (
        <InfoWindow
          position={selectedPlace.geometry.location}
          onCloseClick={() => {
            setSelectedPlace(null);
          }}
        >
          <div>
            <h3>{selectedPlace.name}</h3>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export default Map;