export type AuthScreenName = "Login" | "Register" | "ForgotPassword";

export interface AuthFlowNavigation {
  navigate: (screen: AuthScreenName) => void;
}
