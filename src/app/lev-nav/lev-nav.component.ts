import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { LivestatsService } from '../livestats.service';
import { BehaviorSubject } from 'rxjs/Rx';

@Component({
  selector: 'app-lev-nav',
  templateUrl: './lev-nav.component.html',
  styleUrls: ['./lev-nav.component.css']
})
export class LevNavComponent implements OnInit {
  private games: Object = {};
  private gamesId: Array<string> = [];
  private gameSelected: string;
  private gameGroups: Object = {};
  private groupsName: Array<string> = [];
  private groupSelected: string;

  constructor(private livestatsService: LivestatsService) {
    this.livestatsService.serviceInit.subscribe(msg => {
      this.livestatsService.GameSubject.subscribe(msg => {
        this.games = msg;
        this.gamesId = Object.keys(msg);
        this.getGamesGroup();
      });
      this.livestatsService.gameSelected.subscribe(msg => {
        this.gameSelected = msg;
        this.groupSelected = this.findGroupMatch(msg);
      });
    });
  }

  ngOnInit() {
  }

  private getNameMatch(match) {
    let matchGeneral = this.games[match];
    if (matchGeneral) {
      var matchName = matchGeneral.generatedName.split("|");
      var blueTeam = matchName[0];
      var redTeam = matchName[1];
      var matchNumber = matchName[2].substr(1);
      return blueTeam + " vs " + redTeam + " Game " + matchNumber;
    } else return "error";
  }

  private getGamesGroup() {
    for (let game of Object.keys(this.games)) {
      let match = this.games[game].generatedName.split("|");
      let gameGroup = match[0]+" vs "+match[1];
      this.gameGroups[gameGroup] = this.gameGroups[gameGroup] || [];
      if (this.gameGroups[gameGroup].indexOf(game)==-1) this.gameGroups[gameGroup].push(game);
    }
    this.groupsName = Object.keys(this.gameGroups);
  }

  private chooseGroup(group) {
    this.groupSelected = group;
    let last = this.gameGroups[group].length-1;
    this.livestatsService.gameSelected.next(this.gameGroups[group][last]);
  }

  private chooseMatch(match) {
    this.livestatsService.gameSelected.next(match);
  }

  private findGroupMatch(match) {
    for(let key of Object.keys(this.gameGroups)) {
      if (this.gameGroups[key].indexOf(match) != -1) {
        return key;
      }
    }
    return "-1";
  }
}