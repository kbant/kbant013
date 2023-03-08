import React from 'react';
import {StyleSheet, View} from 'react-native';
import {AppleLogin} from './auth/apple/AppleLogin';
import {GoogleLogin} from './auth/google/GoogleLogin';

export const App = () => {
  return (
    <View style={styles.container}>
      <AppleLogin />
      <GoogleLogin />
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
