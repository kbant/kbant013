import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {GoogleUser, doSignOut, onSignInByFirebase} from './GoogleLoginAction';

export const GoogleLogin = () => {
  const [user, setUser] = useState<GoogleUser | null>();
  const [isSigninInProgress, setSigninInProgress] = useState(false);

  const doSignIn = async () => {
    setSigninInProgress(true);
    setUser(await onSignInByFirebase());
    setSigninInProgress(false);
  };

  const doSignOut = async () => {
    if (user) {
      await doSignOut();
    }
    setUser(null);
  };

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      {user ? (
        <TouchableOpacity
          style={styles.logout_btn_signout_container}
          onPress={() => doSignOut()}>
          <View style={styles.logout_btn_signout_view}>
            <View style={styles.logout_btn_label_view}>
              <Text style={styles.logout_btn_signout_label}>Sign Out</Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <GoogleSigninButton
          style={{width: 192, height: 48}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={() => doSignIn()}
          disabled={isSigninInProgress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  not_supported: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logout_btn_signout_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logout_btn_signout_view: {
    width: '80%',
    height: 45,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#000',
  },
  logout_btn_label_view: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logout_btn_signout_label: {
    fontSize: 16,
    color: '#FFF',
  },
});
