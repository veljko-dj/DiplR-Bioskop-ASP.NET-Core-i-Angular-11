import { Component, OnInit } from '@angular/core';
import { latLng, marker, Marker, tileLayer } from 'leaflet';
import { AdminGuardService } from '../admin-guard.service';
import { LocationService } from '../location.service';
import { MyLocation } from '../Models/location';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.css']
})
export class LocationListComponent implements OnInit {

  locations: MyLocation[] = [];
  markers: Marker<any>[] = [];

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 18, attribution: 'Lokacija' })
    ],
    zoom: 11.5,
    center: latLng(44.81405697597834, 20.459814771250407)
  };

  constructor(private locationService: LocationService, public adminService: AdminGuardService) { }

  ngOnInit(): void {
    this.locationService.repairMarker();

    this.getAll(); 
  }


  removeGenre(loc: MyLocation) {

    this.locationService.removeGenre(loc).subscribe(() => {
      this.getAll();
    }, (err1) => {
      console.error(err1);
    });
  }

  getAll() {
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



}
