import { Component } from '@angular/core';

@Component({
  selector: 'nz-demo-dy-form-customize',
  template: `
    <nz-slider [(ngModel)]="size"></nz-slider>
    <nz-space [nzSize]="size">
      <nz-space-item>
        <button nz-button nzType="primary">Button</button>
      </nz-space-item>
      <nz-space-item>
        <button nz-button nzType="default">Default</button>
      </nz-space-item>
      <nz-space-item>
        <button nz-button nzType="dashed">Dashed</button>
      </nz-space-item>
      <nz-space-item>
        <a nz-button nzType="link">Link</a>
      </nz-space-item>
    </nz-space>
  `
})
export class NzDemoDyFormCustomizeComponent {
  size = 8;
}
