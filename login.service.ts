import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl = 'http://localhost:3000/login';

  constructor(private http: HttpClient) { }

  loginUser(username: string, password: string): Observable<any> {
    const formData = { username, password };
    return this.http.post(this.loginUrl, formData);
  }

  loginStat(username: string): Observable<any>{
    return this.http.get(`${this.loginUrl}/${username}`);
  }
}