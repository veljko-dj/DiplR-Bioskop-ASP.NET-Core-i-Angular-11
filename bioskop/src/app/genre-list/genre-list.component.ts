import { Component, OnInit } from '@angular/core';
import { AdminGuardService } from '../admin-guard.service';
import { GenreServiceService } from '../genre-service.service';
import { Genre } from '../Models/genre';

@Component({
  selector: 'app-genre-list',
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.css']
})
export class GenreListComponent implements OnInit {

  genres: Genre[] = [];

  constructor(private genreService: GenreServiceService, public adminService: AdminGuardService) { }

  ngOnInit(): void {
    this.getAll();
  }

  removeGenre(g: Genre) {
    this.genreService.removeGenre(g).subscribe(() => {
      this.getAll();
    }, (err1) => {
      console.error(err1);
    });
  }

  getAll() {
    this.genreService.getAllGenres().subscribe((g) => {  
      this.genres  = (g as any).$values;  
    }, (err1) => {
      console.error(err1);
    });
  }
}
