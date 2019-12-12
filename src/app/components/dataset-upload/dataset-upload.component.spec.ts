import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetUploadComponent } from './dataset-upload.component';

describe('DatasetUploadComponent', () => {
  let component: DatasetUploadComponent;
  let fixture: ComponentFixture<DatasetUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
