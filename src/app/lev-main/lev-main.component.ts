import { Component } from '@angular/core';
import { LivestatsService } from '../livestats.service';
import { DdragonService } from '../ddragon.service';

@Component({
  selector: 'app-lev-main',
  templateUrl: './lev-main.component.html',
  styleUrls: ['./lev-main.component.css']
})
export class LevMainComponent {
  private games: Object;
  private gameSelected;
  public game: Object;
  private ddragon;
  private items: Object = {};

  constructor(private livestatsService: LivestatsService, private ddragonService: DdragonService) {
    livestatsService.serviceInit.subscribe(() => {
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
    ddragonService.serviceInit.subscribe(() => {
      ddragonService.getItems().subscribe(msg => {
        this.items = this.removeTags(msg);
      });
    });
  }

  private removeTags(items) {
    const tags = [
      'groupLimit',
      'unique',
      'stats',
      'mana',
      'passive',
      'consumable',
      'active',
      'rules',
      'scaleLevel',
      'levelLimit',
      'mainText',
      'aura',
      'unlockedPassive',
      'scaleHealth',
      'spellPassive',
      'gold',
      'subtitleLeft',
      'flavorText',
    ];
    const tagsRemove = tags.concat('hr').map(tag => `<\/?${tag}>`);
    const regex = new RegExp(`<(${tags.join('|')})>(.*?)<\/\\1>`, 'gi');
    const regexRemove = new RegExp(tagsRemove.join('|'), 'gi');
    for (const item of Object.keys(items)) {
      items[item].description = items[item].description
        .replace(regex, '<div class="$1">$2</div>')
        .replace(regex, '<div class="$1">$2</div>'); // Twice because some are nested in <stats> for example
    }
    return items;
  }

  private stackable(item) {
    const stackables = [
      2003, // Health potion
      2055, // Control ward
    ];
    return stackables.indexOf(item) !== -1;
  }

  public count(items) {
    let res = [];
    for (const item of items) {
      if (item.hasOwnProperty('id')) return items;
      if (res.filter(a => a.id === item).length !== 0 && this.stackable(item)) {
        res = res.map(a => (a.id === item) ? { id: item, nb: a.nb + 1 } : a);
      } else {
        res.push({ id: item, nb: 1});
      }
    }
    return res;
  }

  private itemize(game) {
    for (const player of Object.keys(game.playerStats)) {
      game.playerStats[player].items = this.count(game.playerStats[player].items);
    }
    return game;
  }

  updateInfoTeam() {
    if (this.gameSelected) {
      const thisGame = this.itemize(this.games[this.gameSelected]);
      thisGame['blueTeam'] = thisGame['teamStats']['100'];
      thisGame['redTeam'] = thisGame['teamStats']['200'];
      thisGame['blueTeam']['name'] = thisGame['playerStats']['1'].summonerName.split(' ')[0];
      thisGame['redTeam']['name'] = thisGame['playerStats']['10'].summonerName.split(' ')[0];
      thisGame['blueTeam']['tg'] = 0;
      thisGame['redTeam']['tg'] = 0;
      thisGame['blueTeam']['kills'] = 0;
      thisGame['redTeam']['kills'] = 0;
      thisGame['blueTeam']['players'] = [];
      thisGame['redTeam']['players'] = [];
      thisGame['players'] = [];
      Object.keys(thisGame['playerStats']).forEach(key => {
        const player = thisGame['playerStats'][key];
        if (player.teamId === 100) {
          thisGame['blueTeam']['tg'] += player.tg;
          thisGame['blueTeam']['kills'] += player.kills;
          thisGame['blueTeam']['players'].push(player);
        } else {
          thisGame['redTeam']['tg'] += player.tg;
          thisGame['redTeam']['kills'] += player.kills;
          thisGame['redTeam']['players'].push(player);
        }
        thisGame['players'].push(player);
      });
    }
  }
}
