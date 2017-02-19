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

}
