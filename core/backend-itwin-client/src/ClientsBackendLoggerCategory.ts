/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Logging
 */

/** Logger categories used by this package
 * @note All logger categories in this package start with the `backend-itwin-client` prefix.
 * @see [Logger]($bentley)
 * @public
 */
export enum ClientsBackendLoggerCategory {
  /** The logger category used for interactions with iModelHub.
   * @note Should match ClientsBackendLoggerCategory.IModelHub from @bentley/imodelhub-client.
   */
  IModelHub = "imodelhub-client.iModelHub",

  /** The logger category used for Authorization */
  Authorization = "backend-itwin-client.Authorization",
}