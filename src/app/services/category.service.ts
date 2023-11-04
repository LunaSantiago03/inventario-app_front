import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private url = "http://localhost:8080/category"

  constructor(private http: HttpClient) { }

  getAll():Observable<any>{
    return this.http.get(this.url)
  }
  getCategoriesProducts(id: number): Observable<any> {
    const apiUrl = `${this.url}/${id}/getCategoriesProducts`;
    return this.http.get(apiUrl);
  }

  save(c: Category): Observable<any>{
    return this.http.post(this.url,c)
  }

  delete(c: number): Observable<any>{
    return this.http.delete(this.url+'/'+c)
  }

  update(c: Category): Observable<any>{
    return this.http.put(this.url+'/'+c.id+'/update',c)
  }
}
