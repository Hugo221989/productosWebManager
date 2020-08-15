import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CustomerService } from '../service/customer.service';
import { SettingsState } from 'src/app/settings/settings.models';
import { Store, select } from '@ngrx/store';
import { UsuarioDireccion, Genero, CustomerBasic, Customer } from 'src/app/models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { selectSettingsCurrentLanguage } from 'src/app/settings/settings.selectors';
import { MatSnackBar } from '@angular/material/snack-bar';

const DELETE: string = 'delete';
const UPDATE: string = 'update';
const GENDERS: string = 'genders';

@Component({
  selector: 'app-customers-detail',
  templateUrl: './customers-detail.component.html',
  styleUrls: ['./customers-detail.component.scss']
})
export class CustomersDetailComponent implements OnInit {

  private selectedLanguage: string = 'es';
  private currentLanguageOvservable$: Observable<string>;
  private subscription: Subscription[] = [];
  public customerForm: FormGroup;
  private customer: Customer;
  private customerId: string;
  public genders: Genero[];
  public birth = new FormControl(new Date());
  private customerUrlApi: string;
  private updateCustomerUrl: string;
  private deleteCustomerUrl: string;
  private gendersUrl: string;

  constructor(private custumerService: CustomerService, 
    public translate: TranslateService,
    private store: Store<{settings: SettingsState}>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.initCustomerForm();
    this.getUrlParams();
    this.getCustomerBasicData();
  }

  initCustomerForm(){
    this.customerForm = this.fb.group({
      'name': new FormControl(''),
      'lastname': new FormControl(''),
      'user': new FormControl('', Validators.required),
      'birth': new FormControl(new Date()),
      'email': new FormControl('', Validators.required),
      'telephone': new FormControl(''),
      'gender': new FormControl('', Validators.required),
      'addressee': new FormControl(''),
      'street': new FormControl(''),
      'flat': new FormControl(''),
      'postalCode': new FormControl(''),
      'locality': new FormControl(''),
      'additionalData': new FormControl(''),
    });
  }

  getUrlParams(){
    this.customerId = this.route.snapshot.paramMap.get("id");
    this.getCurrentUserData();
  }

  getCurrentUserData(){
    let customers = this.getCustomersDataFromSession();
      for(let customer of customers){
        if(customer != null && customer.id == this.stringToNumber(this.customerId)){
          this.customerUrlApi = customer.links[0].href;
        }
      }
  }

  stringToNumber (x: string): number {
    return parseInt(x, 10);
  }

  getCustomersDataFromSession(){
    let customers: CustomerBasic[] = [];
    if(window.sessionStorage.getItem("customerListData")){
      customers = JSON.parse(window.sessionStorage.getItem("customerListData"));
    }
    return customers;
  }

  getCustomerBasicData(){
    if(this.customerUrlApi == null){
      this.router.navigate(['products/list'])
    }else{
      this.custumerService.getCustomerBasic(this.customerUrlApi).subscribe( data =>{
        this.customer = data;
        this.fillCustomerLinkedUrls();
        this.getGenders();
        this.fillCustomerFormData();
      })
    }
  }

  fillCustomerFormData(){
    if(this.customer){
      let nacimiento = this.customer.nacimiento;
      this.customerForm.controls['name'].setValue(this.customer.nombre);
      this.customerForm.controls['lastname'].setValue(this.customer.apellido);
      this.customerForm.controls['user'].setValue(this.customer.usuario);
      this.customerForm.controls['birth'].setValue(nacimiento);
      if(nacimiento)
        this.birth.setValue(this.createDateFromString(nacimiento.toLocaleString()));
      else
        this.birth.setValue(null);
      this.customerForm.controls['email'].setValue(this.customer.email);
      this.customerForm.controls['telephone'].setValue(this.customer.telefono);
      if(this.customer.genero){
        this.customerForm.controls['gender'].patchValue(this.customer.genero);
      }
      this.fillCustomerFormAddress();
    }
  }

  fillCustomerFormAddress(){
    if(this.customer.direccion){
      let customerAddress: UsuarioDireccion = this.customer.direccion;
      this.customerForm.controls['addressee'].setValue(customerAddress.destinatario);
      this.customerForm.controls['street'].setValue(customerAddress.calle);
      this.customerForm.controls['flat'].setValue(customerAddress.piso);
      this.customerForm.controls['postalCode'].setValue(customerAddress.codigoPostal);
      this.customerForm.controls['locality'].setValue(customerAddress.localidad);
      this.customerForm.controls['additionalData'].setValue(customerAddress.datosAdicionales);
    }
  }

  fillCustomerLinkedUrls(){
    for(let link of this.customer.links){
      let linkedUrl:string = link.rel;
      if(linkedUrl == DELETE){
        this.deleteCustomerUrl = link.href;
      }else if(linkedUrl == UPDATE){
        this.updateCustomerUrl = link.href;
      }else if(linkedUrl == GENDERS){
        this.gendersUrl = link.href;
      }
    }
  }

  updateCustomer(){
    this.fillCustomerUpdated();
    this.custumerService.updateCustomerData(this.updateCustomerUrl, this.customer).subscribe(data=>{
      if(data){
        let status = data.status;
        if(status != 200 && status != 204){
          this.openMessageAfterUpdate('Error al guardar los datos', '');
        }else{
          this.openMessageAfterUpdate('Cambios guardados correctamente', '');
        }
      }
    },error => {
      this.openMessageAfterUpdate('Error al guardar los datos', '');
    });
  }

  fillCustomerUpdated(){
    this.customer.nombre = this.customerForm.value.name;
    this.customer.apellido = this.customerForm.value.lastname;
    this.customer.usuario = this.customerForm.value.user;
    this.customer.nacimiento = this.birth.value;
    this.customer.email = this.customerForm.value.email;
    this.customer.telefono = this.customerForm.value.telephone;
    this.customer.genero = this.customerForm.value.gender;
    this.customer.direccion = this.fillCustomerAddressUpdated();
  }

  fillCustomerAddressUpdated(): UsuarioDireccion{
    let customerAddress:UsuarioDireccion = {
      destinatario: this.customerForm.value.addressee,
      calle: this.customerForm.value.street,
      piso: this.customerForm.value.flat,
      codigoPostal: this.customerForm.value.flat,
      localidad: this.customerForm.value.flat,
      datosAdicionales: this.customerForm.value.flat
    }
    return customerAddress;
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

  getGenders(){
    this.custumerService.getGenders(this.gendersUrl).subscribe( data =>{
      this.genders = data;
    })
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
