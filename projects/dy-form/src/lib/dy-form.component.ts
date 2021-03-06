import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DoCheck,
  ElementRef,
  EmbeddedViewRef,
  Inject,
  Input,
  IterableChangeRecord,
  IterableChanges,
  IterableDiffer,
  IterableDiffers,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {Subject} from 'rxjs';
import {AbstractControl, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {
  DyFormCellDefContext,
  DyFormColumnDef,
  DyFormFooterDef,
  DyFormFooterOutlet,
  DyFormHeaderDef,
  DyFormHeaderOutlet
} from './dy-form.def';
import {AbstractDyFormRef} from './base-dy-form-ref';
import {FormControlModel} from './models';
import {takeUntil} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';
import {BreakpointType} from './type';
import {BreakpointObserver} from '@angular/cdk/layout';
import {DyFormLayoutOutlet, DyLayoutComponent, DyLayoutDirective, DyLayoutItemDirective} from './dy-layout';

@Component({
  selector: 'jd-dy-form',
  templateUrl: './dy-form.component.html',
  styleUrls: ['./dy-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DyFormComponent implements DoCheck, OnInit, OnDestroy, AfterContentInit, AfterContentChecked {
  private _document: Document;
  // 用于销毁资源
  private _unsubscribe$ = new Subject<void>();
  // 表单配置是否变脏 也就是是否第一次赋值
  private _formOptionsDirty = true;

  private _columnDefsByName = new Map<string, DyFormColumnDef>();

  private _customColumnDefs = new Set<DyFormColumnDef>();

  private _customHeaderDefs = new Set<DyFormHeaderDef>();

  private _customFooterDefs = new Set<DyFormFooterDef>();

  private _customLayoutDefs = new Set<DyLayoutComponent>();

  private _customLayoutItems = new Set<DyLayoutItemDirective>();

  private _controlUIDMap = new Map<number, FormControlModel>();

  private _recordControlUIDMap = new Map<number, FormControlModel>();
  // 表单选项
  private _options: FormControlModel[] = [];
  // 窗口变化事件
  private _resizeEvent: () => void;
  // dyForm是否初始化
  private _dyFormInit = false;
  // 表单配置差异器
  private _optionDiffer: IterableDiffer<FormControlModel> | null = null;

  private _breakpoint: BreakpointType;

  private _willRenderChanges: IterableChanges<FormControlModel>;

  private _headerRowDefChanged = true;

  private _footerRowDefChanged = true;

  private _layoutItemDefChanged = true;

  private _headerRowDefs: DyFormHeaderDef[] = [];

  private _footerRowDefs: DyFormFooterDef[] = [];

  private _layoutItemDefs: DyLayoutItemDirective[] = [];

  private _customLayoutDef: DyLayoutDirective;

  private _viewRefs: { [k: string]: EmbeddedViewRef<DyFormCellDefContext<FormControlModel>> } = {};

  formArea: FormGroup;

  @Input() dyFormRef: AbstractDyFormRef<any>;

  @ContentChildren(DyFormColumnDef, {descendants: true}) _formColumnDefs: QueryList<DyFormColumnDef>;

  @ContentChildren(DyFormHeaderDef, {descendants: true}) _formHeaderDefs: QueryList<DyFormHeaderDef>;

  @ContentChildren(DyFormFooterDef, {descendants: true}) _formFooterDefs: QueryList<DyFormFooterDef>;

  @ContentChildren(DyLayoutItemDirective, {descendants: true}) _formLayoutItems: QueryList<DyLayoutItemDirective>;

  @ContentChildren(DyLayoutComponent, {descendants: true}) _customLayoutSelfDefs: QueryList<DyLayoutComponent>;

  @ViewChild(DyFormLayoutOutlet, {static: true}) _formLayoutOutlet: DyFormLayoutOutlet;

  @ViewChild(DyFormFooterOutlet, {static: true}) _formFooterOutlet: DyFormFooterOutlet;

  @ViewChild(DyFormHeaderOutlet, {static: true}) _formHeaderOutlet: DyFormHeaderOutlet;

  get breakpoint(): BreakpointType {
    return this._breakpoint;
  }

  get options() {
    return this._options;
  }

  /**
   * 重置控件
   * @param value
   * @param options
   */
  reset(value?: any, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }) {
    this.formArea.reset(value, options);
  }

  /**
   * 填充表单数据
   * @param value
   * @param options
   */
  setValues(value: { [p: string]: any }, options?: { onlySelf?: boolean; emitEvent?: boolean }) {
    this.formArea.patchValue(value, options);
  }

  constructor(private _differs: IterableDiffers,
              private _fb: FormBuilder,
              private _renderer: Renderer2,
              public _cdf: ChangeDetectorRef,
              private _elementRef: ElementRef<HTMLElement>,
              @Inject(DOCUMENT) _document: any,
              private _breakpointObserver: BreakpointObserver,
              private _ngZone: NgZone) {
    this.formArea = this._fb.group({});
    this._document = _document;

    _ngZone.runOutsideAngular(() => {
      const resize$ = new Subject<number>();

      resize$.next(0);

      this._resizeEvent = _renderer.listen('window', 'resize', () => resize$.next(_elementRef.nativeElement.offsetWidth));
    });
  }

  ngOnInit(): void {
    if (!this.dyFormRef) {
      throw Error(`Must be passed when entering attribute dyFormRef`);
    }

    this.dyFormRef.dyForm = this;

    this.dyFormRef.model.formGroup = this.formArea;

    this.dyFormRef
      .connect()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(value => {
        this._options = value;
      });
  }

  ngAfterContentInit(): void {
    this._customLayoutSelfDefs.forEach(item => this._customLayoutDefs.add(item));

    this._formFooterDefs
      .changes
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(() => {
        this._headerRowDefs = mergeArrayAndSet(this._formHeaderDefs.toArray(), this._customHeaderDefs);
        this._forceRenderHeaderRows();
      });

    this._formHeaderDefs
      .changes
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(() => {
        this._footerRowDefs = mergeArrayAndSet(this._formFooterDefs.toArray(), this._customFooterDefs);

        this._forceRenderFooterRows();
      });

    this._formLayoutItems
      .changes
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(() => {
        // console.log('changes');
        this._layoutItemDefs = mergeArrayAndSet(this._formLayoutItems.toArray(), this._customLayoutItems);
      });
  }

  registerCustomLayout(layoutDef: DyLayoutDirective) {
    this._customLayoutDef = layoutDef;
    this._formLayoutOutlet.viewContainer.createEmbeddedView(layoutDef.template);
  }

  addColumnDef(columnDef: DyFormColumnDef) {
    this._customColumnDefs.add(columnDef);
  }

  removeColumnDef(columnDef: DyFormColumnDef) {
    this._customColumnDefs.delete(columnDef);
  }

  addHeaderRowDef(headerRowDef: DyFormHeaderDef) {
    this._customHeaderDefs.add(headerRowDef);
    this._headerRowDefChanged = true;
    this._headerRowDefs = mergeArrayAndSet(this._formHeaderDefs?.toArray() || [], this._customHeaderDefs);
  }

  removeHeaderRowDef(headerRowDef: DyFormHeaderDef) {
    this._customHeaderDefs.delete(headerRowDef);
    this._headerRowDefChanged = true;
    this._headerRowDefs = mergeArrayAndSet(this._formHeaderDefs?.toArray() || [], this._customHeaderDefs);
  }

  addFooterRowDef(footerRowDef: DyFormFooterDef) {
    this._customFooterDefs.add(footerRowDef);
    this._footerRowDefChanged = true;
    this._footerRowDefs = mergeArrayAndSet(this._formFooterDefs?.toArray() || [], this._customFooterDefs);
  }

  removeFooterRowDef(footerRowDef: DyFormFooterDef) {
    this._customFooterDefs.delete(footerRowDef);
    this._footerRowDefChanged = true;
    this._footerRowDefs = mergeArrayAndSet(this._formFooterDefs?.toArray() || [], this._customFooterDefs);
  }

  addLayoutItemDef(layoutDef: DyLayoutItemDirective) {
    this._customLayoutItems.add(layoutDef);
    this._layoutItemDefChanged = true;
    this._layoutItemDefs = mergeArrayAndSet(this._formLayoutItems?.toArray() || [], this._customLayoutItems);
  }

  removeLayoutItemDef(layoutDef: DyLayoutItemDirective) {
    this._customLayoutItems.delete(layoutDef);
    this._layoutItemDefChanged = true;
    this._layoutItemDefs = mergeArrayAndSet(this._formLayoutItems?.toArray() || [], this._customLayoutItems);
  }

  private _removeControlView({uid, name}: FormControlModel) {
    // 目前只允许存在一个布局容器
    const layoutDef = Array.from(this._customLayoutDefs)[0];

    if (layoutDef) {
      const containers = layoutDef.layoutChildren.filter(value => value.controlName === name);

      if (!containers.length) {
        return false;
      }

      const outletViewContainer = containers[0].viewContainer;

      const viewRef = outletViewContainer.get(0) as EmbeddedViewRef<DyFormCellDefContext<FormControlModel>>;

      const context = viewRef.context;

      if (context.model.uid === uid) {
        outletViewContainer.clear();
        return true;
      }
    }

    return false;
  }

  private _isRenderControl(item: FormControlModel) {
    // 是否需要渲染控件
    let isRenderControl = true;

    if (item.type === 'GROUP' || item.layoutGroup) {
      item.group = true;
    }

    if (item.layoutGroup || (item.group && item?.groupMode !== 'combine')) {
      // layoutGroup || 非组合模式 不需要渲染控件
      isRenderControl = false;
    }

    // 如果是组合模式
    if (item.layoutGroup || (item.group && item?.groupMode === 'combine')) {
      const groupChildrenMap = this._getGroupChildrenMap(item.name);
      // 组合模式 & 组成员数大于 0 需要渲染控件
      isRenderControl = Object.keys(groupChildrenMap).length > 0;
    }

    // 如果为true 则表示为控件
    if (item.parent && !item.group && !item.layoutGroup) {
      const parent = this.dyFormRef.optionMap.get(item.parent);

      // 如果父级是组合模式 则不单独渲染子控件
      if (parent?.groupMode === 'combine') {
        isRenderControl = false;
      }
    }

    return isRenderControl;
  }

  private _renderLayoutModeControl(item: FormControlModel, currentIndex: number) {
    // 是否需要渲染控件
    const isRenderControl = this._isRenderControl(item);

    const dyFormColumnDef = this._columnDefsByName.get(item.type);

    if (!dyFormColumnDef) {
      throw Error(`控件类型 ${item.type} 未注册`);
    }

    if (!isRenderControl) {
      return;
    }

    if (item.hide) {
      return;
    }

    const containers = this._layoutItemDefs.filter(value => value.controlName === item.name);

    if (!containers.length) {
      throw Error(`jd-form-layout 里 无法找到控件 ${item.name}`);
    }

    this._viewRefs[item.uid] = containers[0].viewContainer.createEmbeddedView(
      dyFormColumnDef.template,
      new DyFormCellDefContext(null, item, -1, 0)
    );

    this._recordControlUIDMap.set(item.uid, item);
  }

  private _addControl(record: IterableChangeRecord<FormControlModel>) {
    const config = record.item;

    if (config.layoutGroup) {
      return;
    }

    const controlName = config.controlName;

    let exit: any = this.formArea.get(controlName);

    const getFormControl = (op) => {
      const formControl = op.formControl || new FormControl(
        op.defaultValue !== null ? op.defaultValue : null,
        {
          validators: op.validators ? op.validators : [],
          asyncValidators: op.asyncValidators ? op.asyncValidators : [],
          updateOn: op.updateOn
        }
      );

      formControl.name = controlName;
      return formControl;
    };

    const updateValidators = (control: AbstractControl, op) => {
      const oldAsyncValidators = control.asyncValidator;
      const oldValidators = control.validator;

      /**
       * 当修改控件时
       * 先清除验证器 然后根据一些规则 重新生成验证器
       */
      control.clearAsyncValidators();
      control.clearValidators();

      // tslint:disable-next-line:one-variable-per-declaration
      const _asyncValidators = op.asyncValidators && op.asyncValidators.length ?
        op.asyncValidators : op.asyncValidators === null ? [] : oldAsyncValidators,
        _validators = op.validators && op.validators.length ?
          op.validators : op.validators === null ? [] : oldValidators;

      /**
       * 当修改控件时
       * 重新设置验证器
       */
      control.setAsyncValidators(_asyncValidators);
      control.setValidators(_validators);
    };

    if (config.group || config.parent) {
      if (config.group) {
        exit = this._getFormGroup(config.name);
      } else {
        const formGroup = this._getFormGroup(config.name);

        exit = formGroup && formGroup.get(controlName);
      }
    }

    if (exit) {
      let isControl = true;

      if (config.group) {
        isControl = false;
        // const control: FormGroup = exit as FormGroup;
      }

      if (config.parent && !config.group) {
        isControl = false;
        const formGroup: FormGroup = this._getFormGroup(config.name) as FormGroup;

        const control = formGroup.get(controlName);

        setControlStatus(control, config.disabled);

        updateValidators(control, config);
      }

      if (isControl) {
        const control = this.formArea.get(controlName);

        setControlStatus(control, config.disabled);

        updateValidators(control, config);
      }
    } else {
      let isControl = true;

      if (config.group) {
        isControl = false;
        this._addFormGroup(config.name);
      }

      // console.log(config.parent && !config.group, config.name);
      if (config.parent && !config.group) {
        isControl = false;
        const parentOption = this.dyFormRef.optionMap.get(config.parent);

        if (!parentOption) {
          throw Error(`模型提供错误 找不到${config.parent}`);
        }

        if (!parentOption.layoutGroup) {
          const control: FormGroup = this._getFormGroup(config.name, true) as FormGroup;

          control.addControl(controlName, getFormControl(config));
        } else {
          isControl = true;
        }
      }

      isControl && this.formArea.addControl(
        controlName,
        getFormControl(config)
      );
    }
    // console.log('_addControl');
  }

  private _addFormGroup(groupName: string) {
    const option = this.dyFormRef.optionMap.get(groupName);

    if (!option) {
      throw Error(`表单组: ${groupName}  未注册`);
    }

    if (!option.group) {
      throw Error(`表单配置错误: ${groupName}并不是表单组`);
    }

    if (option.layoutGroup) {
      return;
    }

    this._getFormGroup(groupName, true);
  }

  private _getControlPath(name: string, first = true) {
    const path = [];

    const option = this.dyFormRef.optionMap.get(name);

    if (option.group && first) {
      path.push(option.name);
    }

    let parent = option.parent;

    for (let i = 0; i < 10; i++) {
      const _option = this.dyFormRef.optionMap.get(parent);

      if (_option) {
        path.push(parent);
        parent = _option.parent;

        if (!parent) {
          break;
        }
      } else {
        break;
      }

      if (path.length > 9) {
        throw Error('表单组嵌套太深');
      }
    }

    return path.reverse();
  }

  private _getFormGroup(name: string, generate = false): FormGroup {
    const path = this._getControlPath(name);
    // console.log(path);
    let control: FormGroup = null;

    path.forEach(value => {
      const option = this.dyFormRef.optionMap.get(value);
      if (!control) {
        const temp = this.formArea.get(option.controlName) as FormGroup;
        if (!temp && generate) {
          this.formArea.addControl(option.controlName, new FormGroup({}));
          control = this.formArea.get(option.controlName) as FormGroup;
        } else {
          control = temp;
        }
      } else {
        const temp = control.get(value) as FormGroup;

        if (!temp && generate) {
          control.addControl(option.controlName, new FormGroup({}));
          control = control.get(option.controlName) as FormGroup;
        } else {
          control = temp;
        }
      }
    });

    return control;
  }

  private _removeControl(options: FormControlModel) {
    this._removeControlView(options);

    const {controlName, group, parent, name, uid} = options;

    delete this._viewRefs[uid];

    // if (previousIndex > -1) {
    //   this._viewRefs.splice(previousIndex, 1);
    // } else {
    //   console.log(`移除 ${name}---${uid} error`);
    // }

    this._recordControlUIDMap.delete(uid);

    if (group || !parent) {
      this.formArea.removeControl(controlName);
      return;
    }

    if (parent) {
      const formGroup = this._getFormGroup(name);

      formGroup.removeControl(controlName);
    }
  }

  private _getGroupChildrenControlMap(childMap: { [key: string]: FormControlModel }) {
    const childControlMap: { [key: string]: FormControl } = {};

    for (const childKey in childMap) {
      const item = childMap[childKey];

      if (item.group || item.layoutGroup) {
        continue;
      }

      if (item.parent && !item.group) {
        const parentOption = this.dyFormRef.optionMap.get(item.parent);

        let control: FormGroup;

        if (!parentOption.layoutGroup) {
          control = this._getFormGroup(item.name, true) as FormGroup;
        } else {
          control = this.formArea;
        }

        childControlMap[item.name] = control.get(item.controlName) as FormControl;
      } else {
        childControlMap[item.name] = this.formArea.get(item.controlName) as FormControl;
      }
    }

    return childControlMap;
  }

  private _getGroupChildrenMap(groupName: string) {
    const groupChildrenMap: { [key: string]: FormControlModel } = {};

    this.options
      .filter(value => value.parent === groupName && !value.group)
      .forEach(value => groupChildrenMap[value.name] = value);

    return groupChildrenMap;
  }

  private _updateRowIndexContext() {
    const attachContext = (viewRef: EmbeddedViewRef<DyFormCellDefContext<FormControlModel>>, count: number, renderIndex: number) => {
      const {model} = viewRef.context;

      const controlName = model.name;

      let _$implicit;

      if (model.parent) {
        const parentOption = this.dyFormRef.optionMap.get(model.parent);

        if (parentOption.layoutGroup) {
          // 如果是 LAYOUT_GROUP 直接获取自身控件即可
          _$implicit = this.formArea.get(model.controlName);
        } else {
          const formGroup = this._getFormGroup(controlName);
          _$implicit = formGroup.get(model.controlName);
        }
      } else {
        _$implicit = this.formArea.get(model.controlName);
      }

      let combineMode = false;

      // 如果是组合模式
      if ((model.type === 'GROUP' || model.layoutGroup) && model?.groupMode === 'combine') {
        combineMode = true;
      }

      const tempContext = {count, index: renderIndex, $implicit: _$implicit, config: this._recordControlUIDMap.get(model.uid)};

      Object.assign(viewRef.context, tempContext);

      if (combineMode) {
        const groupChildrenMap = this._getGroupChildrenMap(model.name);
        const childControl = this._getGroupChildrenControlMap(groupChildrenMap);

        viewRef.context.withGroupInfo(groupChildrenMap);
        viewRef.context.childControl = childControl;
      } else {
        viewRef.context.withGroupInfo({});
        viewRef.context.childControl = {};
      }
    };

    const keys = Object.keys(this._viewRefs);

    for (let renderIndex = 0; renderIndex < keys.length; renderIndex++) {
      // const item = this._recordControlUIDMap.get(+keys[renderIndex]);
      const viewRef = this._viewRefs[keys[renderIndex]];

      if (!viewRef) {
        return;
      }

      attachContext(viewRef, keys.length, renderIndex);
    }
  }

  private _applyChanges(changes: IterableChanges<FormControlModel>) {
    if (!changes) {
      return;
    }

    this._controlUIDMap.clear();

    this.options.forEach(value => this._controlUIDMap.set(value.uid, value));

    changes.forEachOperation((record: IterableChangeRecord<FormControlModel>,
                              previousIndex: number | null,
                              currentIndex: number | null) => {
      // 新增 | 修改
      if (record.previousIndex === null) {
        // console.log('新增 | 修改', record.item.name);
        this._addControl(record);

        if (!this._recordControlUIDMap.get(record.item.uid)) {
          // customLayout ? this._renderLayoutModeControl(record, currentIndex) : this._renderCustomControl(record);
          this._renderLayoutModeControl(record.item, currentIndex);
        }
      } else if (currentIndex === null) {
        // 删除
        // console.log('删除', record.item.name, previousIndex);
        if (!this._controlUIDMap.get(record.item.uid)) {
          this._removeControl(record.item);
        }
      } else {
        // 移动 不需要处理
        // console.log('移动');
      }
    });

    this._updateRowIndexContext();

    Promise.resolve().then(() => {
      this._cdf.markForCheck();
      if (!this._dyFormInit) {
        this._dyFormInit = true;
        this.dyFormRef.model.initHook();
      }
    });
  }

  private _forceRenderHeaderRows() {
    if (this._formHeaderOutlet.viewContainer.length > 0) {
      this._formHeaderOutlet.viewContainer.clear();
    }

    this._headerRowDefs.forEach(value => this._formHeaderOutlet.viewContainer.createEmbeddedView(value.template));
  }

  private _forceRenderFooterRows() {
    if (this._formFooterOutlet.viewContainer.length > 0) {
      this._formFooterOutlet.viewContainer.clear();
    }

    this._footerRowDefs.forEach(value => this._formFooterOutlet.viewContainer.createEmbeddedView(value.template));
  }

  /**
   * 强制渲染
   */
  forceRenderLayout() {
    this._controlUIDMap.clear();

    this.options.forEach((value, index) => this._renderLayoutModeControl(value, index));

    this._updateRowIndexContext();
  }

  ngDoCheck(): void {
    if (this._formOptionsDirty) {
      this._formOptionsDirty = false;

      try {
        this._optionDiffer = this._differs.find([]).create(trackByFn);
      } catch (e) {

      }
    }

    if (this._optionDiffer) {
      const changes = this._optionDiffer.diff(this.options);

      if (changes) {
        if (this._columnDefsByName.size) {
          changes.forEachOperation((record: IterableChangeRecord<FormControlModel>) => {
            const containers = this._layoutItemDefs.filter(value => value.controlName === record.item.name);

            if (!containers.length) {
              this._willRenderChanges = changes;
            }
          });
          if (!this._willRenderChanges) {
            this._applyChanges(changes);
          }
        } else {
          this._willRenderChanges = changes;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    // this._formCellOutlet.viewContainer.clear();

    if (this._resizeEvent) {
      this._resizeEvent();
    }
    // this._noDataRowOutlet.viewContainer.clear();
    this._formFooterOutlet.viewContainer.clear();
    this._formHeaderOutlet.viewContainer.clear();
  }

  ngAfterContentChecked(): void {
    this._cacheColumnDefs();

    if (this._columnDefsByName.size && this._willRenderChanges) {
      Promise.resolve().then(() => {
        // console.log('_applyChanges');
        const willRenderChanges = this._willRenderChanges;
        this._willRenderChanges = null;
        this._applyChanges(willRenderChanges);
      });
    }

    if (this._footerRowDefChanged) {
      this._forceRenderHeaderRows();
      this._footerRowDefChanged = false;
    }

    if (this._layoutItemDefChanged) {
      // this.forceRenderLayout();
      this._layoutItemDefChanged = false;
    }

    if (this._headerRowDefChanged) {
      this._forceRenderFooterRows();
      this._headerRowDefChanged = false;
    }
  }

  private _cacheColumnDefs() {

    this._footerRowDefs = mergeArrayAndSet(this._formFooterDefs.toArray(), this._customFooterDefs);

    this._headerRowDefs = mergeArrayAndSet(this._formHeaderDefs.toArray(), this._customHeaderDefs);

    this._layoutItemDefs = mergeArrayAndSet(this._formLayoutItems.toArray(), this._customLayoutItems);

    this._columnDefsByName.clear();

    const columnDefs = mergeArrayAndSet(
      this._formColumnDefs.toArray(), this._customColumnDefs);

    columnDefs.forEach(columnDef => {
      if (this._columnDefsByName.has(columnDef.name)) {
        throw Error(`columnDef.name: ${columnDef.name} 已经存在`);
      }
      this._columnDefsByName.set(columnDef.name, columnDef);
    });
  }
}

function setControlStatus(control: AbstractControl, disabled: boolean) {
  if (disabled && control.enabled) {
    control.disable();
  }
  if (!disabled && control.disabled) {
    control.enable();
  }
}

function percentage(size: number, columns: number) {
  return ((size / columns) * 100).toFixed(2) + '%';
}

function trackByFn(index, item) {
  let token = '';
  for (const itemKey in item) {
    if (item.hasOwnProperty(itemKey) && !(typeof item[itemKey] === 'object')) {
      token += itemKey + item[itemKey];
    } else if (typeof item[itemKey] === 'object') {
      token += itemKey + JSON.stringify(item[itemKey]);
    }
  }
  return token;
}

function mergeArrayAndSet<T>(array: T[], set: Set<T>): T[] {
  return array.concat(Array.from(set));
}
