import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements HttpInterceptor {

  readonly URLG: string = "https://localhost:" + "44366" + "/guard/";

  constructor(private http: HttpClient ) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    var token = localStorage.getItem("token");

    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })
    }

    return next.handle(req);
  }

  registerUser(genre: {
    email: string,
    password: string
  }) {
    return this.http.post<any>(this.URLG + "new", genre);
  }

  login(genre: {
    email: string,
    password: string
  }) {
    return this.http.post<any>(this.URLG + "login", genre);
  }



  getSecurity(): string {
    if (localStorage.getItem('role'))
      return localStorage.getItem('role') as string;
    else return 'notAuthorized';
  }
  onlyForAdmins(): boolean {
    if (this.getSecurity() == "admin") return true;
    else return false;
  }
  
  onlyForAuthorized(): boolean {
    if (this.getSecurity() != "notAuthorized") return true;
    else return false;
  }

}
