import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsListComponent } from './products-list.component';
import { HttpClientModule } from '@angular/common/http';
import { StateObservable, ActionsSubject } from '@ngrx/store';
import { ProductsModule } from '../products.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SettingsState } from 'src/app/settings/settings.models';
import * as fromSelectors from '../../settings/settings.selectors';
import { MemoizedSelector } from '@ngrx/store';
import { Component } from '@angular/core';

@Component({ selector: 'test-blank', template: `` })
class BlankComponent {}

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  let store: MockStore;
  const initialState = { currentLanguage: 'es' };
  let mockUsernameSelector: MemoizedSelector<SettingsState, string>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'products/list', component: BlankComponent },
        ]),
        ProductsModule,
        BrowserAnimationsModule],
      declarations: [ ProductsListComponent ],
      providers: [ 
        StateObservable, ActionsSubject,
        provideMockStore({ initialState })
      ]
    })
    .compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsListComponent);
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
