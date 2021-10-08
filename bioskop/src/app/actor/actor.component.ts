import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActorService } from '../actor.service';
import { ActorFile } from '../Models/actor';
import { Movie } from '../Models/movie';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-actor',
  templateUrl: './actor.component.html',
  styleUrls: ['./actor.component.css']
})
export class ActorComponent implements OnInit {

  actor !: ActorFile;

  movies: Movie[] = [];

  constructor(private router: Router, private serviceActor: ActorService, private activeRoute: ActivatedRoute,
    private movieService: MoviesService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(param => {
      this.serviceActor.findActor(param.id).subscribe((act) => {
        this.actor = act;

        this.movieService.getMoviesForThisActor(this.actor.id).subscribe((res) => {
          this.getMoviesFromBackendMovies(res);
          console.log("xxx");
          console.log(res);
          
          
        }, (errr) => console.error(errr)); 
      }, (err1) => {
        console.error(err1);
      });
    });
  }
  getMoviesFromBackendMovies(a: any[]) {
    for (var x of a) {
      this.movies.push({
        id: x.id, posterFile: x.posterFile,
        releaseDate: x.releaseDate, summary: x.summary,
        title: x.title, trailer: x.trailer, posterString: x.posterString, rating: x.rating
      });
    } 
  }
}
