import {isArray, isString, trim} from 'lodash';

export class ValidationRuleParser {
  protected implicitAttributes: { [key: string]: any } = {};

  protected explodeRules(rules: { [key: string]: any }) {
    // console.log(rules);
    const ruleNameMap = {};
    for (const rulesKey in rules) {
      if (rulesKey.indexOf('*') > -1) {
        delete rules[rulesKey];
      } else {
        const temp = this.explodeExplicitRule(rules[rulesKey]);
        rules[rulesKey] = temp.rules;
        ruleNameMap[rulesKey] = temp.ruleNameMap;
      }
    }
    return {rules, ruleNameMap};
  }

  protected findBrackets(str: string) {
    const p = {};
    let j = 0;
    let result: Array<number[]> = [];
    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) === '(' || str.charAt(i) === ')') {
        j++;
        if (str.charAt(i) === '(') {
          p[j] = {'left': true, index: i};
        } else if (str.charAt(i) === ')') {
          p[j] = {'right': true, index: i};
          if (p[j - 1] && p[j - 1]['left'] && !p[j - 1]['read']) {
            p[j - 1]['read'] = true;
            result.push([p[j - 1]['index'], i]);
          } else if (p[j - 1]) {
            while (j - 1 > 0) {
              j--;
              if (j - 1 === 1 && !p[j - 1]['read']) {
                p[j - 1]['read'] = true;
                result.push([p[j - 1]['index'], i]);
                break;
              } else if (p[j - 1] && p[j - 1]['left'] && !p[j - 1]['read']) {
                p[j - 1]['read'] = true;
                result.push([p[j - 1]['index'], i]);
                break;
              }
            }
          }
        }
      }
    }
    result = result.sort((a, b) => a[0] - b[0]);
    const res: Array<number[]> = [];
    result.forEach((value, index) => {
      if (index === 0) {
        res.push(value);
      } else {
        let i = 0;
        while (i < result.length) {
          if (value[1] < result[i][1] && value[0] > result[i][0]) {
            i++;
            break;
          }
          i++;
          if (i === result.length) {
            res.push(value);
          }
        }
      }
    });
    return {
      res, result
    }
  }

  protected getRuleObj(value, _tempRules) {
    if (value.indexOf(':') > -1) {
      const [key, params] = value.split(':').map(value => trim(value));
      _tempRules[key] = params.split(',').map(value => trim(value));
    } else {
      _tempRules[value] = [];
    }
  }

  protected explodeExplicitRule(rule) {
    let _rules: string[] = [];
    // 获取规则名称的映射
    const _ruleNameMap = [];
    const _tempRules = {};
    if (isString(rule)) {
      // 判断是否存在括号
      const _reg1 = /\(|\)/g,
        // 检测规则合法性
        _checkLegal = /([a-zA-Z_]+[0-9]?)|([a-zA-Z_]+[0-9]?[:].*)/;
      if (_reg1.test(rule)) {
        throw Error('暂时不支持 括号的形式');
      }
      // 去空格
      const _rule = (<string>rule)
        .replace(/\s/g, '')
        .replace(/&{2,}|\|{2,}/g, () => {
          throw Error('只支持 | 或者 & 单独出现  不允许 ||... 或 &&...');
        });
      _rules = _rule.split(/\|/);
      const __rules = [];
      _rules.forEach(value => {
        if (/&/g.test(value)) {
          const tempRules = [];
          _ruleNameMap.push(
            value
              .split(/&/)
              .filter(value1 => {
                if (!_checkLegal.test(value1)) {
                  console.warn(`该规则 ${value1} 不合法 该规则将会被忽略!`);
                  return false;
                }
                tempRules.push(value1);
                return true;
              }).map(value1 => value1.replace(/[:].*/g, '')));
          if (tempRules.length) {
            __rules.push(tempRules);
          }
        } else {
          if (!_checkLegal.test(value)) {
            console.warn(`该规则 ${value} 不合法 该规则将会被忽略!`);
            return;
          }
          __rules.push(value);
          _ruleNameMap.push(value.replace(/[:].*/g, ''));
        }
      });
      _rules = __rules;
    } else if (isArray(rule)) {
      _rules = rule;
    }
    _rules.forEach(value => {
      if (isArray(value)) {
        value.forEach(val => this.getRuleObj(val, _tempRules));
      } else {
        this.getRuleObj(value, _tempRules)
      }
    });
    return {
      ruleNameMap: _ruleNameMap,
      rules: _tempRules
    }
  }

  explode(rules: { [key: string]: any }) {
    this.implicitAttributes = {};

    const _rules = this.explodeRules(rules);
    return {
      rules: _rules.rules,
      ruleNameMap: _rules.ruleNameMap,
      implicitAttributes: this.implicitAttributes
    };
  }
}
