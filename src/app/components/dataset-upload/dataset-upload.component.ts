import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';

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
    this.validating = true;
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
        const obs = self.parseDataset(fileReader.result);
        obs.subscribe(res => {
          self.validating = false;
        });
      };
      // Only read one file, ignore he rest
      fileReader.readAsText(files[0]);
    }
  }

  onPaste(event) {
    this.validating = true;
    this.uploadData = undefined;
    // @ts-ignore
    const clipboardData = event.clipboardData || window.clipboardData;
    const dataInput = clipboardData.getData('text');
    const obs = this.parseDataset(dataInput);
    obs.subscribe(res => {
      this.validating = false;
    });
  }

  parseDataset(dataInput) {
    const comp = this;
    return Observable.create(function (observer) {
      comp.uploadData = undefined;
      const entries = dataInput.split('\n');
      if (entries.every(entry => {
          try {
            const value = comp.decimalPipe.transform(entry);
            return true;
          } catch (error) {
            return false;
          }
        }
      )) {
        comp.uploadDataInvalid = false;
        comp.dataUpload.emit(dataInput);
        let hour = 0;
        comp.uploadData = entries.map(entry => {
          if (hour === 24) {
            hour = 0;
          }
          hour++;
          const period = hour < 13 ? 'AM' : 'PM';
          const value = entry;
          return {hour, period, value};
        });
        observer.next(true);
      } else {
        comp.uploadDataInvalid = true;
        comp.uploadData = undefined;
        observer.next(false);
      }
    });
  }

  constructor(private decimalPipe: DecimalPipe) {
  }

  ngOnInit() {
  }

}
