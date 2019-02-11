import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { SocketioService } from './socketio.service';
import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { DdragonService } from './ddragon.service';

@Injectable()
export class LivestatsService {
  private ls: Observable<any> = null;
  private games = { toInit: true };
  private token_url = 'https://api.lolesports.com/api/issueToken';
  private ws_url = 'wss://livestats.proxy.lolesports.com/stats?jwt=';
  public serviceInit = new Subject();
  public GameSubject = new BehaviorSubject<Object>(this.games);
  public gameSelected = new BehaviorSubject<string>('-1');
  public announces = new BehaviorSubject<Object>({});

  constructor(private wsService: WebsocketService, private io: SocketioService, private http: Http, private ddragon: DdragonService) {
    const tokenObs = this.getToken();
    tokenObs.subscribe(issueToken => {
      const token = issueToken.token;
      this.getCandidate(token);
      /*setTimeout(() => {
        if (this.ls === null) this.serviceInit.error('Couldnt load livestats');
        }, 10000);*/
    });
  }

  private getCandidate(token, acc = 0) {
    const candidate = this.getLS(token);
    candidate.subscribe(
      msg => {
        this.ls = candidate;
        this.parseData(msg);
        this.GameSubject.next(this.games);
        this.serviceInit.next('OK');
      },
      err => {
        if (acc < 10) setTimeout(() => this.getCandidate(token, acc + 1), 1000);
        else this.serviceInit.error('Couldnt load livestats');
      });
  }

  private getToken() {
    return this.http.get(this.token_url).map((res: Response) => res.json());
  }

  private getLS(token) {
    const ws = this.wsService.connect(this.ws_url + token, true).map((response: MessageEvent): Object => JSON.parse(response.data));
    return ws;
  }

  private filter(obj: Object, f) {
    const res = {};
    for (const key of Object.keys(obj)) {
      if (f(obj[key])) {
        res[key] = obj[key];
      }
    }
    return res;
  }

  public announce(text, time = 2, icon = null) {
    this.announces.next({ text, time, until: -1, icon });
  }

  private parseData(message) {
    let json = JSON.parse(JSON.stringify(message));
    if (this.games.toInit) {
      json = this.filter(json, (game => game != null));
      this.games = json;
      const idGame = window.location.pathname.slice(1);
      if (idGame !== '' && Object.keys(this.games).indexOf(idGame) !== -1) {
        this.gameSelected.next(idGame);
      } else {
        this.gameSelected.next(Object.keys(this.games).reduce((a, b) => parseInt(a, 10) > parseInt(b, 10) ? a : b));
      }
    } else {
      for (const game of Object.keys(json)) {
        if (this.games[game]) {
          const evt = json[game];
          if (evt.playerStats) {
            for (const player of Object.keys(evt.playerStats)) {
              for (const stat of Object.keys(evt.playerStats[player])) {
                this.games[game].playerStats[player][stat] = evt.playerStats[player][stat];
              }
              const cPlayer = this.games[game].playerStats[player];
              const evtPlayer = evt.playerStats[player];

              const champion =  `${this.ddragon.url}cdn/${this.ddragon.version}/img/champion/${cPlayer.championName}.png`;
              if (evtPlayer.h && evtPlayer.h === 0) cPlayer.baronActive = false;
              if (evtPlayer.pentaKills) this.announce(`${cPlayer.summonerName} PENTAKILL !!!`, 4, champion);
              else if (evtPlayer.quadraKills) this.announce(`${cPlayer.summonerName} Quadra Kill !!`, 3, champion);
              else if (evtPlayer.tripleKills) this.announce(`${cPlayer.summonerName} Triple Kill !`, 3, champion);
              else if (evtPlayer.doubleKills) this.announce(`${cPlayer.summonerName} Double Kill`, 2, champion);
              else if (evtPlayer.kills) this.announce(`${cPlayer.summonerName} has slain an enemy`, 2, champion);
            }
          }
          if (evt.teamStats) {
            for (const teamId of Object.keys(evt.teamStats)) {
              for (const stat of Object.keys(evt.teamStats[teamId])) {
                this.games[game].teamStats[teamId][stat] = evt.teamStats[teamId][stat];
              }
              const cTeam = this.games[game].playerStats[parseInt(teamId, 10) / 20].summonerName.split(' ')[0];
              const evtTeam = evt.teamStats[teamId];
              if (evtTeam.baronsKilled) {
                  this.announce(`${cTeam} has slain the Baron Nashor`, 4);
                  const players = this.games[game].playerStats;
                  Object.keys(players)
                    .filter(player => players[player].teamId === parseInt(teamId, 10))
                    .map(player => players[player].baronActive = true);
                  setTimeout(() => {
                    Object.keys(players)
                      .filter(player => players[player].teamId === parseInt(teamId, 10))
                      .map(player => players[player].baronActive = false);
                  }, 210 * 1000);
              }
              if (evtTeam.dragonsKilled) this.announce(`${cTeam} has killed a dragon`, 2);
              if (evtTeam.towersKilled) this.announce(`${cTeam} has destroyed a tower`, 2);
              if (evtTeam.inhibitorsKilled) this.announce(`${cTeam} has destroyed an inhibitor`, 3);
            }
          }
          this.games[game].t = evt.t;
          if (evt.gameComplete) {
            this.games[game].gameComplete = evt.gameComplete;
            const blueTeamWin = this.games[game].teamStats[100].matchVictory === 1;
            let winner = 0;
            let loser = 0;
            if (blueTeamWin) {
                winner = this.games[game].playerStats[1].summonerName.split(' ')[0];
                loser = this.games[game].playerStats[10].summonerName.split(' ')[0];
            } else {
                winner = this.games[game].playerStats[10].summonerName.split(' ')[0];
                loser = this.games[game].playerStats[1].summonerName.split(' ')[0];
            }
            this.announce(`${winner} VICTORY against ${loser}`, 10);
          }
        } else if (json[game] !== null) {
          this.games[game] = json[game];
          this.gameSelected.next(game);
        }
      }
    }
  }

  private extractData(res: Response) {
    const body = res.json();
    return body.data || {};
  }

}
