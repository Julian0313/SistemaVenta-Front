import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interface/response-api';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private urlApi: string = environment.endpoint + "Menu/"

  constructor(private http: HttpClient) { }

  lista(idUsuario: number):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista?idUsuario=${idUsuario}`)
  }
}
