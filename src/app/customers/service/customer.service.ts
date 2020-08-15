import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerBasic, User, Genero, Customer } from 'src/app/models/user';
import { TranslateService } from '@ngx-translate/core';
import { ManagerMenuItem } from 'src/app/models/menuItem';

const MANAGER_API = `${environment.urlAPI}manager/obtenerMenuPrincipal`;

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private httpClient: HttpClient) { }

  getMenuConfiguration():  Observable<ManagerMenuItem[]>{
    return this.httpClient.get<ManagerMenuItem[]>(`${MANAGER_API}`);
  }

  getCustomersBasicList(url: string): Observable<any> {
    return this.httpClient.get<CustomerBasic[]>(`${url}`);
  }

  getCustomerBasic(url: string): Observable<any> {
    return this.httpClient.get<Customer>(`${url}`);
  }

  updateCustomerData(url: string, customer: Customer): Observable<any>{
    return this.httpClient.put<any>(`${url}`, customer, {observe: 'response'});
  }

  getGenders(url: string): Observable<any> {
  return this.httpClient.get<Genero[]>(`${url}`);
  }
  
}
