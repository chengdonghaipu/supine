import {InputModelControl} from './input-model.control';

export class TextareaControl<M = any> extends InputModelControl<M> {
  type = 'TEXTAREA';

  /**
   * 自适应内容高度
   */
  autosize: boolean | { minRows: number, maxRows: number } = {minRows: 3, maxRows: 3};
  /**
   * 只读
   */
  readonly = false;

  constructor(init?: TextareaControl) {
    super(init as unknown as InputModelControl);
  }
}
