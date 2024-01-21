import "./App.css";

import { Content, Footer, Header } from "antd/es/layout/layout";
import { Flex, Layout } from "antd";

import { GOOGLE_MAPS_LIBRARIES } from "./constants";
import LocationSearchBox from "./Components/LocationSearchBox";
import Map from "./Components/Map";
import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";

function App() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const [map, setMap] = React.useState(null);
  const [centerMarker, setCenterMarker] = React.useState(null);
  const [places, setPlaces] = React.useState(null);
  const [searchBox, setSearchBox] = React.useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  return isLoaded ? (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{ display: "flex", alignItems: "center", padding: "20px" }}
      >
        <LocationSearchBox
          searchBox={searchBox}
          setSearchBox={setSearchBox}
          map={map}
          setCenterMarker={setCenterMarker}
          setPlaces={setPlaces}
        ></LocationSearchBox>
      </Header>
      <Content style={{ overflow: "auto" }}>
        <Flex justify="center">
          <Map
            map={map}
            setMap={setMap}
            centerMarker={centerMarker}
            places={places}
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
          ></Map>
        </Flex>
        {/* <div>places</div> */}
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