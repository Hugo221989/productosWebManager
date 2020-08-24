import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TranslateService, } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Store, StateObservable, StoreModule } from '@ngrx/store';
import { AppModule } from './app.module';

describe('AppComponent', () => {
  let translate: TranslateService;
  let httpClient: HttpClient;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        AppModule,
        StoreModule.forRoot({})
      ],
      declarations: [
        AppComponent
      ],
      providers: [
         Store, StateObservable
      ]
    }).compileComponents();
    //translate = TestBed.get(TranslateService);
    httpClient = TestBed.get(HttpClient);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

/*   it(`should have as title 'productosWebAdmin'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('productosWebAdmin');
  }); */

/*   it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('productosWebAdmin app is running!');
  }); */
});
