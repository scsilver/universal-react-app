import React, { Component } from "react";
import actions from "../../../actions/journeyActions";
import { View, Text, Image, StyleSheet } from "react-primitives";
import lodash from "lodash";
import moment from "moment";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  EventChart,
  Resizable
} from "react-timeseries-charts";
import {
  Index,
  TimeRangeEvent,
  TimeEvent,
  TimeRange,
  TimeSeries
} from "pondjs";

const startEndToPercents = ({
  rangeStartDate,
  eventStartDate,
  rangeEndDate,
  eventEndDate
}) => {
  const rangeInMinutes = rangeEndDate.diff(rangeStartDate, "minutes");
  const eventStartMinute = eventStartDate.diff(rangeStartDate, "minutes");
  const eventEndMinute = eventEndDate.diff(rangeStartDate, "minutes");
  return {
    startPercent: 100 * (eventStartMinute / rangeInMinutes) + "%",
    lengthPercent:
      100 * Math.abs((eventEndMinute - eventStartMinute) / rangeInMinutes) +
      "%",
    endPercent: 100 - 100 * (eventEndMinute / rangeInMinutes) + "%"
  };
};
const transformDateRange = ({ event }) => {
  const { deltaX, deltaY } = event.scroll;
  if (deltaX > deltaY) return;
};

class JourneyPanel extends Component {
  constructor(props) {
    super(props);
    this.handleOnScroll = this.handleOnScroll.bind(this);
  }

  handleOnScroll(event) {
    const { deltaX, deltaY } = event;
    if (event) {
      if (Math.abs(deltaY) >= Math.abs(deltaX)) {
        this.props.actions.zoomJourneyPanelDateRange(deltaY);
      } else {
        this.props.actions.shiftJourneyPanelDateRange(deltaX);
      }
    }
  }
  render() {
    const { journey } = this.props;
    const today = moment();
    const series = new TimeSeries({
      name: "events",
      events: Object.keys(journey.events)
        .reduce((p, c) => p.concat(journey.events[c]), [])
        .map(
          event =>
            new TimeRangeEvent(
              new TimeRange(
                event.tripSettings.transitOptions.departureTime,
                event.tripSettings.transitOptions.arrivalTime
              ),
              event
            )
        )
    });
    return (
      <View
        onWheel={this.handleOnScroll}
        style={{
          bottom: "0",
          position: "absolute",
          flex: 1,
          display: "flex",
          flexDirection: "row",
          overflowX: "scroll",
          width: "100%",
          height: "100px",
          backgroundColor: "rgba(255, 255, 255, 0.7)"
        }}
      >
        <ChartContainer
          width={window.innerWidth}
          utc={true}
          timeRange={
            new TimeRange(
              journey.panels.journeyPanel.startDate,
              journey.panels.journeyPanel.endDate
            )
          }
          timezone="Australia/Adelaide"
          enablePanZoom={true}
        >
          <ChartRow height="35">
            <Charts>
              <EventChart
                series={series}
                textOffsetY={0}
                style={outageEventStyleCB}
                label={e =>
                  e.get("tripSettings.origin") +
                  " to " +
                  e.get("tripSettings.destination")}
              />
            </Charts>
          </ChartRow>
        </ChartContainer>
      </View>
    );
  }
}
const Event = props => {
  const { event, minutes } = props;

  const { startPercent, lengthPercent, endPercent } = startEndToPercents({
    rangeStartDate: minutes[0],
    eventStartDate: moment(event.tripSettings.transitOptions.departureTime),
    rangeEndDate: minutes[minutes.length - 1],
    eventEndDate: moment(event.tripSettings.transitOptions.arrivalTime)
  });
  return (
    <View
      style={{
        display: "flex",
        width: "100%",
        height: "20px",
        flexDirection: "row"
      }}
    >
      <View
        style={{
          display: "flex-inline",
          height: "100%",
          width: startPercent
        }}
      />
      <View
        style={{
          display: "flex-inline",
          height: "100%",
          width: lengthPercent,
          backgroundColor: "red",
          opacity: 0.7
        }}
      />
      <View
        style={{
          display: "flex-inline",
          height: "100%",
          width: endPercent
        }}
      />
    </View>
  );
};
const DayRange = props => {
  const { startDate, endDate, events } = props;

  const minutes = Array.from(
    Array(endDate.diff(startDate, "minutes"))
  ).map((empty, minute) => {
    return moment(startDate).add(minute, "minute").startOf("minute");
  });
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <View
        style={{
          width: "100%",
          height: "50px",
          display: "flex",
          flexDirection: "row"
        }}
      >
        {minutes.map(minute => <Minute minute={minute} />)}
      </View>
      <View
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "absolute",
          zIndex: 99
        }}
      >
        {Object.keys(events)
          .reduce((p, c) => p.concat(events[c]), [])
          .map(e => <Event minutes={minutes} event={e} />)}
      </View>
    </View>
  );
};
const Day = props => {
  const { day } = props;
  const hours = Array(24).map((blank, hour) => moment(day).hour(hour));
  return (
    <View
      style={{
        height: "100%",
        display: "inline-flex",
        backgroundColor: "white",
        flexGrow: 1,
        border: "1px solid #333 "
      }}
    >
      {hours.map(hour => <Hour hour={hour} />)}
    </View>
  );
};
const Hour = props => {
  const { hour } = props;
  const minutes = Array(60).map((blank, minute) => moment(hour).minute(minute));

  return (
    <View
      style={{
        height: "100%",
        display: "inline-flex",
        backgroundColor: "white",
        flexGrow: 1,
        border: "1px solid #333 ",
        width: "100%"
      }}
    />
  );
};
const Minute = props => {
  const { minute } = props;

  return (
    <View
      style={{
        height: "100%",
        display: "inline-flex",
        backgroundColor: "white",
        flexGrow: 1,
        //          border: "1px solid #333 ",
        width: "100%"
      }}
    />
  );
};
const mapStateToProps = state => {
  return {
    journey: state.journey,
    journeyPanel: state.journey.panels.journeyPanel
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(JourneyPanel);
function outageEventStyleCB(event, state) {
  const color = event.get("type") === "Planned" ? "#998ec3" : "#f1a340";
  switch (state) {
    case "normal":
      return {
        fill: event.get("color")
      };
    case "hover":
      return {
        fill: event.color,
        opacity: 0.4
      };
    case "selected":
      return {
        fill: event.color
      };
  }
}
