import React from 'react';
import {StyleSheet, View} from 'react-native';
import {AppleLogin} from './apple/AppleLogin';

export const App = () => {
  return (
    <View style={styles.container}>
      <AppleLogin />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
