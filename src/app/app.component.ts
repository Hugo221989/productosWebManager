import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { myAnimation } from './animations/animation';
import {Language} from './models/user';
import { TranslateService } from '@ngx-translate/core';
import { actionSettingsCurrentLanguage } from './settings/settings.actions';
import { SettingsState } from './settings/settings.models';
import { Store } from '@ngrx/store';
import { CustomerService } from './customers/service/customer.service';
import { ManagerMenuItem, MenuItem } from './models/menuItem';

const MENU_PRODUCTS = 'Products';
const MENU_CUSTOMERS = 'Customers';
const MENU_ORDERS = 'Orders';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [myAnimation]
})
export class AppComponent implements OnInit{
  public languages: Language[];
  public selectedLanguage: string = 'es';
  private managerMenuItems: ManagerMenuItem[];
  public menuItemProducts: MenuItem;
  public menuItemCustomers: MenuItem;
  public menuItemOrders: MenuItem;

  constructor(public translate: TranslateService,
    private store: Store<{settings: SettingsState}>,
    private customerService: CustomerService,
    private router: Router){}

  ngOnInit(){
    this.setUpLanguages();
    this.setMenuConfiguration();
  }

  setUpLanguages(){
    this.languages = [
      {
        key : 'es',
        value : 'Spanish'
      },
      {
        key : 'en',
        value : 'English'
      }
    ];
    this.selectedLanguage = this.languages[0].key;
    this.storeLanguage();
  }

  setLanguageSelected(selectedLanguage){
    this.selectedLanguage = selectedLanguage;
    this.translate.use(this.selectedLanguage);
    this.storeLanguage();
  }

  storeLanguage(){
    this.store.dispatch(actionSettingsCurrentLanguage({
      currentLanguage: this.selectedLanguage
    }))
  }

  setMenuConfiguration(){
    this.customerService.getMenuConfiguration().subscribe(data => {
      this.managerMenuItems = data;
      this.setUpMenuItems();
    })
  }

  setUpMenuItems(){
    for(let managerMenuItem of this.managerMenuItems){
      if(managerMenuItem.nombre == MENU_PRODUCTS){
        this.menuItemProducts= {
          path: '/products/list',
          url: managerMenuItem.links[0].href
        }
        this.setMenuInSession('urlProducts', this.menuItemProducts.url);
      }else if(managerMenuItem.nombre == MENU_CUSTOMERS){
        this.menuItemCustomers= {
          path: '/customers/list',
          url: managerMenuItem.links[0].href
        }
        this.setMenuInSession('urlCustomers', this.menuItemCustomers.url);
      }else if(managerMenuItem.nombre == MENU_ORDERS){
        this.menuItemOrders= {
          path: '/customers/list',
          url: managerMenuItem.links[0].href
        }
        this.setMenuInSession('urlOrders', this.menuItemOrders.url);
      }
    }
  }

  setMenuInSession(menuItemName: string, menuItemUrl: string){
    let itemInSession = window.sessionStorage.getItem(menuItemName);
    if(itemInSession == null || itemInSession != menuItemUrl){
      window.sessionStorage.setItem(menuItemName, menuItemUrl);
    }
  }

  navigateToProducts(){
    if(!this.isMenuItemNull(this.menuItemProducts)){
      this.router.navigate([this.menuItemProducts.path]);
    }
  }

  navigateToCustomers(){
    if(!this.isMenuItemNull(this.menuItemCustomers)){
      this.router.navigate([this.menuItemCustomers.path]);
    }
  }

  navigateToOrders(){
    if(!this.isMenuItemNull(this.menuItemOrders)){
      this.router.navigate([this.menuItemOrders.path]);
    }
  }

  isMenuItemNull(menuItem: MenuItem){
    if(menuItem == null){
      this.navigateToHomePage();
      return true;
    }
    return false;
  }

  navigateToHomePage(){
    this.router.navigate(['/']);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  
}
