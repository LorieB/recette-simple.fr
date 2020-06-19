import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AccueilComponent } from './accueil/accueil.component';
import { AstuceComponent } from './astuce/astuce.component';
import { RecetteComponent } from './recette/recette.component';
import { MenuComponent } from './menu/menu.component';
import { NouvelleRecetteComponent } from './nouvelle-recette/nouvelle-recette.component';

import { ToasterContainerComponent } from './_toaster/toaster-container.component';
import { ToasterComponent } from './_toaster/toaster.component';

import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { LoginComponent } from './login/login.component';
import { CreationIngrUstComponent } from './creation-ingr-ust/creation-ingr-ust.component';
import { RechercheComponent } from './recherche/recherche.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    AstuceComponent,
    RecetteComponent,
    MenuComponent,
    NouvelleRecetteComponent,
    LoginComponent,
    CreationIngrUstComponent,
    ToasterContainerComponent,
    ToasterComponent,
    RechercheComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
