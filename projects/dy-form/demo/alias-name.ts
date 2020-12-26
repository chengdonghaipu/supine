import {Component, OnInit} from '@angular/core';
import {BaseFormModel, DyFormRef} from '@supine/dy-form';
import {InputModel} from './basic';

export class AliasNameModel extends BaseFormModel {
  aliasName1 = 'aliasName1被占用啦';

  aliasName2 = 'aliasName2也被占用啦';

  aliasName3 = 'aliasName3也被占用啦';

  /**
   * 字段被占用的情况下 用别名是比较方便的
   */

  @InputModel<AliasNameModel>({label: 'filed', aliasName: 'aliasName1'})
  filed = [null];

  @InputModel<AliasNameModel>({label: 'filed1', aliasName: 'aliasName2'})
  filed1 = [null];

  @InputModel<AliasNameModel>({label: 'filed2', aliasName: 'aliasName3'})
  filed2 = [null];
}

@Component({
  selector: 'nz-demo-dy-form-alias-name',
  template: `
    <nz-zorro-dy-form [dyFormRef]="dyFormRef" style="display: inline-block"></nz-zorro-dy-form>
    <button nz-button nzType="primary" (click)="submit()">提 交</button>
    <br>
    <code>
      {{result | json}}
    </code>
  `,
  styles: [``]
})
export class NzDemoDyFormAliasNameComponent implements OnInit {
  result = {};

  dyFormRef = new DyFormRef(AliasNameModel);

  submit() {
    const {model: formModel} = this.dyFormRef;

    this.result = formModel.value;
  }

  ngOnInit() {
    this.dyFormRef.executeModelUpdate();
  }
}
