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

  constructor(private _namespaceName: string) {
  }

  public init(io: SocketIO.Server) : GenericSocket {
    if (this.initialized) {
      return this;
    }
    this.io = io;
    this.namespace = this.io.of(`${this._namespaceName}`);
    this.namespace.on("connection", (socket: Socket) => {
      logger.info(`Socket.IO: Client ${socket.client.id} on ${this._namespaceName} connected`);
      this.listen(socket);
    });
    logger.info(`Socket.IO: namespace ${this._namespaceName} initialized`);
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
    this.namespace.clients((c: any) => {
      logger.info(JSON.stringify(c));
    });
  }

  public get namespaceName() {
    return this._namespaceName;
  }


  private listen(socket: any): void {
    socket.on("disconnect", () => this.disconnect());
  }

  private disconnect(): void {
    console.log(`Client disconnected ${this.namespace.name}`);
  }
}
