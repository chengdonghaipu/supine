import {BaseFormModel, FormControlConfig, ValidatorRule} from '@supine/dy-form';
import {InputModel} from '@supine/dy-form-zorro';

export class FormModel extends BaseFormModel {
  @InputModel<FormModel>({label: '矿岩名称5', areaId: 6})
  @ValidatorRule(['max:999'], {max: '最大排土次数999'})
  mineralName = [null];

  @InputModel<FormModel>({label: '矿岩名称1', areaId: 2})
  mineralName5 = [null];

  @InputModel<FormModel>({label: '矿岩名称6', areaId: 3})
  mineralName6 = [null];

  @InputModel<FormModel>({label: '矿岩名称2', areaId: 3})
  mineralName1 = [null];

  @InputModel<FormModel>({label: '矿岩名称3', areaId: 4})
  mineralName2 = [null];

  @InputModel<FormModel>({label: '矿岩名称4', areaId: 5})
  mineralName3 = [3];

  modelUpdateHook(formValue: any, model: FormControlConfig[], ...params: any[]): void {
    super.modelUpdateHook(formValue, model, ...params);
    console.log(model);
    // return model.filter((value, index) => index > 2);
  }
}
