import {BaseModel} from './base.model';
import {ModelPartial} from '../type';

export class LayoutGroupModelControl<M = any> extends BaseModel<M> {
  type = 'LAYOUT_GROUP';

  readonly layoutGroup = true;

  /**
   * 表单组模式
   * single 表单组的每个控件都单独渲染
   * combine 表单组的所有控件 合并为一个控件渲染
   */
  groupMode: 'single' | 'combine' = 'combine';

  constructor(init?: ModelPartial<LayoutGroupModelControl>) {
    super();
    this.init(init);
  }
}
