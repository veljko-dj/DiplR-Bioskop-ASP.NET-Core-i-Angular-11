import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminGuardService } from '../admin-guard.service';

@Component({
  selector: 'app-meni',
  templateUrl: './meni.component.html',
  styleUrls: ['./meni.component.css']
})
export class MeniComponent implements OnInit {

  searchTitle: string = "";


  constructor(private router: Router, public adminService: AdminGuardService) { }

  ngOnInit(): void {
  }

  search() {
    if (this.searchTitle != "")
      this.router.navigate(["searchMovie/t/" + this.searchTitle]);
    else this.router.navigate(["searchMovie"]);
    }

}
