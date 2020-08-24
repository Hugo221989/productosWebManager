import { NumericDirective } from './numeric.directive';
import { ElementRef, DebugElement, Component } from '@angular/core';
import {TestBed, ComponentFixture, ComponentFixtureAutoDetect, async, tick, fakeAsync} from '@angular/core/testing';
import { ProductsDetailComponent } from '../products/products-detail/products-detail.component';
import { ProductsModule } from '../products/products.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SettingsState } from 'src/app/settings/settings.models';
import * as fromSelectors from '../settings/settings.selectors';
import { MemoizedSelector } from '@ngrx/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from '../app.module';
import { BrowserModule, By } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { CustomersModule } from '../customers/customers.module';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { I18nModule } from '../translate/i18n/i18n.module';

// creating a test component in the spec file
@Component(
  {
    selector: 'ngx-mix-test-disable-link-directive',
    template: `
    <div>
      <input matInput placeholder="Precio" class="input-compose" id="precio" numeric decimals="2" type="text">
     <a id="disabled-link" disabled (click)="onClick()">Disabled</a>
     <a id="normal-link" (click)="onClick()">Normal</a>
    </div>
    `
  }
)
class TestDisableLinkComponent {
  precio = '';
onClick() {
    
  }
}

describe('NumericDirective', () => {
  let component: TestDisableLinkComponent;
  let fixture: ComponentFixture<TestDisableLinkComponent>;
  let el: ElementRef;
  let directive: NumericDirective;

  beforeEach(async () => {
  await TestBed.configureTestingModule({
        declarations: [TestDisableLinkComponent, NumericDirective]
      }).compileComponents();
    });

  beforeEach(async () => {
      directive = new NumericDirective(el);
      fixture = TestBed.createComponent(TestDisableLinkComponent);
      component = fixture.componentInstance;
      spyOn(directive, 'onKeyDown');
      fixture.detectChanges();
    });

  it('should create an instance', () => {
      const directive = new NumericDirective(el);
      expect(directive).toBeTruthy();
    });

  it('should call eventPreventDefault()', fakeAsync( () => {
      directive = new NumericDirective(el);
      const testDe: DebugElement = fixture.debugElement;
      const inputPrecio = testDe.query(By.css('#precio'));
      inputPrecio.nativeElement.value='23.443'
      let keyEvent: KeyboardEvent; keyEvent = new KeyboardEvent('keydown', { key: '5' });
      let spy = spyOn(keyEvent, 'preventDefault');
      inputPrecio.triggerEventHandler('keydown', keyEvent);
      tick();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
      });
    }));

    it('should NOT call eventPreventDefault()', fakeAsync( () => {
      directive = new NumericDirective(el);
      const testDe: DebugElement = fixture.debugElement;
      const inputPrecio = testDe.query(By.css('#precio'));
      inputPrecio.nativeElement.value='23.4'
      let keyEvent: KeyboardEvent; keyEvent = new KeyboardEvent('keydown', { key: '5' });
      let spy = spyOn(keyEvent, 'preventDefault');
      inputPrecio.triggerEventHandler('keydown', keyEvent);
      tick();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(spy).toHaveBeenCalledTimes(0);
      });
    }));

  afterEach(() => {
    fixture.destroy();
  });

});
