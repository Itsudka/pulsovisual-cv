import {
  Component,
  output,
  signal,
} from '@angular/core';


@Component({
  selector: 'app-video-upload',
  imports: [],
  templateUrl: './video-upload.html',
  styleUrl: './video-upload.css',
})
export class VideoUpload {
  // ==========================
  // ARCHIVO SELECCIONADO
  // ==========================

  readonly selectedFileName =
    signal<string | null>(null);


  // ==========================
  // EVENTOS
  // ==========================

  readonly videoSelected =
    output<File>();


  // ==========================
  // SELECCIONAR VIDEO
  // ==========================

  onFileSelected(
    event: Event,
  ): void {
    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }


    // ==========================
    // VALIDAR TIPO
    // ==========================

    if (!file.type.startsWith('video/')) {
      input.value = '';

      return;
    }


    // ==========================
    // GUARDAR NOMBRE
    // ==========================

    this.selectedFileName.set(
      file.name,
    );


    // ==========================
    // EMITIR VIDEO
    // ==========================

    this.videoSelected.emit(
      file,
    );
  }
}
