import {Component, OnInit} from '@angular/core';
import {DyFormRef} from '@supine/dy-form';
import {FormModel} from './form.model';
import {ZlValidator} from '@supine/validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  dyFormRef = new DyFormRef(FormModel, {mode: 'vertical'});

  ngOnInit(): void {
  }

  constructor() {
    // 执行这行代码才会渲染
    this.dyFormRef.executeModelUpdate();

    const validator = new ZlValidator();

    validator.setRule({a: 'in:1,2,3'}).make(null, {a: 'a', b: {a: 'f', f: 'm', m: {a: 'g'}}, c: 'c'});

    console.log(validator);
  }

}
