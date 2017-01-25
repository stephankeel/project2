import {logger} from '../utils/logger';

/**
 * The GenericDataSocket broadcasts values from one sensor.
 *
 * It creates a new socket.io namespace with the name '/<namespacePrefix>/<sensorId>'.
 * All values are send to every client which is connected to this namespace.
 * The send object is a ISocketItem with the action 'update' and item of type of the namespacePrefix with a date and value.
 */
export class GenericDataSocket<T> {
  public namespace: any;

  constructor(private io: SocketIO.Server, private namespacePrefix: string, private sensorId: string) {
    this.namespace = this.io.of(`/${namespacePrefix}/${sensorId}`);
    this.namespace.on("connection", (socket: any) => {
      logger.info(`Socket.IO: Client on ${namespacePrefix} sensor(${this.sensorId}) connected`);
      this.listen(socket);
    });
    logger.info(`Socket.IO: namespace /${namespacePrefix}/${this.sensorId} created`);
  }

  public broadcast(value: T) {
    this.namespace.emit("update", value);
  }

  private listen(socket: any): void {
    socket.on("disconnect", () => this.disconnect());
  }

  private disconnect(): void {
    console.log(`Client disconnected ${this.namespacePrefix}`);
  }
}
