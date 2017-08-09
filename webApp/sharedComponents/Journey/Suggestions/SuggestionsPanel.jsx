class PlaceSuggestionsPanel extends Component {
  render() {
    const { placeSuggestions, onImageClick } = this.props;
    return (
      <View
        style={{
          bottom: "0",
          position: "absolute",
          flex: 1,
          display: "flex",
          flexDirection: "row",
          overflowX: "scroll",
          width: "100%"
        }}
      >
        {placeSuggestions.map(place => {
          if (place.photos) {
            const width =
              100 * place.photos[0].height / place.photos[0].width + "px";
            return (
              <Image
                source={`https://maps.googleapis.com/maps/api/place/photo?maxheight=100&photoreference=${place
                  .photos[0]
                  .photo_reference}&key=AIzaSyB_O7dkvfLlFZ7DZYZPhEbLrJeG8br6up0`}
                style={{ height: "100px", width: width, margin: "5px" }}
                onClick={() => onImageClick({ place })}
              />
            );
          } else {
            return null;
          }
        })}
      </View>
    );
  }
}
