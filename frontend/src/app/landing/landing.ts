import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {


  videos = [
    {
      title: 'Pasillo - Salida de Emergencia',
      src: '/videos/pulsovisual-demo.mp4',
    },
    {
      title: 'Zona 1 - Exhibicion Ropa',
      src: '/videos/pulsovisual-demo-2.mp4',
    },
    {
      title: 'Zona 2 - Area general',
      src: '/videos/pulsovisual-demo-3.mp4',
    },
  ];

  activeVideoIndex = 0;

  nextVideo(): void {
    this.activeVideoIndex =
      (this.activeVideoIndex + 1) % this.videos.length;
  }

  previousVideo(): void {
    this.activeVideoIndex =
      (this.activeVideoIndex - 1 + this.videos.length)
      % this.videos.length;
  }

  selectVideo(index: number): void {
    this.activeVideoIndex = index;
  }



}
