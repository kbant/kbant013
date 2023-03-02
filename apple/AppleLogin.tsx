import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  appleAuth,
  appleAuthAndroid,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import {
  AppleUser,
  doSignIntByApple,
  doSignOutByApple,
} from './AppleLoginAction';

export const AppleLogin = () => {
  const [user, setUser] = useState<AppleUser | null>();

  const doSignIn = async () => {
    setUser(await doSignIntByApple());
  };

  const doSignOut = async () => {
    if (user) {
      await doSignOutByApple(user.userId);
    }
    setUser(null);
  };

  useEffect(() => {
    if (!appleAuth.isSupported) {
      return;
    }
    // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    return appleAuth.onCredentialRevoked(async () => {
      console.warn(
        'If this function executes, User Credentials have been Revoked',
      );
    });
  }, []);

  if (!appleAuth.isSupported) {
    return (
      <View style={styles.container}>
        <Text style={styles.not_supported}>
          Apple Authentication is not supported on this device.
        </Text>
      </View>
    );
  }

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
        <AppleButton
          buttonStyle={AppleButton.Style.BLACK}
          buttonType={AppleButton.Type.SIGN_IN}
          style={{
            width: 160, // You must specify a width
            height: 45, // You must specify a height
          }}
          onPress={() => doSignIn()}
        />
      )}
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
  not_supported: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logout_btn_signout_container: {
    width: '80%',
    height: '10%',
    marginTop: 20,
    marginLeft: 50,
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
