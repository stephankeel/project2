import {ISocketItem} from "../entities/socket-item.model";
import {ITemperatureItem} from "../entities/temperature.model";
import {logger} from '../utils/logger';

/**
 * The temperatureSocket broadcasts temperature values from one sensor.
 *
 * It creates a new socket.io namespace with the name '/temperature/<sensorId>'.
 * All values are send to every client which is connected to this namespace.
 * The send object is a ISocketItem with the action 'update' and item of type ITemperatureItem with a date and value.
 */
export class TemperatureSocket {
  public namespace: any;

  constructor(private io: SocketIO.Server, private sensorId: string) {
    this.namespace = this.io.of(`/temperature/${sensorId}`);
    this.namespace.on("connection", (socket: any) => {
      logger.info(`Socket.IO: Client on temperature sensor(${this.sensorId}) connected`);
      this.listen(socket);
    });
    logger.info(`Socket.IO: namespace /temperature/${this.sensorId} created`);
  }

  public broadcastTemperature(value: ITemperatureItem) {
    this.namespace.emit("update", value);
  }

  private listen(socket: any): void {
    socket.on("disconnect", () => this.disconnect());
  }

  private disconnect(): void {
    console.log("Client disconnected");
  }
}
