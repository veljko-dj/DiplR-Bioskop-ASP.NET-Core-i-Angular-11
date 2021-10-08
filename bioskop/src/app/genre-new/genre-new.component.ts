import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GenreServiceService } from '../genre-service.service';
import { Genre } from '../Models/genre';

@Component({
  selector: 'app-genre-new',
  templateUrl: './genre-new.component.html',
  styleUrls: ['./genre-new.component.css']
})
export class GenreNewComponent implements OnInit {
  errorMessage: string = "";


  genreName: string = "";


  constructor(private router: Router, private genreService: GenreServiceService) { }

  ngOnInit(): void {
  }

  addGenre() {
    if (this.genreName == "") {
      this.errorMessage = "Unesi ime zanra";
      return;
    }

    let genTmp: Genre = { id: 0, name: this.genreName };

    this.genreService.addGenre(genTmp).subscribe(() => {
      this.router.navigate(['/genreList']);
      this.errorMessage = "";
    }, (err1) => {
      console.error(err1);
    });
  }

}
