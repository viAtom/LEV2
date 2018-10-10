import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { SocketioService } from './socketio.service';
import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const TOKEN_URL = 'https://api.lolesports.com/api/issueToken';
const WS_URL = 'wss://livestats.proxy.lolesports.com/stats?jwt=';

@Injectable()
export class LivestatsService {
  private ls: Observable<any>;
  private games = { toInit: true };
  public serviceInit = new Subject();
  public GameSubject = new BehaviorSubject<Object>(this.games);
  public gameSelected = new BehaviorSubject<string>('-1');
  public announces = new BehaviorSubject<Object>({});

  constructor(wsService: WebsocketService, io: SocketioService, http: Http) {
    http.get(TOKEN_URL).map((res: Response) => res.json()).subscribe(issueToken => {
      const token = issueToken.token;
      const lsCandidate = <Observable<MessageEvent>>wsService
        .connect(WS_URL + token)
        .map((response: MessageEvent): Object => JSON.parse(response.data));
      lsCandidate.subscribe(
        msg => {
          this.parseData(msg);
          this.ls = lsCandidate;
          this.GameSubject.next(this.games);
          this.serviceInit.next('OK');
        },
        err => {
          // logger.error("Couldn't connect to Riot Livestats.");
          // logger.info("Trying secondary socket");
          this.ls = io.getMessages();
          this.ls.subscribe(
            msg => {
              this.parseData(msg);
              this.GameSubject.next(this.games);
              this.serviceInit.next('OK');
            });
        });
    });
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

  public announce(text, time = 2) {
      this.announces.next({ text, time, until: -1 });
      this.announces.next({ text: '', time: 1, until: -1 });
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
              if (evtPlayer.h && evtPlayer.h === 0) cPlayer.baronActive = false;
              if (evtPlayer.pentaKills) this.announce(`${cPlayer.summonerName} (${cPlayer.championName}) PENTAKILL !!!`, 4);
              else if (evtPlayer.quadraKills) this.announce(`${cPlayer.summonerName} (${cPlayer.championName}) Quadra Kill !!`, 3);
              else if (evtPlayer.tripleKills) this.announce(`${cPlayer.summonerName} (${cPlayer.championName}) Triple Kill !`, 3);
              else if (evtPlayer.doubleKills) this.announce(`${cPlayer.summonerName} (${cPlayer.championName}) Double Kill`, 2);
              else if (evtPlayer.kills) this.announce(`${cPlayer.summonerName} (${cPlayer.championName}) has slain an enemy`, 2);
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
