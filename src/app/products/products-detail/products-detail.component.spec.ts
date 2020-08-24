import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsDetailComponent } from './products-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { StateObservable, ActionsSubject, MemoizedSelector } from '@ngrx/store';
import { ProductsModule } from '../products.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as fromSelectors from '../../settings/settings.selectors';
import { SettingsState } from 'src/app/settings/settings.models';

describe('ProductsDetailComponent', () => {
  let component: ProductsDetailComponent;
  let fixture: ComponentFixture<ProductsDetailComponent>;
  let store: MockStore;
  const initialState = { currentLanguage: 'es' };
  let mockUsernameSelector: MemoizedSelector<SettingsState, string>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, 
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'products/detail/:id', component: ProductsDetailComponent },
          { path: 'products/list', component: ProductsDetailComponent },
        ]),
        //StoreModule.forRoot({}),
        //RouterModule.forRoot([]),
        ProductsModule,
        BrowserAnimationsModule],
      declarations: [ ProductsDetailComponent ],
      providers: [
         StateObservable, ActionsSubject,
         provideMockStore({ initialState })
      ]
    })
    .compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsDetailComponent);
    component = fixture.componentInstance;
    mockUsernameSelector = store.overrideSelector(
      fromSelectors.selectSettingsCurrentLanguage,
      'es'
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
