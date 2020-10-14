import {Component, OnInit} from '@angular/core';
import {DyFormRef} from '@supine/dy-form';
import {FormModel} from './form.model';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dev';
  validateForm;
  dyFormRef = new DyFormRef(FormModel, {mode: 'vertical'});

  ngOnInit(): void {
  }

  constructor(private fb: FormBuilder) {
    this.dyFormRef.executeModelUpdate();
    setTimeout(() => {
      this.dyFormRef.dyForm.formArea.valueChanges.subscribe(value => {
        console.log(value, this.dyFormRef.dyForm.formArea.valid, this.dyFormRef.dyForm.formArea);
        // this.dyFormRef.model.updateValueAndValidity();
      });
      // this.dyFormRef.executeModelUpdate();
      // this.dyFormRef.addControl(new InputModelControl({name: 'test', label: 'test'}));
    }, 5000);
  }

}
