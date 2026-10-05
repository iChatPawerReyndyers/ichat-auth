import { useAuthSdkConfig } from "../sdk/AuthSdkProvider";
import {
  AuthResponse,
  CompleteProfilePayload,
  FacebookLoginPayload,
  ForgotPasswordPayload,
  GoogleLoginPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "../types/auth";

async function postJson<T>(baseUrl: string, path: string, body: T): Promise<AuthResponse> {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const response = await fetch(`${normalizedBaseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.message ||
      (data?.errors ? Object.values(data.errors).join("\n") : "Request failed");
    throw new Error(message);
  }

  return data as AuthResponse;
}

export function useAuthApi() {
  const { apiBaseUrl, appId } = useAuthSdkConfig();

  return {
    login: (payload: Omit<LoginPayload, "appId">) =>
      postJson(apiBaseUrl, "/login", { ...payload, appId }),
    register: (payload: RegisterPayload) => postJson(apiBaseUrl, "/register", payload),
    loginWithGoogle: (payload: Omit<GoogleLoginPayload, "appId">) =>
      postJson(apiBaseUrl, "/oauth/google", { ...payload, appId }),
    loginWithFacebook: (payload: Omit<FacebookLoginPayload, "appId">) =>
      postJson(apiBaseUrl, "/oauth/facebook", { ...payload, appId }),
    forgotPassword: (payload: ForgotPasswordPayload) =>
      postJson(apiBaseUrl, "/password/forgot", payload),
    resetPassword: (payload: ResetPasswordPayload) =>
      postJson(apiBaseUrl, "/password/reset", payload),
    completeProfile: (payload: CompleteProfilePayload) =>
      postJson(apiBaseUrl, "/profile/complete", payload),
  };
}
