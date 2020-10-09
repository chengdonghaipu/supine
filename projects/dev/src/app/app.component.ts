import {Component, OnInit} from '@angular/core';
import {DyFormRef} from 'dy-form';
import {FormModel} from './form.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'dev';

  dyFormRef = new DyFormRef(FormModel, {mode: 'responsive'});

  constructor() {
    setTimeout(() => {
      this.dyFormRef.reset();
    }, 5000);
  }

  ngOnInit(): void {
  }
}
