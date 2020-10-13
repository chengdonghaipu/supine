import {Component, OnInit} from '@angular/core';
import {DyFormRef} from '@supine/dy-form';
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
    this.dyFormRef.executeModelUpdate();
    /*setTimeout(() => {
      // this.dyFormRef.executeModelUpdate();
      // this.dyFormRef.addControl(new InputModelControl({name: 'test', label: 'test'}));
    }, 5000);*/
  }

  ngOnInit(): void {
  }
}
