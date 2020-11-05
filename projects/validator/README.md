# 验证器
- 安装
```shell script
# npm
npm install @supine/validator
# yarn
yarn add @supine/validator
```
- 简单使用
```js
import {ZlValidator} from '@supine/validator';

const validator = new ZlValidator();
    // 被验证的数据
    const data = {id: '100'};
    validator
      .setRule({id: 'in:100,2,3'}) // 设置校验规则
      .setTarget(data) // 设置被校验的数据
      .make();
    // 判断验证是否通过
    if (validator.fails()) {
      // 获取错误信息
      console.log(v.getMessages());
    }
```
- 支持的规则书写形式
  - 字符串数组
  ```js
    // 相当于max||min 满足其中之一即可
    validator.setRule({id: ['max:30', 'min:10']})
  ```
  - 字符串
  ```js
    // &意味着 两个条件必须同时满足
    validator.setRule({id: 'max:30&in:20,10'})
  ```
  - 函数
  ```js
    function max(value, targetMap: TargetMap): boolean {/**/}
    validator.setRule({id: max})
  ```
  - 函数数组
  ```js
    function max(value, targetMap: TargetMap): boolean {/**/}
    function min(value, targetMap: TargetMap): boolean {/**/}
    // 相当于max||min 满足其中之一即可
    validator.setRule({id: [max, min]})
  ```
  - 对象
  ```js
    function max(value, targetMap: TargetMap): boolean {/**/}
    // 两个条件必须同时满足
    // in和max均为规则名称 max使用了自定义校验 将不会使用内置max校验规则
    // [10, 14, 15, 16] 为规则参数
    validator.setRule({id: {in: [10, 14, 15, 16], max}})
  ```
  - 对象数组
  ```js
    function max(value, targetMap: TargetMap): boolean {/**/}
    // 数组组的对象中的所有规则必须同时满足
    // in和max均为规则名称 max使用了自定义校验 将不会使用内置max校验规则
    // [10, 14, 15, 16] 为规则参数
    validator.setRule({id: [{in: [10, 14, 15, 16], max}]})
  ```
- 批量验证

```js
import {ZlValidator} from '@supine/validator';

const validator = new ZlValidator();
    // 被验证的数据
    const data = {id: '100'};
    validator
      .batch(true) // 将会对所有的规则都会进行校验 即便已经知道验证结果了
      .setRule({id: 'in:100,2,3&max:20&min:10'}) // 设置校验规则
      .setTarget(data) // 设置被校验的数据
      .make();
    // 判断验证是否通过
    if (validator.fails()) {
      // 获取错误信息
      console.log(v.getMessages());
    }
```

- 嵌套验证

```js
import {ZlValidator} from '@supine/validator';

const validator = new ZlValidator();
    // 被验证的数据
    const data = {id: '100', child: {id: '300'}};
    validator
      .setRule({'child.id': 'in:100,2,3'}) // 设置校验规则
      .setTarget(data) // 设置被校验的数据
      .make();
    // 判断验证是否通过
    if (validator.fails()) {
      // 获取错误信息
      console.log(v.getMessages());
    }
```
- 自定义验证信息

```js
import {ZlValidator} from '@supine/validator';

const validator = new ZlValidator();
    // 被验证的数据
    const data = {id: '100', child: {id: '300'}};
    validator
      .setRule({'child.id': 'in:100,2,3'}) // 设置校验规则
      .setTarget(data) // 设置被校验的数据
      .setMessage({'id.in': 'id 必须为100,2,3其中之一'})
      .make();
    // 判断验证是否通过
    if (validator.fails()) {
      // 获取错误信息
      console.log(v.getMessages());
    }
```

- 内置校验规则

|  规则名称   | 参数  | 描述 |
|  ----  | ----  | ---- |
| **required**  | 无 | 字段是必填的 |
| **array**  | 无 | 只允许为数组类型 |
| **number**  | 无 | 只允许为数字类型 |
| **boolean**  | 无 | 必须为boolean类型 |
| **booleanString**  | 无 | 必须为 'true' || 'false' |
| **string**  | 无 | 只允许为字符串 |
| **numeric**  | 无 | 只允许是数字 可以是字符串数字 |
| **date**  | 无 | 必须是 Date类型 |
| **float**  | 无 | 验证的字段必须完全是浮点数 |
| **integer**  | 无 | 整型 |
| **safeInteger**  | 无 | safeInteger |
| **base32**  | 无 | 必须符合 base32 规则 |
| **base58**  | 无 | 必须符合 base58 规则 |
| **base64**  | 无 | 必须符合 base64 规则 |
| **base64UrlSafe**  | 无 | 必须符合 base64UrlSafe 规则 |
| **ipV4**  | 无 | 必须符合 IPV4 规则 |
| **ipV6**  | 无 | 必须符合 ipV6 规则 |
| **chs**  | 无 | 只允许汉字 |
| **chsAlpha**  | 无 | 只允许汉字、字母 |
| **chsAlphaNum**  | 无 | 验证的字段必须完全是汉字、字母和数字。 |
| **email**  | 无 | 验证的字段必须是邮箱 |
| **phoneNum**  | 无 | 验证的字段必须是手机号码 |
| **chsDash**  | 无 | 只允许汉字、字母、数字和下划线_及破折号- |
| **alphaDash**  | 无 | 验证的字段可能具有字母、数字、破折号- 以及下划线 _  |
| **alpha**  | 无 | 验证的字段必须完全是字母的字符 |
| **alphaNum**  | 无 | 只包含字母、数字 |
| **telNumber**  | 无 | 验证的字段必须是电话号码 |
| **ascii**  | 无 | 验证是否符合ascii |
| **fullWidth**  | 无 | 检查字符串是否包含全角字符 |
| **halfWidth**  | 无 | 检查字符串是否包含半角字符 |
| **hexadecimal**  | 无 | 检查字符串是否为十六进制数字 |
| **hexColor**  | 无 | 检查字符串是否为十六进制颜色 |
| **hsl**  | 无 | 检查字符串是否为HSL |
| **contains**  | 一个参数['contains:hello'] | 包含 hello字符串片段 |
| **notContains**  | 一个参数['notContains:hello'] | 不包含 hello字符串片段 |
| **hash**  | 一个参数['hash:md5'] 支持的hash有['md5', 'md4', 'sha1', 'sha256', 'sha384', 'sha512', 'ripemd128','ripemd160', 'tiger128', 'tiger160', 'tiger192', 'crc32', 'crc32b'] | 验证符合md5格式hash |
| **in**  | 多个参数['in:10,15,16,17'] | 验证值要在10,15,16,17之中 |
| **notIn**  | 多个参数['in:10,15,16,17'] | 验证值不能在10,15,16,17之中 |
| **max**  | 一个参数['max:10'] | 验证一个数字最大只能为10 |
| **min**  | 一个参数['min:10'] | 验证一个数字最小只能为10 |
| **same**  | 一个参数['same:other'] | 被验证字段对应的值需要跟other字段对应的值相同 |
| **equal**  | 一个参数['equal:12'] | 被验证字段对应的值需要等于12 |
| **after**  | 一个参数['after:2020-10-10'] | 被验证字段对应的值必须是 2020-10-10 之后的一个日期 |
| **afterOrEqual**  | 一个参数['afterOrEqual:2020-10-10'] | 被验证字段对应的值必须是 2020-10-10 之后或者相同的一个日期 |
| **before**  | 一个参数['before:2020-10-10'] | 被验证字段对应的值必须是 2020-10-10 之前的一个日期 |
| **beforeOrEqual**  | 一个参数['beforeOrEqual:2020-10-10'] | 被验证字段对应的值必须是 2020-10-10 之前或者相同的一个日期 |

- 单独使用内置规则

```typescript
import {ValidatorRule} from '@supine/validator';

ValidatorRule.base64('hfk')
```

# 自定义验证规则
- 自定义规则
```typescript
import {ZlValidator, DefaultMessage, Rule} from '@supine/validator';
export class XXValidatorRule {
  // 验证规则默认提示信息
  @DefaultMessage()
  defaultMessage(filedName: string, ruleName: string, params, value): string {
    if (!params) {
      params = [];
    }
    const typeMsg = {
      array: `${filedName} 必须是数组`,
      required: `${filedName} 字段是必须的`,
    };

    return typeMsg[ruleName];
  }

  /**
  * @param value 被验证的数据 不用担心是怎么传过来的 因为这个是验证器做的事
  * @param {string[]} rule 验证的规则 不用担心是怎么传过来的 因为这个是验证器做的事
  * @param {Map<string, any>} dataMap 解析后数据 可以根据属性名获取对应的数据
  * @returns {string} 返回值可以为string 或者 boolean 当为 string 时
  * 自动将返回值作为自定义错误信息提示 如果验证失败请返回失败原因(字符串) 如果验证通过 请返回空字符''
  * 当为 boolean 时 为true说明验证失败 为false说明验证通过
  * 方法名hello 为验证规则的名称  后面可以跟参数 比如 hello:otherField
  * 装饰器 @Rule() 告诉验证 该方法为验证规则  如果没有声明该装饰器的方法  将不会拓展该规则
  * 例子: 实现hello规则 当otherField的值为hello 该规则才通过 否则失败
  */
  @Rule()
  required(value, params, targetMap: TargetMap) {
    CheckParamNotException('required', params);
    return value === null || value === '' || (isArray(value) && !value.length) ||
      (isObject(value) && !Object.keys(value).length);
  }

  /**
   * 只允许为数组类型
   * @param value
   * @param params
   */
  @Rule()
  array(value, params, targetMap: TargetMap) {
    CheckParamNotException('array', params);
    return !Array.isArray(value);
  }
}
```

- 注册自定义规则

```typescript
import {ZlValidator, ValidatorRule} from '@supine/validator';
import {XXValidatorRule} from './XXValidatorRule'
/**
 * ValidatorRule 内置的验证规则  如有需要可以加进来
 * XXValidatorRule 就是上面自定义的 规则
 */
@Validator({
  rules: [ValidatorRule, XXValidatorRule]
})
class XXValidator extends ZlValidator {
  
}
```
