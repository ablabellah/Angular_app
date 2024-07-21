import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DossierService {
  private apiUrl = 'http://localhost:3000/dossier';

  constructor(private http: HttpClient) { }

  getDossiers(prop: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${prop}`);
  }

  addDossier(name: string,proprietaire: string): Observable<any> {
    const formData = {name, proprietaire};
    return this.http.post<any>(this.apiUrl, formData);
  }

  updateDossier(dossier: any): Observable<any> {
    const url = `${this.apiUrl}/${dossier.id}`;
    return this.http.put<any>(url, dossier);
  }
}
