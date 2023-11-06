import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';
import { Valoracion } from '../models/valoracion';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url = "http://localhost:8080/product"

  constructor(private http: HttpClient) { }

  getAll():Observable<any>{
    return this.http.get(this.url)
  }
  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }

  saveProduct(product:any): Observable<any>{
    return this.http.post(this.url,product)
  }

  update(product:any,id:number):Observable<any>{
    return this.http.put(`${this.url}/${id}/update`,product)
  }

  delete(product:number): Observable <any>{
    return this.http.delete(this.url+'/'+product)
  }

  avaible():Observable<any>{
    return this.http.get(this.url+"/getDisponibles")
  }

  getValoracion(valoracion: String):Observable<any>{
    return this.http.get(`${this.url}/valoracion/${valoracion}`)
  }
  

}
