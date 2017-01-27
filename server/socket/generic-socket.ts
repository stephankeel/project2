import {logger} from '../utils/logger';

/**
 * The GenericSocket broadcasts values from one sensor.
 *
 * It creates a new socket.io namespace with the name '<namespaceName>' (example: /temperature/123456 or /humidity).
 * All values are send to every client which is connected to this namespace.
 * The send object is a ISocketItem with the action 'update' and item of type T.
 */
export class GenericSocket<T> {
  public namespace: any;

  constructor(private io: SocketIO.Server, private namespaceName: string) {
    this.namespace = this.io.of(`${namespaceName}`);
    this.namespace.on("connection", (socket: any) => {
      logger.info(`Socket.IO: Client on ${namespaceName} connected`);
      this.listen(socket);
    });
    logger.info(`Socket.IO: namespace /${namespaceName} created`);
  }

  public del(value: T) {
    this.namespace.emit("delete", value);
  }

  public update(value: T) {
    this.namespace.emit("update", value);
  }

  public create(value: T) {
    this.namespace.emit("create", value);
  }

  private listen(socket: any): void {
    socket.on("disconnect", () => this.disconnect());
  }

  private disconnect(): void {
    console.log(`Client disconnected ${this.namespaceName}`);
  }
}
