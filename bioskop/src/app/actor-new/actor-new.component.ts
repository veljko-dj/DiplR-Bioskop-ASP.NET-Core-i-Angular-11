import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActorService } from '../actor.service';
import { ActorFile } from '../Models/actor';

@Component({
  selector: 'app-actor-new',
  templateUrl: './actor-new.component.html',
  styleUrls: ['./actor-new.component.css']
})
export class ActorNewComponent implements OnInit {
  errorMessage: string = "";
  nameOfPictureToDisplay: string = "Odaberi sliku glumca";

  actorName: string = "";
  actorDate: Date = new Date(2100, 3, 3);
  actorBio: string = "";
  selectedFile!: File; // zaobisao inicijalizaciju



  constructor(private router: Router, private serviceActor: ActorService) { }

  ngOnInit(): void {
  }

  addGenre() {
    if (this.actorName == "") {
      this.errorMessage = "Unesi ime glumca";
      return;
    }
    if ((new Date(this.actorDate)).getTime() == (new Date(2100, 3, 3)).getTime()) {
      this.errorMessage = "Unesi datum";
      return;
    }
    if (this.actorBio == "Uneti biografiju, ako prepravis ovo prepravi i uslov za gresku") {
      this.errorMessage = "Unesi biografiju";
      return;
    }
    if (this.selectedFile == undefined) {
      this.errorMessage = "Unesi sliku";
      return;
    }


    let genTmp: ActorFile = {
      id: 0, name: this.actorName, dateOfBirth: this.actorDate,
      bio: this.actorBio, pictureFile: this.selectedFile
    };

    this.serviceActor.addGenre(genTmp).subscribe(() => {
      this.router.navigate(['actorList']);
      this.errorMessage = "";
    }, (err1) => {
      console.error(err1);
    });
  }


  onFileChanged(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      console.log("FileUpload -> files", fileList);
      this.nameOfPictureToDisplay = fileList[0].name;
      this.selectedFile= fileList[0];
    }
  }


}
