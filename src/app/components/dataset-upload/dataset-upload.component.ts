import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'eyes-dataset-upload',
  templateUrl: './dataset-upload.component.html',
  styleUrls: ['./dataset-upload.component.css']
})
export class DatasetUploadComponent implements OnInit {

  uploadData: any[];
  dragOver = false;
  uploadDataInvalid = false;
  validating = false;

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
    this.resetStatus();
    const files = evt.dataTransfer.files;
    if (files && files.length) {
      this.readFiles(files);
    }
  }

  private readFiles(files) {
    if (files && files.length) {
      const fileReader = new FileReader();
      const self = this;
      fileReader.onload = function () {
        self.parseDataset(fileReader.result);
      };
      // Only read one file, ignore he rest
      fileReader.readAsText(files[0]);
    }
  }

  onPaste(event) {
    this.resetStatus();
    // @ts-ignore
    const clipboardData = event.clipboardData || window.clipboardData;
    const dataInput = clipboardData.getData('text');
    this.parseDataset(dataInput);
  }

  parseDataset(dataInput) {
    const entries = dataInput.split('\n');
    const uploadData = [];
    let hourOfDay = 0;
    if (entries.every(entry => {
        try {
          const value = this.decimalPipe.transform(entry);
          hourOfDay = hourOfDay === 24 ? 1 : hourOfDay + 1;
          const period = hourOfDay < 13 ? 'AM' : 'PM';
          const hour = hourOfDay > 12 ? hourOfDay - 12 : hourOfDay;
          uploadData.push({hour, period, value});
          return true;
        } catch (error) {
          return false;
        }
      }
    )) {
      this.uploadDataInvalid = false;
      this.uploadData = uploadData;
      this.dataUpload.emit(dataInput);
    } else {
      this.validating = false;
      this.uploadDataInvalid = true;
      this.uploadData = undefined;
    }
  }

  private resetStatus() {
    this.validating = true;
    this.uploadDataInvalid = false;
    this.uploadData = undefined;
  }


  constructor(private decimalPipe: DecimalPipe) {
  }

  ngOnInit() {
  }

}
