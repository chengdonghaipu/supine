import {BaseModel} from './base.model';
import {ModelPartial} from '../type';

export class GroupModelControl<M = any> extends BaseModel<M> {
  readonly type = 'GROUP';

  /**
   * @deprecated
   * // TODO 目前不支持
   */
  children: string[] = [];

  readonly group = true;

  /**
   * 表单组模式
   * single 表单组的每个控件都单独渲染
   * combine 表单组的所有控件 合并为一个控件渲染
   */
  groupMode: 'single' | 'combine' = 'single';

  constructor(init?: ModelPartial<GroupModelControl>) {
    super();
    this.init(init);
  }
}
