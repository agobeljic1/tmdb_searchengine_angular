import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TvShowPageComponent } from './page/tv-page/tv-show-page.component';
import { ErrorPageComponent } from './page/error-page/error-page.component';
import { MoviePageComponent } from './page/movie-page/movie-page.component';
import { SearchPageComponent } from './page/search-page/search-page.component';

const appRoutes: Routes = [
  { path: '', component: SearchPageComponent },
  { path: 'movie/:id', component: MoviePageComponent },
  { path: 'tv/:id', component: TvShowPageComponent },
  { path: 'error', component: ErrorPageComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    SearchPageComponent,
    MoviePageComponent,
    TvShowPageComponent,
    ErrorPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
