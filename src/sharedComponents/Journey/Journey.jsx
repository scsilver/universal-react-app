import React, { Component } from "react";
import PropTypes from "prop-types";
//
import { View } from "react-primitives";
import Map from "./JourneyMap";
//
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../actions/journeyActions";
import SearchPanel from "./Trips/SearchPanel";
import JourneyPanel from "./Trips/JourneyPanel";
import TripPanel from "./Trips/TripPanel";
import SuggestionsPanel from "./Suggestions/SuggestionsPanel";

const googleMapURL =
  "https://maps.googleapis.com/maps/api/js?v=3.27&libraries=places,geometry&key=AIzaSyB_O7dkvfLlFZ7DZYZPhEbLrJeG8br6up0";
const tripDirectionsSelector = ({ trips }) => {
  let directions = [];
  trips.map(trip =>
    directions.push({
      color: trip.color,
      request: {
        destination: trip.tripSettings.destination,
        origin: trip.tripSettings.origin,
        travelMode: trip.tripSettings.travelMode
      },
      routes: [trip.routes[trip.filters.route]],
      status: "OK"
    })
  );
  return directions;
};

class Journey extends Component {
  constructor(props) {
    super(props);
    this.handleMapMounted = this.handleMapMounted.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleCenterChanged = this.handleCenterChanged.bind(this);
  }
  handleMapClick(event) {
    event.preventPropogation();
  }
  handleMapMounted(map) {
    this._map = map;
  }
  handleCenterChanged() {
    const bounds = this._map.getBounds().toJSON();

    const zoom = { level: this._map.getZoom() };
    this.props.actions.citiesSuggestionsRequest({ bounds, zoom });
  }
  render() {
    const {
      journey: {
        suggestions,
        events,
        map,
        panels: { searchPanel, tripsPanel, suggestionsPanel }
      }
    } = this.props;
    const directions = tripDirectionsSelector({ trips: events.trips });

    return (
      <View>
        <Map
          containerElement={
            <div style={{ height: window.innerHeight, width: "100%" }} />
          }
          mapElement={
            <div style={{ height: window.innerHeight, width: "100%" }} />
          }
          onMapLoad={this.handleMapMounted}
          onMapClick={event => this.handleMapClick(event)}
          defaultZoom={3}
          defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
          center={map.center}
          onCenterChanged={this.handleCenterChanged}
          googleMapURL={googleMapURL}
          directions={directions}
          placeSuggestions={suggestions.trips}
          suggestedMarkerClick={this.onPlaceClick}
        />
        <SearchPanel />
        <TripPanel map={this._map} />
        <SuggestionsPanel />
        <JourneyPanel />
      </View>
    );
  }
}

//         <PlaceSuggestionsPanel
//        ;
//   }
// }
//    onImageClick={this.onPlaceClick}
//           placeSuggestions={suggestions.placeSuggestions}
//         />
//         <SearchPanel
//           expanded={searchPanel.expanded}
//           onClick={event => this.handleSearchOnClick({ event })}
//         />
//         <RoutesPanel
//           expanded={routesPanel.expanded}
//           onClick={event => this.handleRoutesOnClick({ event })}
//           trips={trips}
//         />
// const mapStateToProps = state => ({
//   trips: state.trips
// });

// const mapDispatchToProps = dispatch =>  {
//   actions: bindActionCreators(actions, dispatch);
// };

const mapStateToProps = state => ({
  journey: state.journey
});

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Journey);
