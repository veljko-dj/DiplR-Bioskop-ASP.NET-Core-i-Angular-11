import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { icon, Marker } from 'leaflet';
import { MyLocation } from './Models/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  readonly URLL: string = "https://localhost:" + "44366" + "/location/";

  constructor(private http: HttpClient) { }

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


  getAllGenres(){

    return this.http.get<MyLocation[]>(this.URLL+"all");
  }
  addGenre(loc: MyLocation) {  
    return this.http.post(this.URLL + "new", loc);
  }
  removeGenre(genre: MyLocation) {
    return this.http.delete(this.URLL + "delete/" + genre.id);
  }
}
