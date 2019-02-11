import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class DdragonService {
  public version: string;
  public url = 'https://ddragon.leagueoflegends.com/';
  private itemsURL: string;
  public serviceInit = new Subject();

  constructor(private http: Http) {
    this.http.get(`${this.url}api/versions.json`).map((res: Response) => res.json()).subscribe(data => {
        this.version = data[0];
        this.itemsURL = this.url + 'cdn/' + this.version + '/data/en_US/item.json';
        this.serviceInit.next('OK');
    });
  }

  getItems(): Observable<Object> {
    return this.http.get(this.itemsURL)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    const body = res.json();
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
