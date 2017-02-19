import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-lev-header',
  templateUrl: './lev-header.component.html',
  styleUrls: ['./lev-header.component.css']
})
export class LevHeaderComponent implements OnInit {
  @Input() game;
  constructor() { }

  ngOnInit() {
  }

}
