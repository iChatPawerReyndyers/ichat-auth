// Central place for build/runtime flags.
//
// IS_DEV_MODE mirrors the backend's `app.security.skip-password-check` flag
// (see backend/src/main/resources/application-dev.properties). It defaults
// to false so a normal build never shows the "testing mode" banner or
// implies passwords are being skipped.
//
// Flip this only for local development builds — never commit it as `true`.
export const IS_DEV_MODE = false;

// --- Multi-app identity ---
// Sent as `appId` with every login/Google/Facebook call, so the shared
// backend knows which app is asking and whether it's on the free list
// (app.clients.free-ids — currently "stickies,galleries"; everything else,
// Calculator included, requires an active subscription). Set this to
// whichever app this particular build actually is.
export const APP_ID = "stickies";
export const AUTH_API_BASE_URL = "https://auth-be-1qyi.onrender.com/api/auth";

// --- Google / Facebook OAuth ---
// Set to false to show the Google/Facebook buttons in a disabled, blurred
// state until their provider credentials and native setup are ready.
export const SOCIAL_LOGIN_ENABLED = false;

// Fill these in with the values from backend/docs/OAUTH_SETUP.md. None of
// these are secret — they're meant to be embedded in the client app. The
// Facebook App Secret and Google verification happen only on the backend
// (see application.properties) and must never appear here.
export const GOOGLE_WEB_CLIENT_ID = "";
export const GOOGLE_IOS_CLIENT_ID = "";
export const GOOGLE_ANDROID_CLIENT_ID = "";
export const FACEBOOK_APP_ID = "";
