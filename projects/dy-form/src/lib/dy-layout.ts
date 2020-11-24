import {
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  QueryList,
  TemplateRef,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';


@Directive({selector: '[jdDyFormLayoutItemName]'})
export class DyLayoutItemDirective {
  @Input('jdDyFormLayoutItemName') controlName: string;

  constructor(public viewContainer: ViewContainerRef, public elementRef: ElementRef) {
  }
}

@Component({
  selector: 'jd-form-layout',
  template: `
    <ng-content></ng-content>
  `,
})
export class DyLayoutComponent {
  @ContentChildren(DyLayoutItemDirective, {descendants: true}) layoutChildren: QueryList<DyLayoutItemDirective>;

  constructor() {
  }
}

@Directive({selector: '[jdDyFormLayoutDef]'})
export class DyLayoutDirective {

  constructor(public viewContainer: ViewContainerRef,  public template: TemplateRef<void>) {
    viewContainer.createEmbeddedView(template);
  }
}

@Directive({selector: '[jdFormLayoutOutlet]'})
export class DyFormLayoutOutlet {
  constructor(public viewContainer: ViewContainerRef) {
  }
}
