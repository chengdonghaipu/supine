import {
  ContentChild,
  Directive,
  ElementRef,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {FormControlModel} from './models';
import {FormControl} from '@angular/forms';


@Directive({selector: '[jdDyFormCellOutlet]'})
// tslint:disable-next-line:directive-class-suffix
export class DyFormCellOutlet {
  constructor(public viewContainer: ViewContainerRef, public elementRef: ElementRef) {
  }
}

@Directive({
  selector: '[jdDyFormLabelDef]',
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    class: 'jd-form-label',
    role: 'form-label',
  },
})
// tslint:disable-next-line:directive-class-suffix
export class DyFormLabelCellDef {
  constructor(public viewContainer: ViewContainerRef,
              public elementRef: ElementRef) {
  }
}

@Directive({
  selector: '[jdDyFormControlDef]',
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    class: 'jd-form-control',
    role: 'form-control',
  },
})
// tslint:disable-next-line:directive-class-suffix
export class DyFormControlCellDef {
  constructor(public viewContainer: ViewContainerRef,
              public elementRef: ElementRef) {
  }
}


@Directive({
  selector: '[jdDyFormFooterDef]',
})
export class DyFormFooterDef {
  constructor(public template: TemplateRef<any>) {
  }
}

@Directive({
  selector: '[jdDyFormHeaderDef]',
})
export class DyFormHeaderDef {
  constructor(public template: TemplateRef<any>) {
  }
}

@Directive({selector: '[jdFormFooterOutlet]'})
export class DyFormFooterOutlet {
  constructor(public viewContainer: ViewContainerRef) {
  }
}

@Directive({selector: '[jdFormHeaderOutlet]'})
export class DyFormHeaderOutlet {
  constructor(public viewContainer: ViewContainerRef) {
  }
}


@Directive({selector: '[jdDyFormColumnDef]'})
export class DyFormColumnDef {
  private _name: string;

  constructor(public viewContainer: ViewContainerRef,
              public elementRef: ElementRef,
              public template: TemplateRef<DyFormCellDefContext<FormControlModel>>) {
  }

  /** Unique name for this column. */
  @Input('jdDyFormColumnDefName')
  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
    // this._setNameInput(name);
  }

  @ContentChild(DyFormLabelCellDef) labelCell: DyFormLabelCellDef;

  @ContentChild(DyFormControlCellDef) controlCell: DyFormControlCellDef;
}

export class DyFormCellDefContext<T> {
  groupInfo: { [key: string]: T } = {};
  childControl: { [key: string]: FormControl } = {};

  withGroupInfo(groupInfo: { [key: string]: T }) {
    this.groupInfo = groupInfo;
    return this;
  }

  constructor(public $implicit: FormControl,
              public model: T,
              public index: number,
              public count: number) {
  }

  get first() {
    return this.index === 0;
  }

  get last() {
    return this.index === this.count - 1;
  }

  get even() {
    return this.index % 2 === 0;
  }

  get odd() {
    return !this.even;
  }
}
