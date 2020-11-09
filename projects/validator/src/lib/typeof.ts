export function isString(value) {
  return Object.prototype.toString.call(value) === '[object String]';
}

// 是否是数字
export function isNumber(value) {
  return Object.prototype.toString.call(value) === '[object Number]';
}

// 是否是布尔值
export function isBoolean(value) {
  return Object.prototype.toString.call(value) === '[object Boolean]';
}

// 是否undefined
export function isUndefined(value) {
  return Object.prototype.toString.call(value) === '[object Undefined]';
}

// 是否是null
export function isNull(value) {
  return Object.prototype.toString.call(value) === '[object Null]';
}

// 是否数组
export function isArray(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
}

// 是否是函数
export function isFunction(value) {
  return Object.prototype.toString.call(value) === '[object Function]';
}

// 是否是对象
export function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

// 是否是正则表达式
export function isRegExp(value) {
  return Object.prototype.toString.call(value) === '[object RegExp]';
}

// 是否是日期对象
export function isDate(value) {
  return Object.prototype.toString.call(value) === '[object Date]';
}

export function isFloat(value) {
  return isNumber(value) && value + '.0' !== value;
}

const ipv4Maybe = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
const ipv6Block = /^[0-9A-F]{1,4}$/i;

export function isIP(str, version = '') {
  version = String(version);
  if (!version) {
    return isIP(str, '4') || isIP(str, '6');
  } else if (version === '4') {
    if (!ipv4Maybe.test(str)) {
      return false;
    }
    const parts = str.split('.').sort((a, b) => a - b);
    return parts[3] <= 255;
  } else if (version === '6') {
    let addressAndZone = [str];

    if (str.includes('%')) {
      addressAndZone = str.split('%');
      if (addressAndZone.length !== 2) {
        return false;
      }
      if (!addressAndZone[0].includes(':')) {
        return false;
      }

      if (addressAndZone[1] === '') {
        // the second part must not be empty
        return false;
      }
    }

    const blocks = addressAndZone[0].split(':');
    let foundOmissionBlock = false; // marker to indicate ::
    const foundIPv4TransitionBlock = isIP(blocks[blocks.length - 1], '4');
    const expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;

    if (blocks.length > expectedNumberOfBlocks) {
      return false;
    }
    if (str === '::') {
      return true;
    } else if (str.substr(0, 2) === '::') {
      blocks.shift();
      blocks.shift();
      foundOmissionBlock = true;
    } else if (str.substr(str.length - 2) === '::') {
      blocks.pop();
      blocks.pop();
      foundOmissionBlock = true;
    }

    for (let i = 0; i < blocks.length; ++i) {
      if (blocks[i] === '' && i > 0 && i < blocks.length - 1) {
        if (foundOmissionBlock) {
          return false; // multiple :: in address
        }
        foundOmissionBlock = true;
      } else if (foundIPv4TransitionBlock && i === blocks.length - 1) {
      } else if (!ipv6Block.test(blocks[i])) {
        return false;
      }
    }
    if (foundOmissionBlock) {
      return blocks.length >= 1;
    }
    return blocks.length === expectedNumberOfBlocks;
  }
  return false;
}

export function isBaseStr(value: string, type: 32 | 58) {
  const base32 = /^[A-Z2-7]+=*$/;

  const base58Reg = /^[A-HJ-NP-Za-km-z1-9]*$/;

  if (type === 32) {
    return value.length % 8 === 0 && base32.test(value);
  } else if (type === 58) {
    return base58Reg.test(value);
  } else {
    return false;
  }
}


export function isBase64(str, urlSafe = false) {
  const notBase64 = /[^A-Z0-9+\/=]/i;
  const urlSafeBase64 = /^[A-Z0-9_\-]*$/i;

  const len = str.length;

  if (urlSafe) {
    return urlSafeBase64.test(str);
  }

  if (len % 4 !== 0 || notBase64.test(str)) {
    return false;
  }

  const firstPaddingChar = str.indexOf('=');
  return firstPaddingChar === -1 ||
    firstPaddingChar === len - 1 ||
    (firstPaddingChar === len - 2 && str[len - 1] === '=');
}


export function isHash(str, algorithm) {
  const lengths = {
    md5: 32,
    md4: 32,
    sha1: 40,
    sha256: 64,
    sha384: 96,
    sha512: 128,
    ripemd128: 32,
    ripemd160: 40,
    tiger128: 32,
    tiger160: 40,
    tiger192: 48,
    crc32: 8,
    crc32b: 8
  };

  const hash = new RegExp('^[a-fA-F0-9]{'.concat(lengths[algorithm], '}$'));
  return hash.test(str);
}

export function toDate(date) {
  date = isDate(date) ? +date : Date.parse(date);
  return !isNaN(date) ? new Date(date) : null;
}
