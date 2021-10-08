import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { latLng, marker, Marker, tileLayer } from 'leaflet';
import { AdminGuardService } from '../admin-guard.service';
import { LocationService } from '../location.service';
import { MyLocation } from '../Models/location';
import { Movie } from '../Models/movie';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-bioskop',
  templateUrl: './bioskop.component.html',
  styleUrls: ['./bioskop.component.css']
})
export class BioskopComponent implements OnInit {
  //logovanje
  showDiv: number = 1; //1-login, 2-registracija 3-ulogovan
  email: string = "";
  password: string = "";
  password2: string = "";
  errorMessage: string = "";
  //

  movies: Movie[] = [];

  locations: MyLocation[] = [];
  markers: Marker<any>[] = [];
  optionsLocations = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 18, attribution: 'Lokacija' })
    ],
    zoom: 11.5,
    center: latLng(44.81405697597834, 20.459814771250407)
  };

  constructor(private router: Router,
    private movieService: MoviesService,
    private locationService: LocationService,
    private activeRoute: ActivatedRoute,
    private guardService: AdminGuardService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(param => {
      this.showDiv = param.showDiv;
      // if (this.showDiv==3) this.showDiv=1;
    });

    var emailExists = localStorage.getItem('email');
    if (emailExists) this.showDiv = 3;
    if (!emailExists && this.showDiv == 3) this.showDiv = 1;

    this.movieService.getAllGenres().subscribe(res => {
      res = (res as any).$values;
      this.getMoviesFromBackend(res);
    }, (err1) => { console.error(err1) });

    this.getAllLocations();
  }


  getMoviesFromBackend(a: any[]) {
    for (var x of a) {
      this.movies.push({
        id: x.id, posterFile: x.posterFile,
        releaseDate: x.releaseDate, summary: x.summary,
        title: x.title, trailer: x.trailer, posterString: x.posterString, rating: x.rating
      });
    }
  }

  getAllLocations() {
    this.locationService.repairMarker();
    this.locationService.getAllGenres().subscribe((res) => {
      this.locations = (res as any).$values;
      this.markers = [];
      for (let entry of this.locations) {
        let a = marker([entry.x, entry.y]);
        a.bindTooltip(entry.name).openTooltip();
        a.bindPopup(entry.name).openPopup();

        this.markers.push(a);
      }
    }, (err1) => console.error(err1)
    );
  }


  register() {

    if (this.email == "") {
      this.errorMessage = "Unesite email adresu";
      return;
    } else if (this.password != this.password2 || this.password == "") {
      this.errorMessage = "Lozinke se ne poklapaju";
      return;
    }

    var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    var isEmail = regexp.test(this.email);
    if (!isEmail) {
      this.errorMessage = "Nije validan email";
      return;
    }

    this.errorMessage = "";
    this.guardService.registerUser({ email: this.email, password: this.password }).subscribe((res) => {
      console.log(res);
      localStorage.setItem("token", res.token);
      localStorage.setItem("ttl", res.timeToLive);
      localStorage.setItem("email", this.email);

      var role = JSON.parse(atob(res.token.split('.')[1]));
      if (role.role != null) localStorage.setItem('role', role.role);
      else localStorage.setItem("role", "normal");

      // this.router.navigate(["bioskop/3"]);
      this.showDiv = 3;
    }, (err1) => {
      console.log(err1);
    });

  }




  login() {

    if (this.email == "") {
      this.errorMessage = "Unesite email adresu";
      return;
    } else if (this.password == "") {
      this.errorMessage = "Unesite lozinku";
      return;
    }

    var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    var isEmail = regexp.test(this.email);
    if (!isEmail) {
      this.errorMessage = "Unesite email adresu!";
      return;
    }


    this.errorMessage = "";
    this.guardService.login({ email: this.email, password: this.password }).subscribe((res) => {

      localStorage.setItem("token", res.token);
      localStorage.setItem("ttl", res.timeToLive);
      localStorage.setItem("email", this.email);

      var role = JSON.parse(atob(res.token.split('.')[1]));
      if (role.role != null) localStorage.setItem('role', role.role);
      else localStorage.setItem("role", "normal");


      // this.router.navigate(["bioskop/3"]);
      this.showDiv = 3;
    }, (err1) => {
      this.errorMessage = err1.error;
      console.log(err1);

    });

  }

  logout() {
    localStorage.clear();
    this.showDiv = 1;
    this.email = "";
    this.password = "";
    this.password2 = "";

  }

  returnName(): string {
    var str: string =
      localStorage.getItem('email') as string;

    if (str != null)
      return str.split("@")[0];
    else return "GRESKA"
  }
}
