import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { useStores } from "app/models"
import { qrVenueNotificationService } from "app/services/QrVenueNotifications"
import { pushNotificationService } from "app/services/PushNotifications"

export interface QrVenueNotificationsManagerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const QrVenueNotificationsManager = observer(function QrVenueNotificationsManager(
  props: QrVenueNotificationsManagerProps,
) {
  const { pushNotificationsStore, locationStore } = useStores()

  useEffect(() => {
    ;(async () => {
      const { latitude, longitude } = locationStore

      if (latitude === undefined || longitude === undefined) return

      let qrVenueApiResponse
      try {
        qrVenueApiResponse = await qrVenueNotificationService.getCompanyAndUrlOfMatchedQrVenue(
          latitude,
          longitude,
        )
      } catch (error) {
        console.error(`Failed to seeIfUserLocationMatchesQrVenueGeoFence: ${error}`)
      }

      try {
        await pushNotificationsStore.fetchExpoPushToken()
      } catch (error) {
        console.error(`Failed to fetchExpoPushToken: ${error}`)
      }

      const expoPushToken = pushNotificationsStore.expoPushToken

      if (qrVenueApiResponse && expoPushToken) {
        try {
          await pushNotificationService.sendPushNotificationToUser(expoPushToken, {
            title: `Welcome to ${qrVenueApiResponse.company}!`,
            body: "Click to see the trusted QR Destination!",
            sound: "default",
            data: { url: qrVenueApiResponse.url },
          })
        } catch (error) {
          console.error(`failed to sendPushNotificationToUser: ${error}`)
        }
      } else {
        console.warn(
          `False response or no push token in QrVenueNotificationManager: qrVenueApiResponse: ${qrVenueApiResponse} expoPushToken: ${expoPushToken}`,
        )
      }
    })()
  }, [])

  return <></>
})
