import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {DyFormColumnDef, DyFormComponent, DyFormFooterDef, DyFormHeaderDef, DyFormRef} from '@supine/dy-form';

@Component({
  selector: 'jd-dy-form-zorro',
  templateUrl: './dy-form-zorro.component.html',
  styleUrls: ['./dy-form-zorro.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DyFormZorroComponent implements OnInit, AfterContentInit {
  @ViewChild(DyFormComponent, {static: true}) dyForm: DyFormComponent;

  @ContentChildren(DyFormHeaderDef, {descendants: true}) _formHeaderDefs: QueryList<DyFormHeaderDef>;

  @ContentChildren(DyFormFooterDef, {descendants: true}) _formFooterDefs: QueryList<DyFormFooterDef>;

  @ContentChildren(DyFormColumnDef, {descendants: true}) _formColumnDefs: QueryList<DyFormColumnDef>;

  @Input() dyFormRef: DyFormRef<any>;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    // 增加form Footer 可以有多行
    this._formFooterDefs.forEach(item => this.dyForm.addFooterRowDef(item));
    // 增加form Header 可以有多行
    this._formHeaderDefs.forEach(item => this.dyForm.addHeaderRowDef(item));
    // 注册表单控件模板
    this._formColumnDefs.forEach(item => this.dyForm.addColumnDef(item));
  }

}
