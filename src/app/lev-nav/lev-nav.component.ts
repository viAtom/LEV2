import { Component, Pipe, PipeTransform } from '@angular/core';
import { LivestatsService } from '../livestats.service';
@Component({
  selector: 'app-lev-nav',
  templateUrl: './lev-nav.component.html',
  styleUrls: ['./lev-nav.component.css']
})
export class LevNavComponent {
  private games: Object = {};
  private gamesId: Array<string> = [];
  private gameSelected: string;
  public gameGroups: Object = {};
  public groupsName: Array<string> = [];
  public groupSelected: string;

  constructor(private livestatsService: LivestatsService) {
    this.livestatsService.serviceInit.subscribe(msgInit => {
      this.livestatsService.GameSubject.subscribe(msg => {
        this.games = msg;
        this.gamesId = Object.keys(msg);
        this.getGamesGroup();
      });
      this.livestatsService.gameSelected.subscribe(msg => {
        this.gameSelected = msg;
        history.pushState(null, '', `/${msg}`);
        this.groupSelected = this.findGroupMatch(msg);
      });
    });
  }

  private getNameMatch(match) {
    const matchGeneral = this.games[match];
    if (matchGeneral) {
      const matchName = matchGeneral.generatedName.split('|');
      const blueTeam = matchName[0];
      const redTeam = matchName[1];
      const matchNumber = matchName[2].substr(1);
      return `${blueTeam} - ${redTeam} GAME ${matchNumber}`;
    } else {
      return 'error';
    }
  }

  private getGamesGroup() {
    for (const game of Object.keys(this.games)) {
      const match = this.games[game].generatedName.split('|');
      const gameGroup = `${match[0]} vs ${match[1]}`;
      this.gameGroups[gameGroup] = this.gameGroups[gameGroup] || [];
      if (this.gameGroups[gameGroup].indexOf(game) === -1) {
        this.gameGroups[gameGroup].push(game);
      }
    }
    this.groupsName = Object.keys(this.gameGroups);
  }

  private chooseGroup(group) {
    this.groupSelected = group;
    const last = this.gameGroups[group].length - 1;
    this.livestatsService.gameSelected.next(this.gameGroups[group][last]);
  }

  private chooseMatch(match) {
    this.livestatsService.gameSelected.next(match);
  }

  private findGroupMatch(match) {
    for (const key of Object.keys(this.gameGroups)) {
      if (this.gameGroups[key].indexOf(match) !== -1) {
        return key;
      }
    }
    return '-1';
  }

  private replay() {
  }
}
