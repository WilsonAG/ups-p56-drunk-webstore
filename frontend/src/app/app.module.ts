import { AppComponent } from './app.component';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AdminModule } from './admin/admin.module';

import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { NgProgressRouterModule } from 'ngx-progressbar/router';

// Components
import { LicoresComponent } from './components/licores/licores.component';

import { RegisterComponent } from './components/register/register.component';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { FooterHomeComponent } from './shared/footer-home/footer-home.component';
import { SliderComponent } from './components/slider/slider.component';
import { NavbarHomeComponent } from './shared/navbar-home/navbar-home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/login/login.component';

// Routing
import { AppRoutingModule } from './app.routing';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { UserOrdersComponent } from './pages/user-orders/user-orders.component';
import { SearchComponent } from './components/search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarHomeComponent,
    HomeComponent,
    AboutComponent,
    FooterHomeComponent,
    RegisterComponent,
    LoginComponent,
    LicoresComponent,
    SliderComponent,
    ProductListComponent,
    NotFoundComponent,
    CartComponent,
    UserOrdersComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    AdminModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgProgressModule.withConfig({
      color: '#97302c',
    }),
    NgProgressHttpModule,
    NgProgressRouterModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
