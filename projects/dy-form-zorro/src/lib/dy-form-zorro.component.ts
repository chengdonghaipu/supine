import {Component, Input, OnInit} from '@angular/core';
import {DyFormRef} from '@supine/dy-form';

@Component({
  selector: 'jd-dy-form-zorro',
  templateUrl: './dy-form-zorro.component.html',
  styles: [
  ]
})
export class DyFormZorroComponent implements OnInit {
  @Input() dyFormRef: DyFormRef<any>;

  constructor() { }

  ngOnInit(): void {
  }

}
