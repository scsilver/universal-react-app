class StepDetails extends Component {
  render() {
    const { step, trip } = this.props;
    const width = step.instructions.split("").length * 5;
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          flex: 1,
          height: "100%",
          minWidth: `${width}px`
        }}
      >
        <Text
          style={{
            display: "flex",
            textAlign: "right",
            fontWeight: "800",
            fontSize: 16,
            flex: 1
          }}
        >
          {step.instructions}
          {"   "}
        </Text>

        <Text
          style={{
            display: "flex"
          }}
        >
          {step.distance.text}
        </Text>

        <Text
          style={{
            display: "flex"
          }}
        >
          {step.duration.text}
        </Text>
      </View>
    );
  }
}
class TripTitle extends Component {
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
          {firstLeg.start_address}
        </Text>
        <Text style={{ display: "inline-block", float: "right" }}>
          {lastLeg.end_address}
        </Text>
      </View>
    );
  }
}
