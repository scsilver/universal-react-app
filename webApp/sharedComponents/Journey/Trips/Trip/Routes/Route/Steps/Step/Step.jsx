class Step extends Component {
  render() {
    const { step, trip, index } = this.props;
    return (
      <View
        style={{
          display: "inline-block",
          backgroundColor: "white",
          padding: "5px",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          display: "inline-flex"
        }}
      >
        <View
          style={{
            display: "inline-block",
            backgroundColor: trip.tripSettings.color,
            flexDirection: "column",
            justifyContent: "center",
            flex: 0.2
          }}
        >
          <Text
            style={{
              display: "block",
              flex: 1,
              textAlign: "center",
              color: "white",
              paddingTop: "10px"
            }}
          >
            Step{" "}
          </Text>
          <Text
            style={{
              display: "block",
              textAlign: "center",
              flex: 1,
              fontSize: "30px",
              lineHeight: "50px",
              color: "white"
            }}
          >
            {index + 1}
          </Text>
        </View>
        <View
          style={{
            display: "inline-block",
            backgroundColor: "white",
            flexDirection: "column",
            justifyContent: "flex-start",
            flex: 0.8,
            color: trip.tripSettings.color
          }}
        >
          <StepDetails step={step} trip={trip} />
        </View>
      </View>
    );
  }
}
