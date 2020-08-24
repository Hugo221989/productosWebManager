import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Product, ProductBasic, Producto } from 'src/app/models/producto';
import { TranslateService } from '@ngx-translate/core';
import { SettingsState } from 'src/app/settings/settings.models';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { selectSettingsCurrentLanguage } from 'src/app/settings/settings.selectors';
import { ProductsService } from '../service/products.service';
import { CategoriaPadreDto, SubCategoriaDto, CategoriaDto } from 'src/app/models/categoria';
import { InfoBasica, Descripcion, ValorNutricional, Foto, InfoVitaminas, Sabor } from 'src/app/models/productoOtrosDatos';
import { UploadService } from '../service/upload-service.service';
import Utils from '../helpers/product-detail-helper';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from 'src/app/dialogs/confirm-dialog';

const DELETE: string = 'delete';
const UPDATE: string = 'update';
const CATEGORIASPADRE: string = 'categoriasPadreUrl';
const FLAVOURS: string = 'flavoursUrl';
const CATEGORIAS: string = 'categorias';
const SUBCATEGORIAS: string = 'subCategorias';
const URL_UPLOAD_PHOTO: string = 'uploadPhotoUrl';

@Component({
  selector: 'app-products-detail',
  templateUrl: './products-detail.component.html',
  styleUrls: ['./products-detail.component.scss']
})
export class ProductsDetailComponent implements OnInit {
  private selectedLanguage: string = 'es';
  private currentLanguageOvservable$: Observable<string>;
  private subscription: Subscription[] = [];
  public productForm: FormGroup;
  public valorNutricionalForm: FormGroup;
  public infoBasicaForm: FormGroup;
  public infoVitaminasForm: FormGroup;
  public descripcionForm: FormGroup;
  private product: Product;
  private producto: Producto;
  private productId: string;
  public productoName: string;
  public birth = new FormControl(new Date());
  public vitaminas: InfoVitaminas[] = [];
  private productUrlApi: string;
  private updateProductoUrl: string;
  private deleteProductoUrl: string;
  private categoriaPadreUrl: string;
  private categoriaUrl: string;
  private subCategoriaUrl: string;
  private urlUploadPhotos: string;
  private urlFlavours: string;
  public categoriasPadre: CategoriaPadreDto[] = [];
  public categorias: CategoriaDto[] = [];
  public subCategorias: SubCategoriaDto[] = [];
  public flavours: Sabor[] = [];
  public selectedFlavours:Sabor[] = [];
  public inputPuntuacion: number = 0;

  public progress: number;
  public infoMessage: any;
  public isUploading: boolean = false;
  public productPhotos: Foto[] = [];
  public productPhotoOne: Foto;
  public productPhotoTwo: Foto;
  public productPhotoThree: Foto;
  public productPhotoFour: Foto;
  public photoBaseUrl: string = 'http://127.0.0.1:8887/';

  constructor(private productService: ProductsService, 
    public translate: TranslateService,
    private store: Store<{settings: SettingsState}>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private uploader: UploadService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.setLanguageSelected();
    this.initProductForm();
    this.initValorNutricionalForm();
    this.initInfoBasicaForm();
    this.initInfoVitaminasForm();
    this.initDescripcionForm();
    this.getUrlParams();
    this.getProductBasicData();
    this.initUploadPhotoProgress();
  }

  initProductForm(){
    this.productForm = Utils.initProductForm(this.fb);
  }

  initValorNutricionalForm(){
    this.valorNutricionalForm = Utils.initValorNutricionalForm(this.fb);
  }

  initInfoBasicaForm(){
    this.infoBasicaForm = Utils.initInfoBasicaForm(this.fb);
  }

  initDescripcionForm(){
    this.descripcionForm = Utils.initDescripcionForm(this.fb);
  }

  initInfoVitaminasForm(){
    this.infoVitaminasForm = Utils.initInfoVitaminasForm(this.fb);
    //this. addVitaminaToForm();
  }
  

  getUrlParams(){
    this.productId = this.route.snapshot.paramMap.get("id");
    this.getProductUserData();
  }

  getProductUserData(){
    let products = this.getProductsDataFromSession();
      for(let product of products){
        if(product != null && product.id == this.stringToNumber(this.productId)){
          this.productUrlApi = product.links[0].href;
        }else{
          if(window.sessionStorage.getItem("newProductUrl")){
            this.productUrlApi = window.sessionStorage.getItem("newProductUrl");
          }
        }
      }
  }

  stringToNumber (x: string): number {
    return parseInt(x, 10);
  }

  getProductsDataFromSession(){
    let products: ProductBasic[] = [];
    if(window.sessionStorage.getItem("productListData")){
      products = JSON.parse(window.sessionStorage.getItem("productListData"));
    }
    return products;
  }

  getProductBasicData(){
    if(this.productUrlApi == null){
      this.router.navigate(['products/list'])
    }else{
      this.productService.getProductBasic(this.productUrlApi).subscribe( data =>{
        this.product = data;
        this.fillProductLinkedUrls();
        this.fillFlavoursList();
        this.getCategoriasPadreList();
        this.fillProductFormData();
        this.fillProductFlavours();
        this.fillProductPhotos();
      })
    }
  }

  fillProductFormData(){
    if(this.product){
      this.producto = this.product.producto;
      this.productoName = this.producto.nombre;
      this.productForm = Utils.fillProductFormData(this.productForm, this.product);
      this.inputPuntuacion = this.producto.puntuacion;
      this.fillValorNutricionalForm(this.producto);
      this.fillDescripcionForm(this.producto);
    }
  }

  fillValorNutricionalForm(producto: Producto){
    if(producto.valorNutricional.infoBasica){
      let valorNutricional: ValorNutricional = producto.valorNutricional;
      this.valorNutricionalForm = Utils.fillValorNutricionalForm(this.valorNutricionalForm, valorNutricional);
      this.fillInfoBasicaForm(valorNutricional);
      this.fillInfoVitaminas(valorNutricional);
    }
  }

  fillInfoBasicaForm(valorNutricional: ValorNutricional){
    if(valorNutricional.infoBasica){
      let infoBasica: InfoBasica = valorNutricional.infoBasica;
      this.infoBasicaForm = Utils.fillInfoBasicaForm(this.infoBasicaForm, infoBasica);
    }
  }

  fillInfoVitaminas(valorNutricional: ValorNutricional){
    if(valorNutricional.infoVitaminas){
      let infoVitaminas = valorNutricional.infoVitaminas;
      this.vitaminas = infoVitaminas;
      let index:number = 0;
      for(let vitamina of this.vitaminas){ 
        this.addVitaminaToForm();
        this.fillVitaminaForm(vitamina, index);
        index ++;
      }
    }
  }

  getInfoVitaminasFormArray(): FormArray {
    return this.infoVitaminasForm.get('vitas') as FormArray;
  }

  addVitaminaToForm(){
    this.getInfoVitaminasFormArray().push(this.fb.group({
        nombre: new FormControl('', Validators.required),
        valor: new FormControl('', Validators.required)
    }));
  }

  fillVitaminaForm(vitamina: InfoVitaminas, index: number){
    this.getInfoVitaminasFormArray().controls[index].get('nombre').setValue(vitamina.nombre);
    this.getInfoVitaminasFormArray().controls[index].get('valor').setValue(vitamina.valor);
  }

  removeVitamin(index: number){
    this.getInfoVitaminasFormArray().controls.splice(index, 1);
  }

  fillDescripcionForm(producto: Producto){
    if(producto.descripcion){
      let descripcion: Descripcion = producto.descripcion;
      this.descripcionForm = Utils.fillDescripcionForm(this.descripcionForm, descripcion);
    }
  }

  fillProductFlavours(){
    this.selectedFlavours = this.product.producto.sabores;
  }

  fillProductPhotos(){
    this.productPhotos = this.product.producto.fotos;
    this.productPhotoOne = this.productPhotos[0];
    this.photoUrlOne = this.photoBaseUrl+this.productPhotoOne.ruta
    this.productPhotoTwo = this.productPhotos[1];
    this.photoUrlTwo = this.photoBaseUrl+this.productPhotoTwo.ruta
    this.productPhotoThree = this.productPhotos[2];
    this.photoUrlThree = this.photoBaseUrl+this.productPhotoThree.ruta
    this.productPhotoFour = this.productPhotos[3];
    this.photoUrlFour = this.photoBaseUrl+this.productPhotoFour.ruta
  }

  fillProductLinkedUrls(){
    for(let link of this.product.links){
      let linkedUrl:string = link.rel;
      if(linkedUrl == DELETE){
        this.deleteProductoUrl = link.href;
      }else if(linkedUrl == UPDATE){
        this.updateProductoUrl = link.href;
      }else if(linkedUrl == CATEGORIASPADRE){
        this.categoriaPadreUrl = link.href;
      }else if(linkedUrl == URL_UPLOAD_PHOTO){
        this.urlUploadPhotos = link.href;
      }else if(linkedUrl == FLAVOURS){
        this.urlFlavours = link.href;
      }
    }
  }

  updateProductMainData(){
    this.product = Utils.updateProductMainData(this.product, this.productForm);
    this.updateProducto();
  }

  updateProductoInfoBasica(){
    this.product.producto = Utils.updateProductoInfoBasica(this.product.producto, this.infoBasicaForm);
    this.updateProducto();
  }

  updateProductInfoVitaminas(){
    this.product.producto= Utils.updateProductoInfoVitaminas(this.product.producto, this.infoVitaminasForm);
    this.updateProducto();
  }

  updateProductoDescripcion(){
    this.product.producto = Utils.updateProductoDescripcion(this.product.producto, this.descripcionForm);
    this.updateProducto();
  }

  updateProductoFlavours(){
    this.product.producto = Utils.updateProductoFlavours(this.product.producto, this.selectedFlavours);
    this.updateProducto();
  }

  updateProductoNutritionalValue(){
    this.product.producto = Utils.updateProductoNutritionalValue(this.product.producto, this.valorNutricionalForm);
    this.updateProducto();
  }

  updateProducto(){
    this.productService.updateProductoData(this.updateProductoUrl, this.product).subscribe( data=> { 
      this.openMessageAfterUpdate('Datos actualizados correctamente', '');
    },error => {
      this.openMessageAfterUpdate('Error al guardar los datos', error.error);
    });
  }

  openMessageAfterUpdate(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      panelClass: ['snackBarStyle']
    });
  }

  openDialog(nombre: string): void {

    const dialogRef = this.dialog.open(ConfirmDialog, {
      //width: '250px',
      data: {name: nombre}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  initUploadPhotoProgress(){
    this.uploader.progressSource.subscribe(progress => {
      this.progress = progress;
    });
  }

  public photoOne: File;
  public photoUrlOne: string | ArrayBuffer;
  onPhotoOneChange(file: File) {
    if (file) {
      this.photoOne = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        this.photoUrlOne = reader.result;
      };
    }
  }

  public photoTwo: File;
  public photoUrlTwo: string | ArrayBuffer;
  onPhotoTwoChange(file: File) {
    if (file) {
      this.photoTwo = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        this.photoUrlTwo = reader.result;
      };
    }
  }

  public photoThree: File;
  public photoUrlThree: string | ArrayBuffer;
  onPhotoThreeChange(file: File) {
    if (file) {
      this.photoThree = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        this.photoUrlThree = reader.result;
      };
    }
  }

  public photoFour: File;
  public photoUrlFour: string | ArrayBuffer;
  onPhotoFourChange(file: File) {
    if (file) {
      this.photoFour = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        this.photoUrlFour = reader.result;
      };
    }
  }

  cancelPhotoOneChange(){
    this.photoUrlOne = this.photoBaseUrl+this.productPhotoOne.ruta;
  }

  cancelPhotoTwoChange(){
    this.photoUrlTwo = this.photoBaseUrl+this.productPhotoTwo.ruta;
  }

  cancelPhotoThreeChange(){
    this.photoUrlThree = this.photoBaseUrl+this.productPhotoThree.ruta;
  }

  cancelPhotoFourChange(){
    this.photoUrlFour = this.photoBaseUrl+this.productPhotoFour.ruta;
  }

  photo: File;
  onPhotoUploadOne(photoDirectory){
    this.photo = this.photoOne;
    this.onPhotoUpload(photoDirectory);
  }
  onPhotoUploadTwo(photoDirectory){
    this.photo = this.photoTwo;
    this.onPhotoUpload(photoDirectory);
  }
  onPhotoUploadThree(photoDirectory){
    this.photo = this.photoThree;
    this.onPhotoUpload(photoDirectory);
  }
  onPhotoUploadFour(photoDirectory){
    this.photo = this.photoFour;
    this.onPhotoUpload(photoDirectory);
  }

  onPhotoUpload(photoDirectory) {
    this.infoMessage = null;
    this.progress = 0;
    this.isUploading = true;

    let urlUploadPhoto:string = this.urlUploadPhotos+photoDirectory; 
    this.uploader.upload(urlUploadPhoto, this.photo).subscribe(message => {
      this.isUploading = false;
      this.infoMessage = message;
      this.openMessageAfterUpdate('Foto subida correctamente', '');
    },error => {
      this.isUploading = false;
      this.openMessageAfterUpdate('Error al guardar los datos', error.error);
    });
  }

  getCategoriasPadreList(){
    this.productService.getCategoriasPadre(this.categoriaPadreUrl).subscribe(data => {
      this.categoriasPadre = data;
      this.fillCategoriaLinkedUrl(this.product.categoriaPadre);
    })
  }

  fillCategoriaLinkedUrl(productCategoriaPadreId){
    for(let categoriaPadre of this.categoriasPadre){
      if(categoriaPadre.id == productCategoriaPadreId){
        this.categorias = null;
        this.subCategorias = null;
        this.setCategoriaUrl(categoriaPadre);
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

  fillFlavoursList(){
    this.productService.getFlavours(this.urlFlavours).subscribe(data => {
      this.flavours = data;
    })
  }

  onRatingChange(slider){
    this.inputPuntuacion = slider.value;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
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
