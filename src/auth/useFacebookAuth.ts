import { useCallback } from "react";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";

/**
 * Returns a signIn() you can call from a button press. On success, calls
 * onAccessToken with the Facebook access token — send that to
 * POST /api/auth/oauth/facebook.
 *
 * Requires native setup beyond this file: Facebook App ID in
 * AndroidManifest.xml/strings.xml (Android) and Info.plist (iOS) — see
 * backend/docs/OAUTH_SETUP.md.
 */
export function useFacebookAuth(onAccessToken: (accessToken: string) => void) {
  const signIn = useCallback(async () => {
    const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);
    if (result.isCancelled) return; // user closed the dialog — not an error to surface

    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw new Error("Facebook sign-in did not return an access token");
    }
    onAccessToken(data.accessToken);
  }, [onAccessToken]);

  return { signIn };
}
