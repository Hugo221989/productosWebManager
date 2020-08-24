import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomersListComponent } from './customers-list.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { StateObservable, Store, ActionsSubject, StoreModule, MemoizedSelector } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomersModule } from '../customers.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SettingsState } from 'src/app/settings/settings.models';
import * as fromSelectors from '../../settings/settings.selectors';

describe('CustomersListComponent', () => {
  let component: CustomersListComponent;
  let fixture: ComponentFixture<CustomersListComponent>;
  let store: MockStore;
  const initialState = { currentLanguage: 'es' };
  let mockUsernameSelector: MemoizedSelector<SettingsState, string>;
  let h1: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule,
        HttpClientTestingModule,
        TranslateTestingModule.withTranslations({ en: require('src/assets/i18n/en.json'), es: require('src/assets/i18n/es.json') }),
        RouterTestingModule.withRoutes([
          { path: 'customers/list', component: CustomersListComponent },
        ]),
        CustomersModule,
        BrowserAnimationsModule],
      declarations: [ CustomersListComponent ],
      providers: [
         StateObservable, ActionsSubject,
         provideMockStore({ initialState }),
      ]
    })
    .compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersListComponent);
    component = fixture.componentInstance;
    mockUsernameSelector = store.overrideSelector(
      fromSelectors.selectSettingsCurrentLanguage,
      'es'
    );
    fixture.detectChanges();
  });

  it('CustomersListComponent: should create', () => {
    expect(component).toBeTruthy();
  });

  it('CustomersListComponent: should display original title', () => {
    h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Clientes');
  });


});
