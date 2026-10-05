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
import { APP_ID } from "../config/appConfig";

const BASE_URL = "https://auth-be-1qyi.onrender.com/api/auth";

async function postJson<T>(path: string, body: T): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}${path}`, {
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

// login/loginWithGoogle/loginWithFacebook take the caller's payload WITHOUT
// appId and inject it here from config — so screens don't need to know
// about it. appId tells the backend which app is asking, which decides
// whether the subscription gate applies (see app.clients.free-ids).

export function login(payload: Omit<LoginPayload, "appId">): Promise<AuthResponse> {
  return postJson("/login", { ...payload, appId: APP_ID });
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return postJson("/register", payload);
}

export function loginWithGoogle(payload: Omit<GoogleLoginPayload, "appId">): Promise<AuthResponse> {
  return postJson("/oauth/google", { ...payload, appId: APP_ID });
}

export function loginWithFacebook(payload: Omit<FacebookLoginPayload, "appId">): Promise<AuthResponse> {
  return postJson("/oauth/facebook", { ...payload, appId: APP_ID });
}

export function forgotPassword(payload: ForgotPasswordPayload): Promise<AuthResponse> {
  return postJson("/password/forgot", payload);
}

export function resetPassword(payload: ResetPasswordPayload): Promise<AuthResponse> {
  return postJson("/password/reset", payload);
}

export function completeProfile(payload: CompleteProfilePayload): Promise<AuthResponse> {
  return postJson("/profile/complete", payload);
}
