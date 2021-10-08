import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Genre } from './Models/genre';

@Injectable({
  providedIn: 'root'
})
export class GenreServiceService {

  readonly URLG: string = "https://localhost:" + "44366" + "/genre/";

  constructor(private http: HttpClient) { }


  getAllGenres(){
    // Ne zaboravi da kazes sta vracas
    return this.http.get<Genre[]>(this.URLG+"all");
  }
  addGenre(genre: Genre) {  
    return this.http.post(this.URLG + "new", genre);
  }
  removeGenre(genre: Genre) {
    return this.http.delete(this.URLG + "delete/" + genre.id);
  }
}
