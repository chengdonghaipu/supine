import {BaseFormModel, CustomModel, FormControlConfig, GroupModel, LayoutGroupModel, ValidatorRule} from '@supine/dy-form';
import {InputGroupModel, InputModel, SelectGroupModel, SelectModel} from '@supine/dy-form-zorro';
import {FormControl, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {filter, map} from 'rxjs/operators';

export class FormModel extends BaseFormModel {
  sexModel = {
    label: '性别',
    optionContent: [
      {label: '男', value: 1},
      {label: '女', value: 2}
    ]
  };

  // 不使用表单模型上下文是这样的
  // @SelectModel<FormModel>({label: '性别', optionContent: [{label: '男', value: 1}, {label: '女', value: 1}]})
  // 使用表单模型上下文是这样的 当控件模型定义比较复杂的时候用这种方法有着很大的优势
  @SelectModel<FormModel>({initHook: (that, context) => Object.assign(that, context.sexModel)})
  sex: [null];

  @InputModel<FormModel>({label: '用户名'})
  @ValidatorRule(['required&max:15&min:4'], {required: '用户名字段是必填的', max: '用户名长度最多为15个字符', min: '用户名长度最少为4个字符'})
  username = [null, [], [FormModel.userNameAsyncValidator]];

  @InputModel<FormModel>({label: '手机号码'})
  @ValidatorRule(['required&phoneNum'], {required: '用户名字段是必填的', phoneNum: '请填写正确的手机号码'})
  phone = [null];

  @InputModel<FormModel>({label: '密码'})
  @ValidatorRule(['required&max:15&min:4'], {required: '密码字段是必填的', max: '密码长度最多为15个字符', min: '密码长度最少为4个字符'})
  password = [null];

  static userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          observer.next({ userName: '用户名已存在' });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 3000);
    })
  /**
   * 更新表单模型钩子
   * @param formValue 当表单初始化后 formValue就为表单对象的value 否则为null
   * @param model 注册了的模型配置数组 可以根据某些条件进行过滤 来动态控制表单
   * @param params 调用 executeModelUpdate方法传的参数 以此来更加灵活来动态控制表单
   * @return 如果返回值为void 则渲染所有注册的表单控件 如果返回表单控件数组 则只渲染该数组中的控件模型
   */
  modelUpdateHook(formValue: any, model: FormControlConfig[], ...params: any[]): FormControlConfig[] | void {
    return model;
  }

  /**
   * 结合我封装的HTTP模块 可轻松实现批量对接与表单相关的接口
   * HTTP模块 目前还没开源
   * 即便不使用我封装的HTTP模块 按照以下模板 也容易实现
   */
  httpRequest() {
    return this.updateValueAndValidity()
      .pipe(
        // 如果验证未通过 则过滤掉
        filter(value => value),
        map(() => {
          // 获取表单数据 如果不能满足需要 可以在子类重写value的获取
          // const body = this.value;
          // 获取提交表单的一些外部参数 比如更新的参数ID  attachValue 通过 model.withAttachValue(数据)进行设置
          // const {mapId, id} = this.attachValue;
          //
          // body.id = id;
          // 组装接口所需要的参数
          // const tempBody = {
          //   mapId,
          //   area_info: body
          // };

          // 一系列与表单相关的接口
          // const httpRequestMap: HttpRequestMap = {
          // update: [this.http.editAreaBaseInfo, [tempBody]]
          /* UnloadMineralArea: [this.http.setUnLoadMineralArea, [body, mapId]],
             UnloadWasteArea: [this.http.setUnLoadWasteArea, [body, mapId]],
             LoadArea: [this.http.setLoadArea, [body, mapId]],
             Road: [this.http.setRoad, [body, mapId]],
             PassableArea: [this.http.setPassableArea, [body, mapId]],
             ImpassableArea: [this.http.setImPassableArea, [body, mapId]],
             Junction: [this.http.setJunction, [body, mapId]],
             create: [this.http.createMapUtil, [body, mapId]] */
          // };

          // const [handle, params] = httpRequestMap[this.actionType];
          //
          // return handle(...params);
        })
      );
  }
}
