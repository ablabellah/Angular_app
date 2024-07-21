import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:3000/doc';
  constructor(private http: HttpClient) { }

  getDocuments(prop: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${prop}`);
  }

  addDocument(emplacement: string,name: string,extension: string,type: string,taille: number,proprietaire: string): Observable<any> {
    const formData = {emplacement, name, extension, type, taille, proprietaire};
    return this.http.post<any>(this.apiUrl, formData);
  }

  updateDocument(document: any): Observable<Document> {
    const url = `${this.apiUrl}/${document.id}`;
    return this.http.put<Document>(url, document);
  }

  deleteDocument(id: string): Observable<any> {
    const deleteUrl = `${this.apiUrl}/:${id}`;
    return this.http.delete<any>(deleteUrl);
  }
}
