class SearchPanel extends Component {
  render() {
    const { expanded, onClick } = this.props;
    return (
      <View
        onClick={onClick}
        style={{
          left: "200px",
          position: "absolute",
          top: "20px",
          display: "inline-block",
          boxSizing: "border-box",
          zIndex: 999
        }}
      >
        {this.props.children}
      </View>
    );
  }
}
