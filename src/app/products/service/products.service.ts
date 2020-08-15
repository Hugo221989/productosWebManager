import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, PageModelProductBasic, Product, ProductoDto } from '../../models/producto';
import { CategoriaPadreDto, CategoriaDto, SubCategoriaDto } from 'src/app/models/categoria';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private httpClient: HttpClient) { }

  getProductsBasicList(url: string): Observable<any> {
    return this.httpClient.get<PageModelProductBasic>(`${url}`);
  }

  getProductBasic(url: string): Observable<any> {
    return this.httpClient.get<Product>(`${url}`);
  }

  updateProductoData(url: string, product: Product): Observable<any>{
    return this.httpClient.put<any>(`${url}`, product, {observe: 'response'});
  }

  getCategoriasPadre(url: string): Observable<any> {
    return this.httpClient.get<CategoriaPadreDto[]>(`${url}`);
  }

  getCategorias(url: string): Observable<any> {
    return this.httpClient.get<CategoriaDto[]>(`${url}`);
  }

  getSubCategorias(url: string): Observable<any> {
    return this.httpClient.get<SubCategoriaDto[]>(`${url}`);
  }

}
