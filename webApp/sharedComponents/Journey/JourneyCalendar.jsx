class Event extends Component {
  render() {
    const { event } = this.props;
    return (
      <View style={styles.event}>
        <Text style={styles.eventText}>
          {event.text}
        </Text>
      </View>
    );
  }
}
class EventsContainer extends Component {
  render() {
    const { children } = this.props;
    return (
      <View style={styles.eventsContainer}>
        {children}
      </View>
    );
  }
}
class DayHeader extends Component {
  render() {
    const { day } = this.props;
    return (
      <View style={styles.dayHeader}>
        <Text>
          {day.text}
        </Text>
      </View>
    );
  }
}
class Day extends Component {
  render() {
    const { children } = this.props;
    return (
      <View style={styles.day}>
        {children}
      </View>
    );
  }
}
class DaysContainer extends Component {
  render() {
    const { children } = this.props;
    return (
      <View style={styles.daysContainer}>
        {children}
      </View>
    );
  }
}
