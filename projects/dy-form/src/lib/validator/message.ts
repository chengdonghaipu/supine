import {isArray, merge, toString} from 'lodash';

export class CdMessage {
  // 所有已注册的消息。
  protected messages: { [key: string]: string[] } = {};

  // 消息输出的默认格式。
  protected format = ':message';

  constructor() {}

  // 获取消息的key
  keys(): string[] {
    return Object.keys(this.messages);
  }

  // 添加一条消息。
  add(key: string, messages: string): this {
    if (!isArray(this.messages[key])) {
      this.messages[key] = [];
    }
    this.messages[key].push(messages);
    return this;
  }

  isUnique(key: string): boolean {
    return !this.messages[key];
  }

  // 合并信息
  merge(messages: { [key: string]: string[] }): this {
    this.messages = merge(this.messages, messages);
    return this;
  }

  first(key: string) {
    return this.isUnique(key) ? '' : this.messages[key][0];
  }

  get(key: string): string[] {
    if (this.keys().indexOf(key) > -1) {
      return this.messages[key];
    }
    return [];
  }

  getMessages() {
    return this.messages;
  }

  count(): number {
    return Object.keys(this.messages).length;
  }

  any(): boolean {
    return this.count() > 0;
  }

  isNotEmpty(): boolean {
    return !this.isEmpty();
  }

  isEmpty(): boolean {
    return !this.any();
  }

  toString(): string {
    return toString(this.messages);
  }

  clear() {
    this.messages = {};
  }
}
