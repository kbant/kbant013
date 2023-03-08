import {UserType} from './UserType';

export interface LoginUser {
  type: UserType;
  userId: string;
  nickname: string;
  token: string;
  refreshToken?: string;
}
