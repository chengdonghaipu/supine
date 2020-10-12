import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
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
  DyFormAreaDef,
  DyFormAreaOutlet,
  DyFormCellDefContext,
  DyFormCellOutlet,
  DyFormColumnDef, DyFormFooterDef, DyFormFooterOutlet, DyFormHeaderDef, DyFormHeaderOutlet,
  DyFormItemDef,
  DyFormItemOutlet
} from './dy-form.def';
import {AbstractDyFormRef} from './base-dy-form-ref';
import {FormControlConfig} from './models';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';
import {BreakpointType} from './type';

class RecordControlItemViewTuple {
  constructor(public record: IterableChangeRecord<FormControlConfig>,
              public labelView: EmbeddedViewRef<DyFormCellDefContext<FormControlConfig>>,
              public controlView: EmbeddedViewRef<DyFormCellDefContext<FormControlConfig>>,
  ) {
  }
}

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

  private _controlUIDMap = new Map<number, FormControlConfig>();

  private _recordControlUIDMap = new Map<number, FormControlConfig>();
  // 表单选项
  private _options: FormControlConfig[] = [];
  // 窗口变化事件
  private _resizeEvent: () => void;
  // dyForm是否初始化
  private _dyFormInit = false;
  // 表单配置差异器
  private _optionDiffer: IterableDiffer<FormControlConfig> | null = null;

  private _breakpoint: BreakpointType;

  private _willRenderChanges: IterableChanges<FormControlConfig>;

  private _headerRowDefChanged = true;

  private _footerRowDefChanged = true;

  private _headerRowDefs: DyFormHeaderDef[] = [];

  private _footerRowDefs: DyFormFooterDef[] = [];

  formArea: FormGroup;

  @Input() dyFormRef: AbstractDyFormRef<any>;

  @ContentChildren(DyFormColumnDef, {descendants: true}) _formColumnDefs: QueryList<DyFormColumnDef>;

  @ContentChildren(DyFormHeaderDef, {descendants: true}) _formHeaderDefs: QueryList<DyFormHeaderDef>;

  @ContentChildren(DyFormFooterDef, {descendants: true}) _formFooterDefs: QueryList<DyFormFooterDef>;

  @ContentChild(DyFormItemDef, {static: true}) _formControlItemDef: DyFormItemDef;

  @ContentChild(DyFormAreaDef, {static: true}) _formAreaDef: DyFormAreaDef;

  @ViewChild(DyFormCellOutlet, {static: true}) _formCellOutlet: DyFormCellOutlet;

  @ViewChild(DyFormFooterOutlet, {static: true}) _formFooterOutlet: DyFormFooterOutlet;

  @ViewChild(DyFormHeaderOutlet, {static: true}) _formHeaderOutlet: DyFormHeaderOutlet;

  get breakpoint(): BreakpointType {
    return this._breakpoint;
  }

  get options() {
    return this._options;
  }

  get areaOptions() {
    return this.dyFormRef.areaOptions;
  }

  /*get renderData() {
    const keys = Object.keys(this.areaOptions)
      .sort((a, b) => +a - +b)
      .map(value => +value);
    return keys.map(value => this.areaOptions[value]);
  }*/

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
              private _ngZone: NgZone) {
    this.formArea = this._fb.group({});
    this._document = _document;

    _ngZone.runOutsideAngular(() => {
      const resize$ = new Subject<number>();

      resize$.next(0);

      this._resizeEvent = _renderer.listen('window', 'resize', () => resize$.next(_elementRef.nativeElement.offsetWidth));

      resize$
        .pipe(debounceTime(45), distinctUntilChanged(), takeUntil(this._unsubscribe$))
        .subscribe(value => this._setBreakpoint(value, () => this._restSetLayoutForControl()));
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
        console.log(value);
      });

    const offsetWidth = this._elementRef.nativeElement.offsetWidth;

    console.log(offsetWidth, 'offsetWidth');
    // this._watchDyFormRef();
    this._setBreakpoint(offsetWidth);
  }

  ngAfterContentInit(): void {
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
  }

  removeHeaderRowDef(headerRowDef: DyFormHeaderDef) {
    this._customHeaderDefs.delete(headerRowDef);
    this._headerRowDefChanged = true;
  }

  addFooterRowDef(footerRowDef: DyFormFooterDef) {
    this._customFooterDefs.add(footerRowDef);
    this._footerRowDefChanged = true;
  }

  removeFooterRowDef(footerRowDef: DyFormFooterDef) {
    this._customFooterDefs.delete(footerRowDef);
    this._footerRowDefChanged = true;
  }

  controlClass(config: FormControlConfig) {
    if (typeof config.controlClass === 'function') {
      return config.controlClass(this.formArea.value, this.dyFormRef.model);
    }
    return config.controlClass || [];
  }

  labelClass(config: FormControlConfig) {
    if (typeof config.labelClass === 'function') {
      return config.labelClass(this.formArea.value, this.dyFormRef.model);
    }
    return config.labelClass || [];
  }

  private _restSetLayoutForControl() {
    const viewContainer = this._formCellOutlet.viewContainer;
    console.log('_restSetLayoutForControl');

    if (!this.dyFormRef.responsiveForm) {
      return;
    }

    const {containerCount} = this.dyFormRef;

    if (containerCount > 1) {
      const keys = Object.keys(this.areaOptions)
        .sort((a, b) => +a - +b)
        .map(value => +value);

      keys.forEach(areaId => {
        const _viewContainer = DyFormAreaOutlet.mostRecentAreaOutlet[areaId].viewContainer;

        for (let i = 0, length = _viewContainer.length; i < length; i++) {
          const viewRef = _viewContainer.get(i) as EmbeddedViewRef<{ childView: RecordControlItemViewTuple }>;
          const context = viewRef.context.childView;

          this._setLayoutForControl(viewRef, context.record.item);
        }
      });
    } else {
      for (let renderIndex = 0, count = viewContainer.length; renderIndex < count; renderIndex++) {
        const viewRef = viewContainer.get(renderIndex) as EmbeddedViewRef<{ childView: RecordControlItemViewTuple }>;
        const context = viewRef.context.childView;

        this._setLayoutForControl(viewRef, context.record.item);
      }
    }
  }

  private _setBreakpoint(hostWidth: number, breakpointChangeCallback?: () => void) {
    // tslint:disable-next-line:prefer-const one-variable-per-declaration
    let _bps = [], gridBreakpoints = this.dyFormRef.gridBreakpoints;

    for (const gridBreakpointsKey in gridBreakpoints) {
      if (gridBreakpointsKey !== 'unit' && gridBreakpoints.hasOwnProperty(gridBreakpointsKey)) {
        _bps.push({name: gridBreakpointsKey, value: gridBreakpoints[gridBreakpointsKey]});
      }
    }

    _bps = _bps.sort((a, b) => b.value - a.value);

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < _bps.length; i++) {
      if (_bps[i].value < hostWidth) {
        if (this._breakpoint !== _bps[i].name) {
          this._breakpoint = _bps[i].name;
          // tslint:disable-next-line:no-unused-expression
          breakpointChangeCallback && breakpointChangeCallback();
        }
        break;
      }
    }
  }

  private _setLayoutForControl(view: EmbeddedViewRef<{ childView: RecordControlItemViewTuple }>, config: FormControlConfig) {
    // 获取宿主元素
    const controlHostEl: HTMLElement = view.rootNodes[0];

    if (!controlHostEl) {
      return;
    }

    const {mode, responsiveForm} = this.dyFormRef;

    const prefix = 'jd-dy-form-';

    const classList = ['vertical', 'horizontal', 'responsive'].map(value => prefix + value);

    this._setHostClass([prefix + mode], classList);

    if (config.hide) {
      this._renderer.setStyle(controlHostEl, 'display', 'none');
    }

    if (responsiveForm) {
      const _percentage = percentage(config.controlLayout[this.breakpoint], this.dyFormRef.column);
      this._setStyle(controlHostEl, {
        width: _percentage,
        flex: `0 0 ${_percentage}`,
        display: 'flex'
      });
    }
  }

  private _setStyle(el: HTMLElement, value: { [key: string]: string }) {
    for (const valueKey in value) {
      this._renderer.setStyle(el, valueKey, value[valueKey]);
    }
  }

  private _setHostClass(include: string[], exclude: string[]) {
    const el = this._elementRef.nativeElement;

    exclude.forEach(value => this._renderer.removeClass(el, value));
    include.forEach(value => this._renderer.addClass(el, value));
  }

  private _getAreaViewIndexById(areaId: number) {
    const outlet = this._formCellOutlet;

    for (let i = 0; i < outlet.viewContainer.length; i++) {
      const areaView = outlet.viewContainer.get(i) as EmbeddedViewRef<any>;

      if (areaView.context.areaId === areaId) {
        return i;
      }
    }

    return -1;
  }

  private _getCreateViewIndex(areaId: number) {
    const outlet = this._formCellOutlet;

    for (let i = 0; i < outlet.viewContainer.length; i++) {
      const areaView = outlet.viewContainer.get(i) as EmbeddedViewRef<any>;
      const nextAreaView = outlet.viewContainer.get(i + 1) as EmbeddedViewRef<any>;

      const _areaId = areaView?.context.areaId;
      const _nextAreaId = nextAreaView?.context.areaId;

      if (areaId < _areaId) {
        return i > 0 ? i - 1 : 0;
      }

      if (areaId > _areaId && areaId < _nextAreaId) {
        return i + 1;
      }

      if (!_nextAreaId) {
        return outlet.viewContainer.length;
      }
    }

    return 0;
  }

  private _removeControlView({uid, areaId}: FormControlConfig) {
    // 如果存在 说明是分区模式渲染
    let outletViewContainer = DyFormAreaOutlet.mostRecentAreaOutlet[areaId].viewContainer;

    if (!outletViewContainer) {
      outletViewContainer = this._formCellOutlet.viewContainer;
    }

    for (let i = 0; i < outletViewContainer.length; i++) {
      const viewRef = outletViewContainer.get(i) as EmbeddedViewRef<{ childView: RecordControlItemViewTuple }>;

      const context = viewRef.context.childView;
      const controlContext = context.controlView.context;

      if (controlContext.config.uid === uid) {
        // 移除视图
        outletViewContainer.remove(i);
        return true;
      }
    }

    return false;
  }

  private _renderCustomControl(record: IterableChangeRecord<FormControlConfig>) {
    const item = record.item;

    const filterType = ['GROUP'];

    const {containerCount} = this.dyFormRef;

    const groupChildrenMap: { [key: string]: FormControlConfig } = {};

    if (filterType.includes(item.type) && item?.groupMode !== 'combine') {
      return;
    }

    let combineMode = false;

    // 如果是组合模式
    if (filterType.includes(item.type) && item?.groupMode === 'combine') {
      this.options
        .filter(value => value.parent === item.name)
        .forEach(value => groupChildrenMap[value.name] = value);

      combineMode = true;
    }


    if (item.parent) {
      const parent = this.dyFormRef.optionMap.get(item.parent);

      // 如果是组合模式 则不单独渲染子控件
      if (parent?.groupMode === 'combine') {
        return;
      }
    }

    const dyFormColumnDef = this._columnDefsByName.get(item.type);

    const outlet = this._formCellOutlet;

    let outletViewContainer = outlet.viewContainer;

    if (dyFormColumnDef) {
      const {_formControlItemDef, _formAreaDef} = this;

      if (containerCount > 1) {
        this._setHostClass(['jd-dy-form-area-mode'], []);
        const areaViewIndex = this._getAreaViewIndexById(item.areaId);

        if (areaViewIndex < 0) {
          const createIndex = this._getCreateViewIndex(item.areaId);

          outlet.viewContainer.createEmbeddedView(_formAreaDef.template, item, createIndex);

          DyFormAreaOutlet.mostRecentAreaOutlet[item.areaId] = DyFormAreaOutlet.mostRecentTemAreaOutlet;
        }

        outletViewContainer = DyFormAreaOutlet.mostRecentAreaOutlet[item.areaId].viewContainer;
      } else {
        this._setHostClass([], ['jd-dy-form-area-mode']);
      }

      const view = outletViewContainer.createEmbeddedView(_formControlItemDef.wrapDef.template);
      // console.log(_formControlItemDef, _formControlItemDef);

      if (DyFormItemOutlet.mostRecentCellOutlet) {
        const {viewContainer} = DyFormItemOutlet.mostRecentCellOutlet;
        const labelView = viewContainer.createEmbeddedView(
          dyFormColumnDef.labelCell.template,
          new DyFormCellDefContext(null, record.item, -1, 0)
        );

        const controlView = viewContainer.createEmbeddedView(
          dyFormColumnDef.controlCell.template,
          new DyFormCellDefContext(null, record.item, -1, 0)
        );

        this._recordControlUIDMap.set(record.item.uid, record.item);

        view.context.childView = new RecordControlItemViewTuple(record, labelView, controlView);

        this._setLayoutForControl(view, record.item);
      } else {
        throw Error(`error`);
      }
    }
    console.log('_renderCustomControl');
  }

  private _addControl(record: IterableChangeRecord<FormControlConfig>) {
    const config = record.item;

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

      console.log(oldValidators, 'oldValidators');
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
        exit = this.formArea.get(controlName) as FormGroup;
      } else {
        const formGroup = this._getFormGroup(config.name);
        exit = formGroup.get(controlName);
      }
    }

    if (exit) {
      let isControl = true;

      if (config.group) {
        isControl = false;

        const control: FormGroup = this.formArea.get(controlName) as FormGroup;

        if (control) {
          throw new Error(`表单模型定义错误:  无法找到${controlName}表单组`);
        }
      }

      if (config.parent) {
        isControl = false;
        const formGroup: FormGroup = this._getFormGroup(config.name) as FormGroup;

        // console.log(this.formArea);
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
        if (!this.formArea.get(controlName)) {
          this.formArea.addControl(controlName, new FormGroup({}));
        }
      }

      if (config.parent) {
        isControl = false;
        const control: FormGroup = this._getFormGroup(config.name) as FormGroup;

        if (!control) {
          throw new Error(`表单模型定义错误:  无法找到${controlName}表单组`);
        }

        control.addControl(controlName, getFormControl(config));
      }

      isControl && this.formArea.addControl(
        controlName,
        getFormControl(config)
      );
    }
    console.log('_addControl');
  }

  private _getControlPath(name: string) {
    const path = [];

    const option = this.dyFormRef.optionMap.get(name);

    if (option.parent) {
      path.push(option.parent);
      const p = this._getControlPath(option.parent);
      path.push(...p);
    }
    return path.reverse();
  }

  private _getFormGroup(name: string): FormGroup {
    const path = this._getControlPath(name);
    // console.log(path);
    let control: FormGroup = null;

    path.forEach(value => {
      if (!control) {
        control = this.formArea.get(value) as FormGroup;
      } else {
        control = control.get(value) as FormGroup;
      }

      if (!control) {
        // this.formArea.addControl(value, new FormGroup({}));
        throw new Error(`表单模型定义错误:  无法找到${value}表单组`);
      }
    });

    return control;
  }

  private _removeControl(options: FormControlConfig) {
    const result = this._removeControlView(options);

    console.log(result, '_removeControl');

    const {controlName, group, parent, name} = options;

    if (group || !parent) {
      this.formArea.removeControl(controlName);
      return;
    }

    if (parent) {
      const formGroup = this._getFormGroup(name);

      formGroup.removeControl(controlName);
    }
  }

  private _updateRowIndexContext() {
    const viewContainer = this._formCellOutlet.viewContainer;

    const {containerCount} = this.dyFormRef;

    const attachContext = (viewRef: EmbeddedViewRef<{ childView: RecordControlItemViewTuple }>, count: number, renderIndex: number) => {
      const context = viewRef.context.childView;
      const labelContext = context.labelView.context;
      const controlContext = context.controlView.context;

      const {item} = context.record;

      const controlName = item.name;

      let _$implicit;

      if (item.parent) {
        const formGroup = this._getFormGroup(controlName);
        _$implicit = formGroup.get(controlName);
      } else {
        _$implicit = this.formArea.get(controlName);
      }

      const groupChildrenMap: { [key: string]: FormControlConfig } = {};

      let combineMode = false;

      // 如果是组合模式
      if (item.type === 'GROUP' && item?.groupMode === 'combine') {
        this.options
          .filter(value => value.parent === item.name)
          .forEach(value => groupChildrenMap[value.name] = value);

        combineMode = true;
      }

      const tempContext = {count, index: renderIndex, $implicit: _$implicit, config: this._recordControlUIDMap.get(item.uid)};

      Object.assign(labelContext, tempContext);
      Object.assign(controlContext, tempContext);
    };

    if (containerCount > 1) {
      const keys = Object.keys(this.areaOptions)
        .sort((a, b) => +a - +b)
        .map(value => +value);

      let renderIndex = 0;

      const count = this.options.length;

      keys.forEach(areaId => {
        const _viewContainer = DyFormAreaOutlet.mostRecentAreaOutlet[areaId].viewContainer;

        for (let i = 0, length = _viewContainer.length; i < length; i++, renderIndex++) {
          const viewRef = _viewContainer.get(i) as EmbeddedViewRef<{ childView: RecordControlItemViewTuple }>;

          attachContext(viewRef, count, renderIndex);
        }
      });
    } else {
      for (let renderIndex = 0, count = viewContainer.length; renderIndex < count; renderIndex++) {
        const viewRef = viewContainer.get(renderIndex) as EmbeddedViewRef<{ childView: RecordControlItemViewTuple }>;

        attachContext(viewRef, count, renderIndex);
      }
    }
  }

  private _applyChanges(changes: IterableChanges<FormControlConfig>) {
    this._controlUIDMap.clear();
    this.options.forEach(value => this._controlUIDMap.set(value.uid, value));


    changes.forEachOperation((record: IterableChangeRecord<FormControlConfig>,
                              previousIndex: number | null,
                              currentIndex: number | null) => {
      // 新增 | 修改
      if (record.previousIndex === null) {
        // console.log('新增 | 修改', record.item.name);
        this._addControl(record);

        if (!this._recordControlUIDMap.get(record.item.uid)) {
          this._renderCustomControl(record);
        }

        console.log('新增 | 修改');
      } else if (currentIndex === null) {
        // 删除
        console.log('删除', record.item.name, previousIndex, record.item.disabled, this._controlUIDMap.get(record.item.uid));
        if (!this._controlUIDMap.get(record.item.uid)) {
          this._removeControl(record.item);
        }
      } else {
        console.log('移动');
        // 移动 不需要处理
        // console.log('移动');
      }
    });

    this._updateRowIndexContext();

    Promise.resolve().then(() => {
      this._cdf.markForCheck();
      if (!this._dyFormInit) {
        this._dyFormInit = true;
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

  ngDoCheck(): void {
    /**
     * 通过表单配置注册迭代差异器
     */
    if (this._formOptionsDirty) {
      this._formOptionsDirty = false;

      try {
        this._optionDiffer = this._differs.find([]).create(trackByFn);
      } catch (e) {

      }
    }

    /**
     * 判断配置是否发生变化
     */
    if (this._optionDiffer) {
      const changes = this._optionDiffer.diff(this.options);

      if (changes) {
        if (this._columnDefsByName.size) {
          this._applyChanges(changes);
        } else {
          this._willRenderChanges = changes;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._formCellOutlet.viewContainer.clear();

    if (this._resizeEvent) {
      this._resizeEvent();
    }
    // this._noDataRowOutlet.viewContainer.clear();
    // this._headerRowOutlet.viewContainer.clear();
    // this._footerRowOutlet.viewContainer.clear();
  }

  ngAfterContentChecked(): void {
    this._cacheColumnDefs();

    if (this._columnDefsByName.size && this._willRenderChanges) {
      this._applyChanges(this._willRenderChanges);
      this._willRenderChanges = null;
    }

    if (this._footerRowDefChanged) {
      this._forceRenderHeaderRows();
      this._footerRowDefChanged = false;
    }

    if (this._headerRowDefChanged) {
      this._forceRenderFooterRows();
      this._headerRowDefChanged = false;
    }

    console.log('_cacheColumnDefs');
  }

  private _cacheColumnDefs() {
    const _headerRowDefs = mergeArrayAndSet(
      this._formHeaderDefs.toArray(), this._customHeaderDefs);

    // TODO 目前暂时通过长度变化 来渲染
    if (this._headerRowDefs.length !== _headerRowDefs.length) {
      this._forceRenderHeaderRows();
    }

    this._headerRowDefs = _headerRowDefs;

    const _footerRowDefs = mergeArrayAndSet(
      this._formFooterDefs.toArray(), this._customFooterDefs);

    // TODO 目前暂时通过长度变化 来渲染
    if (this._footerRowDefs.length !== _footerRowDefs.length) {
      this._forceRenderFooterRows();
    }

    this._footerRowDefs = _footerRowDefs;

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
