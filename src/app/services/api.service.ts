import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiurl;
  constructor(private http: HttpClient) {}


  getCategories(){
    return this.http.get<any>(`${this.apiUrl}/categories`);
  }
  getCategorieById(id:any){
    return this.http.get<any>(`${this.apiUrl}/categories/${id}`);
  }
  createCategorie(data: any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${this.apiUrl}/categories`, data, { headers });
  }

  getArticles(){
    return this.http.get<any>(`${this.apiUrl}/articles`);
  }
  getArticlesById(id:any){
    return this.http.get<any>(`${this.apiUrl}/articles/${id}`);
  }
  createArticles(data: any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${this.apiUrl}/articles`, data, { headers });
  }

  uploadFile(formData: FormData): Observable<any> {
    const url = `${this.apiUrl}/articles/upload`; 
    return this.http.post(url, formData);
  }
  about(data: any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${this.apiUrl}/articles/about`, data, { headers });
  }
  descript(data: any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${this.apiUrl}/articles/descript`, data, { headers });
  }
}
