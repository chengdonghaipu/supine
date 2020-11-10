import {async} from '@angular/core/testing';
import {Validator, ZlValidator} from './validator';

const data = {
  id: 100,
  child: {
    id: 100,
    f: 'm',
    m: {a: 'g'}
  },
  c: 'c'
};

describe('Validator', () => {
  beforeEach(async(() => {
  }));

  it(`验证字符串规则 'in:1,2,3'`, () => {
    const validator = new ZlValidator();

    validator
      .setRule({id: 'in:100,2,3'})
      .setTarget(data)
      .make(null);

    const message = validator.getMessage();

    expect(!!message.id).toBeTrue();
    expect(message.id).toEqual(['id 必须是 100,2,3 其中之一']);
  });

  it(`验证规则 [{in: [100, 1, 20]}]`, () => {
    const validator = new ZlValidator();

    validator
      .setRule({id: [{in: [100, 1, 20]}]})
      .setTarget(data)
      .make(null);

    const message = validator.getMessage();

    expect(!!message.id).toBeFalse();
  });

  it(`验证字符串规则 ['in:1,2,3']`, () => {
    const validator = new ZlValidator();

    validator
      .setRule({id: ['in:100,2,3']})
      .setTarget(data)
      .make(null);

    const message = validator.getMessage();

    expect(!!message.id).toBeTrue();
  });

  it(`嵌套验证 规则 ['in:1,2,3']`, () => {
    const validator = new ZlValidator();

    validator
      .setRule({'child.id': ['in:100,2,3']})
      .setTarget(data)
      .make();

    const message = validator.getMessage();

    expect(!!message['child.id']).toBeTrue();
  });
  it(`测试 required`, () => {
    const validator = new ZlValidator();

    validator
      .setRule({'child.aa': ['required&in:100,2,3']})
      .setTarget(data)
      .make();

    const message = validator.getMessage();

    expect(!!message['child.aa']).toBeTrue();
  });
  it(`嵌套校验`, () => {
    const validator = new ZlValidator();

    validator
      .setRule({'child.id': ['required&in:1003,2,3']})
      .setTarget(data)
      .setMessage({
        'child.id.in': 'required&in:1003,2,3'
      })
      .make();

    const message = validator.getMessage();
    console.log(message, 'message');
    expect(validator.fails()).toBeTrue();
  });
});
