import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    this.ROOT_URL = 'http://localhost:3000';
  }

  get(uri: string){
    let accessToken = localStorage.getItem('x-access-token');
    let userId = localStorage.getItem('user-id');

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     ''
    //     'x-access-token': accessToken,
    //     'user-id': userId
    //   })
    // };

    return this.http.get(`${this.ROOT_URL}/${uri}`);
  }

  getPayload(uri: string, payload: Object){

    let accessToken = localStorage.getItem('x-access-token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': accessToken
      })
    };

    return this.http.get(`${this.ROOT_URL}/${uri}`, payload);
  }

  post(uri: string, payload: Object){
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload);
  }

  patch(uri: string, payload: Object){
    return this.http.patch(`${this.ROOT_URL}/${uri}`, payload);
  }

  delete(uri: string){
    return this.http.delete(`${this.ROOT_URL}/${uri}`);
  }

  login(email: string, password: string){

    return this.http.post(`${this.ROOT_URL}/users/login`,{
      email,
      password
    }, {
      observe: 'response'
    });
  }
}
