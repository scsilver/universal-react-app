import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View, Text, Image, StyleSheet } from 'react-primitives';

class HelloWorld extends Component {
    render() {
        return (
            <View>
                <Text>Hello World</Text>
            </View>
        );
    }
}

HelloWorld.propTypes = {
};

export default HelloWorld;