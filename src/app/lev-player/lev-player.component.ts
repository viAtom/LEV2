import { Component, Input } from '@angular/core';
import { DdragonService } from '../ddragon.service';
@Component({
  selector: 'app-lev-player',
  templateUrl: './lev-player.component.html',
  styleUrls: ['./lev-player.component.css'],
})
export class LevPlayerComponent {
  @Input() player;
  @Input() first;
  @Input() items;
  @Input() gameSelected;
  constructor(private ddragon: DdragonService) { }

  powerType(champion) {
    const energy = ['Akali', 'Kennen', 'LeeSin', 'Shen', 'Zed'];
    const nothing = ['Garen', 'Katarina', 'Riven'];
    const fierce = ['Rengar'];
    const rage = ['Renekton', 'Tryndamere', 'Shyvana', 'Gnar', 'RekSai'];
    if (energy.indexOf(champion) !== -1) {
      return 'energy';
    } else if (rage.indexOf(champion) !== -1) {
      return 'red';
    } else {
      return 'power';
    }
  }
}
