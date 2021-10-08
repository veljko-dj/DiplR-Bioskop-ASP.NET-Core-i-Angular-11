import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ActorService } from '../actor.service';
import { GenreServiceService } from '../genre-service.service';
import { LocationService } from '../location.service';
import { ActorFile } from '../Models/actor';
import { Genre } from '../Models/genre';
import { Movie } from '../Models/movie';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-movie-new',
  templateUrl: './movie-new.component.html',
  styleUrls: ['./movie-new.component.css']
})


export class MovieNewComponent implements OnInit {
  errorMessage: string = "";

  movieTitle: string = "";
  movieDate: Date = new Date(2100, 3, 3);
  movieSummary: string = "";
  movieTrailer: string = "";
  selectedFile!: File;

  nameOfPictureToDisplay: string = "Odaberi poster";
  showActors: boolean = false;


  dropdownGenres: any[] = [];
  selectedGenres: any[] = [];
  dropdownLoc: any[] = [];
  selectedLoc: any[] = [];
  dropdownSettingsGenres: IDropdownSettings = {};
  dropdownSettingsLoc: IDropdownSettings = {};

  actors: ActorFile[] = [];
  filtredActors: ActorFile[] = [];
  selectedActors: ActorFile[] = [];
  filterWord: string = "";

  constructor(private genreService: GenreServiceService,
    private locationService: LocationService,
    private actorService: ActorService,
    private movieService: MoviesService,
    private router: Router) { }

  ngOnInit(): void {
    this.genreService.getAllGenres().subscribe((genres) => {
      this.dropdownGenres = (genres as any).$values;
      this.locationService.getAllGenres().subscribe((loc) => {
        this.dropdownLoc = (loc as any).$values;
        this.actorService.getAllGenres().subscribe((act) => {
          this.actors = (act as any).$values;
          this.filtredActors = this.actors;
        }, (err1) => console.error(err1));

      }, (err1) => console.error(err1));
    }, (err1) => {
      console.error(err1);
    });
    this.doSomething();
  }




  doSomething() {
    this.dropdownSettingsGenres = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Odaberi sve',
      unSelectAllText: 'Izbrisi sve',
      itemsShowLimit: 3, 
      showSelectedItemsAtTop: true,
      allowSearchFilter: true
    };
    this.dropdownSettingsLoc = this.dropdownSettingsGenres;
  }
  // onItemSelect(item: any) {
  //   console.log(this.selectedItems);
  // }
  onSelectAll(items: any) {
  }

  updateActorListKeyUp() {
    this.filtredActors = this.actors;
    this.filtredActors = this.filtredActors.filter(act => act.name.toLowerCase().indexOf(this.filterWord.toLowerCase()) != -1)
  }

  addActor(actor: ActorFile) {
    this.showActors = false;
    this.selectedActors.push(actor);
    actor.bio = "";
    const distinctThings = this.selectedActors.filter((thing, i, arr) => {
    });


  }
  disableButton(event: Event) {
  }

  onFileChanged(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.nameOfPictureToDisplay = fileList[0].name;
      this.selectedFile = fileList[0];
    }
  }

  addMovie() {
    if (this.movieTitle == "") {
      this.errorMessage = "Unesi naziv Filma";
      return;
    }
    if ((new Date(this.movieDate)).getTime() == (new Date(2100, 3, 3)).getTime()) {
      this.errorMessage = "Unesi datum";
      return;
    }
    if (this.movieSummary == "") {
      this.errorMessage = "Unesi biografiju";
      return;
    }
    if (this.selectedFile == undefined) {
      this.errorMessage = "Unesi sliku";
      return;
    }
    if (this.movieTrailer == "") {
      this.errorMessage = "Unesi link";
      return;
    }

    let genTmp: Movie = {
      id: 0, title: this.movieTitle, summary: this.movieSummary, trailer: this.movieTrailer,
      posterFile: this.selectedFile, releaseDate: this.movieDate, rating: 0
    };

    var genresId = this.selectedGenres.map(value => value.id);
    var locationsId = this.selectedLoc.map(value => value.id);
    var actorsIdAndChar: { id: number, character: string }[] =
      this.selectedActors.map(value => ({ id: value.id, character: value.bio }));

    this.movieService.addGenre(genTmp, genresId, locationsId, actorsIdAndChar).subscribe(() => {
      this.router.navigate(['']);
      this.errorMessage = "";
    }, (err1) => {
      console.error(err1);
    });

  }
}

