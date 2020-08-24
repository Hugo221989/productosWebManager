import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { I18nModule } from './translate/i18n/i18n.module';
import {MatSelectModule} from '@angular/material/select';
import { CustomersModule } from './customers/customers.module';
import { settingsReducer } from './reducers/settings.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SettingsEffect } from './settings/settings.effects';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductsModule } from './products/products.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    CustomersModule,
    ProductsModule,
    HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    I18nModule,
    TranslateModule,
    EffectsModule.forRoot([SettingsEffect]),
    StoreModule.forRoot({
      settingsState: settingsReducer
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25})
  ],
  exports: [
    I18nModule
  ],
  providers: [
    TranslateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
