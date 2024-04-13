/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, SignIn, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { useColorScheme } from "react-native"

import Config from "../config"
import { useStores } from "../models"
import { MainNavigator, TabParamList } from "./MainNavigator"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"
import * as Screens from "app/screens"
import { authService } from "app/services/Auth"
import { api } from "app/services/api"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  SignUp: undefined
  Main: NavigatorScreenParams<TabParamList>
  // 🔥 Your screens go here
  PushNotifications: undefined
  MarketPlace: undefined
  TermsAndConditions: undefined
  Debug: undefined
  Information: undefined
  Leaderboard: undefined
  History: undefined
  Registration: undefined
  Username: undefined
  LogIn: undefined
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  const {
    locationStore,
    termsAndConditionsStore,
    debugStore,
    authenticationStore: {
      isAuthenticated,
      setAuthToken,
      setAuthUsername,
      authToken,
      authUsername,
    },
  } = useStores()

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
    ;(async () => {
      await authService.initializeTokens()
      const tokenDoesExist = await authService.tokenDoesExist()
      if (tokenDoesExist) {
        authService.validToken && api.setIdentityToken(authService.validToken)
        console.log("identity token in api on load is:", api.identityToken)
        const username = await authService.getUsername()
        username && setAuthUsername(username)
        authService.validToken && setAuthToken(authService.validToken)
      } else {
        console.log("no token")
        console.log(authToken, authUsername)
      }
    })()

    // cleanup
    return () => clearInterval(locationIntervalId)
  }, [locationStore.permission])

  console.log("render app navigator")
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        navigationBarHidden: true,
      }}
    >
      {isAuthenticated ? (
        <>
          {termsAndConditionsStore.userHasTermsToSign ? (
            <Stack.Screen name="TermsAndConditions" component={Screens.TermsAndConditionsScreen} />
          ) : (
            <>
              <Stack.Screen name="Main" component={MainNavigator} />
              <Stack.Screen name="Debug" component={Screens.DebugScreen} />
              <Stack.Screen name="Information" component={Screens.InformationScreen} />
              <Stack.Screen name="Leaderboard" component={Screens.LeaderboardScreen} />
              <Stack.Screen name="History" component={Screens.HistoryScreen} />
            </>
          )}
        </>
      ) : (
        <>
          <Stack.Screen name="SignUp" component={Screens.SignUpScreen} />
          <Stack.Screen name="Registration" component={Screens.Registration} />
          <Stack.Screen name="Username" component={Screens.UsernameScreen} />
          <Stack.Screen name="LogIn" component={Screens.LogIn} />
        </>
      )}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
})
