/* eslint-disable import/first */

// Entry Point App
// ------------------------------------
if (__DEV__) {
  // Load Reactotron configuration in development. We don't want to
  // include this in our production bundle, so we are using `if (__DEV__)`
  // to only execute this in development.
  require("./devtools/ReactotronConfig.ts")
}
import "./i18n"
import "./utils/ignoreWarnings"
import { useFonts } from "expo-font"
import React, { useEffect } from "react"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import * as Linking from "expo-linking"
import { useInitialRootStore, useStores } from "./models"
import { AppNavigator, useNavigationPersistence } from "./navigators"
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary"
import * as storage from "./utils/storage"
import { customFontsToLoad } from "./theme"
import Config from "./config"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ViewStyle } from "react-native"
import { quintonTheCybear } from "./utils/QuintonTheCybear"
import { leaderboardServiceInstance } from "./services/Leaderboard"
import { QrVenueNotificationsManager } from "./components"
import { authService } from "./services/Auth"
import { api } from "./services/api"
export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

// Web linking configuration
const prefix = Linking.createURL("/")
const config = {
  screens: {
    Login: {
      path: "",
    },
    Welcome: "welcome",
    Main: {
      screens: {
        Scanner: {
          path: "scanner/:queryIndex?/:itemIndex?",
        },
        Map: "map",
        Community: "community",
        Me: "me",
      },
    },
  },
}

interface AppProps {
  hideSplashScreen: () => Promise<boolean>
}

/**
 * This is the root component of our app.
 */
function App(props: AppProps) {
  const { hideSplashScreen } = props
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  const [areFontsLoaded] = useFonts(customFontsToLoad)
  const {
    termsAndConditionsStore,
    debugStore,
    locationStore,
    authenticationStore: { setAuthToken, setAuthUsername, authToken, authUsername },
  } = useStores()

  const { rehydrated } = useInitialRootStore(async () => {
    // This runs after the root store has been initialized and rehydrated.

    // If your initialization scripts run very fast, it's good to show the splash screen for just a bit longer to prevent flicker.
    // Slightly delaying splash screen hiding for better UX; can be customized or removed as needed,
    // Note: (vanilla Android) The splash-screen will not appear if you launch your app via the terminal or Android Studio. Kill the app and launch it normally by tapping on the launcher icon. https://stackoverflow.com/a/69831106
    // Note: (vanilla iOS) You might notice the splash-screen logo change size. This happens in debug/development mode. Try building the app for release.

    // APP SETUP ----------->

    try {
      await termsAndConditionsStore.setUnsignedDocumentsToState()

      debugStore.addInfoMessage("Checked to see if user needed to sign up to date contract.")

      await leaderboardServiceInstance.incrementDummyLeadboardData()
      ;(async () => {
        await authService.initializeTokens()
        const tokenDoesExist = await authService.tokenDoesExist()
        if (tokenDoesExist) {
          // Set Auth: Bearer Token...
          authService.validToken && api.setIdentityToken(authService.validToken)

          // Set username from phone secure store...
          const username = await authService.getUsername()
          username && setAuthUsername(username)

          // Set token to global state to take user to main screens...
          authService.validToken && setAuthToken(authService.validToken)
        } else {
          console.log("no token")
          console.log(authToken, authUsername)
        }
      })()
    } catch (error) {
      __DEV__ && console.error(`Failed to init some app functions: ${error}`)
      debugStore.addErrorMessage(`Failed to init some app functions: ${error}`)
    }

    // <----------------- APP SETUP
    hideSplashScreen()
  })

  const recurringlyUpdateLocation = async () => {
    try {
      await locationStore.getAndSetCurrentPosition()
    } catch (error) {
      console.error(`Failed to get location: ${error}`)
    }
  }

  useEffect(() => {
    let locationIntervalId: NodeJS.Timeout
    if (locationStore.permission) {
      locationIntervalId = setInterval(recurringlyUpdateLocation, 10000)
      debugStore.addInfoMessage("Started location updates")
    }
    // cleanup
    return () => clearInterval(locationIntervalId)
  }, [locationStore.permission])

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!rehydrated || !isNavigationStateRestored || !areFontsLoaded) return null

  const linking = {
    prefixes: [prefix],
    config,
  }

  // otherwise, we're ready to render the app
  return (
    <>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ErrorBoundary catchErrors={Config.catchErrors}>
          <GestureHandlerRootView style={$container}>
            <AppNavigator
              linking={linking}
              initialState={initialNavigationState}
              onStateChange={onNavigationStateChange}
            />
          </GestureHandlerRootView>
        </ErrorBoundary>
      </SafeAreaProvider>
    </>
  )
}

export default App

const $container: ViewStyle = {
  flex: 1,
}
