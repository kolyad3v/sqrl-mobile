/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type { ApiConfig, ApiFeedResponse } from "./api.types"
import { secureStoreInstance } from "../SecureStore/SecureStorageService"
import { authService } from "../Auth"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 25000,
  headers: {
    Accept: "application/json",
    "Accept-encoding": "gzip, deflate",
    "Content-Type": "application/json",
  },
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  auth: ApisauceInstance
  config: ApiConfig
  apisauceForPushNotifications: ApisauceInstance
  identityToken: string | null = ""

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: this.config.headers,
    })
    this.auth = create({
      baseURL: Config.AUTH_URL,
      timeout: this.config.timeout,
      headers: this.config.headers,
    })
    const authMonitor = (res: any) => console.log(res)
    this.auth.addMonitor(authMonitor)
    this.apisauceForPushNotifications = create({
      baseURL: "https://exp.host/--/api/v2/push",
      timeout: 10000,
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    })
  }

  async setIdentityToken(token?: string) {
    if (token) {
      this.identityToken = token
    } else {
      this.identityToken = authService.validToken
    }

    this.apisauce.setHeader("Authorization", `Bearer ${this.identityToken}`)
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
