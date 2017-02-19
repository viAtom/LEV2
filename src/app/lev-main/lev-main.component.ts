import { Component, OnInit } from '@angular/core';
import { LivestatsService } from '../livestats.service';
import { DdragonService } from '../ddragon.service';

@Component({
  selector: 'app-lev-main',
  templateUrl: './lev-main.component.html',
  styleUrls: ['./lev-main.component.css']
})
export class LevMainComponent implements OnInit {
  private games: Object;
  private gameSelected;
  private game: Object;
  private ddragon;
  private items: Object = {};

  constructor(private livestatsService: LivestatsService, private ddragonService: DdragonService) {
    livestatsService.serviceInit.subscribe(msg => {
      livestatsService.GameSubject.subscribe(msg => {
        this.games = msg;
        this.updateInfoTeam();
      });
      this.livestatsService.gameSelected.subscribe(msg => {
        this.gameSelected = msg;
        this.updateInfoTeam();
        this.game = this.games[this.gameSelected];
      });
    });
    ddragonService.getItems().subscribe(msg => {
      this.items = msg;
    });
  }

  ngOnInit() { }

  updateInfoTeam() {
    if (this.gameSelected) {
      const thisGame = this.games[this.gameSelected];
      thisGame["blueTeam"] = thisGame["teamStats"]["100"];
      thisGame["redTeam"] = thisGame["teamStats"]["200"];
      thisGame["blueTeam"]["name"] = thisGame["playerStats"]["1"].summonerName.split(" ")[0];
      thisGame["redTeam"]["name"] = thisGame["playerStats"]["10"].summonerName.split(" ")[0];
      thisGame["blueTeam"]["tg"] = 0;
      thisGame["redTeam"]["tg"] = 0;
      thisGame["blueTeam"]["kills"] = 0;
      thisGame["redTeam"]["kills"] = 0;
      thisGame["blueTeam"]["players"] = [];
      thisGame["redTeam"]["players"] = [];
      thisGame["players"] = [];
      Object.keys(thisGame["playerStats"]).forEach(key => {
        const player = thisGame["playerStats"][key];
        if (player.teamId == 100) {
          thisGame["blueTeam"]["tg"] += player.tg;
          thisGame["blueTeam"]["kills"] += player.kills;
          thisGame["blueTeam"]["players"].push(player);
        } else {
          thisGame["redTeam"]["tg"] += player.tg;
          thisGame["redTeam"]["kills"] += player.kills;
          thisGame["redTeam"]["players"].push(player);
        }
        thisGame["players"].push(player);
      });
    }
  }
}
