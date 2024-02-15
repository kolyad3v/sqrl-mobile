import { types } from "mobx-state-tree"
import { MessageModel } from "./MessageModel"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { pushNotificationService } from "../services/PushNotifications"

export const PushNotificationsStoreModel = types
  .model("PushNotificationsStore")
  .props({
    notification: types.maybe(MessageModel),
    expoPushToken: types.maybe(types.string),
    pushNotificationsError: types.maybe(types.string),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchExpoPushToken() {
      try {
        store.notification = MessageModel.create({
          title: "Hello from QRLA!",
          body: "Welcome to the QRLA app!",
          sound: "default",
          data: { url: "https://www.qrla.io" },
        })
        const token = await pushNotificationService.registerForPushNotificationsAsync()
        if (token) {
          store.setProp("expoPushToken", token)
        } else {
          store.pushNotificationsError = "Failed to get push token for push notification!"
        }
      } catch (error) {
        console.error(error)
      }
    },
    setNotification(notification: any) {
      store.setProp("notification", notification)
    },
    clearNotification() {
      let reset = MessageModel.create({
        title: "Hello from QRLA!",
        body: "Welcome to the QRLA app!",
        sound: "default",
        data: { url: "https://www.qrla.io" },
      })
      store.notification = reset
    },

    async sendPushNotificationOfQrVenueToUser() {
      // get user location
      // send userlocation to BE and get response
      // if null, return
      // if response, prep message to push to user
      // send push notification to user
    },
  }))
// .views((store) => ({
//   get expoPushToken() {
//     return store.expoPushToken ? store.expoPushToken : "No token"
//   },
// }))
