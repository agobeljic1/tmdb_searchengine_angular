import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { TvPageComponent } from './tv-page/tv-page.component';
import { MoviePageComponent } from './movie-page/movie-page.component';
import { ErrorPageComponent } from './error-page/error-page.component';

const appRoutes: Routes = [
  { path: '', component: SearchPageComponent },
  { path: 'movie/:movieId', component: MoviePageComponent },
  { path: 'tv/:tvId', component: TvPageComponent },
  { path: 'error', component: ErrorPageComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    SearchPageComponent,
    MoviePageComponent,
    TvPageComponent,
    ErrorPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
