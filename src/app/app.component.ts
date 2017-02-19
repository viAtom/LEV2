import { Component } from '@angular/core';
import { LivestatsService } from './livestats.service';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-lev',
  templateUrl: './app.component.html',
  providers: [WebsocketService],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LEV first ng2 !';
  constructor() {

  }
}
