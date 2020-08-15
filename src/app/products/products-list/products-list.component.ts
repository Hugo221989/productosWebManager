import { Component, OnInit, ViewChild, OnDestroy, Inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { CustomerBasic } from 'src/app/models/user';
import { ProductsService } from '../service/products.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { SettingsState } from 'src/app/settings/settings.models';
import { selectSettingsCurrentLanguage } from '../../settings/settings.selectors';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from 'src/app/dialogs/confirm-dialog';
import { ProductBasic, PageModelProductBasic } from 'src/app/models/producto';

const PRODUCT_DETAIL_PATH = '/products/detail';
const NEXT_PAGE = 'next';
const PREVIOUS_PAGE = 'prev';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
  private paginaActual: number = 0;
  private paginaAnterior: number = 0;
  public pageSize: number[] = [5];
  private pageSizeSelected: number = 5;
  public totalLength: number = 0;
  private ordenColumnas: string = 'desc';
  private nombreColumna: string = 'usuario';
  public pageModelProductBasic: PageModelProductBasic;
  public productsBasicList: ProductBasic[] = [];
  private urlProducts: string;
  private urlProductsPrev: string;
  private urlProductsNext: string;
  displayedColumns: string[] = ['foto', 'nombre', 'tamano', 'precio', 'acciones'];
  dataSource = new MatTableDataSource<ProductBasic>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  private selectedLanguage: string = 'es';
  private currentLanguageOvservable$: Observable<string>;
  private subscription: Subscription[] = [];

  constructor(private productService: ProductsService, 
    public translate: TranslateService,
    private store: Store<{settings: SettingsState}>,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.setLanguageSelected();
    this.urlProducts = this.getUrlProducts();
    this.setPaginator();
    this.getProductsBasicList(this.urlProducts);
  }

  getUrlProducts(){
    if(window.sessionStorage.getItem('urlProducts')){
      return window.sessionStorage.getItem('urlProducts');
    }
  }

  getProductsBasicList(urlProductsPageable: string){
    this.productService.getProductsBasicList(urlProductsPageable).subscribe( data =>{
      this.pageModelProductBasic = data;
      this.setTableDataSource();
      this.setTableTotalLength();
      this.setUrlPrevAndNext();
      this.saveDataInSessionStorage();
    })
  }

  setPaginator(){
    this.dataSource.paginator = this.paginator;
  }

  setTableDataSource(){
    this.productsBasicList =  this.pageModelProductBasic.content;
    this.dataSource = new MatTableDataSource(this.productsBasicList);
  }

  setTableTotalLength(){
    this.totalLength = this.pageModelProductBasic.page.totalElements;
  }

  setUrlPrevAndNext(){
    for(let link of this.pageModelProductBasic.links){
      let linkedUrl:string = link.rel;
      if(linkedUrl == NEXT_PAGE){
        this.urlProductsNext = link.href;
      }else if(linkedUrl == PREVIOUS_PAGE){
        this.urlProductsPrev = link.href;
      }
    }
  }

  saveDataInSessionStorage(){
    window.sessionStorage.setItem("productListData", JSON.stringify(this.productsBasicList));
  }

  busquedaOrden(event) {
    this.paginaActual = 0;
    if (event.active != null) {
      this.ordenColumnas = event.direction;
      this.nombreColumna = event.active;
    }
  }

  changePage(event) {
    this.paginaActual = event.pageIndex;
    this.paginaAnterior = event.previousPageIndex;
    if(this.paginaAnterior < this.paginaActual){
      this.getProductsBasicList(this.urlProductsNext);
    }else{
      this.getProductsBasicList(this.urlProductsPrev);
    }
  }

  openDialog(product: ProductBasic): void {

    const dialogRef = this.dialog.open(ConfirmDialog, {
      //width: '250px',
      data: {name: product .nombre}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  goToProductDetail(product: ProductBasic){
    this.router.navigate([PRODUCT_DETAIL_PATH, product.id])
  }

  setLanguageSelected(){
    this.currentLanguageOvservable$ = this.store.pipe(select(selectSettingsCurrentLanguage)); 
    this.subscription.push(this.currentLanguageOvservable$.subscribe( (language) => {
      if(language != null || language != ''){
        this.selectedLanguage = language;
        this.translate.use(this.selectedLanguage);
      }
    }))
  }

  ngOnDestroy(){
    this.subscription.forEach(s => s.unsubscribe());
  }

}
