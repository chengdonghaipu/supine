# DyFormZorro

@supine/dy-form-zorro是基于@supine/dy-form 为ng-zorro适配的开箱即用的动态表单库。

通过引入一组可维护的表单控件模型和动态表单控件组件，它完全自动化了表单UI创建

## 主要特性
- 解耦

传统的Angular表单开发需要成百上千行HTML，在组件内部维护大量与表单相关的代码，不利于后期维护，可读性不强。
[@supine/dy-form](https://www.npmjs.com/package/@supine/dy-form)
最核心的思想就是将与表单相关的业务集中到表单模型中解决，从而减弱与组件的耦合性

更多文档请参考[@supine/dy-form](https://www.npmjs.com/package/@supine/dy-form)

- 高可读性
    - 所有控件配置都在表单模型中，表单结构一目了然
- 快速开发
    - 不需要成百上千行HTML，组件内部也不需要维护大量与表单相关的代码
- 面向对象
    - 表单模型、控件模型都基于class实现的，表单模型、控件模型都提供了基类，可以基于基类继承进行拓展
- 易拓展性
    - 轻松实现自定义控件
    - 轻松实现自定义布局

#相关库
- 基于@supine/dy-form[@supine/dy-form](https://www.npmjs.com/package/@supine/dy-form)
- 轻量级、易拓展验证库(文档中涉及的验证参考该文档)[@supine/validator](https://www.npmjs.com/package/@supine/validator)


# 快速上手
- 安装

```shell script
ng add ng-zorro-antd # 如果项目中没有ng-zorro-antd 则需要安装ng-zorro-antd
ng add @supine/dy-form-zorro
```

- 在模块中导入 DyFormZorroModule

- 通过脚手架生成表单模型
```
ng g @supine/dy-form:model LoginModel
```
- 通过上面的命令即可生成 LoginModel 模型内容如下

```typescript
import {BaseFormModel, InputModel, ValidatorRule} from '@supine/dy-form';

export class LoginModel extends BaseFormModel {
  @InputModel<LoginModel>({label: 'label'})
  @ValidatorRule(['max:999'], {max: '最大999'})
  exp = [null];

  /**
   * 更新表单模型钩子
   * @param formValue 当表单初始化后 formValue就为表单对象的value 否则为null
   * @param model 注册了的模型配置数组 可以根据某些条件进行过滤 来动态控制表单
   * @param params 调用 executeModelUpdate方法传的参数 以此来更加灵活来动态控制表单
   * @return 如果返回值为void 则渲染所有注册的表单控件 如果返回表单控件数组 则只渲染该数组中的控件模型
   */
  modelUpdateHook(formValue: any, model: FormControlModel[], ...params: any[]): FormControlModel[] | void {
    return model;
  }


  /**
   * 结合我封装的HTTP模块 可轻松实现批量对接与表单相关的接口
   * HTTP模块 目前还没开源
   * 即便不使用我封装的HTTP模块 按照以下模板 也容易实现
   */
  httpRequest() {
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
  }
}

```

- 然后修改表单配置来生成成所需的表单

```typescript
import {BaseFormModel, InputModel, ValidatorRule} from '@supine/dy-form';

export class LoginModel extends BaseFormModel {
  @InputModel<LoginModel>({label: '用户名'})
  @ValidatorRule(['required&max:15&min:4'], {required: '用户名字段是必填的', max: '用户名长度最多为15个字符', min: '用户名长度最少为4个字符'})
  username = [null];

   @InputModel<LoginModel>({label: '密码'})
   @ValidatorRule(['required&max:15&min:4'], {required: '密码字段是必填的', max: '密码长度最多为15个字符', min: '密码长度最少为4个字符'})
   password = [null];

  /**
   * 更新表单模型钩子
   * @param formValue 当表单初始化后 formValue就为表单对象的value 否则为null
   * @param model 注册了的模型配置数组 可以根据某些条件进行过滤 来动态控制表单
   * @param params 调用 executeModelUpdate方法传的参数 以此来更加灵活来动态控制表单
   * @return 如果返回值为void 则渲染所有注册的表单控件 如果返回表单控件数组 则只渲染该数组中的控件模型
   */
  modelUpdateHook(formValue: any, model: FormControlModel[], ...params: any[]): FormControlModel[] | void {
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

```
- 然后在HTML中声明动态表单
```angular2html
<jd-dy-form-zorro [dyFormRef]="dyFormRef"></jd-dy-form-zorro>
```

- 在组件中定义dyFormRef属性

```typescript
dyFormRef = new DyFormRef(LoginModel, {mode: 'vertical'});

ngOnInit(): void {
   // 执行这行代码才会渲染
   this.dyFormRef.executeModelUpdate();
}
```

- 至此就可以看到我们想要的表单啦
  
![Image text](https://readme-image.oss-cn-shenzhen.aliyuncs.com/login-dy-form-zorro.png)

# 自定义布局

- 修改模型
```typescript
import {BaseFormModel, ValidatorRule} from '@supine/dy-form';
import {InputModel} from '../decorator/input.model';

export class LoginModel extends BaseFormModel {
  // 布局容器 我们可以指定自定义类型 type=phone  默认值为LAYOUT_GROUP
  @LayoutGroupModel({type: 'phone'})
  layout;
   
  // parent: 'layout' 指定容器 layout
  @InputModel<FormModel>({label: '手机号码', parent: 'layout'})
  @ValidatorRule(['required&phoneNum'], {required: '用户名字段是必填的', phoneNum: '请填写正确的手机号码'})
  phone = [null];

  @InputModel<LoginModel>({label: '用户名'})
  @ValidatorRule(['required&max:15&min:4'], {required: '用户名字段是必填的', max: '用户名长度最多为15个字符', min: '用户名长度最少为4个字符'})
  username = [null];

  @InputModel<LoginModel>({label: '密码'})
  @ValidatorRule(['required&max:15&min:4'], {required: '密码字段是必填的', max: '密码长度最多为15个字符', min: '密码长度最少为4个字符'})
  password = [null];

  /**
   * 更新表单模型钩子
   * @param formValue 当表单初始化后 formValue就为表单对象的value 否则为null
   * @param model 注册了的模型配置数组 可以根据某些条件进行过滤 来动态控制表单
   * @param params 调用 executeModelUpdate方法传的参数 以此来更加灵活来动态控制表单
   * @return 如果返回值为void 则渲染所有注册的表单控件 如果返回表单控件数组 则只渲染该数组中的控件模型
   */
  modelUpdateHook(formValue: any, model: FormControlModel[], ...params: any[]): FormControlModel[] | void {
    return model;
  }


  /**
   * 结合我封装的HTTP模块 可轻松实现批量对接与表单相关的接口
   * HTTP模块 目前还没开源
   * 即便不使用我封装的HTTP模块 按照以下模板 也容易实现
   */
  httpRequest() {
    /* .... */
  }
}

```
- 接下来修改模板

```angular2html
<jd-dy-form-zorro [dyFormRef]="dyFormRef" #dyFormZorro>
<!--  phone 跟模型中的layout字段的元数据type是相对应的-->
<!--  groupModel 包含布局容器内所有字控件的配置信息 比如我要访问容器内phone控件的配置可以这样访问 groupModel.phone-->
<!--  childControl 包含布局容器内所有字控件的formControl 比如我要访问容器内phone控件可以这样访问 childControl.phone-->
  <ng-container *jdDyFormColumnDef="let model = model name 'phone', let groupModel = groupInfo, let childControl = childControl">
    <nz-form-item>
      <ng-template [ngTemplateOutlet]="dyFormZorro.labelTpl" [ngTemplateOutletContext]="{$implicit: groupModel.phone}"></ng-template>
      <nz-form-control
        jdDyFormControlDef
        [nzValidateStatus]="childControl.phone"
        [nzErrorTip]="dyFormZorro.errorTpl"
      >
        <nz-input-group [nzAddOnBefore]="addOnBeforeTemplate">
          <ng-template #addOnBeforeTemplate>
            <nz-select class="phone-select" [ngModel]="'+86'">
              <nz-option nzLabel="+86" nzValue="+86"></nz-option>
              <nz-option nzLabel="+87" nzValue="+87"></nz-option>
            </nz-select>
          </ng-template>
          <input [formControl]="childControl.phone" id="'phoneNumber'" nz-input/>
        </nz-input-group>
      </nz-form-control>
    </nz-form-item>
  </ng-container>
</jd-dy-form-zorro>
```
- 预览图如下
  
![Image text](https://readme-image.oss-cn-shenzhen.aliyuncs.com/layout_preview.png)
- 看上去挺多的 但只需要把常见的使用场景封装好了 以后开发就不要写什么模板了

#内置控件

|  名称   | 描述 |
|  ----  | ---- |
| **InputModel**  | 输入框 |
| **InputGroupModel**  | 数字输入框组 |
| **InputNumberModel**  | 数字输入框 |
| **InputNumberGroupModel**  | 数字输入框组 |
| **TextareaModel**  | 文本域 |
| **SelectModel**  | 下拉框 |
| **SelectGroupModel**  | 下拉框组 |
| **DatePickerModel**  | 日期选择框 |
| **RangePickerModel**  | 日期范围选择 |
| **TimePickerModel**  | 时间选择 |

- 预览图如下
  
![Image text](https://readme-image.oss-cn-shenzhen.aliyuncs.com/all_model_preview.png)
