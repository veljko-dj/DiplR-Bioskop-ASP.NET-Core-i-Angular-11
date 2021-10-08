import { Component, OnInit } from '@angular/core';
import { ActorService } from '../actor.service';
import { ActorFile } from '../Models/actor';

@Component({
  selector: 'app-actor-list',
  templateUrl: './actor-list.component.html',
  styleUrls: ['./actor-list.component.css']
})
export class ActorListComponent implements OnInit {

  actors: ActorFile[] = [];


  constructor(
    private actorService: ActorService) { }

  ngOnInit(): void {
    this.actorService.getAllGenres().subscribe((act) => {
      this.actors = (act as any).$values; 
    }, (err1) => console.error(err1));
  }

}
