import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs/Rx';
import { WebsocketService } from './websocket.service';
import { SocketioService } from './socketio.service';
import { Http, Response } from '@angular/http';
import { Logger } from "angular2-logger/core";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const TOKEN_URL = "http://api.lolesports.com/api/issueToken";
const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjoiMS4wIiwiamlkIjoiNjczODA1YjUtZWE3My00ZDVkLThiNGEtZTM4ZGE2MWU1ODIzIiwiaWF0IjoxNDg2ODQ2NDE1NzIzLCJleHAiOjE0ODc0NTEyMTU3MjMsIm5iZiI6MTQ4Njg0NjQxNTcyMywiY2lkIjoiYTkyNjQwZjI2ZGMzZTM1NGI0MDIwMjZhMjA3NWNiZjMiLCJzdWIiOnsiaXAiOiI5My4zMS4xNDEuMTQyIiwidWEiOiJNb3ppbGxhLzUuMCAoWDExOyBMaW51eCB4ODZfNjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS81NC4wLjI4NDAuNTkgU2FmYXJpLzUzNy4zNiJ9LCJyZWYiOlsid2F0Y2guKi5sb2xlc3BvcnRzLmNvbSJdLCJzcnYiOlsibGl2ZXN0YXRzLXYxLjAiXX0.Jb77U4QHkro1QCnwizLSMcRrsngyo_Mq2V3tcrgOnkU";
const WS_URL = 'ws://livestats.proxy.lolesports.com/stats?jwt=';

@Injectable()
export class LivestatsService {
  private ls: Observable<MessageEvent>;
  private games = { toInit: true };
  public serviceInit = new Subject();
  public GameSubject = new BehaviorSubject<Object>(this.games);
  public gameSelected = new BehaviorSubject<string>("-1");


  constructor(wsService: WebsocketService, io: SocketioService, http: Http, private logger: Logger) {
    http.get(TOKEN_URL).map((res: Response) => res.json()).subscribe(issueToken => {
      this.logger.info("Token received : ", issueToken);
      const TOKEN = issueToken.token;
      let lsCandidate = <Observable<MessageEvent>>wsService
        .connect(WS_URL + TOKEN)
        .map((response: MessageEvent): Object => { return JSON.parse(response.data); });
      lsCandidate.subscribe(
        msg => {
          this.parseData(msg);
          this.ls = lsCandidate;
          this.GameSubject.next(this.games);
          this.serviceInit.next("OK");
        },
        err => {
          logger.error("Couldn't connect to Riot Livestats.");
          logger.info("Trying secondary socket");
          this.ls = io.getMessages();
          this.ls.subscribe(
            msg => {
              this.parseData(msg);
              this.GameSubject.next(this.games);
              this.serviceInit.next("OK");
            });
        });
    });
  }

  private filter(obj: Object, f) {
    let res = {};
    for (let key of Object.keys(obj)) {
      if (f(obj[key])) {
        res[key] = obj[key];
      }
    }
    return res;
  }

  private parseData(message) {
    let json = JSON.parse(JSON.stringify(message));
    if (this.games.toInit) {
      json = this.filter(json, (game => game != null));
      this.games = json;
      this.gameSelected.next(Object.keys(this.games).reduce((a, b) => parseInt(a, 10) > parseInt(b, 10) ? a : b));
    } else {
      for (const game of Object.keys(json)) {
        if (this.games[game]) {
          const evt = json[game];
          if (evt.playerStats) {
            for (const player of Object.keys(evt.playerStats)) {
              for (const stat of Object.keys(evt.playerStats[player])) {
                this.games[game].playerStats[player][stat] = evt.playerStats[player][stat];
              }
            }
          }
          if (evt.teamStats) {
            for (const team of Object.keys(evt.teamStats)) {
              for (const stat of Object.keys(evt.teamStats[team])) {
                this.games[game].teamStats[team][stat] = evt.teamStats[team][stat];
              }
            }
          }
          this.games[game].t = evt.t;
        } else if (json[game] != null) {
          this.games[game] = json[game];
          this.gameSelected.next(game);
        }
      }
    }
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

}
