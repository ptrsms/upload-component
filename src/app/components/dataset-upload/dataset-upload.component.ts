import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';

@Component({
  selector: 'eyes-dataset-upload',
  templateUrl: './dataset-upload.component.html',
  styleUrls: ['./dataset-upload.component.css']
})
export class DatasetUploadComponent implements OnInit {

  uploadData: any[];
  dragOver = false;
  uploadDataInvalid = false;

  @Output() fileUpload = new EventEmitter<FileList>();
  @Output() dataUpload = new EventEmitter<string>();

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
    const files = evt.dataTransfer.files;
    if (files && files.length && this.areFilesValid(files)) {
      // this.fileUpload.emit(files);
    }
  }

  private areFilesValid(files) {
    const fileReader = new FileReader();
    fileReader.readAsText(files[0]);
    const self = this;
    fileReader.onload = function () {
      const dataset = fileReader.result;
      self.parseDataset(dataset);
    };
  }

  onPaste(event) {
    // @ts-ignore
    const clipboardData = event.clipboardData || window.clipboardData;
    const dataInput = clipboardData.getData('text');
    this.parseDataset(dataInput);
  }

  parseDataset(dataInput) {

    this.uploadData = undefined;

    const entries = dataInput.split('\n');
    if (entries.every(entry => !isNaN(parseFloat(entry)))) {
      this.uploadDataInvalid = false;
      this.dataUpload.emit(dataInput);
      let hour = 0;
      this.uploadData = entries.map(entry => {
        if (hour === 24) {
          hour = 0;
        }
        hour++;
        const period = hour < 13 ? 'AM' : 'PM';
        const value = entry;
        return {hour, period, value};
      });
    } else {
      this.uploadDataInvalid = true;
    }
  }


  constructor() {
  }

  ngOnInit() {
  }

}
