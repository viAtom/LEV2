import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-lev-player',
  templateUrl: './lev-player.component.html',
  styleUrls: ['./lev-player.component.css']
})
export class LevPlayerComponent implements OnInit {
  @Input() player;
  @Input() first;
  @Input() items;
  @Input() gameSelected;
  constructor() { }

  ngOnInit() {
  }

  powerType(champion) {
    const energy = ['Akali', 'Kennen', 'LeeSin', 'Shen', 'Zed'];
    const nothing = ['Garen', 'Katarina', 'Riven'];
    const fierce = ['Rengar'];
    const rage = ['Renekton', 'Tryndamere', 'Shyvana', 'Gnar', 'RekSai'];
    const nomana = energy.concat(nothing, fierce, rage);
    if (nomana.indexOf(champion) !== -1) {
      if (energy.indexOf(champion) !== -1) return 'energy'
      else if (rage.indexOf(champion) !== -1) return 'red';
      else return 'power';
    } else {
      return 'power';
    }
  }
}
