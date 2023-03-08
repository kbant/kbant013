import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import {LoginUser} from '../LoginUser';
import {UserType} from '../UserType';

export interface GoogleUser extends LoginUser {}

GoogleSignin.configure({
  webClientId:
    '422166043165-0slild65ph5a3eo27300nbhrftegm5l8.apps.googleusercontent.com',
  // '422166043165-pljcccacln9r2in0v3phsgl6r71vpmpf.apps.googleusercontent.com',
  iosClientId:
    '422166043165-k7i5m4sn8fj1qt1ci06ninu8snet4qk4.apps.googleusercontent.com',
});

export async function doSignOutByGoogle() {
  const isSignedIn = await GoogleSignin.isSignedIn();
  if (isSignedIn) {
    try {
      await auth().signOut();
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      console.log('Sign Out');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  }
}
export async function onSignInByFirebase(): Promise<GoogleUser | null> {
  try {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    if (!idToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }

    console.log('Response', idToken);
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign the user in with the credential
    const userCredential = await auth().signInWithCredential(googleCredential);
    console.log('google User', userCredential);
    const currentUser = await GoogleSignin.getCurrentUser();
    console.log('current User', currentUser);
    return {
      type: UserType.GOOGLE,
      userId: '',
      nickname: '' || 'Unknown',
      token: idToken,
    };
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('CANCELED');
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
      console.error(error);
      Alert.alert('Error', error.message);
    }
  }
  return null;
}
