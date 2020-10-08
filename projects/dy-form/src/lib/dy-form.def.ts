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

  static mostRecentTemAreaOutlet: DyFormAreaOutlet | null;

  constructor(public viewContainer: ViewContainerRef) {
    console.log(this, 'DyFormAreaOutlet');
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

@Directive({selector: '[jdFormControlItemOutlet]'})
// tslint:disable-next-line:directive-class-suffix
export class DyFormControlItemOutlet implements OnDestroy {
  static mostRecentCellOutlet: DyFormControlItemOutlet | null = null;

  constructor(public viewContainer: ViewContainerRef) {
    DyFormControlItemOutlet.mostRecentCellOutlet = this;
  }

  ngOnDestroy() {
    if (DyFormControlItemOutlet.mostRecentCellOutlet === this) {
      DyFormControlItemOutlet.mostRecentCellOutlet = null;
    }
  }
}

@Component({
  selector: 'jd-form-control-item',
  template: `
    <ng-container jdFormControlItemOutlet></ng-container>
  `,
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    class: 'jd-form-control-item',
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

@Component({
  selector: 'jd-form-header',
  template: `
    <ng-content></ng-content>
  `,
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    class: 'jd-form-header',
  },
  styles: [`
    :host {
      display: block;
    }
  `],
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
})
// tslint:disable-next-line:component-class-suffix
export class DyFormHeader {
  constructor() {
  }
}

@Component({
  selector: 'jd-form-footer',
  template: `
    <ng-content></ng-content>
  `,
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    class: 'jd-form-footer',
  },
  styles: [`
    :host {
      display: block;
    }
  `],
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
})
// tslint:disable-next-line:component-class-suffix
export class DyFormFooter {
  constructor() {
  }
}

@Directive({selector: '[jdDyFormControlItemDef]'})
// tslint:disable-next-line:directive-class-suffix
export class DyFormControlItemDef {
  constructor(public viewContainer: ViewContainerRef, public elementRef: ElementRef, public template: TemplateRef<any>) {
  }
}

@Directive({selector: '[jdDyFormColumnDef]'})
// tslint:disable-next-line:directive-class-suffix
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
