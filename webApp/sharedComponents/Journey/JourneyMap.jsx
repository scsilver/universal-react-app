import React from "react";

import {
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline,
  DirectionsRenderer
} from "react-google-maps";

const GettingStartedGoogleMap = withGoogleMap(props =>
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={3}
    defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
    onClick={props.onMapClick}
    onCenterChanged={props.onCenterChanged}
  >
    {props.directions &&
      props.directions.map(d =>
        <DirectionsRenderer
          options={{
            preserveViewport: true,
            polylineOptions: {
              strokeOpacity: 0.7,
              strokeWeight: 5
            }
          }}
          directions={d}
        />
      )}
    {props.placeSuggestions &&
      props.placeSuggestions.map(place =>
        <Marker
          position={place.geometry.location}
          onClick={() => props.suggestedMarkerClick({ place })}
        />
      )}
  </GoogleMap>
);
export default GettingStartedGoogleMap;