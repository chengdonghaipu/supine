import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component, ContentChild,
  ContentChildren,
  Input,
  OnInit,
  QueryList, TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  DyFormColumnDef,
  DyFormComponent,
  DyFormFooterDef,
  DyFormHeaderDef,
  DyFormRef,
  DyLayoutComponent,
  DyLayoutDirective
} from '@supine/dy-form';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'jd-dy-form-zorro',
  templateUrl: './dy-form-zorro.component.html',
  styleUrls: ['./dy-form-zorro.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DyFormZorroComponent implements OnInit, AfterContentInit {
  @ViewChild(DyFormComponent, {static: true}) dyForm: DyFormComponent;

  @ViewChild('errorTpl', {static: true}) errorTpl: TemplateRef<any>;

  @ViewChild('label', {static: true}) labelTpl: TemplateRef<any>;

  @ViewChild('inputControl', {static: true}) inputTpl: TemplateRef<any>;

  @ViewChild('inputNumberControl', {static: true}) inputNumberTpl: TemplateRef<any>;

  @ViewChild('textAreaControl', {static: true}) textAreaTpl: TemplateRef<any>;

  @ViewChild('datePickerControl', {static: true}) datePickerTpl: TemplateRef<any>;

  @ViewChild('rangePickerControl', {static: true}) rangePickerTpl: TemplateRef<any>;

  @ViewChild('timePickerControl', {static: true}) timePickerTpl: TemplateRef<any>;

  @ViewChild('selectControl', {static: true}) selectTpl: TemplateRef<any>;

  @ViewChild('formGroupControl', {static: true}) formGroupTpl: TemplateRef<any>;

  @ContentChildren(DyFormHeaderDef, {descendants: true}) _formHeaderDefs: QueryList<DyFormHeaderDef>;

  @ContentChildren(DyFormFooterDef, {descendants: true}) _formFooterDefs: QueryList<DyFormFooterDef>;

  @ContentChildren(DyFormColumnDef, {descendants: true}) _formColumnDefs: QueryList<DyFormColumnDef>;

  @ContentChildren(DyLayoutComponent, {descendants: true}) _customLayoutDefs: QueryList<DyLayoutComponent>;

  // @ContentChild(DyLayoutDirective) _customLayoutDef: DyLayoutDirective;

  @Input() dyFormRef: DyFormRef<any>;

  hasError(control: FormControl) {
    return control.errors && Object.keys(control.errors).length;
  }

  getError(control: FormControl) {
    const errors = Object.getOwnPropertyNames(control.errors);
    return control.getError(errors[0]);
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    // 增加form Footer 可以有多行
    this._formFooterDefs.forEach(item => this.dyForm.addFooterRowDef(item));
    // console.log(this._customLayoutDefs);
    // 注册自定义布局
    this._customLayoutDefs.forEach(item => this.dyForm.addLayoutDef(item));
    // 增加form Header 可以有多行
    this._formHeaderDefs.forEach(item => this.dyForm.addHeaderRowDef(item));
    // 注册表单控件模板
    this._formColumnDefs.forEach(item => this.dyForm.addColumnDef(item));

    // this.dyForm.registerCustomLayout(this._customLayoutDef);
    setTimeout(() => {
      // console.log(this._customLayoutDef);
    }, 1000);
  }

}
