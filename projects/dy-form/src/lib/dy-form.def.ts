import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  Input, OnDestroy,
  TemplateRef, ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {FormControlConfig} from './models';
import {FormControl} from '@angular/forms';


@Directive({selector: '[jdDyFormCellOutlet]'})
// tslint:disable-next-line:directive-class-suffix
export class DyFormCellOutlet {
  constructor(public viewContainer: ViewContainerRef, public elementRef: ElementRef) {
  }
}


// @Directive({selector: '[jdDyFormCell]'})
// // tslint:disable-next-line:directive-class-suffix
// export class DyFormCell {
//   constructor(public viewContainer: ViewContainerRef, public elementRef: ElementRef) {
//   }
// }

// @Directive({selector: '[jdDyFormLabelCell]'})
// // tslint:disable-next-line:directive-class-suffix
// export class DyFormLabelCell {
//   constructor(public viewContainer: ViewContainerRef, public elementRef: ElementRef) {
//   }
// }

@Directive({selector: '[jdDyFormLabelCellDef]'})
// tslint:disable-next-line:directive-class-suffix
export class DyFormLabelCellDef {
  constructor(public viewContainer: ViewContainerRef,
              public elementRef: ElementRef,
              public template: TemplateRef<DyFormCellDefContext<FormControlConfig>>) {
  }
}

// @Directive({selector: '[jdDyFormControlCell]'})
// // tslint:disable-next-line:directive-class-suffix
// export class DyFormControlCell {
//   constructor(public viewContainer: ViewContainerRef, public elementRef: ElementRef) {
//   }
// }


@Directive({selector: '[jdDyFormControlCellDef]'})
// tslint:disable-next-line:directive-class-suffix
export class DyFormControlCellDef {
  constructor(public viewContainer: ViewContainerRef,
              public elementRef: ElementRef,
              public template: TemplateRef<DyFormCellDefContext<FormControlConfig>>) {
  }
}


@Directive({selector: '[jdFormAreaOutlet]'})
// tslint:disable-next-line:directive-class-suffix
export class DyFormAreaOutlet implements OnDestroy {
  static mostRecentAreaOutlet: { [key: string]: DyFormAreaOutlet | null } = {};

  static mostRecentTemAreaOutlet: DyFormAreaOutlet | null = null;

  constructor(public viewContainer: ViewContainerRef) {
    DyFormAreaOutlet.mostRecentTemAreaOutlet = this;
  }

  ngOnDestroy() {
    DyFormAreaOutlet.mostRecentAreaOutlet = {};
    DyFormAreaOutlet.mostRecentTemAreaOutlet = null;
  }
}

@Component({
  selector: 'jd-form-area',
  template: `
    <ng-container jdFormAreaOutlet></ng-container>
  `,
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    class: 'jd-form-area',
    role: 'form-area',
  },
  styles: [`
    jd-form-area {
      display: block;
    }
  `],
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
})
// tslint:disable-next-line:component-class-suffix
export class DyFormArea {
  @ViewChild(DyFormAreaOutlet, {static: true}) outlet: DyFormAreaOutlet;

  constructor(public viewContainer: ViewContainerRef,
              public elementRef: ElementRef) {
  }
}

@Directive({selector: '[jdDyFormAreaDef]'})
// tslint:disable-next-line:directive-class-suffix
export class DyFormAreaDef {
  constructor(public viewContainer: ViewContainerRef,
              public elementRef: ElementRef,
              public template: TemplateRef<any>) {
  }
}

@Directive({selector: '[jdFormItemOutlet]'})
export class DyFormItemOutlet implements OnDestroy {
  static mostRecentCellOutlet: DyFormItemOutlet | null = null;

  constructor(public viewContainer: ViewContainerRef) {
    DyFormItemOutlet.mostRecentCellOutlet = this;
  }

  ngOnDestroy() {
    if (DyFormItemOutlet.mostRecentCellOutlet === this) {
      DyFormItemOutlet.mostRecentCellOutlet = null;
    }
  }
}

@Component({
  selector: 'jd-form-item',
  template: `
    <ng-container jdFormItemOutlet></ng-container>
  `,
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    class: 'jd-form-item',
    role: 'row',
  },
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
})
// tslint:disable-next-line:component-class-suffix
export class DyFormControlItem {
  constructor(public viewContainer: ViewContainerRef, public elementRef: ElementRef) {
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

@Directive({selector: '[jdDyFormItemWrapDef]'})
// tslint:disable-next-line:directive-class-suffix
export class DyFormItemWrapDef {

  constructor(public viewContainer: ViewContainerRef,
              public elementRef: ElementRef,
              public template: TemplateRef<any>) {
  }
}


@Directive({selector: '[jdDyFormItemDef]'})
export class DyFormItemDef {
  // @ContentChild(DyFormItemOutlet) outlet: DyFormItemOutlet;
  @ContentChild(DyFormItemWrapDef) wrapDef: DyFormItemWrapDef;


  constructor(public viewContainer: ViewContainerRef,
              public elementRef: ElementRef,
              /*public template: TemplateRef<any>*/) {
  }
}


@Directive({selector: '[jdDyFormColumnDef]'})
export class DyFormColumnDef {
  private _name: string;

  constructor(public viewContainer: ViewContainerRef, public elementRef: ElementRef) {
  }

  /** Unique name for this column. */
  @Input('jdDyFormColumnDef')
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

  withGroupInfo(groupInfo: { [key: string]: T }) {
    this.groupInfo = groupInfo;
    return this;
  }

  constructor(public $implicit: FormControl,
              public config: T,
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
