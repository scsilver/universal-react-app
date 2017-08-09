class RoutesPanel extends Component {
  render() {
    const { expanded, onClick, trips } = this.props;
    const display = expanded ? "flex" : "none";
    const padding = expanded ? "10px" : "0px";
    const hasTrips = trips.length > 0;
    return (
      <View
        style={{
          position: "absolute",
          right: "0px",
          top: "10%",
          height: "50%",
          overflowY: "scroll",
          flex: 1,
          display: "flex",
          flexDirection: "row"
        }}
      >
        <View
          onClick={onClick}
          style={{
            position: "relative",
            display: "inline-block",
            width: "30px",
            padding: "5px",
            height: "30px",
            backgroundColor: "white"
          }}
        >
          <Image
            style={{
              position: "relative",
              width: "20px",
              height: "20px"
            }}
            source={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Ic_directions_48px.svg/2000px-Ic_directions_48px.svg.png"
            }
          />
        </View>
        {hasTrips &&
          expanded &&
          <View
            style={{
              display: display,
              height: "100%",
              padding: padding,
              backgroundColor: "rgba(255,255,255,0.7)"
            }}
          >
            {this.props.children}
          </View>}
      </View>
    );
  }
}
