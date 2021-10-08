import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GenreServiceService } from '../genre-service.service';
import { Genre } from '../Models/genre';
import { Movie } from '../Models/movie';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export class MovieSearchComponent implements OnInit {
  searchTitle: string = "";
  genreId: number = -1;
  genres: Genre[] = [];

  movies: Movie[] = [];
  allMovies: Movie[] = [];

  showActors: boolean = false;

  constructor(private activeRoute: ActivatedRoute,
    private genreServices: GenreServiceService,
    private movieService: MoviesService,
    private route: Router) { }

  ngOnInit(): void {
    console.log(this.activeRoute);
    console.log(this.route.url.includes('searchMovie/t') + "x");
    console.log(this.route.url);

    this.activeRoute.params.subscribe(par => {
      if (par.title && this.route.url.includes('searchMovie/t')) {
        this.searchTitle = par.title;
        this.search();
      } else {
        if (par.idGen && this.route.url.includes('searchMovie/g')) {
          this.genreId = par.idGen;
          this.search();
        }
      }
    });

    this.genreServices.getAllGenres().subscribe((res) => {
      this.genres = (res as any).$values;
      console.log(this.genres);

    }, (err1) => console.error(err1));
  }


  search() {
    console.log("trazim:" + this.genreId + "x" + this.searchTitle);

    this.movieService.searchMovies(this.genreId, this.searchTitle).subscribe((res) => {
      this.movies = []; this.allMovies = [];
      this.getMoviesFromBackendMovies(res);
    }, (err1) => console.error(err1));

  }

  filter(event: any) {

    if (event != null && event.target.checked == true) {
      var filteredMovies: Movie[] = [];
      for (var movie1 of this.movies) {
        if ((new Date(movie1.releaseDate)).getTime() < (new Date()).getTime())
          filteredMovies.push(movie1);
      }
      this.movies = filteredMovies;
    } else {
      this.movies = this.allMovies;
    }
  }

  getMoviesFromBackendMovies(a: any[]) {
    for (var x of a) {
      this.movies.push({
        id: x.id, posterFile: x.posterFile,
        releaseDate: x.releaseDate, summary: x.summary,
        title: x.title, trailer: x.trailer, posterString: x.posterString, rating: x.rating
      });
    }
    this.allMovies = this.movies;
  }
}
