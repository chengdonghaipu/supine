export class NotInRule {
  /**
   * 规则的名称.
   */
  protected rule = 'not_in';

  /**
   * 值.
   * @var array
   */
  protected values: Array<string>;

  constructor(value: Array<string>) {
    this.values = value;
  }

  /**
   * 将规则转换为验证字符串。
   */
  toString() {
    const values = this.values.map(value => {
      return '"' + value.replace('"', '""') + '"';
    });
    return this.rule + ':' + values.join(',');
  }
}
