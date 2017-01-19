'use strict';

/**
 * Used in the request body to pass data to the server.
 */
export class RequestContainer<T> {
  /**
   * @param clientCtx UUID to identify broadcast that holds data already received by the resulting REST response
   * @param content content, like User, BlindsDevice, ...
   */
  constructor(public clientCtx: string, public content: T){}
}

/**
 * Used in the response body to return data to the client.
 */
export class ResponseContainer<T> {
  /**
   * @param content content, like User, BlindsDevice, ...
   */
  constructor(public content: T){}
}

/**
 * Used in the response body to return data collection to the client.
 */
export class ResponseCollectionContainer<T> {
  /**
   * @param content content collection, like User[], BlindsDevice[], ...
   */
  constructor(public content: T[]){}
}

/**
 * Container for broadcast
 */
export class IBroadcastContainer<T> {
  /**
   * @param clientCtx UUID to identify broadcast that holds data already received by the resulting REST response
   * @param contentType type of content being broadcast
   * @param content content, like User, BlindsDevice, ...
   */
  constructor(public clientCtx: string, public contentType: ContentType, public content: T){}
}

export const enum ContentType {
  USER, BLINDS_DEVICE, HUMIDITY_DEVICE, TEMPERATURE_DEVICE
}
