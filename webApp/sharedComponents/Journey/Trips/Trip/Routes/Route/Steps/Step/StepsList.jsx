class StepList extends Component {
  static get defaultProps() {
    return {
      steps: []
    };
  }
  render() {
    const { steps, trip } = this.props;
    return (
      <View
        style={{
          display: "inline-block",
          flex: 0.8,
          padding: "5px",
          backgroundColor: trip.tripSettings.color
        }}
      >
        {steps.map(step => {
          return (
            <Text style={styles.stepListText}>
              {step.instructions}
            </Text>
          );
        })}
      </View>
    );
  }
}
