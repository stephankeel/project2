import {logger} from '../utils/logger';
import Namespace = SocketIO.Namespace;
import Socket = SocketIO.Socket;

/**
 * The GenericSocket sends values to all registered clients.
 */
export class GenericSocket {
  private _namespace: Namespace;
  private io: SocketIO.Server;
  private initialized : boolean = false;

  constructor(private namespaceName: string) {
  }

  public init(io: SocketIO.Server) : GenericSocket {
    if (this.initialized) {
      return this;
    }
    this.io = io;
    this._namespace = this.io.of(`${this.namespaceName}`);
    this._namespace.on("connection", (socket: Socket) => {
      logger.info(`Socket.IO: Client ${socket.client.id} on ${this.namespaceName} connected`);
      this.listen(socket);
    });
    logger.info(`Socket.IO: namespace ${this.namespaceName} initialized`);
    this.initialized = true;
    return this;
  }

  public del(value: any) {
    logger.info(`websocket.delete namespace: ${this._namespace.name} ${JSON.stringify(value)}`);
    this._namespace.emit("delete", value);
  }

  public update(value: any) {
    logger.info(`websocket.update namespace: ${this._namespace.name} ${JSON.stringify(value)}`);
    this._namespace.emit("update", value);
  }

  public create(value: any) {
    logger.info(`websocket.create namespace: ${this._namespace.name} ${JSON.stringify(value)}`);
    this._namespace.emit("create", value);
  }

  public close() {
    this._namespace.clients((c: any) => {
      logger.info(JSON.stringify(c));
    });
  }

  public get namespace() {
    return this._namespace;
  }


  private listen(socket: any): void {
    socket.on("disconnect", () => this.disconnect());
  }

  private disconnect(): void {
    console.log(`Client disconnected ${this._namespace.name}`);
  }
}
