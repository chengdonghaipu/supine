# 验证器

- 简单使用
```js
import {JdValidator} from '@supine/validator';

const v = new JdValidator();
    // 验证规则
    const rules = {
      a: ['required', 'in:12,13'] // 或者 'required&in:12,13'
    };
    // 被验证的数据
    const data = {a: 'kl'};
    v.make(rules, data);
    if (v.fails()) {
      // 获取错误信息
      console.log(v.getMessages()); // a 必须在 12,13 范围内
    }
```
- 批量验证

```js
import {JdValidator} from '@supine/dy-form';

const v = new JdValidator();
    // 验证规则
    const rules = {
      a: ['required', 'in:12'] // 或者 'required&in:12'
    };
    // 被验证的数据
    const data = {a: '121'};
    // 批量验证  默认为false
    v.batch(true).make(rules, data);
    if (v.fails()) {
      // 获取错误信息
      console.log(v.getMessages());
    }
```
- 自定义验证信息

```js
import {JdValidator} from '@supine/dy-form';

const v = new JdValidator();
    // 验证规则
    const rules = {
      a: ['required', 'in:12, 13'] // 或者 'required&in:12,13'
    };
    // 被验证的数据
    const data = {a: '121'};
    // 批量验证  默认为false
    v.batch(true).make(rules, data,
     // 自定义验证规则信息提示
     {
      'a.required': '字段a是必填的',
      'a.in': '字段a只能是12,13中的一个值'
    });
    if (v.fails()) {
      // 获取错误信息
      console.log(v.getMessages());
    }
```
- 嵌套验证

```js
import {JdValidator} from '@supine/dy-form';

const v = new JdValidator();
    // 验证规则
    const rules = {
      'a.b': ['required', 'in:12, 13'] // 或者 'required&in:12,13'
    };
    // 被验证的数据
    const data = {a: {
      b: '123'
    }};
    // 批量验证  默认为false
    v.batch(true).make(rules, data,
     // 自定义验证规则
     {
      'a.b.required': '字段a.b是必填的',
      'a.b.in': '字段a.b只能是12,13中的一个值'
    });
    if (v.fails()) {
      // 获取错误信息
      console.log(v.getMessages());
    }
```
- Validator 根验证器
  
  Validator没有任何内置的验证规则  可以基于Validator来拓展自定义规则
  
  JdValidator就是基于Validator拓展而来的
  
  - API
    ```
    // 批量验证
    batch(isBatch: boolean = false): this
    // 验证
    make(rules?: { [key: string]: any },
                data?: { [key: string]: any },
                messages?: { [key: string]: any }): boolean
                
    // 设置规则(会重置规则)
    setRules(rules): this
    // 增加规则(不会重置规则)
    addRules(rules): this
    // 判断规则是否已经存在
    hasRule(ruleName: string): boolean
    // 清空所有错误信息
    clearMsg(): this
    // 获取错误信息
    getMessages(): { [key: string]: string[] }
    // 判断是否验证通过 false为验证通过 true为失败
    fails(): boolean
    // 新增错误信息
    addMsg(key: string, _msg: string)
    // 添加验证后回调。
    registerAfterF(callback: (that: this) => void)
    ```
- 添加验证后回调钩子
  ```js
     const v = new JdValidator();
     
         v.registerAfterF(that => {
           // 一些操作...  比如在一条件下添加错误信息  或者清除错误信息
         });
  ```
- 自定义验证规则

 ```js
     import {AfterF, JdValidator, Registered, RuleF, TypeMsg, Validator, ValidatorF} from '@supine/dy-form';
     import {ValidatorFs} from './validator-fs';
     
     @Registered({
       // 如果希望使用内置校验规则 可以将内置规则也放到这 ValidatorF
       declarations: [ValidatorFs, ValidatorF] // 自定义验证规则(批量)
     })
     // 如果希望使用内置规则 可以 继承 JdValidator 或者在 @Registered 的 declarations 里添加 ValidatorF
     // 如果不希望使用内置规则 那么 继承 Validator(根验证器)
     export class Validators extends Validator {
       // 也可以在这里添加验证规则 验证后的回调钩子 默认的错误信息提示
       // 验证规则和默认的错误信息使用跟在ValidatorFs中的使用是一模一样的
       // 验证规则默认提示信息
       // 不推荐使用
       @TypeMsg()
       typeMsg = {
         accepted: ':attribute 必须是yes、on或者1或者true',  // :attribute  是占位符  将会用被验证的属性名替代
       };
     
       @RuleF()
       hello(value: any, rule: string[], dataMap: Map<string, any>): string {
         if (!rule[0]) { // 获取参数
           // 如果不存在参数  那么说明规则使用错误  可以报错提示!
         }
         // 获取参数字段的值
         const otherFieldValue = dataMap.get(rule[0]);
         return otherFieldValue === 'hello' ? '' : '错误原因...';
       }
     }
  ```
   - ValidatorFs.ts 代码
   ```js
     //  ValidatorFs.ts 代码
     import {RuleF, TypeMsg} from '@supine/dy-form';
     
     export class ValidatorFs {
       // 验证规则默认提示信息
       // 不推荐使用
       @TypeMsg()
       typeMsg = {
         accepted: ':attribute 必须是yes、on或者1或者true',  // :attribute  是占位符  将会用被验证的属性名替代
       };
     
       /**
        * @param value 被验证的数据 不用担心是怎么传过来的 因为这个是验证器做的事
        * @param {string[]} rule 验证的规则 不用担心是怎么传过来的 因为这个是验证器做的事
        * @param {Map<string, any>} dataMap 解析后数据 可以根据属性名获取对应的数据
        * @returns {string} 返回值可以为string 或者 boolean 当为 string 时
        * 自动将返回值作为自定义错误信息提示 如果验证失败请返回失败原因(字符串) 如果验证通过 请返回空字符''
        * 当为 boolean 时 为true说明验证失败 为false说明验证通过
        * 方法名hello 为验证规则的名称  后面可以跟参数 比如 hello:otherField
        * 装饰器 @RuleF() 告诉验证 该方法为验证规则  如果没有声明该装饰器的方法  将不会拓展该规则
        * 例子: 实现hello规则 当otherField的值为hello 该规则才通过 否则失败
        */
       @RuleF()
       hello(value: any, rule: string[], dataMap: Map<string, any>): string {
         if (!rule[0]) { // 获取参数
           // 如果不存在参数  那么说明规则使用错误  可以报错提示!
         }
         // 获取参数字段的值
         const otherFieldValue = dataMap.get(rule[0]);
         return otherFieldValue === 'hello' ? '' : '错误原因...';
       }
     }
   ```
- JdValidator 内置的验证规则

    - required ()
      ```
      参数: 无
      使用: required
      ```
    - requiredWith (只要在指定的其他字段中有任意一个字段存在时，被验证的字段就必须存在并且不能为空)
      ```
      参数: filed1,filed2...
      使用: requiredWith: filed1,filed2...
      ```
    - requiredWithAll (只有当所有的其他指定字段全部存在时，被验证的字段才必须存在并且不能为空)
      ```
      参数: filed1,filed2...
      使用: requiredWithAll: filed1,filed2...
      ```
    - requiredWithout (只要在其他指定的字段中有任意一个字段不存在，被验证的字段就必须存在且不为空)
      ```
      参数: filed1,filed2...
      使用: requiredWithout: filed1,filed2...
      ```
    - requiredWithoutAll (只有当所有的其他指定的字段都不存在时，被验证的字段才必须存在且不为空)
      ```
      参数: filed1,filed2...
      使用: requiredWithoutAll: filed1,filed2...
      ```
    - requiredIf (如果指定的其它字段（ filed1 ）等于任何一个 value 时，被验证的字段必须存在且不为空)
      ```
      参数: filed1,value1...
      使用: requiredIf: filed1,value1...
      ```
    - requiredUnless (如果指定的其它字段（ filed ）等于任何一个 value 时，被验证的字段不必存在)
      ```
      参数: filed1,value1...
      使用: requiredUnless: filed1,value1...
      ```
    - filled (验证的字段在存在时不能为空)
      ```
      参数: 无
      使用: filled
      ```
    - accepted (验证的字段必须为 yes、 on、 1、或 true。这在确认「服务条款」是否同意时相当有用)
      ```
      参数: 无
      使用: accepted
      ```
    - present (验证的字段必须存在于输入数据中，但可以为空)
      ```
      参数: 无
      使用: present
      ```
    - confirmed (验证的字段必须和 filed 的字段值一致。例如，如果要验证的字段是 password，输入中必须存在匹配的 filed 字段)
      ```
      参数: filed
      使用: confirmed: filed
      ```
    - same (给定字段必须与验证的字段匹配)
      ```
      参数: filed
      使用: same: filed
      ```
    - different (验证的字段值必须与字段 (field) 的值不同)
      ```
      参数: filed
      使用: different: filed
      ```
    - before (验证的字段必须是给定日期之前的值)
      ```
      参数: filed
      使用: before: filed
      ```
    - after (验证的字段必须是给定日期之后的值)
      ```
      参数: filed
      使用: after: filed
      ```
    - beforeOrEqual (验证的字段必须是给定日期之前或等于之前的值)
      ```
      参数: filed
      使用: beforeOrEqual: filed
      ```
    - afterOrEqual (验证的字段必须是给定日期之后或等于之后的值)
      ```
      参数: filed
      使用: afterOrEqual: filed
      ```
    - dateEqual (验证的字段必须等于给定的日期)
      ```
      参数: filed
      使用: dateEqual: filed
      ```
    - dateFormat (验证的字段必须与给定的格式相匹配)
      ```
      参数: filed
      使用: dateFormat: filed
      ```
    - gt (验证的字段的值大于other字段值)
      ```
      参数: filed
      使用: gt: filed
      ```
    - lt (验证的字段的值小于other字段值)
      ```
      参数: filed
      使用: lt: filed
      ```
    - gte (验证的字段的值大于等于other字段值)
      ```
      参数: value
      使用: gte: value
      ```
    - lte (验证的字段的值小于等于other字段值)
      ```
      参数: value
      使用: lte: value
      ```
    - min (验证中的字段必须具有最小值。字符串、数字、数组的计算方式都用 size 方法进行评估)
      ```
      参数: value
      使用: min: value
      ```
    - max (验证中的字段必须小于或等于 value。字符串、数字、数组的计算方式都用 size 方法进行评估)
      ```
      参数: value
      使用: max: value
      ```
    - minLength (验证中的字段必须具有最小长度。字符串、数字(会转换为字符串计算)、数组的计算方式都用 size 方法进行评估)
      ```
      参数: value
      使用: maxLength: value
      ```
    - maxLength (验证中的字段必须满足最大长度 字符串、数字(会转换为字符串计算)、数组的计算方式都用 size 方法进行评估)
      ```
      参数: value
      使用: maxLength: value
      ```
    - between (验证的字段的大小必须在给定的 min 和 max 之间。字符串、数字、数组的计算方式都用 size 方法进行评估)
      ```
      参数: min,max
      使用: between: min,max
      ```
    - size (验证的字段必须具有与给定值匹配的大小。对于字符串来说，value 对应于字符数。对于数字来说，value 对应于给定的整数值 对于数组来说， size 对应的是数组的 count 值)
      ```
      参数: value
      使用: size: value
      ```
    - numeric (数字)
      ```
      参数: 无
      使用: numeric
      ```
    - integer (整型)
      ```
      参数: 无
      使用: integer
      ```
    - array (数组)
      ```
      参数: 无
      使用: array
      ```
    - in (验证的字段必须包含在给定的值列表中)
      ```
      参数: value1,value2...
      使用: in: value1,value2...
      ```
    - notIn (验证的字段不能包含在给定的值列表中)
      ```
      参数: value1,value2...
      使用: notIn: value1,value2...
      ```
    - alpha (验证的字段必须完全是字母的字符)
      ```
      参数: 无
      使用: alpha
      ```
    - alphaDash (验证的字段可能具有字母、数字、破折号(-) 以及下划线(_)
      ```
      参数: 无
      使用: alphaDash
      ```
    - alphaNum (只包含字母、数字)
      ```
      参数: 无
      使用: alphaNum
      ```
    - chsDash (只允许汉字、字母、数字和下划线_及破折号-)
      ```
      参数: 无
      使用: chsDash
      ```
    - chs (只允许汉字)
      ```
      参数: 无
      使用: chs
      ```
    - chsAlpha (只允许汉字、字母)
      ```
      参数: 无
      使用: chsAlpha
      ```
    - chsAlphaNum (验证的字段必须完全是汉字、字母和数字)
      ```
      参数: 无
      使用: chsAlphaNum
      ```
    - email (验证的字段必须是邮箱)
      ```
      参数: 无
      使用: email
      ```
    - float (验证的字段必须完全是浮点数)
      ```
      参数: 无
      使用: float
      ```
    - phoneNum (验证的字段必须是手机号码)
      ```
      参数: 无
      使用: phoneNum
      ```
    - telNumber (验证的字段必须是电话号码)
      ```
      参数: 无
      使用: telNumber
      ```
    - regex (验证的字段必须与给定的正则表达式匹配 注意： 当使用 regex 规则时，你必须使用数组，而不是使用 | 分隔符，特别是如果正则表达式包含 | 字符)
      ```
      参数: reg
      使用: requiredWith: reg
      ```
