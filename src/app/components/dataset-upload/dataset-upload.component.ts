import {Component, EventEmitter, HostBinding, HostListener, OnInit, Output} from '@angular/core';

@Component({
  selector: 'eyes-dataset-upload',
  templateUrl: './dataset-upload.component.html',
  styleUrls: ['./dataset-upload.component.css']
})
export class DatasetUploadComponent implements OnInit {

  uploadData: string[];
  dragOver = false;
  uploadDataInvalid = false;
  dataInput: string;

  @Output() uploadFiles = new EventEmitter<FileList>();

  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragOver = true;
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragOver = false;
  }

  @HostListener('drop', ['$event'])
  public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragOver = false;
    const files: FileList = evt.dataTransfer.files;
    if (files.length > 0) {
      this.uploadFiles.emit(files);
    }
  }

  parseDataset() {
    this.uploadData = undefined;
    const entries = this.dataInput.split(' ');
    if (entries.every(entry => !isNaN(parseFloat(entry)))) {
      this.uploadDataInvalid = false;
      this.uploadData = entries;
    } else {
      this.uploadDataInvalid = true;
    }
  }


  constructor() {
  }

  ngOnInit() {
  }

}
