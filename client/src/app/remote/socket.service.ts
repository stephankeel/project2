import {Injectable, Inject} from "@angular/core";
import {Observable} from "rxjs";
import * as io from "socket.io-client";
import {AuthenticationService} from './authentication.service';

/**
 * This class handles authentication, error's, connect's and disconnect's from socket.io.
 * The created observable follows the "update" signals from socket stream.
 */
@Injectable()
export class SocketService {
  private name: string;
  private host: string = this.window.location.protocol + "//" + this.window.location.hostname + ":" + this.window.location.port;
  socket: SocketIOClient.Socket;

  constructor(private authService: AuthenticationService, @Inject('Window') private window: Window) {
  }

  /**
   *
   * @param name The name of the requested namespace
   * @returns {any} Observable which follows the "update" signals from socket stream
   */
  get(name: string): Observable<any> {
    this.name = name;
    let socketUrl = this.host + "/" + this.name;
    this.socket = io.connect(socketUrl, {
      'query': 'token=' + this.authService.getToken()
    });
    this.socket.on("connect", () => this.connect());
    this.socket.on("disconnect", () => this.disconnect());
    this.socket.on("error", (error: string) => {
      console.log(`ERROR: "${error}" (${socketUrl})`);
    });
    this.socket.on("unauthorized", (error: string) => {
      console.log(`unauthorized: "${error}" (${socketUrl})`);
    });

    // Return observable which follows the "update" signals from socket stream
    return Observable.create((observer: any) => {
      this.socket.on("update", (item: any) => observer.next({action: "update", item: item}));
      return () => this.socket.close();
    });
  }

  private update(item: any, observer: any) {
    console.log("update");
    observer.next({action: "update", item: item})
  }

  private connect() {
    console.log(`Connected to "${this.name}"`);
  }

  private disconnect() {
    console.log(`Disconnected from "${this.name}"`);
  }
}
