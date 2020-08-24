import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProductsService } from '../service/products.service';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SubCategoriaDto, CategoriaDto, CategoriaPadreDto } from 'src/app/models/categoria';
import { select, Store } from '@ngrx/store';
import { selectSettingsCurrentLanguage } from 'src/app/settings/settings.selectors';
import { SettingsState } from 'src/app/settings/settings.models';
import { Product} from 'src/app/models/producto';
import Utils from '../helpers/product-detail-helper';
import { MatSnackBar } from '@angular/material/snack-bar';

const PRODUCT_DETAIL_PATH = '/products/detail';
const CATEGORIASPADRE: string = 'categoriasPadre';
const CATEGORIAS: string = 'categorias';
const SUBCATEGORIAS: string = 'subCategorias';
const CREATE_PRODUCT_URL: string = 'createProduct';
const SELF_URL: string = 'self';

@Component({
  selector: 'app-pre-create-product',
  templateUrl: './pre-create-product.component.html',
  styleUrls: ['./pre-create-product.component.scss']
})
export class PreCreateProductComponent implements OnInit, OnDestroy {

  private selectedLanguage: string = 'es';
  private currentLanguageOvservable$: Observable<string>;
  private subscription: Subscription[] = [];
  public preCreateForm: FormGroup;
  public categoriasPadre: CategoriaPadreDto[] = [];
  public categorias: CategoriaDto[] = [];
  public subCategorias: SubCategoriaDto[] = [];
  private categoriaPadreUrl: string;
  private categoriaUrl: string;
  private subCategoriaUrl: string;
  private product: Product;
  private urlPreCreate: string;
  private urlCreateProduct: string;
  private mainDirectory: string;

  constructor(private productService: ProductsService, 
    public translate: TranslateService,
    private router: Router,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private store: Store<{settings: SettingsState}>) { }

  ngOnInit(): void {
    this.setLanguageSelected();
    this.initPreProductForm();
    this.getUrlPreCreate();
    this.getCategoriasPadreList();
  }

  getUrlPreCreate(){
    if(window.sessionStorage.getItem("preCreateUrl") == null){
      this.router.navigate(['products/list'])
    }else{
      this.urlPreCreate = window.sessionStorage.getItem("preCreateUrl");
      this.getNewProduct();
    }
  }

  getNewProduct(){
    this.productService.getProductBasic(this.urlPreCreate).subscribe( data =>{
      this.product = data;
      this.fillProductLinkedUrls();
      this.getCategoriasPadreList();
      //this.fillProductPhotos();
    })
  }

  fillProductLinkedUrls(){
    for(let link of this.product.links){
      let linkedUrl:string = link.rel;
       if(linkedUrl == CATEGORIASPADRE){
        this.categoriaPadreUrl = link.href;
      }else if(linkedUrl == CREATE_PRODUCT_URL){
        this.urlCreateProduct = link.href;
      }
    }
  }

  initPreProductForm(){
    this.preCreateForm = Utils.initPreProductForm(this.fb);
  }

  updatePreProductData(){
    this.fillPreProductData();
    this.productService.createProduct(this.urlCreateProduct, this.product).subscribe(data => { 
      if(data){
        this.processCreatedProductData(data);
      }else{
        this.showErrorWhenCreateProduct('Error al crear el producto', '');
      }
    },error => {
      this.showErrorWhenCreateProduct('Error al crear el producto', error.error);
    })
    console.log(this.product);
  }

  fillPreProductData(){
    this.product.categoriaPadre = this.preCreateForm.value.categoriaPadre;
    this.product.categoria = this.preCreateForm.value.categoria;
    this.product.subCategoria = this.preCreateForm.value.subCategoria;
    this.product.producto.nombre = this.preCreateForm.value.nombre;
    this.product.producto.carpetaFoto = this.mainDirectory +'/'+ this.preCreateForm.value.imagesDirectory +'/';
  }

  processCreatedProductData(data: Product){
    this.openMessageAfterUpdate('Producto '+this.product.producto.nombre+' creado correctamente', '');
    this.product = data;
    this.setNewProductInSession(this.product);
  }

  setNewProductInSession(product: Product){
    let newProductUrl: string;
    for(let link of product.links){
      let linkedUrl:string = link.rel;
      if(linkedUrl == SELF_URL){
        newProductUrl = link.href;
        window.sessionStorage.setItem("newProductUrl", newProductUrl);
        setTimeout(() => {
          this.router.navigate([PRODUCT_DETAIL_PATH, product.id])  
        }, 1500);
      }
    }
  }

  showErrorWhenCreateProduct(errorMessage: string, error){
    this.openMessageAfterUpdate(errorMessage, error);
  }

  setMainPhotoDirectory(directory){
    console.log(directory);
    this.mainDirectory = directory;
  }

  getCategoriasPadreList(){
    this.productService.getCategoriasPadre(this.categoriaPadreUrl).subscribe(data => {
      this.categoriasPadre = data;
      //this.fillCategoriaLinkedUrl(this.product.categoriaPadre);
    })
  }

  fillCategoriaLinkedUrl(productCategoriaPadreId){
    for(let categoriaPadre of this.categoriasPadre){
      if(categoriaPadre.id == productCategoriaPadreId){
        this.setCategoriaUrl(categoriaPadre);
        this.categorias = null;
        this.subCategorias = null;
      }
    }
  }

  setCategoriaUrl(categoriaPadre: CategoriaPadreDto){
    for(let link of categoriaPadre.links){
      let linkedUrl:string = link.rel;
      if(linkedUrl == CATEGORIAS){
        this.categoriaUrl = link.href;
        this.getCategoriasList();
      }
    }
  }

  getCategoriasList(){
    this.productService.getCategorias(this.categoriaUrl).subscribe(data => {
      this.categorias = data;
      this.fillSubCategoriaLinkedUrl(this.product.categoria);
    })
  }

  fillSubCategoriaLinkedUrl(productCategoriaId){
    for(let categoria of this.categorias){
      if(categoria.id == productCategoriaId){
        this.setSubCategoriaUrl(categoria);
      }
    }
  }

  setSubCategoriaUrl(categoria: CategoriaDto){
    for(let link of categoria.links){
      let linkedUrl:string = link.rel;
      if(linkedUrl == SUBCATEGORIAS){
        this.subCategoriaUrl = link.href;
        this.getSubCategoriasList();
      }
    }
  }

  getSubCategoriasList(){
    this.productService.getSubCategorias(this.subCategoriaUrl).subscribe(data => {
      this.subCategorias = data;
    })
  }

  openMessageAfterUpdate(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      panelClass: ['snackBarStyle']
    });
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
    window.sessionStorage.removeItem("preCreateUrl");
  }

}
