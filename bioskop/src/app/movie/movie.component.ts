import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import getYouTubeID from 'get-youtube-id';
import { latLng, marker, Marker, tileLayer } from 'leaflet';
import { BehaviorSubject } from 'rxjs';
import { ActorService } from '../actor.service';
import { AdminGuardService } from '../admin-guard.service';
import { GenreServiceService } from '../genre-service.service';
import { LocationService } from '../location.service';
import { ActorFile } from '../Models/actor';
import { Genre } from '../Models/genre';
import { MyLocation } from '../Models/location';
import { Movie } from '../Models/movie';
import { MojStripeService } from '../moj-stripe.service';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

  optionsForMap = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 18, attribution: 'Lokacija' })
    ],
    zoom: 11.5,
    center: latLng(44.81405697597834, 20.459814771250407)
  };
  markers: Marker<any>[] = [];



  movie !: Movie;
  movieGenres: Genre[] = [];
  movieLocs: MyLocation[] = [];
  movieActors: ActorFile[] = [];
  userRate: number = 2;

  reservationMessage = "";
  buyingMessage: string = "";
  datesFromReleaseDay = 0;
  datesFromReleaseDayBUY = 0;
  locationForReservation: string = "";
  locationForBuying: string = "";
  numOfTicketsReservation: number = 0;
  numOfTicketsBuying: number = 0;


  constructor(private genreService: GenreServiceService,
    private locationService: LocationService,
    private actorService: ActorService,
    private movieService: MoviesService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    public adminService: AdminGuardService,
    public stripeMojService: MojStripeService) { }

  ngOnInit(): void {
    this.invokeStripe();
    this.activeRoute.params.subscribe(p => {
      this.movieService.findMovie(p.id).subscribe((movieA) => {

        this.getLocalFieldsFromBackEndMovie(movieA);

        var id = getYouTubeID(this.movie.trailer);
        this.movie.trailer = id as string;


        this.locationService.repairMarker();
        this.getLocationMarkers(this.movieLocs);

        this.movieService.getUserRate(this.movie.id).subscribe((res) => {
          this.userRate = res as number;
        }, (err2) => console.error(err2));

      }, (err1) => {
        console.error(err1);
      });
    })

  }

  getLocalFieldsFromBackEndMovie(movieA: any) {

    var g: any[] = movieA.movieGenres.$values;
    var l: any[] = movieA.movieLocations.$values;
    var a: any[] = movieA.movieActors.$values;

    this.movieGenres = g.map(x => ({ id: x.genre.id, name: x.genre.name } as Genre));
    this.movieLocs = l.map(x => ({ id: x.location.id, name: x.location.name, x: x.location.x, y: x.location.y } as MyLocation));
    this.movieActors = a.map(x => ({
      id: x.actor.id, name: x.actor.name,
      bio: x.actor.bio, dateOfBirth: x.actor.dateOfBirth,
      pictureString: x.actor.pictureString, pictureFile: x.actor.pictureFile,
      character: x.character
    } as ActorFile));


    this.movie = {
      id: movieA.id, posterFile: movieA.posterFile,
      releaseDate: movieA.releaseDate, summary: movieA.summary,
      title: movieA.title, trailer: movieA.trailer, posterString: movieA.posterString,
      rating: movieA.rating
    };

    this.movie.releaseDate = new Date(this.movie.releaseDate);
  }

  getLocationMarkers(l: MyLocation[]) {
    this.locationForReservation = l[0].name;
    this.locationForBuying = this.locationForReservation;
      
    for (var loc of l) {
      var customOptions =
      { 
        'className': 'popupCustom'
        // 'color': 'black'
      }
      var markerMoj =marker([loc.x, loc.y]).bindPopup(loc.name).openPopup();
      markerMoj.bindTooltip(loc.name).openTooltip();
      this.markers.push(markerMoj);
    }
  }

  deleteMovie() {
    this.movieService.removeGenre(this.movie.id).subscribe((res) => {
      this.router.navigate(["bioskop"]);
    }, (err1) => console.error(err1));
  }

  rateMovie() {
    this.movieService.rateMovie(this.userRate, this.movie.id).subscribe(() => {

      this.movieService.getUserRate(this.movie.id).subscribe((res) => {
        this.movieService.getAvgRate(this.movie.id).subscribe(ress => {
          this.movie.rating = ress as number;
        }, (err4) => console.error(err4))

        this.userRate = res as number;
      }, (err2) => console.error(err2));

    }, (err1) => console.error(err1));

  }

  reserveTickets() {

    var dateForReservation: Date = this.addDays(this.movie.releaseDate, this.datesFromReleaseDay);

    this.movieService.reserve2Tickets(2, dateForReservation).subscribe(() => {
      this.reservationMessage = "Uspešno ste rezervisali karte. Jedinstveni kod vam je poslat na mejl adresu";
    }, err1 => console.error(err1));
  }


  returnReserveButtonToShow(): boolean {
    var now = new Date();
    var movieRelease = new Date(this.movie.releaseDate);
    var movieReleasePlus = this.addDays(movieRelease, 5);
    if (now.getTime() > movieReleasePlus.getTime()) return false;
    return true;
  }

  addDays(date1: Date, days: number): Date {
    return new Date(date1.getTime() + days * (1000 * 60 * 60 * 24));

  }

  praznaMetoda() {
    console.log("Prazna Metoda");
  }




  ///

  makePayment(amount: any) {
    var tokenToSendToService: string = "";
    var filterChanges: BehaviorSubject<string> = new BehaviorSubject(tokenToSendToService);
    filterChanges.subscribe((model) => {
      if (model != "") {

        var dateForBuying: Date = this.addDays(this.movie.releaseDate, this.datesFromReleaseDayBUY);

        var idLoc = 0;
        for (var item of this.movieLocs) {
          if (item.name == this.locationForBuying) idLoc = item.id
        }
        var numberr: number = +this.datesFromReleaseDayBUY;

        this.stripeMojService.makePayment(model, amount * 100, dateForBuying,
          this.locationForBuying, this.movie.id, idLoc, numberr).
          subscribe((res) => {
            console.log("Stripe-uspeh");
            console.log(res);
            if (res == null) this.buyingMessage = "Nazalost sve karte su prodate";
            else
              if ((res as any).outcome.seller_message == "Payment complete." || (res as any).outcome.paid == true)
                this.buyingMessage = "Uspešno ste kupili karte";
              else this.buyingMessage = "Neuspesna kupovina, molimo pokusajte kasnije"
          }, (res) => {
            console.log("Stripe-neuspeh");
            console.log(res);
            this.buyingMessage = "Neuspesna kupovina, molimo pokusajte kasnije"
          });
      }
    });


    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51JZKGnJdrA1wVWRAYQ4vjOckVnjUK83n2SoRzhFjFEUHIuIdQS3cxzv1NmjacFCc7fXf39mtzy29VAwMupxbvmf600NkXcqQi2',
      locale: 'auto',
      token: function (token: any) {

        filterChanges.next(token.id);

      }
    });

    handler.open({
      name: 'Placanje karticom',
      description: 'Unesite potrebne podatke',
      amount: amount * 100
    });
  }


  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      window.document.body.appendChild(script);
    }
  }


}
