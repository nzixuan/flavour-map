import "./App.css";

import { Content, Footer, Header } from "antd/es/layout/layout";
import { Flex, Layout, Slider, Button } from "antd";
import { GOOGLE_MAPS_LIBRARIES } from "./constants";
import LocationSearchBox from "./Components/LocationSearchBox";
import Map from "./Components/Map";
import React, { useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";
import CardContainer from "./Components/CardContainer";
import MenuDropdown from "./Components/MenuDropdown";
function App() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const [map, setMap] = React.useState(null);
  const [places, setPlaces] = React.useState([]);
  const [searchBox, setSearchBox] = React.useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapSettings, setMapSettings] = useState({
    centerMarkerLatLng: null,
    radius: 1000,
    foodType: "restaurant",
  });
  const [placesLoading, setPlacesLoading] = useState(false);
  const [displayedPlaces, setDisplayedPlaces] = useState([]);

  const placeScore = (place) => {
    return place && place.rating && place.user_ratings_total
      ? (place.rating * Math.log(place.user_ratings_total + 1)) / Math.log(6)
      : 0;
  };
  const search = () => {
    if (map === null) {
      return;
    }
    const placesService = new window.google.maps.places.PlacesService(map);
    if (mapSettings.centerMarkerLatLng !== null) {
      setPlacesLoading(true);
      setPlaces([]);
      setDisplayedPlaces([]);
      console.log(mapSettings.centerMarkerLatLng);
      placesService.nearbySearch(
        {
          rankBy: window.google.maps.places.RankBy.PROMINENCE,
          // keyword: "food",
          type: mapSettings.foodType,
          location: mapSettings.centerMarkerLatLng,
          radius: mapSettings.radius,
          key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        },
        (results, status, pagination) => {
          console.log("Nearby search API Called");
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setPlaces((prevPlaces) => {
              if (
                pagination.hasNextPage &&
                (!prevPlaces || prevPlaces.length < 10)
              ) {
                pagination.nextPage();
              } else {
                setPlacesLoading(false);
              }

              const updatePlace = [...(prevPlaces || []), ...results]
                .filter((place) => place.business_status === "OPERATIONAL")
                .map((place) => {
                  return {
                    ...place,
                    score: placeScore(place),
                  };
                });
              updatePlace.sort((a, b) => b.score - a.score);
              return updatePlace;
            });
          } else {
            console.error(status);
          }
        }
      );
    }
  };
  console.log(mapSettings.radius);
  return isLoaded ? (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <LocationSearchBox
          searchBox={searchBox}
          setSearchBox={setSearchBox}
          map={map}
          mapSettings={mapSettings}
          setMapSettings={setMapSettings}
          setPlaces={setPlaces}
        ></LocationSearchBox>
        <Slider
          min={1000}
          max={8000}
          step={1000}
          value={mapSettings.radius}
          onChange={(value) => {
            setMapSettings({ ...mapSettings, radius: value });
          }}
          style={{ width: "200px", margin: "0 20px" }}
        ></Slider>
        <MenuDropdown
          mapSettings={mapSettings}
          setMapSettings={setMapSettings}
        />
        <Button onClick={search}>Search</Button>
      </Header>
      <Content style={{ overflow: "auto" }}>
        {/* <div style={{ position: "sticky", top: "0", zIndex: 100 }}> */}
        <Flex justify="center">
          <Map
            map={map}
            setMap={setMap}
            mapSettings={mapSettings}
            setMapSettings={setMapSettings}
            places={displayedPlaces}
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
          ></Map>
        </Flex>
        {/* </div> */}
        <CardContainer
          map={map}
          places={places}
          selectedPlace={selectedPlace}
          placesLoading={placesLoading}
          displayedPlaces={displayedPlaces}
          setDisplayedPlaces={setDisplayedPlaces}
        ></CardContainer>
      </Content>
      <Footer>Created By Ng Zi Xuan</Footer>
    </Layout>
  ) : (
    <div>
      <h1>Map Loading...</h1>
    </div>
  );
}

export default App;
