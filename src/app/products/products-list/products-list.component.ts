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
import { startWith, map } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';

const PRODUCT_DETAIL_PATH = '/products/detail';
const PRODUCT_NEW_PATH = '/products/new';
const NEXT_PAGE = 'next';
const PREVIOUS_PAGE = 'prev';
const PRE_CREATE = 'preCreate';

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
  private urlPreCreate: string;
  public searchBoxForm: FormGroup;
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
    this.initSearchBoxForm();
  }

  getUrlProducts(){
    if(window.sessionStorage.getItem('urlProducts')){
      return window.sessionStorage.getItem('urlProducts');
    }
  }

  getProductsBasicList(urlProductsPageable: string){
    this.productService.getProductsBasicList(urlProductsPageable, null).subscribe( data =>{
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
      }else if(linkedUrl == PRE_CREATE){
        this.urlPreCreate = link.href;
      }
    }
  }

  saveDataInSessionStorage(){
    window.sessionStorage.setItem("productListData", JSON.stringify(this.productsBasicList));
    window.sessionStorage.setItem("preCreateUrl", this.urlPreCreate);
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

  initSearchBoxForm(){
    this.searchBoxForm = new FormGroup({
      textToSearch: new FormControl('')
    })
  }

  filterSearchBoxText(){
    let textToSearch: string = this.searchBoxForm.get('textToSearch').value;
    this.productService.getProductsBasicList(this.urlProducts, textToSearch).subscribe( data =>{
      this.pageModelProductBasic = data;
      this.setTableDataSource();
      this.setTableTotalLength();
      this.setUrlPrevAndNext();
      this.saveDataInSessionStorage();
    })
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

  createNewProduct(){
    this.router.navigate([PRODUCT_NEW_PATH])
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
