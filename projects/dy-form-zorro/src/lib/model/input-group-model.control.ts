import {InputModelControl} from './input-model.control';

export class InputGroupModelControl extends InputModelControl {
  type = 'INPUT_GROUP';

  /**
   * 是否用搜索框
   */
  search = false;

  constructor(init?: InputModelControl) {
    super(init as unknown as InputModelControl);
  }
}
