import { Component, Input } from '@angular/core';
import { DdragonService } from '../ddragon.service';
import { LivestatsService } from '../livestats.service';
declare var $: any;

@Component({
  selector: 'app-lev-map',
  templateUrl: './lev-map.component.html',
  styleUrls: ['./lev-map.component.css']
})
export class LevMapComponent {
  @Input() game;
  @Input() gameSelected;
  public announces = [];
  constructor(private ddragon: DdragonService, private livestats: LivestatsService) {
    livestats.announces.subscribe((announce: any) => {
      if (announce.hasOwnProperty('text') && announce.hasOwnProperty('time')) {
        this.announces.push(announce);
        this.getAnnounce();
        console.log(this.announces);
      }
    });
  }

  getAnnounce() {
    const announce = this.announces[0];
    setTimeout(() => this.announces.shift(), announce.time * 1000);
  }

  pad(n) {
    if (n < 10) return `0${n}`;
    else return n;
  }

  getTime() {
    const time = this.game.t;
    return this.pad(Math.round(time / 1000 / 60)) + ':' + this.pad(Math.round(time / 1000 % 60));
  }

  mouseenter(player) {
    $('#' + this.gameSelected + player.participantId).addClass('hovered');
  }

  mouseleave(player) {
    $('#' + this.gameSelected + player.participantId).removeClass('hovered');
  }

}
