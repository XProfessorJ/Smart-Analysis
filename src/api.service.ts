import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private serverURL = "http://127.0.0.1:3001";
  constructor(public httpClient: HttpClient) {}

  login(username, password): Observable<any> {
    return this.httpClient.post(`${this.serverURL}/rpc/compass/login`, {
      username,
      password,
    });
  }

  queryStatus(data:any){
    return this.httpClient.post(`${this.serverURL}/rpc/compass/queryNow`, {
      ...data
    });
  }

}
