import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Product, ProductBasic, Producto } from 'src/app/models/producto';
import { TranslateService } from '@ngx-translate/core';
import { SettingsState } from 'src/app/settings/settings.models';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { selectSettingsCurrentLanguage } from 'src/app/settings/settings.selectors';
import { ProductsService } from '../service/products.service';
import { CategoriaPadreDto, SubCategoriaDto, CategoriaDto } from 'src/app/models/categoria';
import { InfoBasica, Descripcion, ValorNutricional, Foto } from 'src/app/models/productoOtrosDatos';
import { UploadService } from '../service/upload-service.service';
import Utils from '../helpers/product-detail-helper';

const DELETE: string = 'delete';
const UPDATE: string = 'update';
const CATEGORIASPADRE: string = 'categoriasPadre';
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
  public birth = new FormControl(new Date());
  private productUrlApi: string;
  private updateProductoUrl: string;
  private deleteProductoUrl: string;
  private categoriaPadreUrl: string;
  private categoriaUrl: string;
  private subCategoriaUrl: string;
  private urlUploadPhotos: string;
  public categoriasPadre: CategoriaPadreDto[] = [];
  public categorias: CategoriaDto[] = [];
  public subCategorias: SubCategoriaDto[] = [];
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
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.setLanguageSelected();
    this.initProductForm();
    this.initValorNutricionalForm();
    this.initInfoBasicaForm();
    this.initDescripcionForm();
    this.getUrlParams();
    this.getProductBasicData();
    this.initUploadPhotoProgress();
  }

  initProductForm(){
    this.productForm = Utils.initProductForm(this.fb);
   /*  this.productForm = this.fb.group({
      'nombre': new FormControl(''),
      'nombreEng': new FormControl(''),
      'precio': new FormControl('', [Validators.required, Validators.pattern(/\-?\d*\.?\d{1,2}/)]),
      'tamano': new FormControl(new Date()),
      'saborSeleccionado': new FormControl('', Validators.required),
      'cantidad': new FormControl(''),
      'puntuacion': new FormControl(''),
      'disponible': new FormControl(''),
      //'foto': new FormControl(''),
      'precioFinal': new FormControl(''),
      'descuento': new FormControl(''),
      'categoriaPadre': new FormControl('', Validators.required),
      'categoria': new FormControl('', Validators.required),
      'subCategoria': new FormControl('', Validators.required),
    }); */
  }

  initValorNutricionalForm(){
    this.valorNutricionalForm = this.fb.group({
      'dosis': new FormControl(''),
      'dosisEnvase': new FormControl(''),
      'dosisDiaria': new FormControl(''),
      'ingredientes': new FormControl(''),
      'ingredientesEng': new FormControl(''),
      'otrosIngredientes': new FormControl(''),
      'otrosIngredientesEng': new FormControl(''),
      'conservacion': new FormControl(''),
      'conservacionEng': new FormControl(''),
      'alergias': new FormControl(''),
      'alergiasEng': new FormControl(''),
      'modoEmpleo': new FormControl(''),
      'modoEmpleoEng': new FormControl(''),
      'advertencias': new FormControl(''),
      'advertenciasEng': new FormControl('')
    })
  }

  initInfoBasicaForm(){
    this.infoBasicaForm = this.fb.group({
      'valorEnergetico': new FormControl(''),
      'proteinas': new FormControl(''),
      'hidratos': new FormControl(''),
      'azucares': new FormControl(''),
      'grasas': new FormControl(''),
      'saturadas': new FormControl(''),
      'sodio': new FormControl('')
    })
  }

  initDescripcionForm(){
    this.descripcionForm = this.fb.group({
      'titulo': new FormControl(''),
      'tituloEng': new FormControl(''),
      'subtitulo': new FormControl(''),
      'subtituloEng': new FormControl(''),
      'apartado': new FormControl(''),
      'apartadoEng': new FormControl(''),
      'caracteristicas': new FormControl(''),
      'caracteristicasEng': new FormControl(''),
      'beneficios': new FormControl(''),
      'beneficiosEng': new FormControl('')
    })
  }

  initInfoVitaminasForm(){
    this.infoVitaminasForm = this.fb.group({
      'nombre': new FormControl(''),
      'nombreEng': new FormControl(''),
      'valor': new FormControl('')
    })
  }

  getUrlParams(){
    this.productId = this.route.snapshot.paramMap.get("id");
    this.getCurrentUserData();
  }

  getCurrentUserData(){
    let products = this.getProductsDataFromSession();
      for(let product of products){
        if(product != null && product.id == this.stringToNumber(this.productId)){
          this.productUrlApi = product.links[0].href;
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
        this.getCategoriasPadreList();
        this.fillProductFormData();
        this.fillProductPhotos();
      })
    }
  }

  fillProductFormData(){
    if(this.product){
      this.producto = this.product.producto;
      this.productForm.controls['nombre'].setValue(this.producto.nombre);
      this.productForm.controls['nombreEng'].setValue(this.producto.nombreEng);
      this.productForm.controls['precio'].setValue(this.producto.precio);
      this.productForm.controls['tamano'].setValue(this.producto.tamano);
      this.productForm.controls['saborSeleccionado'].setValue(this.producto.saborSeleccionado);
      this.productForm.controls['cantidad'].setValue(this.producto.cantidad);
      this.inputPuntuacion = this.producto.puntuacion;
      this.productForm.controls['puntuacion'].setValue(this.producto.puntuacion);
      this.productForm.controls['disponible'].setValue(this.producto.disponible);
      this.productForm.controls['precioFinal'].setValue(this.producto.precioFinal);
      this.productForm.controls['descuento'].setValue(this.producto.descuento);
      this.productForm.controls['categoriaPadre'].setValue(this.product.categoriaPadre);
      this.productForm.controls['categoria'].setValue(this.product.categoria);
      this.productForm.controls['subCategoria'].setValue(this.product.subCategoria);
      this.fillValorNutricionalForm(this.producto);
      this.fillDescripcionForm(this.producto);
    }
  }

  fillValorNutricionalForm(producto: Producto){
    if(producto.valorNutricional.infoBasica){
      let valorNutricional: ValorNutricional = producto.valorNutricional;
      this.valorNutricionalForm.controls['dosis'].setValue(valorNutricional.dosis);
      this.valorNutricionalForm.controls['dosisEnvase'].setValue(valorNutricional.dosisEnvase);
      this.valorNutricionalForm.controls['dosisDiaria'].setValue(valorNutricional.dosisDiaria);
      this.valorNutricionalForm.controls['ingredientes'].setValue(valorNutricional.ingredientes);
      this.valorNutricionalForm.controls['ingredientesEng'].setValue(valorNutricional.ingredientesEng);
      this.valorNutricionalForm.controls['otrosIngredientes'].setValue(valorNutricional.otrosIngredientes);
      this.valorNutricionalForm.controls['otrosIngredientesEng'].setValue(valorNutricional.otrosIngredientesEng);
      this.valorNutricionalForm.controls['conservacion'].setValue(valorNutricional.conservacion);
      this.valorNutricionalForm.controls['conservacionEng'].setValue(valorNutricional.conservacionEng);
      this.valorNutricionalForm.controls['alergias'].setValue(valorNutricional.alergias);
      this.valorNutricionalForm.controls['alergiasEng'].setValue(valorNutricional.alergiasEng);
      this.valorNutricionalForm.controls['advertencias'].setValue(valorNutricional.advertencias);
      this.valorNutricionalForm.controls['advertenciasEng'].setValue(valorNutricional.advertenciasEng);
      this.valorNutricionalForm.controls['modoEmpleo'].setValue(valorNutricional.modoEmpleo);
      this.valorNutricionalForm.controls['modoEmpleoEng'].setValue(valorNutricional.modoEmpleoEng);
      this.fillInfoBasicaForm(valorNutricional);
    }
  }

  fillInfoBasicaForm(valorNutricional: ValorNutricional){
    if(valorNutricional.infoBasica){
      let infoBasica: InfoBasica = valorNutricional.infoBasica;
      this.infoBasicaForm.controls['valorEnergetico'].setValue(infoBasica.valorEnergetico);
      this.infoBasicaForm.controls['proteinas'].setValue(infoBasica.proteinas);
      this.infoBasicaForm.controls['hidratos'].setValue(infoBasica.hidratos);
      this.infoBasicaForm.controls['azucares'].setValue(infoBasica.azucares);
      this.infoBasicaForm.controls['grasas'].setValue(infoBasica.grasas);
      this.infoBasicaForm.controls['saturadas'].setValue(infoBasica.saturadas);
      this.infoBasicaForm.controls['sodio'].setValue(infoBasica.sodio);
    }
  }

  fillDescripcionForm(producto: Producto){
    if(producto.descripcion){
      let descripcion: Descripcion = producto.descripcion;
      this.descripcionForm.controls['titulo'].setValue(descripcion.titulo);
      this.descripcionForm.controls['tituloEng'].setValue(descripcion.tituloEng);
      this.descripcionForm.controls['subtitulo'].setValue(descripcion.subtitulo);
      this.descripcionForm.controls['subtituloEng'].setValue(descripcion.subtituloEng);
      this.descripcionForm.controls['apartado'].setValue(descripcion.apartado);
      this.descripcionForm.controls['apartadoEng'].setValue(descripcion.apartadoEng);
      this.descripcionForm.controls['caracteristicas'].setValue(descripcion.caracteristicas);
      this.descripcionForm.controls['caracteristicasEng'].setValue(descripcion.caracteristicasEng);
      this.descripcionForm.controls['beneficios'].setValue(descripcion.beneficios);
      this.descripcionForm.controls['beneficiosEng'].setValue(descripcion.beneficiosEng);
    }
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
      }
    }
  }

  updateProductMainData(){
    let producto: Producto = this.producto;
    producto.nombre = this.productForm.value.nombre;
    producto.nombreEng = this.productForm.value.nombreEng;
    producto.precio = this.productForm.value.precio;
    producto.tamano = this.productForm.value.tamano;
    producto.puntuacion = this.productForm.value.puntuacion;
    producto.disponible = this.productForm.value.disponible;
    producto.precioFinal = this.productForm.value.precioFinal;
    producto.descuento = this.productForm.value.descuento;
    this.product.categoriaPadre = this.productForm.value.categoriaPadre;
    this.product.categoria = this.productForm.value.categoria;
    this.product.subCategoria = this.productForm.value.subCategoria;
    this.product.producto = this.producto;
    this.updateProducto();
  }

  updateProductoInfoBasica(){
    let infoBasica: InfoBasica = this.producto.valorNutricional.infoBasica;
    infoBasica.valorEnergetico = this.infoBasicaForm.value.valorEnergetico;
    infoBasica.proteinas = this.infoBasicaForm.value.proteinas;
    infoBasica.hidratos = this.infoBasicaForm.value.hidratos;
    infoBasica.azucares = this.infoBasicaForm.value.azucares;
    infoBasica.grasas = this.infoBasicaForm.value.grasas;
    infoBasica.saturadas = this.infoBasicaForm.value.saturadas;
    infoBasica.sodio = this.infoBasicaForm.value.sodio;
    this.producto.valorNutricional.infoBasica = infoBasica;
    this.product.producto = this.producto;
    this.updateProducto();
  }

  updateProductoDescripcion(){
    let descripcion: Descripcion = this.producto.descripcion;
    descripcion.titulo = this.descripcionForm.value.titulo;
    descripcion.tituloEng = this.descripcionForm.value.tituloEng;
    descripcion.subtitulo = this.descripcionForm.value.subtitulo;
    descripcion.subtituloEng = this.descripcionForm.value.subtituloEng;
    descripcion.apartado = this.descripcionForm.value.apartado;
    descripcion.apartadoEng = this.descripcionForm.value.apartadoEng;
    descripcion.caracteristicas = this.descripcionForm.value.caracteristicas;
    descripcion.caracteristicasEng = this.descripcionForm.value.caracteristicasEng;
    descripcion.beneficios = this.descripcionForm.value.beneficios;
    descripcion.beneficiosEng = this.descripcionForm.value.beneficiosEng;
    this.producto.descripcion = descripcion;
    this.product.producto = this.producto;
    this.updateProducto();
  }

  updateProductoNutritionalValue(){
    let valorNutricional: ValorNutricional = this.product.producto.valorNutricional;
    valorNutricional.dosis = this.valorNutricionalForm.value.dosis;
    valorNutricional.dosisEnvase = this.valorNutricionalForm.value.dosisEnvase;
    valorNutricional.dosisDiaria = this.valorNutricionalForm.value.dosisDiaria;
    valorNutricional.ingredientes = this.valorNutricionalForm.value.ingredientes;
    valorNutricional.ingredientesEng = this.valorNutricionalForm.value.ingredientesEng;
    valorNutricional.otrosIngredientes = this.valorNutricionalForm.value.otrosIngredientes;
    valorNutricional.otrosIngredientesEng = this.valorNutricionalForm.value.otrosIngredientesEng;
    valorNutricional.conservacion = this.valorNutricionalForm.value.conservacion;
    valorNutricional.conservacionEng = this.valorNutricionalForm.value.conservacionEng;
    valorNutricional.alergias = this.valorNutricionalForm.value.alergias;
    valorNutricional.alergiasEng = this.valorNutricionalForm.value.alergiasEng;
    valorNutricional.modoEmpleo = this.valorNutricionalForm.value.modoEmpleo;
    valorNutricional.modoEmpleoEng = this.valorNutricionalForm.value.modoEmpleoEng;
    valorNutricional.advertencias = this.valorNutricionalForm.value.advertencias;
    valorNutricional.advertenciasEng = this.valorNutricionalForm.value.advertenciasEng;
    this.product.producto.valorNutricional = valorNutricional;
    this.updateProducto();
  }

  updateProducto(){
    this.productService.updateProductoData(this.updateProductoUrl, this.product).subscribe( data=> {
      
    },error => {
      this.openMessageAfterUpdate('Error al guardar los datos', error.error);
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

  onRatingChange(slider){
    this.inputPuntuacion = slider.value;
  }

  createDateFromString(dateString: string){
    const dateArray = dateString.split("/");
    const year = dateArray[2];
    const month = dateArray[1];
    const day = dateArray[0];
    return new Date(year+'-'+month+'-'+day);
  }

  openMessageAfterUpdate(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      panelClass: ['snackBarStyle']
    });
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
