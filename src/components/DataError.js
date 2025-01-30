/* eslint-disable react-native/no-color-literals */
// Disabled because if a user wants to override it, they can pass dataErrorComponent with any customization
import PropTypes from 'prop-types';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const DataError = ({ testID, style }) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <Text style={styles.text}>An issue occurred while calculating the graph data, so it may be inaccurate.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    margin: 4,
    marginVertical: 8,
    padding: 4
  },
  text: {
    color: '#000000',
    textAlign: 'center'
  }
});

DataError.propTypes = {
  testID: PropTypes.string,
  style: PropTypes.object
};

export default DataError;
