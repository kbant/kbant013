import {LoginUser} from './AppleLoginAction';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {Alert} from 'react-native';

export enum UserType {
  APPLE,
  GOOGLE,
  FACEBOOK,
  KAKAO,
  NAVER,
  TWITTER,
  MICROSOFT,
}
export interface LoginUser {
  type: UserType;
  userId: string;
  nickname: string;
  token: string;
  refreshToken?: string;
}

export interface AppleUser extends LoginUser {
  nonce: string;
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
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGOUT,
    user: userId
  });

  console.log('Response', appleAuthRequestResponse);
  const credentialState = await appleAuth.getCredentialStateForUser(
    appleAuthRequestResponse.user,
  );

  if (credentialState === appleAuth.State.REVOKED) {
    console.log('UserStore::logout - apple credential successfully revoked');
  }
}
export async function onLoginByFirebase() {
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
    // const appleCredential = auth.AppleAuthProvider.credential(
    //   identityToken,
    //   nonce,
    // );
  } catch (error: any) {
    console.error('Error', error);
    Alert.alert(error);
  }
}
