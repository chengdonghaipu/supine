import {InputModelControl} from './input-model.control';

export class TextareaModelControl extends InputModelControl {
  type = 'TEXTAREA';

  /**
   * 自适应内容高度
   */
  autosize: boolean | { minRows: number, maxRows: number } = {minRows: 3, maxRows: 3};
  /**
   * 只读
   */
  readonly = false;

  constructor(init?: TextareaModelControl) {
    super(init as unknown as InputModelControl);
  }
}
