class TripList extends Component {
  static get defaultProps() {
    return {
      trips: []
    };
  }
  render() {
    const { trips } = this.props;
    return (
      <View style={styles.tripList}>
        {trips.map(trip => {
          return (
            <View
              style={{
                margin: "5px",
                borderTop: `solid 4px ${trip.tripSettings.color}`
              }}
            >
              <TripTitle trip={trip} />
              <TripDetails trip={trip} />
              {trip.routes[
                trip.filters.route
              ].legs[0].steps.map((step, index) => {
                return <Step step={step} index={index} trip={trip} />;
              })}
            </View>
          );
        })}
      </View>
    );
  }
}
export default TripList;
