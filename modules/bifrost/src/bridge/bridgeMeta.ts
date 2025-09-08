export interface BridgeMeta {
  /** Information about the lighting automation provided by the system */
  lighting?: {
    /** Does the system provide any type of item lighting automation? */
    automate: boolean,
    /** Does the system change the image of an item during automation? */
    changeImg: boolean,
  }
}
