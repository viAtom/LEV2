import { Subject, Observable } from 'rxjs/Rx';
import * as io from 'socket.io-client';

export class SocketioService {
  private url = 'httsp://wslol.viatom.xyz';
  private socket;

  getMessages() {
    const  observable = new Observable(observer => {
      try {
        this.socket = io.connect(this.url, { transports: ['polling'] });
        this.socket.on('message', (data) => {
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
      } catch (e) { };
    })
    return observable;
  }
}