import { ApisauceInstance, create } from "apisauce"
import { LocationObject } from "expo-location"
import * as Location from "expo-location"
import { QrVenueNotificationsConfig } from "./QrVenueNotificationService.types"

export class QrVenueNotificationService {
  currentLocation: LocationObject | null = null
  apisauce_locationEndPoint: ApisauceInstance
  apisauce_nearbyEndPoint: ApisauceInstance
  config: QrVenueNotificationsConfig

  constructor() {
    this.config = {
      baseUrl_locationEndPoint:
        "http://qrlaapi-env.eba-6ipnp3mc.eu-west-2.elasticbeanstalk.com/api/venues/location",
      baseUrl_nearbyEndPoint:
        "http://qrlaapi-env.eba-6ipnp3mc.eu-west-2.elasticbeanstalk.com/api/venues/nearby",
      timeout: 10000,
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    }
    this.apisauce_locationEndPoint = create({
      baseURL: this.config.baseUrl_locationEndPoint,
      timeout: this.config.timeout,
      headers: this.config.headers,
    })
    this.apisauce_nearbyEndPoint = create({
      baseURL: this.config.baseUrl_nearbyEndPoint,
      timeout: this.config.timeout,
      headers: this.config.headers,
    })
  }

  get location(): LocationObject | null {
    return this.currentLocation
  }

  async setCurrentLocation(): Promise<void> {
    this.currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    })
  }

  async seeIfUserLocationMatchesQrVenueGeoFence(
    latitude: number,
    longitude: number,
  ): Promise<false | { url: string; company: string }> {
    const response = await this.apisauce_locationEndPoint.get("", { latitude, longitude })

    if (response.ok) {
      //@ts-ignore
      // TODO - Sort typing
      return { url: response.data[0].url.url, company: response.data[0].company }
    } else {
      console.error(`Failed at get request to API -> ${response.data}, ${response.problem}`)
      return false
    }
  }
}

export const qrVenueNotificationService = new QrVenueNotificationService()
