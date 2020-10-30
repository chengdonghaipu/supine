import {GroupRule, RuleFn, RuleType} from './type';


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

    return andRuleGroup;
  }

  private static parseGroupRule(groupRule: any[]) {

    return groupRule.map(value => {
      return value.map(rule => {
        const rules = [];

        if (rule.indexOf(':') > -1) {
          const [key, params] = rule.split(':').map(value1 => String(value1).trim());
          rules.push(key, params.split(',').map(value1 => String(value1).trim()));
        } else {
          rules.push(rule);
        }

        return rules;
      });
    });
  }

  private static parseStringRule(rule: string): GroupRule {
    const andRuleGroup = RuleParser.checkRule(rule);

    return RuleParser.parseGroupRule(andRuleGroup);
  }

  private static parseArrayRule(rule: string[] | RuleFn[] | Array<string | RuleFn>): GroupRule {
    if (rule.every(value => typeof value === 'string')) {
      return RuleParser.parseStringRule(rule.join('|'));
    } else if (rule.every(value => typeof value === 'function')) {
      return rule as RuleFn[];
    } else {
      throw Error(`Invalid rule`);
    }
  }

  private static parseRuleFnRule(rule: RuleFn) {
    return [rule];
  }


  static exportRule(rule: RuleType) {
    if (typeof rule === 'string') {
      return RuleParser.parseStringRule(rule);
    } else if (typeof rule === 'function') {
      return RuleParser.parseRuleFnRule(rule);
    } else if (Array.isArray(rule) && rule.every(value => typeof value === 'string')) {
      return RuleParser.parseArrayRule(rule);
    } else {
      throw Error(`Invalid rule`);
    }
  }
}

console.log(RuleParser.exportRule(['R1:A&R2:B&R3:C,F', 'R4:M,L,O', 'R5&R6', 'R7']));
console.log(1);
