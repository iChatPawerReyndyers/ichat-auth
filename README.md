# `@ichatpawer/auth-sdk`

Reusable authentication UI and API client for React Native CLI apps. The SDK
exports an embeddable `AuthFlow`; it does not create a `NavigationContainer`.

## Install from Git

```sh
npm install git+https://github.com/iChatPawerReyndyers/ichat-auth.git#main
```

For release builds, pin the dependency to a tag or commit SHA instead of the
moving `main` branch. The host must use React 19.1+ and React Native 0.86+.

## Use in a host app

```tsx
import { AuthFlow, AuthSdkProvider } from "@ichatpawer/auth-sdk";

export function Login() {
	return (
		<AuthSdkProvider
			config={{
				apiBaseUrl: "https://auth-be-1qyi.onrender.com/api/auth",
				appId: "your-app-id",
				primaryColor: "#F5A623",
				socialLoginEnabled: false,
				onAuthenticated: (response) => {
					// Continue only after the SDK completes the required profile gate.
					console.log(response.username, response.profileComplete);
				},
				onCancel: () => {},
			}}
		>
			<AuthFlow />
		</AuthSdkProvider>
	);
}
```

`apiBaseUrl` must include `/api/auth`. The provider supplies API URL, `appId`,
brand color, OAuth configuration, and callbacks. `AuthFlow` manages login,
registration, forgot-password navigation internally and can be rendered inside
the host's existing shell. Its success response includes username and profile
status plus a short-lived, app-audience `accessToken`. The token is for a
trusted app backend to exchange; do not persist it as a long-lived client
session token.

## Native peer dependencies

Install the SDK's peer dependencies in the host app: `@react-native-community/blur`,
`@react-native-google-signin/google-signin`, `react-native-fbsdk-next`, React,
and React Native. Android autolinking is handled by the CLI; rebuild the app
after installation. For iOS, run `npx pod-install` and rebuild.

Google/Facebook buttons are disabled unless `socialLoginEnabled` is true and
the corresponding client/app ID is configured. Provider-specific files and
credentials must also be configured in the host's native projects. Never put
backend secrets or database credentials in the client.

## Backend and host identity limitation

The shared backend does not issue a Cartculate numeric user ID. Cartculate's
backend must exchange the signed Auth token for its own local user ID. Existing
Cartculate accounts require one-time linking with their old Cartculate
credentials; the bridge must not link on username or unverified email alone.
Add `cartculate` to the Auth backend free-client list if Cartculate should
bypass its subscription gate. Password-reset SMS requires a configured SMS
provider on the backend.

## Demo app development

### Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
