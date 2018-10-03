import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
// import { Logger } from 'angular2-logger/core';
import { isDevMode } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule, MatTooltipModule } from '@angular/material';

import { environment } from '../environments/environment';

import { LivestatsService } from './livestats.service';
import { WebsocketService } from './websocket.service';
import { SocketioService } from './socketio.service';
import { DdragonService } from './ddragon.service';

import { AppComponent } from './app.component';
import { LevNavComponent } from './lev-nav/lev-nav.component';
import { LevMainComponent } from './lev-main/lev-main.component';
import { LevMapComponent } from './lev-map/lev-map.component';
import { LevPlayerComponent } from './lev-player/lev-player.component';
import { LevHeaderComponent } from './lev-header/lev-header.component';


@NgModule({
  declarations: [
    AppComponent,
    LevNavComponent,
    LevMainComponent,
    LevMapComponent,
    LevPlayerComponent,
    LevHeaderComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MatProgressBarModule,
    MatTooltipModule,
    BrowserAnimationsModule,
  ],
  providers: [/*Logger, */LivestatsService, WebsocketService, SocketioService, DdragonService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(/*private logger: Logger*/) {
    if (isDevMode()) {
      console.info('To see debug logs enter: \'logger.level = logger.Level.DEBUG;\' in your browser console');
    }
    // this.logger.level = environment.logger.level;
  }
}
