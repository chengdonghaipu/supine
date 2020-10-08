import {BaseFormModel, InputModel} from 'dy-form';

export class FormModel extends BaseFormModel {
  @InputModel<FormModel>({label: '矿岩名称0', areaId: 6})
  mineralName = [null];
  @InputModel<FormModel>({label: '矿岩名称1', areaId: 2})
  mineralName5 = [null];

  @InputModel<FormModel>({label: '矿岩名称2', areaId: 3})
  mineralName1 = [null];

  @InputModel<FormModel>({label: '矿岩名称3', areaId: 4})
  mineralName2 = [null];

  @InputModel<FormModel>({label: '矿岩名称4', areaId: 5})
  mineralName3 = [3];
}
