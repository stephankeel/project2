import {logger} from '../utils/logger';
import Namespace = SocketIO.Namespace;
import Socket = SocketIO.Socket;

/**
 * The GenericSocket sends values to all registered clients.
 */
export class GenericSocket {
  private namespace: Namespace;
  private io: SocketIO.Server;
  private initialized : boolean = false;

  constructor(private namespaceName: string) {
  }

  public init(io: SocketIO.Server) : GenericSocket {
    if (this.initialized) {
      return this;
    }
    this.io = io;
    this.namespace = this.io.of(`${this.namespaceName}`);
    this.namespace.on("connection", (socket: Socket) => {
      logger.info(`Socket.IO: Client ${socket.client.id} on ${this.namespaceName} connected`);
      this.listen(socket);
    });
    logger.info(`Socket.IO: namespace ${this.namespaceName} initialized`);
    this.initialized = true;
    return this;
  }

  public del(value: any) {
    logger.info(`websocket.delete namespace: ${this.namespace.name} ${JSON.stringify(value)}`);
    this.namespace.emit("delete", value);
  }

  public update(value: any) {
    logger.info(`websocket.update namespace: ${this.namespace.name} ${JSON.stringify(value)}`);
    this.namespace.emit("update", value);
  }

  public create(value: any) {
    logger.info(`websocket.create namespace: ${this.namespace.name} ${JSON.stringify(value)}`);
    this.namespace.emit("create", value);
  }

  public close() {
    const connectedNameSpaceSockets = Object.keys(this.namespace.connected); // Get Object with Connected SocketIds as properties
    connectedNameSpaceSockets.forEach(socketId => {
      connectedNameSpaceSockets[socketId].disconnect(); // Disconnect Each socket
      logger.info(`Socket.IO: namespace ${this.namespaceName} client ${connectedNameSpaceSockets[socketId]} disconnected`);
    });
    this.namespace.removeAllListeners(); // Remove all Listeners for the event emitter
    delete this.io.nsps[this.namespaceName]; // Remove from the server namespaces

    // TODO: logger scheint im Callback nicht mehr definiert zu sein. Scope / Context?
    logger.info(`Socket.IO: namespace ${this.namespaceName} closed`);
    // TODO: provisorisch console.log verwendet
    console.log(`Socket.IO: namespace ${this.namespaceName} closed`);
  }

  private listen(socket: any): void {
    socket.on("disconnect", () => this.disconnect());
  }

  private disconnect(): void {
    console.log(`Client disconnected ${this.namespace.name}`);
  }
}
