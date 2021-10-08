import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActorFile } from './Models/actor';

@Injectable({
  providedIn: 'root'
})
export class ActorService {

  readonly URLA: string = "https://localhost:" + "44366" + "/actor/";

  constructor(private http: HttpClient) { }


  getAllGenres() {
    // Ne zaboravi da kazes sta vracas
    return this.http.get<ActorFile[]>(this.URLA + "all");
  }
  addGenre(genre: ActorFile) {
    var data = new FormData();

    data.append('id', '0');
    data.append('name', genre.name);
    data.append('dateOfBirth', this.reformatDate(genre.dateOfBirth));
    data.append('bio', genre.bio);
    data.append('pictureString', "_");
    data.append('pictureFile', genre.pictureFile);

    return this.http.post(this.URLA + "new", data);
  }
  removeGenre(genre: ActorFile) {
    return this.http.delete(this.URLA + "delete/" + genre.id);
  }

  findActor(id: number) {
    return this.http.get<ActorFile>(this.URLA + "find/" + id);
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

}
