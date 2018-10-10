import { Injectable } from '@angular/core';
import { Observer, Observable } from 'rxjs';

@Injectable()
export class WebsocketService {
  private socket: Observable<MessageEvent>;
  public connect(url): Observable<MessageEvent> {
    if (!this.socket) {
      this.socket = this.create(url);
    }
    return this.socket;
  }
  private create(url): Observable<MessageEvent> {
    const ws = new WebSocket(url);
    const observable = Observable.create(
      (obs: Observer<MessageEvent>) => {
        ws.onmessage = obs.next.bind(obs);
        ws.onerror = obs.error.bind(obs);
        ws.onclose = obs.complete.bind(obs);
        return ws.close.bind(ws);
      }
    );
    return observable;
  }
}
