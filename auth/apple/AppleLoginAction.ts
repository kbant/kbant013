import {appleAuth} from '@invertase/react-native-apple-authentication';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import {LoginUser} from '../LoginUser';
import {UserType} from '../UserType';

export interface AppleUser extends LoginUser {
  nonce?: string;
  user?: FirebaseAuthTypes.User;
}

export async function doSignIntByApple(): Promise<AppleUser | null> {
  try {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // Note: it appears putting FULL_NAME first is important, see issue #293
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }

    console.log('Response', appleAuthRequestResponse);

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    console.log('Credential Status', credentialState);
    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      return {
        type: UserType.APPLE,
        userId: appleAuthRequestResponse.user,
        nickname: appleAuthRequestResponse.fullName?.nickname || 'Unknown',
        token: appleAuthRequestResponse.identityToken,
        nonce: appleAuthRequestResponse.nonce,
      };
    }
  } catch (error: any) {
    console.error('Error', error);
    Alert.alert(error);
  }
  return null;
}

export async function doSignOutByApple(userId: string) {
  await auth().signOut();
}
export async function onSignInByFirebase(): Promise<AppleUser | null> {
  try {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // Note: it appears putting FULL_NAME first is important, see issue #293
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }

    console.log('Response', appleAuthRequestResponse);

    // Create a Firebase credential from the response
    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );
    // Sign the user in with the credential
    const userCredential = await auth().signInWithCredential(appleCredential);
    console.log('apple User', userCredential);
    return {
      type: UserType.APPLE,
      userId: appleAuthRequestResponse.user,
      nickname: appleAuthRequestResponse.fullName?.nickname || 'Unknown',
      token: appleAuthRequestResponse.identityToken,
      nonce: appleAuthRequestResponse.nonce,
      user: userCredential.user,
    };
  } catch (error: any) {
    if (error.code === '1001') {
      console.log('CANCELED');
    } else {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  }
  return null;
}
