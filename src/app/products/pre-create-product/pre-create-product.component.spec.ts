import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreCreateProductComponent } from './pre-create-product.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductsModule } from '../products.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SettingsState } from 'src/app/settings/settings.models';
import * as fromSelectors from '../../settings/settings.selectors';
import { MemoizedSelector } from '@ngrx/store';

describe('PreCreateProductComponent', () => {
  let component: PreCreateProductComponent;
  let fixture: ComponentFixture<PreCreateProductComponent>;
  let store: MockStore;
  const initialState = { currentLanguage: 'es' };
  let mockUsernameSelector: MemoizedSelector<SettingsState, string>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'products/new', component: PreCreateProductComponent },
        ]),
        ProductsModule,
        BrowserAnimationsModule],
      declarations: [ PreCreateProductComponent ],
      providers: [
        provideMockStore({ initialState })
      ]
    })
    .compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreCreateProductComponent);
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
