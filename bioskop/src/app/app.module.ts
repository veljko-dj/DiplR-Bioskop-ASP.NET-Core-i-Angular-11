import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MeniComponent } from './meni/meni.component';
import { FormsModule } from '@angular/forms';
import { GenreListComponent } from './genre-list/genre-list.component';
import { GenreNewComponent } from './genre-new/genre-new.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocationNewComponent } from './location-new/location-new.component';
import { LocationListComponent } from './location-list/location-list.component';
import { ActorNewComponent } from './actor-new/actor-new.component'

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ActorComponent } from './actor/actor.component';
import { MovieNewComponent } from './movie-new/movie-new.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';
import { MovieComponent } from './movie/movie.component';
import { VideoComponent } from './video/video.component';
import { VideoModule } from './video/video.module';
import { BioskopComponent } from './bioskop/bioskop.component';
import { MovieSearchComponent } from './movie-search/movie-search.component';
import { ActorListComponent } from './actor-list/actor-list.component';
import { AdminGuardService } from './admin-guard.service';

import {NgxStarRatingModule} from 'ngx-star-rating';

import { NgxStripeModule } from 'ngx-stripe'; 


@NgModule({
  declarations: [
    AppComponent,
    MeniComponent,
    GenreListComponent,
    GenreNewComponent,
    LocationNewComponent,
    LocationListComponent,
    ActorNewComponent, ActorComponent, MovieNewComponent, MovieComponent, BioskopComponent, 
    MovieSearchComponent, ActorListComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    LeafletModule,
    NgMultiSelectDropDownModule,
    CommonModule,
    VideoModule,
    NgxStarRatingModule,
    NgxStripeModule//.forRoot('***your-stripe-publishable-key***'),
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AdminGuardService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
