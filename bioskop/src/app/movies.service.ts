import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from './Models/movie';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  readonly URLA: string = "https://localhost:" + "44366" + "/movie/";

  constructor(private http: HttpClient) { }


  getAllGenres() {
    // Ne zaboravi da kazes sta vracas
    return this.http.get<Movie[]>(this.URLA + "all");
  }
  addGenre(genre: Movie, gId: number[], lId: number[], aId: { id: number, character: string }[]) {
    var data = new FormData();

    data.append('id', '0');
    data.append('title', genre.title);
    data.append('summary', genre.summary);
    data.append('trailer', genre.trailer);
    data.append('releaseDate', this.reformatDate(genre.releaseDate));
    data.append('posterString', "_");
    data.append('posterFile', genre.posterFile);
    data.append('getGenresIds', JSON.stringify(gId));
    data.append('getLocIds', JSON.stringify(lId));
    data.append('getActorIds', JSON.stringify(aId));


    return this.http.post(this.URLA + "new", data);
  }
  removeGenre(id: number) {
    return this.http.delete(this.URLA + "delete/" + id);
  }

  findMovie(id: number) {
    return this.http.get<any>(this.URLA + "find/" + id);
  }

  reformatDate(date: Date) {
    date = new Date(date);
    const format = new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const [{ value: month }, , { value: day }, , { value: year }] = format.formatToParts(date);

    return `${year}-${month}-${day}`;
  }

  searchMovies(idGen: number, title: string) {
    return this.http.get<any>(this.URLA + "search/" + idGen + "/" + title);
  }

  getMoviesForThisActor(idAct: number) {
    return this.http.get<any>(this.URLA + "searchByActor/" + idAct);
  }





  getUserRate(movieId: number) {
    return this.http.get(this.URLA + "rating/getUserRate/" + movieId);
  }


  rateMovie(rate1: number, movieId: number) {

    return this.http.get(this.URLA + "rating/new/" + movieId + "/" + rate1);
  }

  getAvgRate(movieId: number) {
    return this.http.get(this.URLA + "getAvgRate/" + movieId);
  }

  reserve2Tickets(tickets: number, date: Date) {
    return this.http.post(this.URLA + "mail/" + tickets, date);
  }
}
