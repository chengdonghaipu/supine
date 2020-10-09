import {InRule} from './in-rule';
import {NotInRule} from './not-in-rule';

export class Rule {
  /**
   * 获取约束构建器实例。
   * @param value
   * @returns InRule
   */
  public static in(value) {
    return new InRule(
      Array.isArray(value) ? value : Array.prototype.slice.apply(arguments)
    );
  }

  /**
   * 获取约束构建器实例
   * @param value
   * @returns NotInRule
   */
  public static notIn(value) {
    return new NotInRule(
      Array.isArray(value) ? value : Array.prototype.slice.apply(arguments)
    );
  }
}
