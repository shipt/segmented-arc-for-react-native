/* eslint-disable react-native/no-color-literals */
// Disabled because if the user wants to override it, he can pass dataErrorComponent with any customization
import PropTypes from 'prop-types';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const DataError = ({ testID }) => {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.text}>An issue occurred while calculating the graph data, so it may be inaccurate.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    margin: 4,
    padding: 4
  },
  text: {
    color: '#000000',
    textAlign: 'center'
  }
});

DataError.propTypes = {
  testID: PropTypes.string
};

export default DataError;
