import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MojStripeService {

  readonly URLG: string = "https://localhost:" + "44366" + "/stripe2";

  constructor(private http: HttpClient) { }


  // getAllGenres(){
  //   // Ne zaboravi da kazes sta vracas
  //   return this.http.get<Genre[]>(this.URLG+"all");
  // }
  // addGenre(genre: Genre) {  
  //   return this.http.post(this.URLG + "new", genre);
  // }
  makePayment(token: string, amount: number, date: Date, nameLoc: string, movId: number, locId:number, day:number) {
    var data = new FormData();  
    console.log('XXXXXX');
    data.append('token', token);
    data.append('amount', JSON.stringify(amount));
    data.append('description', "Kupovina dve karte za bioskop:" + nameLoc + " dana: " + date.toString());
    data.append('movId', JSON.stringify(movId));
    data.append('locId', JSON.stringify(locId));
    data.append('dayy', JSON.stringify(day)); 
    console.log(day);
    console.log(locId);
      
    
    
    
    

    return this.http.post(this.URLG, data);
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
