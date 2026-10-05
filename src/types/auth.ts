export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export interface LoginPayload {
  username: string;
  password: string;
  appId: string;
}

export interface RegisterPayload {
  username: string;
  email?: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  birthYear: number;
  phoneNumber: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  username?: string;
  // False when birthYear/phoneNumber are still missing (Google/Facebook
  // sign-ups only). The caller must block on this — see CompleteProfileModal.
  profileComplete?: boolean;
}

export interface CompleteProfilePayload {
  username: string;
  birthYear: number;
  phoneNumber: string;
}

export interface GoogleLoginPayload {
  idToken: string;
  appId: string;
}

export interface FacebookLoginPayload {
  accessToken: string;
  appId: string;
}

export interface ForgotPasswordPayload {
  username: string;
}

export interface ResetPasswordPayload {
  username: string;
  otp: string;
  newPassword: string;
  confirmNewPassword: string;
}
