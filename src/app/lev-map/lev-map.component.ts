import { Component, OnInit, Input } from '@angular/core';
declare var $:any;

@Component({
  selector: 'app-lev-map',
  templateUrl: './lev-map.component.html',
  styleUrls: ['./lev-map.component.css']
})
export class LevMapComponent implements OnInit {
  @Input() game;
  @Input() gameSelected;
  constructor() { }

  ngOnInit() { }

  pad(n) {
    if (n < 10) return "0" + n;
    else return n;
  }

  getTime() {
		var time = this.game.t;
		return this.pad(Math.round(time / 1000 / 60)) + ":" + this.pad(Math.round(time / 1000 % 60));
	}

  mouseenter(player) {
    $('#'+this.gameSelected+player.participantId).addClass('hovered');
  }

  mouseleave(player) {
    $('#'+this.gameSelected+player.participantId).removeClass('hovered');
  }

}
