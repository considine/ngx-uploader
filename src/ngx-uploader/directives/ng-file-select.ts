import { Directive, ElementRef, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { NgUploaderService, UploadOutput, UploadInput, UploadFile } from '../services/ngx-uploader';

@Directive({
  selector: '[ngFileSelect]'
})
export class NgFileSelectDirective implements OnInit, OnDestroy {
  @Input() uploadInput: EventEmitter<any>;
  @Output() uploadOutput: EventEmitter<UploadOutput>;

  el: HTMLInputElement;

  constructor(private elementRef: ElementRef, private upload: NgUploaderService) {
    this.uploadOutput = new EventEmitter<UploadOutput>();
  }

  ngOnInit() {
    this.el = this.elementRef.nativeElement;
    this.el.addEventListener('change', this.fileListener, false);

    this.upload.serviceEvents.subscribe((event: UploadOutput) => {
      this.uploadOutput.emit(event);
    });

    if (this.uploadInput instanceof EventEmitter) {
      this.upload.initInputEvents(this.uploadInput);
    }
  }

  ngOnDestroy() {
    this.el.removeEventListener('change', this.fileListener, false);
    this.uploadInput.unsubscribe();
  }

  fileListener = () => {
    this.upload.handleFiles(this.el.files);
  }
}