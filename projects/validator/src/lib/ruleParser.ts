import {RuleFn} from './type';


export class RuleParser {
  private static checkRule(rule: string) {
    if (/\(|\)/g.test(rule)) {
      throw Error('暂时不支持 括号的形式');
    }

    const checkLegal = /([a-zA-Z_]+[0-9]?)|([a-zA-Z_]+[0-9]?[:].*)/;
    // 去空格
    rule = rule.replace(/\s/g, '')
      .replace(/&{2,}|\|{2,}/g, () => {
        throw Error('只支持 | 或者 & 单独出现  不允许 ||... 或 &&...');
      });

    // 分组
    const rules = rule.split(/\|/);

    const andRuleGroup: string[][] = [];

    rules.forEach(value => {
      if (/&/g.test(value)) {
        const tempRules = value
          .split(/&/)
          .filter(value1 => {
            if (!checkLegal.test(value1)) {
              console.warn(`该规则 ${value1} 不合法 该规则将会被忽略!`);
              return false;
            }
            return true;
          })/*.map(value1 => value1.replace(/[:].*!/g, ''))*/;
        if (tempRules.length) {
          andRuleGroup.push(tempRules);
        }
      } else if (!checkLegal.test(value)) {
        console.warn(`该规则 ${value} 不合法 该规则将会被忽略!`);
        return;
      } else {
        andRuleGroup.push([value]);
      }
    });

    andRuleGroup.forEach(value => {
    });
  }

  private static parseStringRule(rule: string) {
  }

  private static parseArrayRule(rule: string[] | RuleFn[] | Array<string | RuleFn>) {
  }

  private static parseRuleFnRule(rule: RuleFn) {
  }


  static exportRule(rule: string | string[] | RuleFn | RuleFn[] | Array<string | RuleFn>) {
    if (rule instanceof String) {
      return RuleParser.parseStringRule(rule as string);
    } else if (rule instanceof Function) {
      return RuleParser.parseRuleFnRule(rule);
    } else if (rule instanceof Array && rule.every(value => (value instanceof Function) || (typeof value === 'string'))) {
      return RuleParser.parseArrayRule(rule);
    } else {
      throw Error(`Invalid rule`);
    }
  }
}

RuleParser.exportRule(['in', (value, ta) => true]);
