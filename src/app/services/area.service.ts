import { Observable } from 'rxjs/Observable';
import { GlobalSettings } from '../shared/globals';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Subscription } from 'rxjs/Subscription';

import { cloneDeep } from 'lodash';
import { Logger } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { HttpService } from './http-service';

import { Space, Spaces } from 'ngx-fabric8-wit';
import { AreaModel } from '../models/area.model';
import { MockHttp } from '../mock/mock-http';

@Injectable()
export class AreaService {
  public areas: AreaModel[] = [];
  private headers = new Headers({'Content-Type': 'application/json'});
  private _currentSpace;

  constructor(
      private logger: Logger,
      private http: HttpService,
      private auth: AuthenticationService,
      private globalSettings: GlobalSettings,
      private spaces: Spaces
  ) {
    this.spaces.current.subscribe(val => this._currentSpace = val);
  }
  /**
   * getAreas - We call this service method to fetch
   * @param areaUrl - The url to get all the areas
   * @return Promise of AreaModel[] - Array of areas
   */
  getAreas(): Observable<AreaModel[]> {
    // get the current iteration url from the space service
    if (this._currentSpace) {
      let areasUrl = this._currentSpace.relationships.areas.links.related;
      if (this.checkValidUrl(areasUrl)) {
        return this.http
          .get(areasUrl)
          .map (response => {
            if (/^[5, 4][0-9]/.test(response.status.toString())) {
              throw new Error('API error occured');
            }
            return response.json().data as AreaModel[];
          })
          .map((data) => {
            /*
            //Need to fix the Area data and service for inmemory mode
            //If the area has a parent, append it to the area's name
            data.forEach((area) => {
              if (area.attributes.parent_path_resolved !== '/'){
                area.attributes.name = (area.attributes.parent_path_resolved).substring(1) + '/' + area.attributes.name;
              }
            });
            */

            this.areas = data;
            return this.areas;
          })
          .catch ((error: Error | any) => {
            if (error.status === 401) {
              //this.auth.logout(true);
            } else {
              console.log('Fetch area API returned some error - ', error.message);
              return Promise.reject<AreaModel[]>([] as AreaModel[]);
            }
          });
      } else {
        this.logger.log('URL not matched');
        return Observable.of<AreaModel[]>([] as AreaModel[]);
      }
    } else {
      return Observable.throw('nospace');
    }
  }

  getArea(area: any): Observable<AreaModel> {
    if (Object.keys(area).length) {
      let areaLink = area.data.links.self;
      return this.http.get(areaLink)
        .map(arearesp => arearesp.json().data);
    } else {
      return Observable.of(area);
    }
  }

  getAreaById(areaId: string): Observable<AreaModel> {
    return this.getAreas().first()
    .map((resultAreas) => {
      for (let i=0; i<resultAreas.length; i++) {
        if (resultAreas[i].id===areaId)
          return resultAreas[i];
        }
    })
    .catch( err => {
      return Observable.throw(new Error(err.message));
    });
  }

  /**
   * checkValidUrl checks if the API url for
   * iterations is valid or not
   * sample url -
   * http://localhost:8080/api/spaces/d7d98b45-415a-4cfc-add2-ec7b7aee7dd5/areas
   *
   * @param URL
   * @return Boolean
   */
  checkValidUrl(url: string): Boolean {
    let urlArr: string[] = url.split('/');
    let uuidRegExpPattern = new RegExp('[^/]+');
    return (
      urlArr[urlArr.length - 1] === 'areas' &&
      uuidRegExpPattern.test(urlArr[urlArr.length - 2]) &&
      urlArr[urlArr.length - 3] === 'spaces'
    );
  }


}
