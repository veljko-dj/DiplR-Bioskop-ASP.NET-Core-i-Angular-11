import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActorListComponent } from './actor-list/actor-list.component';
import { ActorNewComponent } from './actor-new/actor-new.component';
import { ActorComponent } from './actor/actor.component';
import { AdminGuard } from './admin.guard';
import { BioskopComponent } from './bioskop/bioskop.component';
import { GenreListComponent } from './genre-list/genre-list.component';
import { GenreNewComponent } from './genre-new/genre-new.component';
import { LocationListComponent } from './location-list/location-list.component';
import { LocationNewComponent } from './location-new/location-new.component';
import { MovieNewComponent } from './movie-new/movie-new.component';
import { MovieSearchComponent } from './movie-search/movie-search.component';
import { MovieComponent } from './movie/movie.component'; 

const routes: Routes = [
  { path: "genreNew", component: GenreNewComponent, canActivate: [AdminGuard] },
  { path: "genreList", component: GenreListComponent },
  { path: "locationNew", component: LocationNewComponent, canActivate: [AdminGuard] },
  { path: "locationList", component: LocationListComponent },
  { path: "actorNew", component: ActorNewComponent, canActivate: [AdminGuard] },
  { path: "actor/:id", component: ActorComponent },
  { path: "actorList", component: ActorListComponent },
  { path: "movieNew", component: MovieNewComponent, canActivate: [AdminGuard] },
  { path: "movie/:id", component: MovieComponent }, 
  { path: 'bioskop',   redirectTo: 'bioskop/1', pathMatch:'full'}, 
  { path: '',   redirectTo: 'bioskop/1', pathMatch:'full'}, 
  { path: "bioskop/:showDiv", component: BioskopComponent }, 
  { path: "searchMovie", component: MovieSearchComponent },
  { path: "searchMovie/t/:title", component: MovieSearchComponent },
  { path: "searchMovie/g/:idGen", component: MovieSearchComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
