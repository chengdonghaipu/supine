import {BaseFormModel, CustomModel, FormControlModel, GroupModel, LayoutGroupModel, ValidatorRule} from '@supine/dy-form';
import {
  InputModel,
  InputNumberGroupModel,
  SelectModel,
  TimePickerModel, TextareaModel, SelectOptionContent
} from '@supine/dy-form-zorro';
import {FormControl, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {filter, map} from 'rxjs/operators';

export class MapUtilFormModel extends BaseFormModel {
  areaTypeContent: SelectOptionContent[] = [
    // { label: '停车场', value: 'ParkingLot' },
    {label: '卸矿区', value: 'UnloadMineralArea'},
    // { label: '排土场', value: 'UnloadWasteArea' },
    {label: '装载区', value: 'LoadArea'},
    // { label: '加水站', value: 'WaterStation' },
    {label: '道路', value: 'Road'},
    // { label: '交叉路口', value: 'Junction' },
    // { label: '加油站', value: 'PetrolStation' },
    {label: '可通行区域', value: 'PassableArea'},
    {label: '不可通行区域', value: 'ImpassableArea'}
  ];

  _roadType = [
    {label: '主线', value: 0},
    {label: '支线', value: 1},
    {label: '连接线', value: 2}
  ];

  _capacity = [
    {label: '单车道', value: 1},
    {label: '双车道', value: 2}
    // {label: '未知', value: 3},
  ];

  // 路口类型
  crossingType = [
    {label: '十字路口', value: 0},
    {label: '丁字路口', value: 1}
  ];
  // 排土类型
  _unloadWasteType = [
    {label: '边缘式', value: 'cliff'},
    {label: '定点式', value: 'point'}
  ];
  // 矿物类型
  mineralType = [];

  /*@SelectModel<MapUtilFormModel>({
    label: '区域类型',
    initHook: (that, context) => that.optionContent = context.areaTypeContent
  })
  @ValidatorRule('required', {required: '请选择区域类型'})
  areaType = [null];*/

  @InputModel({label: '名称'})
  @ValidatorRule(['required&maxLength:20'], {maxLength: '最大输入20个字符', required: '请输入单元名称'})
  name = [null];
  @InputModel({label: '名称'})
  @ValidatorRule(['required&maxLength:20'], {maxLength: '最大输入20个字符', required: '请输入单元名称'})
  name1 = [null];

  /*// 隐藏控件
  @InputModel({label: '区域编号', hide: true})
  areaId = [null];

  @InputNumberGroupModel<MapUtilFormModel>({
    label: '限速',
    addOnAfter: 'km/h',
    max: 100, min: 0,
    precision: 2,
    // 当类型为 ImpassableArea 限速禁用
    initHook: (that, context) => that.disabled = context.actionType === 'ImpassableArea'
  })
  @ValidatorRule(['required&max:100&min:0'], {max: '最大值为100', min: '最小值为0', required: '请输入区域限速'})
  speed = [0];

  @InputNumberGroupModel<MapUtilFormModel>({
    label: '车数量限制',
    addOnAfter: '辆',
    max: 100, min: 0,
    precision: 2,
  })
  @ValidatorRule(['required&max:100&min:0'], {max: '最大值为100', min: '最小值为0', required: '请输入车数量限制'})
  vehicleMax = [10];

  @SelectModel<MapUtilFormModel>({
    label: '装载类型',
    initHook: (that, context) => that.optionContent = context.mineralType
  })
  @ValidatorRule('required', {required: '请选择装载类型'})
  loadType = [null];

  @SelectModel<MapUtilFormModel>({
    label: '排土类型',
    aliasName: 'type',
    initHook: (that, context) => that.optionContent = context._unloadWasteType
  })
  @ValidatorRule('required', {required: '请选择装载类型'})
  unloadWasteType = [null];

  @InputNumberGroupModel({label: '排土次数上限', addOnAfter: '次'})
  @ValidatorRule(['max:999'], {max: '最大排土次数999'})
  unloadMax = [null];

  @SelectModel<MapUtilFormModel>({
    label: '卸矿类型',
    initHook: (that, context) => that.optionContent = context.mineralType
  })
  @ValidatorRule(['required'], {required: '请选择卸矿类型'})
  unloadType = [null];

  @SelectModel<MapUtilFormModel>({
    label: '道路类型',
    aliasName: 'type',
    initHook: (that, context) => that.optionContent = context._roadType
  })
  @ValidatorRule(['required'], {required: '请选择道路类型'})
  roadType = [null];

  @SelectModel<MapUtilFormModel>({
    label: '容量',
    initHook: (that, context) => that.optionContent = context._capacity
  })
  @ValidatorRule(['required'], {required: '请选择容量'})
  capacity = [null];

  @SelectModel<MapUtilFormModel>({
    label: '路口类型',
    aliasName: 'type', // 控件别名 表单真实的key 也就是获取表单value的时候该控件对应的key是type而不是junctionType
    initHook: (that, context) => that.optionContent = context.crossingType
  })
  @ValidatorRule(['required'], {max: '请选择路口类型'})
  junctionType = [null];*/

  /**
   * 更新表单模型钩子
   * @param formValue 当表单初始化后 formValue就为表单对象的value 否则为null
   * @param model 注册了的模型配置数组 可以根据某些条件进行过滤 来动态控制表单
   * @param params 调用 executeModelUpdate方法传的参数 以此来更加灵活来动态控制表单
   * @return 如果返回值为void 则渲染所有注册的表单控件 如果返回表单控件数组 则只渲染该数组中的控件模型
   */
  modelUpdateHook(formValue: any, model: FormControlModel[], ...params: any[]): FormControlModel[] | void {
    /*const typeMap = {
      create: ['areaType', 'speed', 'name'], // actionType==='create' 显示 'areaType', 'speed', 'name'这几个控件 以下以此类推
      ParkingLot: ['speed', 'name', 'areaId'],
      UnloadMineralArea: ['speed', 'name', 'areaId'],
      UnloadWasteArea: ['speed', 'name', 'unloadWasteType', 'unloadMax', 'areaId'],
      // 编号、类型、名称、限速、车数量限制
      LoadArea: ['areaType', 'speed', 'name'/!*, 'loadType'*!//!*, 'areaId'*!/, 'vehicleMax'],
      ImpassableArea: ['speed', 'name', 'areaId'],
      PassableArea: ['speed', 'name', 'areaId'],
      Road: ['speed', 'name', 'roadType', 'capacity', 'areaId'],
      Junction: ['speed', 'name', 'junctionType', 'areaId']
    };
    const controls = typeMap[this.actionType];
    return model.filter(value => controls.includes(value.name));*/
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
