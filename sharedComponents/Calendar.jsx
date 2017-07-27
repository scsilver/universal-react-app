import React, { Component } from "react";
import PropTypes from "prop-types";
import { times } from "lodash";
import { View, Text, Image, StyleSheet } from "react-primitives";
class Calendar extends Component {
  static get defaultProps() {
    return {
      days: daysGenerator({ numberOfDays: 28 })
    };
  }
  render() {
    const { days, events } = this.props;
    return (
      <View>
        <DaysContainer>
          {days.map(day => {
            return (
              <Day key={day.text}>
                <DayHeader day={day} />
                <EventsContainer>
                  {day.events.map(event =>
                    <Event key={event.text} event={event} />
                  )}
                </EventsContainer>
              </Day>
            );
          })}
        </DaysContainer>
      </View>
    );
  }
}

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
const styles = StyleSheet.create({
  eventText: {
    fontSize: 16,
    color: "#E6E2AF"
  },
  event: {
    marginTop: 10,
    height: 40,
    width: 80,
    borderRadius: "5px",
    backgroundColor: "#046380",
    alignItems: "center",
    justifyContent: "center"
  },
  eventsContainer: {
    paddingBottom: 10
  },
  dayHeader: {
    borderColor: "black",
    borderBottomWidth: 1
  },
  day: {
    width: 100,
    backgroundColor: "white",
    borderColor: "black",
    borderRightWidth: 1,
    alignItems: "center"
  },
  daysContainer: {
    flexDirection: "row"
  },
  calendar: {
    width: 1000
  },

  image: {
    height: 50,
    width: 50
  },
  text: {
    fontSize: 20
  }
});
Calendar.propTypes = {};
const daysGenerator = ({ numberOfDays }) => {
  let days = [];
  times(numberOfDays, n =>
    days.push({
      text: `day ${n}`,
      events: [
        { text: `event ${n * 3 + 1}` },
        { text: `event ${n * 3 + 2}` },
        { text: `event ${n * 3 + 3}` }
      ]
    })
  );
  return days;
};
export default Calendar;
