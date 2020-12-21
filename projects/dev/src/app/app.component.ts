import {Component, OnInit} from '@angular/core';
import {DyFormRef} from '@supine/dy-form';
import {MapUtilFormModel} from './form.model';
import {ZorroDyFormRef} from '@supine/dy-form-zorro';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  dyFormRef = new ZorroDyFormRef(MapUtilFormModel, {mode: 'horizontal'});

  ngOnInit(): void {
  }

  constructor() {
    // 附加类型
    this.dyFormRef.model.withActionType('UnloadWasteArea');
    // 执行这行代码才会渲染  会执行表单模型中的modelUpdateHook
    this.dyFormRef.executeModelUpdate();
  }
}
