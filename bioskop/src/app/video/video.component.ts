import { Component, Input, OnInit } from '@angular/core'; 

@Component({
  // template: '<youtube-player videoId="XqZsoesa55w"></youtube-player>',
  templateUrl: './video.component.html',
  selector: 'app-video',
})
export class VideoComponent implements OnInit {
  @Input()
  idSnimka  = 'XqZsoesa55w';
  ngOnInit() {
    const tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }
}