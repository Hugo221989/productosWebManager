import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageModelProductBasic, Product } from '../../models/producto';
import { CategoriaPadreDto, CategoriaDto, SubCategoriaDto } from 'src/app/models/categoria';
import { Sabor } from 'src/app/models/productoOtrosDatos';
import { environment } from 'src/environments/environment';

const MANAGER_API = `${environment.urlAPI}sabores`;

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  public FALVOURS_URl = `${MANAGER_API}/getAllFlavours`;

  constructor(private httpClient: HttpClient) { }

  getProductsBasicList(url: string, textToSearch: string): Observable<any> {
    return this.httpClient.get<PageModelProductBasic>(`${url}${textToSearch}`);
  }

  getProductBasic(url: string): Observable<any> {
    return this.httpClient.get<Product>(`${url}`);
  }

  createProduct(url: string, product: Product): Observable<any>{
    return this.httpClient.post<Product>(`${url}`, product);
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

  getFlavours(url: string): Observable<any> {
    return this.httpClient.get<Sabor[]>(`${url}`);
  }

}
