import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomersDetailComponent } from './customers-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { StateObservable, ActionsSubject, MemoizedSelector } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomersModule } from '../customers.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { Genero } from 'src/app/models/user';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SettingsState } from 'src/app/settings/settings.models';
import * as fromSelectors from '../../settings/settings.selectors';

@Component({ selector: 'test-blank', template: `` })
class BlankComponent {}

describe('CustomersDetailComponent', () => {
  let component: CustomersDetailComponent;
  let fixture: ComponentFixture<CustomersDetailComponent>;
  let store: MockStore;
  const initialState = { currentLanguage: 'es' };
  let mockUsernameSelector: MemoizedSelector<SettingsState, string>;
  let compiled;
  let nameInput;
  let lastnameInput;
  let userInput;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'customers/detail/:id', component: CustomersDetailComponent },
          { path: 'customers/list', component: CustomersDetailComponent },
        ]),
        CustomersModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'post/view', component: BlankComponent },
        ])],
      declarations: [ CustomersDetailComponent ],
      providers: [
         StateObservable, ActionsSubject,
         provideMockStore({ initialState })
      ]
    })
    .compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersDetailComponent);
    component = fixture.componentInstance;
    mockUsernameSelector = store.overrideSelector(
      fromSelectors.selectSettingsCurrentLanguage,
      'es'
    );

    compiled = fixture.debugElement.nativeElement;
    nameInput = compiled.querySelector('#name');
    lastnameInput = compiled.querySelector('input[id="lastname"]');
    userInput = compiled.querySelector('input[id="user"]');
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('CustomersDetailComponent: should create', () => {
    expect(component).toBeTruthy();
  });

  it('CustomersDetailComponent: form invalid when empty', () => {
    expect(component.customerForm.valid).toBeFalsy();
  });

  it('CustomersDetailComponent: submiting form customer', () => {
    let gender: Genero = {
      id: 1,
      nombre: 'Masculino'
    }

    expect(component.customerForm.valid).toBeFalsy();
    component.customerForm.controls['name'].setValue("Hugo");
    component.customerForm.controls['lastname'].setValue("Onetto");
    component.customerForm.controls['user'].setValue("Hugo");
    component.customerForm.controls['birth'].setValue(new Date());
    component.customerForm.controls['email'].setValue("test@test.com");
    component.customerForm.controls['telephone'].setValue("123456789");
    component.customerForm.controls['gender'].patchValue(gender);
    component.customerForm.controls['addressee'].setValue("yomismo");
    component.customerForm.controls['street'].setValue("calle falsa");
    component.customerForm.controls['flat'].setValue("2");
    component.customerForm.controls['postalCode'].setValue("46779");
    component.customerForm.controls['locality'].setValue("bcn");
    component.customerForm.controls['additionalData'].setValue("blabla");
    expect(component.customerForm.valid).toBeTruthy();
  });

  it('CustomersDetailComponent: should render input elements', async () => {

    expect(nameInput).toBeTruthy();
    expect(lastnameInput).toBeTruthy();
    expect(userInput).toBeTruthy();

    fixture.whenStable().then(val => {
      nameInput.value='Hugo';
      fixture.detectChanges();
      nameInput.dispatchEvent(new Event('input'));
      expect(component.customerForm.controls['name'].value).toBe('Hugo');
      expect(component.customerForm.controls['name'].value).not.toBe('Hugo2');
    });
    
  });

 

});
