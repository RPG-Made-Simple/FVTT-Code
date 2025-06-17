export class UtilsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class UtilsSocketError extends UtilsError {};
export class UtilsSocketRemoteException extends UtilsSocketError {};
export class UtilsSocketInvalidUserError extends UtilsSocketError {};
export class UtilsSocketNoGMConnectedError extends UtilsSocketError {};
export class UtilsSocketUnregisteredHandlerError extends UtilsSocketError {};
export class UtilsSocketInternalError extends UtilsSocketError {};
