import { TestBed } from '@angular/core/testing';

import { ProductsService } from './products.service';
import { HttpClientModule, HttpClient, HttpRequest } from '@angular/common/http';
import { Sabor } from 'src/app/models/productoOtrosDatos';
import {HttpTestingController, HttpClientTestingModule} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { TranslateService, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { translateLoaderFactory, I18nModule } from 'src/app/translate/i18n/i18n.module';
import { ProductsModule } from '../products.module';
import { doesNotReject } from 'assert';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { PageModelProductBasic, Page, ProductBasic, Product } from 'src/app/models/producto';
import { Links } from 'src/app/models/user';

const MANAGER_API = `${environment.urlAPI}sabores`;

@Component({ selector: 'test-blank', template: `` })
class BlankComponent {}

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ProductsModule, TranslateModule.forRoot() ,
        RouterTestingModule.withRoutes([
          { path: 'post/view', component: BlankComponent },
        ])],
      providers: [ProductsService]
    });
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('ProductService: should be created', () => {
    expect(service).toBeTruthy();
  });

  it('ProductService: retrieve data from getFlavours', () => {
    service.getFlavours('').subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(flavours);
    });

    const request = httpMock.expectOne('');
    expect(request.request.method).toBe('GET');
    request.flush(flavours);

  })

  it('ProductService: retrieve data from getProductsBasicList', () => {
    service.getProductsBasicList('', '').subscribe( data =>{
      expect(data.length).toBe(2);
      expect(data[0].id).toBe(1);
      expect(data[1].nombre).toEqual('protein 2');
    })
    const request = httpMock.expectOne('');
    expect(request.request.method).toBe('GET');
    request.flush(productBasic);
  });

  it('ProductService: retrieve data from updateProductoData', () => {
    service.updateProductoData('', product).subscribe();
    const request = httpMock.expectOne('');
    expect(request.request.method).not.toBe('GET');
  });

  afterEach(() => {
    httpMock.verify();
  });

  let flavours: Sabor[] = [{
    id: 1,
    sabor: 'Fresa',
    saborEng: 'Strawberry'
  },{
    id: 2,
    sabor: 'Chocolate',
    saborEng: 'Chocolate'
  }];

  let pageMock:Page = {
    number: 0,
    size: 1,
    totalElements: 5,
    totalPages: 1
  }
  let linksMock: Links[] = [];
  let productBasic: ProductBasic[] = [{
    id: 1,
    tamano: '100',
    nombre: 'protein',
    foto: '',
    links: linksMock,
    precio: '19.95'
  },{
    id: 2,
    tamano: '100',
    nombre: 'protein 2',
    foto: '',
    links: linksMock,
    precio: '19.95'
  }]
  let pageModelProductBasic: PageModelProductBasic = {
    page: pageMock,
    links: linksMock,
    content: productBasic
  };

  let product: Product;

});
