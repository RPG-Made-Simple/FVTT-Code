import { Misc } from ".";
import { UtilsSocketInternalError, UtilsSocketInvalidUserError, UtilsSocketNoGMConnectedError, UtilsSocketRemoteException, UtilsSocketUnregisteredHandlerError } from "./errors";
import { getGame } from "./futureProof";

enum RecipientType {
  ONE_GM,
  ALL_GMS,
  EVERYONE,
}

enum MessageType {
  COMMAND,
  REQUEST,
  RESPONSE,
  RESULT,
  EXCEPTION,
  UNREGISTERED,
}

interface SocketMessage {
  id?: string,
  type: MessageType,
  handlerName?: string,
  args?: any[],
  recipient?: RecipientType | string[],
  result?: any,
  userId?: string,
}

interface PendingRequest {
  handlerName: string;
  resolve: (value: any) => void;
  reject: (value: any) => void;
  recipient: RecipientType | string [],
}

export class SocketManager {
  private modules: Map<string, Socket> = new Map();
  private system?: Socket;

  constructor() {
    this.modules = new Map();
  }

  getSocketForModule(moduleId: string): Socket | undefined {
    const existingSocket = this.modules.get(moduleId);
    if (existingSocket) return existingSocket;

    const module = getGame().modules.get(moduleId);
    if (!module?.active) {
      console.error(
        `Cannot get a socket for '${moduleId}': no active module found`
      );
      return undefined;
    }
    if (!module.socket) {
      console.error(
        `Failed to get socket for module '${moduleId}'. Please set '"socket": true' in your manifest and restart Foundry`,
      );
      return undefined;
    }

    const newSocket = new Socket(moduleId, 'module');
    this.modules.set(moduleId, newSocket);
    return newSocket;
  }

  getSocketForSystem(systemId: string): Socket | undefined {
    const game = getGame();
    if (game.system.id !== systemId) {
      console.error(
        `Cannot get a socket for '${systemId}': system not active`,
      );
      return undefined;
    }

    if (this.system) return this.system;

    if (!game.system.socket) {
      console.error(
        `Failed to get a socket for system '${systemId}'. Please set '"socket": true' in your manifest and restart Foundry`,
      );
      return undefined;
    }

    const newSocket = new Socket(systemId, 'system');
    this.system = newSocket;
    return newSocket;
  }
}

export class Socket {
  private functions: Map<string, Function> = new Map();
  private name: string;
  private pendingRequests: Map<string, PendingRequest> = new Map();

  constructor(moduleId: string, moduleType: 'module' | 'system') {
    this.name = `${moduleType}.${moduleId}`;
    this.functions = new Map();
    getGame().socket.on(this.name, this.onSocketReceived.bind(this));
  }

  register(name: string, fn: Function): void {
    const schema = {
      name: 'string',
      fn: 'function',
    };

    Misc.validate({ name, fn }, schema);

    if (this.functions.has(name)) {
      console.warn(
        `Function '${name}' is already registered for '${this.name}'. Ignoring registrationrequest`
      );
      return;
    }
    this.functions.set(name, fn);
  }

  async executeAsGM(handler: string | Function, ...args: any[]): Promise<any> {
    const [name, func] = this.resolveFunction(handler);
    const game = getGame();
    if (game.user?.isGM) {
      return this.executeLocal(func, ...args);
    }
    if (!game.users?.activeGM) {
      throw new UtilsSocketNoGMConnectedError(
        `Could not execute handler '${name}' as GM: no GM connected`,
      );
    }
    return this.sendRequest(name, args, RecipientType.ONE_GM);
  }

  async executeAsUser(
    handler: string | Function,
    userId: string,
    ...args: any[]
  ): Promise<void> {
    const [name, fn] = this.resolveFunction(handler);
    const game = getGame();
    if (userId === game.user?.id) {
      return this.executeLocal(fn, ...args);
    }
    const user = game.users?.get(userId);
    if (!user) {
      throw new UtilsSocketInvalidUserError(`No user with id '${userId}' exists`);
    }
    if (!user.active) {
      throw new UtilsSocketInvalidUserError(
        `User '${user.name}' (${userId}) is not connected`,
      );
    }
    return this.sendRequest(name, args, [userId]);
  }

  async executeForAllGMs(handler: string | Function, ...args: any[]): Promise<void> {
    const [name, fn] = this.resolveFunction(handler);
    this.sendCommand(name, args, RecipientType.ALL_GMS);
    if (getGame().user?.isGM) {
      try {
        await this.executeLocal(fn, ...args);
      } catch (e) {
        console.error(e);
      }
    }
  }

  async executeForOtherGMs(handler: string | Function, ...args: any[]): Promise<void> {
    const [name] = this.resolveFunction(handler);
    this.sendCommand(name, args,RecipientType.ALL_GMS);
  }

  async executeForEveryone(handler: string | Function, ...args: any[]): Promise<void> {
    const [name, fn] = this.resolveFunction(handler);
    this.sendCommand(name, args, RecipientType.EVERYONE);
    try {
      await this.executeLocal(fn, ...args);
    } catch (e) {
      console.error(e);
    }
  }

  async executeForOthers(handler: string | Function, ...args: any[]): Promise<void> {
    const [name] = this.resolveFunction(handler);
    this.sendCommand(name, args, RecipientType.EVERYONE);
  }

  async executeForUsers(
    handler: string | Function,
    recipients: string[],
    ...args: any[]
  ): Promise<void> {
    const schema = {
      handler: ['string', 'function'],
      recipients: ['array'],
    };
    Misc.validate({ handler, recipients }, schema);
    const [name, fn] = this.resolveFunction(handler);
    const currentUserIndex = recipients.indexOf(getGame().user?.id!);
    const filteredRecipients = [...recipients];
    if (currentUserIndex >= 0) {
      filteredRecipients.splice(currentUserIndex, 1);
    }
    this.sendCommand(name, args, filteredRecipients);
    if (currentUserIndex >= 0) {
      try {
        await this.executeLocal(fn, ...args);
      } catch (e) {
        console.error(e);
      }
    }
  }

  private onSocketReceived(message: SocketMessage, senderId: string): void {
    if (message.type === MessageType.COMMAND || message.type === MessageType.REQUEST) {
      this.handleRequest(message, senderId);
    } else {
      this.handleResponse(message, senderId);
    }
  }

  private async handleRequest(message: SocketMessage, senderId: string): Promise<void> {
    const { handlerName, args, recipient, id, type } = message;
    const game = getGame();

    if (Array.isArray(recipient)) {
      if (!recipient.includes(game.user?.id!)) return;
    } else {
      switch (recipient) {
        case RecipientType.ONE_GM:
          if (!game.users?.activeGM?.isSelf) return;
          break;
        case RecipientType.ALL_GMS:
          if (!game.user?.isGM) return;
          break;
        case RecipientType.EVERYONE:
          break;
        default:
          console.error(
            `Unknown recipient '${recipient}' when trying to execute '${handlerName}' for '${this.name}'`,
          );
          return;
      }
    }

    let name: string, func: Function;
    try {
      [name, func] = this.resolveFunction(handlerName!);
    } catch (e) {
      if (e instanceof UtilsSocketUnregisteredHandlerError && type === MessageType.REQUEST) {
        this.sendError(id!, MessageType.UNREGISTERED);
      }
      throw e;
    }

    const socketData = { userId: senderId };
    const _this = { socketData };
    if (type === MessageType.COMMAND) {
      func.call(_this, ...args!);
    } else {
      try {
        const result = await func.call(_this, ...args!);
        this.sendResult(id!, result);
      } catch (e) {
        console.error(`Exception occurred while executing handler '${name}'`);
        this.sendError(id!, MessageType.EXCEPTION);
        throw e;
      }
    }
  }

  private resolveFunction(handler: string | Function): [string, Function] {
    if (typeof handler === 'string') {
      const fn = this.functions.get(handler);
      if (!fn) {
        throw new UtilsSocketUnregisteredHandlerError(
          `No socket handler with the name '${handler}' has been registered`,
        );
      }
      return [handler, fn];
    }
    const entry = Array.from(this.functions.entries()).find(
      ([, val]) => val === handler,
    );
    if (!entry) {
      throw new UtilsSocketUnregisteredHandlerError(
        `Function '${handler.name}' has not been registered as a socket handler`,
      );
    }
    return [entry[0], handler];
  }

  private handleResponse(message: SocketMessage, senderId: string): void {
    const { id, result, type } = message;
    if (!id) return;

    const request = this.pendingRequests.get(id);
    if (!request) return;

    if (!this.isResponseSenderValid(senderId, request.recipient)) {
      console.warn(`Dropped response from invalid sender (${senderId}) for handler '${request.handlerName}'`);
      return;
    }

    const game = getGame();
    switch (type) {
      case MessageType.RESULT:
        request.resolve(result);
        break;
      case MessageType.EXCEPTION:
        request.reject(
          new UtilsSocketRemoteException(
            `Exception occurred during remote execution of handler '${request.handlerName}'. See ${game.users?.get(message.userId!)?.name}'s client`
          ),
        );
        break;
      case MessageType.UNREGISTERED:
        request.reject(
          new UtilsSocketUnregisteredHandlerError(
            `Handler '${request.handlerName}' was not registered on ${game.users?.get(message.userId!)?.name}'s client`
          ),
        );
        break;
      default:
        request.reject(
          new UtilsSocketInternalError(
            `Unknown result type '${type}' for handler '${request.handlerName}'`
          ),
        );
        break;
    }
    this.pendingRequests.delete(id);
  }

  private isResponseSenderValid(senderId: string, recipients: RecipientType | string[]): boolean {
    if (recipients === RecipientType.ONE_GM && getGame().users?.get(senderId)?.isGM) {
      return true;
    }
    if (Array.isArray(recipients) && recipients.includes(senderId)) {
      return true;
    }
    return false;
  }

  private sendRequest(handlerName: string, args: any[], recipient: RecipientType | string[]): Promise<any> {
    const message: SocketMessage = {
      handlerName,
      args,
      recipient,
      id: foundry.utils.randomID(),
      type: MessageType.REQUEST,
    };
    const promise = new Promise((resolve, reject) => {
      this.pendingRequests.set(message.id!, { handlerName, resolve, reject, recipient });
    });
    getGame().socket.emit(this.name, message);
    return promise;
  }

  private sendCommand(handlerName: string, args: any[], recipient: RecipientType | string[]): void {
    const message: SocketMessage = {
      handlerName,
      args,
      recipient,
      type: MessageType.COMMAND,
    };
    getGame().socket.emit(this.name, message);
  }

  private sendResult(id: string, result: any): void {
    const message: SocketMessage = { id, result, type: MessageType.RESULT };
    getGame().socket.emit(this.name, message);
  }

  private sendError(id: string, type: MessageType): void {
    const game = getGame();
    const message: SocketMessage = {id, type, userId: game.user?.id };
    game.socket.emit(this.name, message);
  }

  private executeLocal(fn: Function, ...args: any[]): any {
    const socketData = { userId: getGame().user?.id };
    return fn.call({ socketData }, ...args);
  }
}
