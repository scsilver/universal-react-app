import React, { Component } from "react";
import PropTypes from "prop-types";

import { View, Text, Image, StyleSheet } from "react-primitives";

class HelloWorld extends Component {
  render() {
    return (
      <View>
        <Image
          style={styles.image}
          source="https://community.cadence.com/resized-image/__size/940x0/__key/communityserver-blogs-components-weblogfiles/00-00-00-01-06/4544.kitten.jpg"
        />
        <Text style={styles.text}>Hello World</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  image: {
    height: 50,
    width: 50
  },
  text: {
    fontSize: 20
  }
});
HelloWorld.propTypes = {};

export default HelloWorld;
