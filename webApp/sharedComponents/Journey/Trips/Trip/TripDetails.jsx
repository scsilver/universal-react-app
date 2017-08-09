class TripDetails extends Component {
  render() {
    const { trip } = this.props;
    const legs = trip.routes[trip.filters.route].legs;
    const firstLeg = legs[0];
    const lastLeg = legs[legs.length - 1];
    return (
      <View
        style={{
          display: "inline-block",
          backgroundColor: "white",
          padding: "5px"
        }}
      >
        <Text style={{ display: "inline-block", float: "left" }}>
          {firstLeg.departure_time.text}
        </Text>
        <Text style={{ display: "inline-block", float: "right" }}>
          {lastLeg.arrival_time.text}
        </Text>
      </View>
    );
  }
}
