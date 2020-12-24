import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ContentChild,
  ContentChildren, Directive,
  Input,
  OnInit,
  QueryList, TemplateRef,
  ViewChild, ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {
  DyFormColumnDef,
  DyFormComponent,
  DyFormFooterDef,
  DyFormHeaderDef,
  DyLayoutComponent,
  DyLayoutDirective,
  DyLayoutItemDirective,
  FormControlConfig
} from '@supine/dy-form';
import {FormControl} from '@angular/forms';
import {ZorroDyFormRef} from './dy-form-ref';

@Directive({selector: '[jdDyFormCustomLayout]'})
// tslint:disable-next-line:directive-class-suffix
export class DyFormCustomLayout {
  constructor(public viewContainer: ViewContainerRef, public template: TemplateRef<{ $implicit: FormControlConfig[] }>) {
    viewContainer.createEmbeddedView(template);
  }
}

@Component({
  selector: 'jd-dy-form-zorro',
  templateUrl: './dy-form-zorro.component.html',
  styleUrls: ['./dy-form-zorro.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DyFormZorroComponent implements OnInit, AfterContentInit, AfterContentChecked {
  @ViewChild(DyFormComponent, {static: true}) dyForm: DyFormComponent;

  @ViewChild('errorTpl', {static: true}) errorTpl: TemplateRef<void>;

  @ViewChild('label', {static: true}) labelTpl: TemplateRef<void>;

  @ViewChild('inputControl', {static: true}) inputTpl: TemplateRef<void>;

  @ViewChild('inputNumberControl', {static: true}) inputNumberTpl: TemplateRef<void>;

  @ViewChild('textAreaControl', {static: true}) textAreaTpl: TemplateRef<void>;

  @ViewChild('datePickerControl', {static: true}) datePickerTpl: TemplateRef<void>;

  @ViewChild('rangePickerControl', {static: true}) rangePickerTpl: TemplateRef<void>;

  @ViewChild('timePickerControl', {static: true}) timePickerTpl: TemplateRef<void>;

  @ViewChild('selectControl', {static: true}) selectTpl: TemplateRef<void>;

  @ViewChild('formGroupControl', {static: true}) formGroupTpl: TemplateRef<void>;

  @ContentChildren(DyFormHeaderDef, {descendants: true}) _formHeaderDefs: QueryList<DyFormHeaderDef>;

  @ContentChildren(DyFormFooterDef, {descendants: true}) _formFooterDefs: QueryList<DyFormFooterDef>;

  @ContentChildren(DyFormColumnDef, {descendants: true}) _formColumnDefs: QueryList<DyFormColumnDef>;

  @ContentChildren(DyLayoutComponent, {descendants: true}) _customLayoutDefs: QueryList<DyLayoutComponent>;

  @ContentChildren(DyLayoutItemDirective, {descendants: true}) _customLayoutItemDefs: QueryList<DyLayoutItemDirective>;

  @ContentChild(DyFormCustomLayout) customLayoutDef: DyFormCustomLayout;

  @Input() dyFormRef: ZorroDyFormRef<any>;

  hasError(control: FormControl) {
    return control.errors && Object.keys(control.errors).length;
  }

  getError(control: FormControl) {
    const errors = Object.getOwnPropertyNames(control.errors);
    return control.getError(errors[0]);
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.dyFormRef.changeDetectorRef = this.changeDetectorRef;
  }

  ngAfterContentInit(): void {
    // 增加form Footer 可以有多行
    this._formFooterDefs.forEach(item => this.dyForm.addFooterRowDef(item));
    // console.log(this._customLayoutDefs.length, this._customLayoutItemDefs.length, this.customLayoutDef);
    if (this.dyFormRef.mode === 'custom') {
      // 注册自定义布局
      // console.log(this._customLayoutItemDefs.length, this._customLayoutItemDefs);
      this._customLayoutItemDefs.forEach(item => this.dyForm.addLayoutItemDef(item));
    }
    // 增加form Header 可以有多行
    this._formHeaderDefs.forEach(item => this.dyForm.addHeaderRowDef(item));
    // 注册表单控件模板
    this._formColumnDefs.forEach(item => this.dyForm.addColumnDef(item));
  }

  ngAfterContentChecked(): void {
  }

}
