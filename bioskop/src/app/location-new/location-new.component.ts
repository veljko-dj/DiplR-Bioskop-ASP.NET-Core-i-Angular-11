import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { latLng, LeafletMouseEvent, marker, tileLayer } from 'leaflet';
import { LocationService } from '../location.service';
import { MyLocation } from '../Models/location';
import { icon, Marker } from 'leaflet';

@Component({
  selector: 'app-location-new',
  templateUrl: './location-new.component.html',
  styleUrls: ['./location-new.component.css']
})
export class LocationNewComponent implements OnInit {

  errorMessage: string = "";
  locationName: string = "";
  locationX: number = 0;
  locationY: number = 0;

  constructor(private router: Router, private locationService: LocationService) { }

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 18, attribution: 'Lokacija' })
    ],
    zoom: 11.5,
    center: latLng(44.81405697597834, 20.459814771250407)
  };

  locations: Marker<any>[] = [];


  repairMarker() {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    Marker.prototype.options.icon = iconDefault;
  }

  ngOnInit(): void {
    this.repairMarker();

  }

  addLocation() {
    if (this.locationName == "") {
      this.errorMessage = "Unesi ime bioskopa";
      return;
    }
    if (this.locationX == 0 && this.locationY == 0) {
      this.errorMessage = "Unesi lokaciju";
      return;
    }


    let locTmp: MyLocation = { id: 0, name: this.locationName, x: this.locationX, y: this.locationY };


    this.locationService.addGenre(locTmp).subscribe(() => {
      this.router.navigate(['/locationList']);
      this.errorMessage = "";
    }, (err1) => {
      console.error(err1);
    });
  }


  click(click: LeafletMouseEvent) {
    this.locationX = click.latlng.lat;
    this.locationY = click.latlng.lng;
    this.locations = [];
    this.locations.push(marker([this.locationX, this.locationY]));
  }
}
