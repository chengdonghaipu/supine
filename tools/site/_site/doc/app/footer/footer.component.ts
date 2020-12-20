import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="rc-footer rc-footer-dark">
      <section class="rc-footer-container">
        <section class="rc-footer-columns">
          <div app-footer-col [title]="language === 'zh' ? '相关资源' : 'Resources'">
            <app-footer-item title="NG-ZORRO-MOBILE" link="https://ng.mobile.ant.design/" description="Angular"> </app-footer-item>
            <app-footer-item title="Ant Design" link="https://ant.design/docs/react/introduce-cn" description="React"> </app-footer-item>
            <app-footer-item title="Ant Design" link="https://vue.ant.design/" description="Vue"> </app-footer-item>
            <app-footer-item title="Angular" link="https://angular.io/"> </app-footer-item>
            <app-footer-item title="Angular CLI" link="https://cli.angular.io/"> </app-footer-item>
          </div>
          <div app-footer-col [title]="language === 'zh' ? '社区' : 'Community'">
            <app-footer-item icon="ant-design" title="Awesome Ant Design" link="https://github.com/websemantics/awesome-ant-design">
            </app-footer-item>
            <app-footer-item icon="global" title="Blog" link="https://ng.ant.design/blog"> </app-footer-item>
            <app-footer-item icon="twitter" title="Twitter" link="https://twitter.com/ng_zorro"> </app-footer-item>
            <app-footer-item *ngIf="language === 'zh'" icon="zhihu" title="知乎专栏" link="https://zhuanlan.zhihu.com/100000">
            </app-footer-item>
            <app-footer-item icon="medium" title="Medium" link="https://medium.com/ng-zorro"> </app-footer-item>
          </div>
        </section>
      </section>
      <section class="rc-footer-bottom">
        <div class="rc-footer-bottom-container">Made with <span style="color: rgb(255, 255, 255);">❤</span> by NG-ZORRO team</div>
      </section>
    </footer>
  `,
  styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit {
  @Input() language: string = 'zh';
  @Input() colorHex: string = '#1890ff';
  // tslint:disable-next-line:no-any
  @Output() colorChange = new EventEmitter<any>();

  constructor() {}

  // tslint:disable-next-line:no-any
  changeColor(res: any): void {
    this.colorChange.emit(res);
  }

  ngOnInit(): void {}
}
