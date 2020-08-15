import { Component, OnInit, ViewChild, OnDestroy, Inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { CustomerBasic } from 'src/app/models/user';
import { CustomerService } from '../service/customer.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { SettingsState } from 'src/app/settings/settings.models';
import { selectSettingsCurrentLanguage } from '../../settings/settings.selectors';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from 'src/app/dialogs/confirm-dialog';

const CUSTOMER_DETAIL_PATH = '/customers/detail';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit, OnDestroy {

  private paginaActual: number = 0;
  public pageSize: number[] = [5];
  private pageSizeSelected: number = 5;
  public totalLength: number = 0;
  private ordenColumnas: string = 'desc';
  private nombreColumna: string = 'usuario';
  public customerBasicList: CustomerBasic[] = [];
  private urlCustomers: string;
  displayedColumns: string[] = ['nombre', 'apellido', 'usuario', 'acciones'];
  dataSource = new MatTableDataSource<CustomerBasic>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  private selectedLanguage: string = 'es';
  private currentLanguageOvservable$: Observable<string>;
  private subscription: Subscription[] = [];

  constructor(private custumerService: CustomerService, 
    public translate: TranslateService,
    private store: Store<{settings: SettingsState}>,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.setLanguageSelected();
    this.getUrlCustomers();
    this.obtenerCustomersBasicList();
  }

  getUrlCustomers(){
    if(window.sessionStorage.getItem('urlCustomers')){
      this.urlCustomers = window.sessionStorage.getItem('urlCustomers');
    }
  }

  obtenerCustomersBasicList(){
    this.custumerService.getCustomersBasicList(this.urlCustomers).subscribe( data =>{
      this.customerBasicList = data;
      this.setTableDataSource();
      this.saveDataInSessionStorage();
    })
  }

  setTableDataSource(){
    this.dataSource = new MatTableDataSource(this.customerBasicList);
    this.dataSource.paginator = this.paginator;
  }

  saveDataInSessionStorage(){
    window.sessionStorage.setItem("customerListData", JSON.stringify(this.customerBasicList));
  }

  busquedaOrden(event) {
    this.paginaActual = 0;
    if (event.active != null) {
      this.ordenColumnas = event.direction;
      this.nombreColumna = event.active;
    }
  }

  changePage(event) {
    this.pageSizeSelected = event.pageSize;
    this.paginaActual = event.pageIndex;
    //this.obtenerTarjetas();
  }

  openDialog(customer: CustomerBasic): void {

    const dialogRef = this.dialog.open(ConfirmDialog, {
      //width: '250px',
      data: {name: customer.nombre}
    });

    dialogRef.afterClosed().subscribe(result => {
    });

   /*  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        apartado: 'cards',
        mensaje: id.panVisible
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.remove(id.id);
      }
    }); */
  }

  goToCustomerDetail(customer: CustomerBasic){
    this.router.navigate([CUSTOMER_DETAIL_PATH, customer.id])
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


