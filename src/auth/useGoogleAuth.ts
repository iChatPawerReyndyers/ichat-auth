import { useCallback } from "react";
import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
} from "@react-native-google-signin/google-signin";
import { useAuthSdkConfig } from "../sdk/AuthSdkProvider";

let configuredClientIds = "";
function ensureConfigured(webClientId?: string, iosClientId?: string) {
  const configKey = `${webClientId ?? ""}|${iosClientId ?? ""}`;
  if (configuredClientIds === configKey) return;
  GoogleSignin.configure({
    // webClientId is what the backend verifies the token's `aud` against —
    // required even on native, per @react-native-google-signin/google-signin's
    // docs, to get an idToken back at all.
    webClientId: webClientId || undefined,
    iosClientId: iosClientId || undefined,
    // The Android client ID isn't passed here — on Android the client ID
    // instead comes from google-services.json / the SHA-1 fingerprint
    // registered in Google Cloud Console (see OAUTH_SETUP.md).
  });
  configuredClientIds = configKey;
}

/**
 * Returns a signIn() you can call from a button press. On success, calls
 * onIdToken with the Google ID token — send that to
 * POST /api/auth/oauth/google.
 *
 * Requires native setup beyond this file: google-services.json (Android)
 * and GoogleService-Info.plist / URL scheme (iOS) — see
 * backend/docs/OAUTH_SETUP.md.
 */
export function useGoogleAuth(onIdToken: (idToken: string) => void) {
  const { google } = useAuthSdkConfig();
  const signIn = useCallback(async () => {
    ensureConfigured(google?.webClientId, google?.iosClientId);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const result = await GoogleSignin.signIn();
      const idToken = result.data?.idToken;
      if (idToken) {
        onIdToken(idToken);
      } else {
        throw new Error("Google sign-in did not return an ID token");
      }
    } catch (error) {
      if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) {
        return; // user closed the dialog — not an error to surface
      }
      throw error;
    }
  }, [google?.webClientId, google?.iosClientId, onIdToken]);

  return { signIn };
}
