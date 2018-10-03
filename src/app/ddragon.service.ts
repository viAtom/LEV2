import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject, Observable, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class DdragonService {
  private version = "8.19.1";
  private ddragon: string = "https://ddragon.leagueoflegends.com/";
  private itemsURL: string = this.ddragon + "cdn/" + this.version + "/data/en_US/item.json";
  constructor(private http: Http) { }

  getItems(): Observable<Object> {
    return this.http.get(this.itemsURL)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
