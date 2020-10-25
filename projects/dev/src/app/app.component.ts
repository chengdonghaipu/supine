import {Component, OnInit} from '@angular/core';
import {DyFormRef} from '@supine/dy-form';
import {FormModel} from './form.model';
import {JdValidator} from '@supine/dy-form';

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
    const v = new JdValidator();

    // 验证规则
    const rules = {
      a: ['required', 'in:12'] // 或者 'required&in:12'
    };
    // 被验证的数据
    const data = {a: 'kl'};
    v.make(rules, data);
    if (v.fails()) {
      // 获取错误信息
      console.log(v.getMessages());
    }
  }

}
