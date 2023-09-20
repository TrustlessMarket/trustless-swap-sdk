import { Interface, defaultAbiCoder } from '@ethersproject/abi';
import JSBI from 'jsbi';
import { BigNumber, ethers } from 'ethers';
import { getAddress, getCreate2Address } from '@ethersproject/address';
import invariant from 'tiny-invariant';
import _Decimal from 'decimal.js-light';
import _Big from 'big.js';
import toFormat from 'toformat';
import { pack, keccak256 } from '@ethersproject/solidity';
import bn from 'bignumber.js';
import { isEmpty, random } from 'lodash-es';
import camelCase from 'lodash-es/camelCase';
import axios from 'axios';

function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return e;
  };
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function (t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function (t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw new Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(typeof e + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function (e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function () {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function (e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw new Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function (t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function (t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    catch: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function (e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

var _TICK_SPACINGS;
var TradeType;
(function (TradeType) {
  TradeType[TradeType["EXACT_INPUT"] = 0] = "EXACT_INPUT";
  TradeType[TradeType["EXACT_OUTPUT"] = 1] = "EXACT_OUTPUT";
})(TradeType || (TradeType = {}));
var Rounding;
(function (Rounding) {
  Rounding[Rounding["ROUND_DOWN"] = 0] = "ROUND_DOWN";
  Rounding[Rounding["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
  Rounding[Rounding["ROUND_UP"] = 2] = "ROUND_UP";
})(Rounding || (Rounding = {}));
var MaxUint256 = /*#__PURE__*/JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
var MaxUint128 = /*#__PURE__*/BigNumber.from(2).pow(128).sub(1);
var FeeAmount;
(function (FeeAmount) {
  FeeAmount[FeeAmount["LOWEST"] = 100] = "LOWEST";
  FeeAmount[FeeAmount["LOW"] = 500] = "LOW";
  FeeAmount[FeeAmount["MEDIUM"] = 3000] = "MEDIUM";
  FeeAmount[FeeAmount["HIGH"] = 10000] = "HIGH";
})(FeeAmount || (FeeAmount = {}));
/**
 * The default factory tick spacings by fee amount.
 */
var TICK_SPACINGS = (_TICK_SPACINGS = {}, _TICK_SPACINGS[FeeAmount.LOWEST] = 1, _TICK_SPACINGS[FeeAmount.LOW] = 10, _TICK_SPACINGS[FeeAmount.MEDIUM] = 60, _TICK_SPACINGS[FeeAmount.HIGH] = 200, _TICK_SPACINGS);
var ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
var POOL_INIT_CODE_HASH = '0x04759a882be3a45ff74719de5c82516d29af4b3480d076fc0c57b2fdab813bc7';
var FACTORY_ADDRESS = '0x9D921bF7460d1FcfF77d88edd4D34cD1e2F56BDc';
// ABI's
// ABI's
var ERC20_ABI = [
// Read-Only Functions
'function balanceOf(address owner) view returns (uint256)', 'function decimals() view returns (uint8)', 'function symbol() view returns (string)', 'function allowance(address owner, address spender) external view returns (uint256)',
// Authenticated Functions
'function transfer(address to, uint amount) returns (bool)', 'function approve(address _spender, uint256 _value) returns (bool)',
// Events
'event Transfer(address indexed from, address indexed to, uint amount)'];
var WETH_ABI = [
// Wrap ETH
'function deposit() payable',
// Unwrap ETH
'function withdraw(uint wad) public'];
var NONFUNGIBLE_POSITION_MANAGER_ABI = [
// Read-Only Functions
'function balanceOf(address _owner) view returns (uint256)', 'function tokenOfOwnerByIndex(address _owner, uint256 _index) view returns (uint256)', 'function tokenURI(uint256 tokenId) view returns (string memory)', 'function positions(uint256 tokenId) external view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)'];
// Transactions
var MAX_FEE_PER_GAS = 100000000000;
var MAX_PRIORITY_FEE_PER_GAS = 100000000000;
var TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 2000;

/**
 * Validates an address and returns the parsed (checksummed) version of that address
 * @param address the unchecksummed hex address
 */
function validateAndParseAddress(address) {
  try {
    return getAddress(address);
  } catch (error) {
    throw new Error(address + " is not a valid address.");
  }
}
// Checks a string starts with 0x, is 42 characters long and contains only hex characters after 0x
var startsWith0xLen42HexRegex = /^0x[0-9a-fA-F]{40}$/;
/**
 * Checks if an address is valid by checking 0x prefix, length === 42 and hex encoding.
 * @param address the unchecksummed hex address
 */
function checkValidAddress(address) {
  if (startsWith0xLen42HexRegex.test(address)) {
    return address;
  }
  throw new Error(address + " is not a valid address.");
}

var _toSignificantRoundin, _toFixedRounding;
var Decimal = /*#__PURE__*/toFormat(_Decimal);
var Big = /*#__PURE__*/toFormat(_Big);
var toSignificantRounding = (_toSignificantRoundin = {}, _toSignificantRoundin[Rounding.ROUND_DOWN] = Decimal.ROUND_DOWN, _toSignificantRoundin[Rounding.ROUND_HALF_UP] = Decimal.ROUND_HALF_UP, _toSignificantRoundin[Rounding.ROUND_UP] = Decimal.ROUND_UP, _toSignificantRoundin);
var toFixedRounding = (_toFixedRounding = {}, _toFixedRounding[Rounding.ROUND_DOWN] = 0, _toFixedRounding[Rounding.ROUND_HALF_UP] = 1, _toFixedRounding[Rounding.ROUND_UP] = 3, _toFixedRounding);
var Fraction = /*#__PURE__*/function () {
  function Fraction(numerator, denominator) {
    if (denominator === void 0) {
      denominator = JSBI.BigInt(1);
    }
    this.numerator = JSBI.BigInt(numerator);
    this.denominator = JSBI.BigInt(denominator);
  }
  Fraction.tryParseFraction = function tryParseFraction(fractionish) {
    if (fractionish instanceof JSBI || typeof fractionish === 'number' || typeof fractionish === 'string') return new Fraction(fractionish);
    if ('numerator' in fractionish && 'denominator' in fractionish) return fractionish;
    throw new Error('Could not parse fraction');
  }
  // performs floor division
  ;
  var _proto = Fraction.prototype;
  _proto.invert = function invert() {
    return new Fraction(this.denominator, this.numerator);
  };
  _proto.add = function add(other) {
    var otherParsed = Fraction.tryParseFraction(other);
    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.add(this.numerator, otherParsed.numerator), this.denominator);
    }
    return new Fraction(JSBI.add(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator)), JSBI.multiply(this.denominator, otherParsed.denominator));
  };
  _proto.subtract = function subtract(other) {
    var otherParsed = Fraction.tryParseFraction(other);
    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.subtract(this.numerator, otherParsed.numerator), this.denominator);
    }
    return new Fraction(JSBI.subtract(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator)), JSBI.multiply(this.denominator, otherParsed.denominator));
  };
  _proto.lessThan = function lessThan(other) {
    var otherParsed = Fraction.tryParseFraction(other);
    return JSBI.lessThan(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };
  _proto.equalTo = function equalTo(other) {
    var otherParsed = Fraction.tryParseFraction(other);
    return JSBI.equal(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };
  _proto.greaterThan = function greaterThan(other) {
    var otherParsed = Fraction.tryParseFraction(other);
    return JSBI.greaterThan(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };
  _proto.multiply = function multiply(other) {
    var otherParsed = Fraction.tryParseFraction(other);
    return new Fraction(JSBI.multiply(this.numerator, otherParsed.numerator), JSBI.multiply(this.denominator, otherParsed.denominator));
  };
  _proto.divide = function divide(other) {
    var otherParsed = Fraction.tryParseFraction(other);
    return new Fraction(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(this.denominator, otherParsed.numerator));
  };
  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }
    if (rounding === void 0) {
      rounding = Rounding.ROUND_HALF_UP;
    }
    !Number.isInteger(significantDigits) ? process.env.NODE_ENV !== "production" ? invariant(false, significantDigits + " is not an integer.") : invariant(false) : void 0;
    !(significantDigits > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, significantDigits + " is not positive.") : invariant(false) : void 0;
    Decimal.set({
      precision: significantDigits + 1,
      rounding: toSignificantRounding[rounding]
    });
    var quotient = new Decimal(this.numerator.toString()).div(this.denominator.toString()).toSignificantDigits(significantDigits);
    return quotient.toFormat(quotient.decimalPlaces(), format);
  };
  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }
    if (rounding === void 0) {
      rounding = Rounding.ROUND_HALF_UP;
    }
    !Number.isInteger(decimalPlaces) ? process.env.NODE_ENV !== "production" ? invariant(false, decimalPlaces + " is not an integer.") : invariant(false) : void 0;
    !(decimalPlaces >= 0) ? process.env.NODE_ENV !== "production" ? invariant(false, decimalPlaces + " is negative.") : invariant(false) : void 0;
    Big.DP = decimalPlaces;
    Big.RM = toFixedRounding[rounding];
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(decimalPlaces, format);
  }
  /**
   * Helper method for converting any super class back to a fraction
   */;
  _createClass(Fraction, [{
    key: "quotient",
    get: function get() {
      return JSBI.divide(this.numerator, this.denominator);
    }
    // remainder after floor division
  }, {
    key: "remainder",
    get: function get() {
      return new Fraction(JSBI.remainder(this.numerator, this.denominator), this.denominator);
    }
  }, {
    key: "asFraction",
    get: function get() {
      return new Fraction(this.numerator, this.denominator);
    }
  }]);
  return Fraction;
}();

var Big$1 = /*#__PURE__*/toFormat(_Big);
var CurrencyAmount = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(CurrencyAmount, _Fraction);
  function CurrencyAmount(currency, numerator, denominator) {
    var _this;
    _this = _Fraction.call(this, numerator, denominator) || this;
    !JSBI.lessThanOrEqual(_this.quotient, MaxUint256) ? process.env.NODE_ENV !== "production" ? invariant(false, 'AMOUNT') : invariant(false) : void 0;
    _this.currency = currency;
    _this.decimalScale = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(currency.decimals));
    return _this;
  }
  /**
   * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
   * @param currency the currency in the amount
   * @param rawAmount the raw token or ether amount
   */
  CurrencyAmount.fromRawAmount = function fromRawAmount(currency, rawAmount) {
    return new CurrencyAmount(currency, rawAmount);
  }
  /**
   * Construct a currency amount with a denominator that is not equal to 1
   * @param currency the currency
   * @param numerator the numerator of the fractional token amount
   * @param denominator the denominator of the fractional token amount
   */;
  CurrencyAmount.fromFractionalAmount = function fromFractionalAmount(currency, numerator, denominator) {
    return new CurrencyAmount(currency, numerator, denominator);
  };
  var _proto = CurrencyAmount.prototype;
  _proto.add = function add(other) {
    !this.currency.equals(other.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'CURRENCY') : invariant(false) : void 0;
    var added = _Fraction.prototype.add.call(this, other);
    return CurrencyAmount.fromFractionalAmount(this.currency, added.numerator, added.denominator);
  };
  _proto.subtract = function subtract(other) {
    !this.currency.equals(other.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'CURRENCY') : invariant(false) : void 0;
    var subtracted = _Fraction.prototype.subtract.call(this, other);
    return CurrencyAmount.fromFractionalAmount(this.currency, subtracted.numerator, subtracted.denominator);
  };
  _proto.multiply = function multiply(other) {
    var multiplied = _Fraction.prototype.multiply.call(this, other);
    return CurrencyAmount.fromFractionalAmount(this.currency, multiplied.numerator, multiplied.denominator);
  };
  _proto.divide = function divide(other) {
    var divided = _Fraction.prototype.divide.call(this, other);
    return CurrencyAmount.fromFractionalAmount(this.currency, divided.numerator, divided.denominator);
  };
  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 6;
    }
    if (rounding === void 0) {
      rounding = Rounding.ROUND_DOWN;
    }
    return _Fraction.prototype.divide.call(this, this.decimalScale).toSignificant(significantDigits, format, rounding);
  };
  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = this.currency.decimals;
    }
    if (rounding === void 0) {
      rounding = Rounding.ROUND_DOWN;
    }
    !(decimalPlaces <= this.currency.decimals) ? process.env.NODE_ENV !== "production" ? invariant(false, 'DECIMALS') : invariant(false) : void 0;
    return _Fraction.prototype.divide.call(this, this.decimalScale).toFixed(decimalPlaces, format, rounding);
  };
  _proto.toExact = function toExact(format) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }
    Big$1.DP = this.currency.decimals;
    return new Big$1(this.quotient.toString()).div(this.decimalScale.toString()).toFormat(format);
  };
  _createClass(CurrencyAmount, [{
    key: "wrapped",
    get: function get() {
      if (this.currency.isToken) return this;
      return CurrencyAmount.fromFractionalAmount(this.currency.wrapped, this.numerator, this.denominator);
    }
  }]);
  return CurrencyAmount;
}(Fraction);

var _format = "hh-sol-artifact-1";
var contractName = "ISelfPermit";
var sourceName = "contracts/interfaces/ISelfPermit.sol";
var abi = [
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "selfPermit",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "nonce",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "expiry",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "selfPermitAllowed",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "nonce",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "expiry",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "selfPermitAllowedIfNecessary",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "selfPermitIfNecessary",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	}
];
var bytecode = "0x";
var deployedBytecode = "0x";
var linkReferences = {
};
var deployedLinkReferences = {
};
var ISelfPermit = {
	_format: _format,
	contractName: contractName,
	sourceName: sourceName,
	abi: abi,
	bytecode: bytecode,
	deployedBytecode: deployedBytecode,
	linkReferences: linkReferences,
	deployedLinkReferences: deployedLinkReferences
};

/**
 * Converts a big int to a hex string
 * @param bigintIsh
 * @returns The hex encoded calldata
 */
function toHex(bigintIsh) {
  var bigInt = JSBI.BigInt(bigintIsh);
  var hex = bigInt.toString(16);
  if (hex.length % 2 !== 0) {
    hex = "0" + hex;
  }
  return "0x" + hex;
}

function isAllowedPermit(permitOptions) {
  return 'nonce' in permitOptions;
}
var SelfPermit = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function SelfPermit() {}
  SelfPermit.encodePermit = function encodePermit(token, options) {
    return isAllowedPermit(options) ? SelfPermit.INTERFACE.encodeFunctionData('selfPermitAllowed', [token.address, toHex(options.nonce), toHex(options.expiry), options.v, options.r, options.s]) : SelfPermit.INTERFACE.encodeFunctionData('selfPermit', [token.address, toHex(options.amount), toHex(options.deadline), options.v, options.r, options.s]);
  };
  return SelfPermit;
}();
SelfPermit.INTERFACE = /*#__PURE__*/new Interface(ISelfPermit.abi);

/**
 * Converts a route to a hex encoded path
 * @param route the v3 path to convert to an encoded path
 * @param exactOutput whether the route should be encoded in reverse, for making exact output swaps
 */
function encodeRouteToPath(route, exactOutput) {
  var firstInputToken = route.input.wrapped;
  var _route$pools$reduce = route.pools.reduce(function (_ref, pool, index) {
      var inputToken = _ref.inputToken,
        path = _ref.path,
        types = _ref.types;
      var outputToken = pool.token0.equals(inputToken) ? pool.token1 : pool.token0;
      if (index === 0) {
        return {
          inputToken: outputToken,
          types: ['address', 'uint24', 'address'],
          path: [inputToken.address, pool.fee, outputToken.address]
        };
      } else {
        return {
          inputToken: outputToken,
          types: [].concat(types, ['uint24', 'address']),
          path: [].concat(path, [pool.fee, outputToken.address])
        };
      }
    }, {
      inputToken: firstInputToken,
      path: [],
      types: []
    }),
    path = _route$pools$reduce.path,
    types = _route$pools$reduce.types;
  return exactOutput ? pack(types.reverse(), path.reverse()) : pack(types, path);
}

var _format$1 = "hh-sol-artifact-1";
var contractName$1 = "SwapRouter";
var sourceName$1 = "contracts/SwapRouter.sol";
var abi$1 = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_factory",
				type: "address"
			},
			{
				internalType: "address",
				name: "_WTC",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		inputs: [
		],
		name: "WTC",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "bytes",
						name: "path",
						type: "bytes"
					},
					{
						internalType: "address",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amountIn",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amountOutMinimum",
						type: "uint256"
					}
				],
				internalType: "struct ISwapRouter.ExactInputParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "exactInput",
		outputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "tokenIn",
						type: "address"
					},
					{
						internalType: "address",
						name: "tokenOut",
						type: "address"
					},
					{
						internalType: "uint24",
						name: "fee",
						type: "uint24"
					},
					{
						internalType: "address",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amountIn",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amountOutMinimum",
						type: "uint256"
					},
					{
						internalType: "uint160",
						name: "sqrtPriceLimitX96",
						type: "uint160"
					}
				],
				internalType: "struct ISwapRouter.ExactInputSingleParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "exactInputSingle",
		outputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "bytes",
						name: "path",
						type: "bytes"
					},
					{
						internalType: "address",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amountOut",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amountInMaximum",
						type: "uint256"
					}
				],
				internalType: "struct ISwapRouter.ExactOutputParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "exactOutput",
		outputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "tokenIn",
						type: "address"
					},
					{
						internalType: "address",
						name: "tokenOut",
						type: "address"
					},
					{
						internalType: "uint24",
						name: "fee",
						type: "uint24"
					},
					{
						internalType: "address",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amountOut",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amountInMaximum",
						type: "uint256"
					},
					{
						internalType: "uint160",
						name: "sqrtPriceLimitX96",
						type: "uint160"
					}
				],
				internalType: "struct ISwapRouter.ExactOutputSingleParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "exactOutputSingle",
		outputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes[]",
				name: "data",
				type: "bytes[]"
			}
		],
		name: "multicall",
		outputs: [
			{
				internalType: "bytes[]",
				name: "results",
				type: "bytes[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "refundTC",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "selfPermit",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "nonce",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "expiry",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "selfPermitAllowed",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "nonce",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "expiry",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "selfPermitAllowedIfNecessary",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "selfPermitIfNecessary",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "sweepToken",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "feeBips",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "feeRecipient",
				type: "address"
			}
		],
		name: "sweepTokenWithFee",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "int256",
				name: "amount0Delta",
				type: "int256"
			},
			{
				internalType: "int256",
				name: "amount1Delta",
				type: "int256"
			},
			{
				internalType: "bytes",
				name: "_data",
				type: "bytes"
			}
		],
		name: "uniswapV3SwapCallback",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "unwrapWTC",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "feeBips",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "feeRecipient",
				type: "address"
			}
		],
		name: "unwrapWTCWithFee",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		stateMutability: "payable",
		type: "receive"
	}
];
var bytecode$1 = "0x60c06040526000196000553480156200001757600080fd5b506040516200302f3803806200302f8339810160408190526200003a9162000076565b6001600160601b0319606092831b8116608052911b1660a052620000ad565b80516001600160a01b03811681146200007157600080fd5b919050565b6000806040838503121562000089578182fd5b620000948362000059565b9150620000a46020840162000059565b90509250929050565b60805160601c60a05160601c612f26620001096000398061012f528061058352806106ad5280610747528061078752806108b15280611c435280611ca35280611d24525080610dc6528061140c5280611e265250612f266000f3fe6080604052600436106101125760003560e01c8063c04b8d59116100a5578063df2ab5bb11610074578063f28c049811610059578063f28c0498146102f5578063f3995c6714610308578063fa461e331461031b576101bd565b8063df2ab5bb146102cf578063e0e189a0146102e2576101bd565b8063c04b8d5914610281578063c2e3140a14610294578063c45a0155146102a7578063db3e2198146102bc576101bd565b80634aa4a4fc116100e15780634aa4a4fc146102195780639b2c0a371461023b578063a4a78f0c1461024e578063ac9650d814610261576101bd565b806312210e8a146101c2578063414bf389146101ca5780634659a494146101f357806349404b7c14610206576101bd565b366101bd573373ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016146101bb57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600960248201527f4e6f742057455448390000000000000000000000000000000000000000000000604482015290519081900360640190fd5b005b600080fd5b6101bb61033b565b6101dd6101d83660046129f8565b61034d565b6040516101ea9190612df1565b60405180910390f35b6101bb610201366004612776565b6104bf565b6101bb610214366004612aff565b61057f565b34801561022557600080fd5b5061022e610745565b6040516101ea9190612c37565b6101bb610249366004612b2e565b610769565b6101bb61025c366004612776565b610981565b61027461026f3660046127d6565b610a56565b6040516101ea9190612caa565b6101dd61028f36600461294d565b610bb0565b6101bb6102a2366004612776565b610d0f565b3480156102b357600080fd5b5061022e610dc4565b6101dd6102ca3660046129f8565b610de8565b6101bb6102dd3660046126d7565b610f78565b6101bb6102f0366004612718565b611095565b6101dd610303366004612a14565b6111fb565b6101bb610316366004612776565b61132f565b34801561032757600080fd5b506101bb610336366004612868565b6113c7565b471561034b5761034b334761150e565b565b600081608001358061035d61165c565b11156103ca57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f5472616e73616374696f6e20746f6f206f6c6400000000000000000000000000604482015290519081900360640190fd5b61047060a08401356103e260808601606087016126b4565b6103f3610100870160e088016126b4565b604080518082019091528061040b60208a018a6126b4565b61041b60608b0160408c01612adc565b61042b60408c0160208d016126b4565b60405160200161043d93929190612bc1565b60405160208183030381529060405281526020013373ffffffffffffffffffffffffffffffffffffffff16815250611660565b91508260c001358210156104b9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104b090612d72565b60405180910390fd5b50919050565b604080517f8fcbaf0c00000000000000000000000000000000000000000000000000000000815233600482015230602482015260448101879052606481018690526001608482015260ff851660a482015260c4810184905260e48101839052905173ffffffffffffffffffffffffffffffffffffffff881691638fcbaf0c9161010480830192600092919082900301818387803b15801561055f57600080fd5b505af1158015610573573d6000803e3d6000fd5b50505050505050505050565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561060857600080fd5b505afa15801561061c573d6000803e3d6000fd5b505050506040513d602081101561063257600080fd5b50519050828110156106a557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f496e73756666696369656e742057455448390000000000000000000000000000604482015290519081900360640190fd5b8015610740577f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16632e1a7d4d826040518263ffffffff1660e01b815260040180828152602001915050600060405180830381600087803b15801561071e57600080fd5b505af1158015610732573d6000803e3d6000fd5b50505050610740828261150e565b505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b60008211801561077a575060648211155b61078357600080fd5b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561080c57600080fd5b505afa158015610820573d6000803e3d6000fd5b505050506040513d602081101561083657600080fd5b50519050848110156108a957604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f496e73756666696369656e742057455448390000000000000000000000000000604482015290519081900360640190fd5b801561097a577f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16632e1a7d4d826040518263ffffffff1660e01b815260040180828152602001915050600060405180830381600087803b15801561092257600080fd5b505af1158015610936573d6000803e3d6000fd5b50505050600061271061095285846117e690919063ffffffff16565b8161095957fe5b049050801561096c5761096c838261150e565b6109788582840361150e565b505b5050505050565b604080517fdd62ed3e00000000000000000000000000000000000000000000000000000000815233600482015230602482015290517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9173ffffffffffffffffffffffffffffffffffffffff89169163dd62ed3e91604480820192602092909190829003018186803b158015610a1657600080fd5b505afa158015610a2a573d6000803e3d6000fd5b505050506040513d6020811015610a4057600080fd5b50511015610978576109788686868686866104bf565b60608167ffffffffffffffff81118015610a6f57600080fd5b50604051908082528060200260200182016040528015610aa357816020015b6060815260200190600190039081610a8e5790505b50905060005b82811015610ba95760008030868685818110610ac157fe5b9050602002810190610ad39190612dfa565b604051610ae1929190612c27565b600060405180830381855af49150503d8060008114610b1c576040519150601f19603f3d011682016040523d82523d6000602084013e610b21565b606091505b509150915081610b8757604481511015610b3a57600080fd5b60048101905080806020019051810190610b5491906128e3565b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104b09190612d28565b80848481518110610b9457fe5b60209081029190910101525050600101610aa9565b5092915050565b6000816040015180610bc061165c565b1115610c2d57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f5472616e73616374696f6e20746f6f206f6c6400000000000000000000000000604482015290519081900360640190fd5b335b6000610c3e8560000151611810565b9050610c97856060015182610c57578660200151610c59565b305b60006040518060400160405280610c738b6000015161181c565b81526020018773ffffffffffffffffffffffffffffffffffffffff16815250611660565b60608601528015610cb7578451309250610cb09061182b565b8552610cc4565b8460600151935050610cca565b50610c2f565b8360800151831015610d08576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104b090612d72565b5050919050565b604080517fdd62ed3e0000000000000000000000000000000000000000000000000000000081523360048201523060248201529051869173ffffffffffffffffffffffffffffffffffffffff89169163dd62ed3e91604480820192602092909190829003018186803b158015610d8457600080fd5b505afa158015610d98573d6000803e3d6000fd5b505050506040513d6020811015610dae57600080fd5b505110156109785761097886868686868661132f565b7f000000000000000000000000000000000000000000000000000000000000000081565b6000816080013580610df861165c565b1115610e6557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f5472616e73616374696f6e20746f6f206f6c6400000000000000000000000000604482015290519081900360640190fd5b610f0e60a0840135610e7d60808601606087016126b4565b610e8e610100870160e088016126b4565b6040518060400160405280886020016020810190610eac91906126b4565b610ebc60608b0160408c01612adc565b610ec960208c018c6126b4565b604051602001610edb93929190612bc1565b60405160208183030381529060405281526020013373ffffffffffffffffffffffffffffffffffffffff16815250611860565b91508260c00135821115610f4e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104b090612d3b565b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600055919050565b60008373ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015610fe157600080fd5b505afa158015610ff5573d6000803e3d6000fd5b505050506040513d602081101561100b57600080fd5b505190508281101561107e57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f496e73756666696369656e7420746f6b656e0000000000000000000000000000604482015290519081900360640190fd5b801561108f5761108f848383611a1c565b50505050565b6000821180156110a6575060648211155b6110af57600080fd5b60008573ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561111857600080fd5b505afa15801561112c573d6000803e3d6000fd5b505050506040513d602081101561114257600080fd5b50519050848110156111b557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f496e73756666696369656e7420746f6b656e0000000000000000000000000000604482015290519081900360640190fd5b80156109785760006127106111ca83866117e6565b816111d157fe5b04905080156111e5576111e5878483611a1c565b6111f28786838503611a1c565b50505050505050565b600081604001358061120b61165c565b111561127857604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f5472616e73616374696f6e20746f6f206f6c6400000000000000000000000000604482015290519081900360640190fd5b6112eb606084013561129060408601602087016126b4565b60408051808201909152600090806112a88980612dfa565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050509082525033602090910152611860565b5060005491508260800135821115610f4e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104b090612d3b565b604080517fd505accf000000000000000000000000000000000000000000000000000000008152336004820152306024820152604481018790526064810186905260ff8516608482015260a4810184905260c48101839052905173ffffffffffffffffffffffffffffffffffffffff88169163d505accf9160e480830192600092919082900301818387803b15801561055f57600080fd5b60008413806113d65750600083135b6113df57600080fd5b60006113ed82840184612a4c565b905060008060006114018460000151611bf1565b9250925092506114337f0000000000000000000000000000000000000000000000000000000000000000848484611c22565b5060008060008a13611474578473ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1610896114a5565b8373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff16108a5b9150915081156114c4576114bf8587602001513384611c41565b610573565b85516114cf90611810565b156114f45785516114df9061182b565b86526114ee8133600089611860565b50610573565b806000819055508394506105738587602001513384611c41565b6040805160008082526020820190925273ffffffffffffffffffffffffffffffffffffffff84169083906040518082805190602001908083835b6020831061158557805182527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe09092019160209182019101611548565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d80600081146115e7576040519150601f19603f3d011682016040523d82523d6000602084013e6115ec565b606091505b505090508061074057604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600360248201527f5354450000000000000000000000000000000000000000000000000000000000604482015290519081900360640190fd5b4290565b600073ffffffffffffffffffffffffffffffffffffffff8416611681573093505b60008060006116938560000151611bf1565b9194509250905073ffffffffffffffffffffffffffffffffffffffff808316908416106000806116c4868686611e1f565b73ffffffffffffffffffffffffffffffffffffffff1663128acb088b856116ea8f611e5d565b73ffffffffffffffffffffffffffffffffffffffff8e161561170c578d611732565b8761172b5773fffd8963efd1fc6a506488495d951d5263988d25611732565b6401000276a45b8d6040516020016117439190612da9565b6040516020818303038152906040526040518663ffffffff1660e01b8152600401611772959493929190612c58565b6040805180830381600087803b15801561178b57600080fd5b505af115801561179f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117c39190612845565b91509150826117d257816117d4565b805b6000039b9a5050505050505050505050565b6000821580611801575050818102818382816117fe57fe5b04145b61180a57600080fd5b92915050565b8051604211155b919050565b606061180a826000602b611e8f565b805160609061180a9083906017907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe901611e8f565b600073ffffffffffffffffffffffffffffffffffffffff8416611881573093505b60008060006118938560000151611bf1565b9194509250905073ffffffffffffffffffffffffffffffffffffffff808416908316106000806118c4858786611e1f565b73ffffffffffffffffffffffffffffffffffffffff1663128acb088b856118ea8f611e5d565b60000373ffffffffffffffffffffffffffffffffffffffff8e161561190f578d611935565b8761192e5773fffd8963efd1fc6a506488495d951d5263988d25611935565b6401000276a45b8d6040516020016119469190612da9565b6040516020818303038152906040526040518663ffffffff1660e01b8152600401611975959493929190612c58565b6040805180830381600087803b15801561198e57600080fd5b505af11580156119a2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119c69190612845565b915091506000836119db5781836000036119e1565b82826000035b909850905073ffffffffffffffffffffffffffffffffffffffff8a16611a0d578b8114611a0d57600080fd5b50505050505050949350505050565b6040805173ffffffffffffffffffffffffffffffffffffffff8481166024830152604480830185905283518084039091018152606490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fa9059cbb000000000000000000000000000000000000000000000000000000001781529251825160009485949389169392918291908083835b60208310611af157805182527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe09092019160209182019101611ab4565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114611b53576040519150601f19603f3d011682016040523d82523d6000602084013e611b58565b606091505b5091509150818015611b86575080511580611b865750808060200190516020811015611b8357600080fd5b50515b61097a57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600260248201527f5354000000000000000000000000000000000000000000000000000000000000604482015290519081900360640190fd5b60008080611bff8482612076565b9250611c0c846014612176565b9050611c19846017612076565b91509193909250565b6000611c3885611c33868686612266565b6122e3565b95945050505050565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16148015611c9c5750804710155b15611de5577f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663d0e30db0826040518263ffffffff1660e01b81526004016000604051808303818588803b158015611d0957600080fd5b505af1158015611d1d573d6000803e3d6000fd5b50505050507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b158015611db357600080fd5b505af1158015611dc7573d6000803e3d6000fd5b505050506040513d6020811015611ddd57600080fd5b5061108f9050565b73ffffffffffffffffffffffffffffffffffffffff8316301415611e1357611e0e848383611a1c565b61108f565b61108f84848484612313565b6000611e557f0000000000000000000000000000000000000000000000000000000000000000611e50868686612266565b6124f0565b949350505050565b60007f80000000000000000000000000000000000000000000000000000000000000008210611e8b57600080fd5b5090565b60608182601f011015611f0357604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f736c6963655f6f766572666c6f77000000000000000000000000000000000000604482015290519081900360640190fd5b828284011015611f7457604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f736c6963655f6f766572666c6f77000000000000000000000000000000000000604482015290519081900360640190fd5b81830184511015611fe657604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f736c6963655f6f75744f66426f756e6473000000000000000000000000000000604482015290519081900360640190fd5b606082158015612005576040519150600082526020820160405261206d565b6040519150601f8416801560200281840101858101878315602002848b0101015b8183101561203e578051835260209283019201612026565b5050858452601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016604052505b50949350505050565b6000818260140110156120ea57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f746f416464726573735f6f766572666c6f770000000000000000000000000000604482015290519081900360640190fd5b816014018351101561215d57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f746f416464726573735f6f75744f66426f756e64730000000000000000000000604482015290519081900360640190fd5b5001602001516c01000000000000000000000000900490565b6000818260030110156121ea57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f746f55696e7432345f6f766572666c6f77000000000000000000000000000000604482015290519081900360640190fd5b816003018351101561225d57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f746f55696e7432345f6f75744f66426f756e6473000000000000000000000000604482015290519081900360640190fd5b50016003015190565b61226e612626565b8273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1611156122a6579192915b506040805160608101825273ffffffffffffffffffffffffffffffffffffffff948516815292909316602083015262ffffff169181019190915290565b60006122ef83836124f0565b90503373ffffffffffffffffffffffffffffffffffffffff82161461180a57600080fd5b6040805173ffffffffffffffffffffffffffffffffffffffff85811660248301528481166044830152606480830185905283518084039091018152608490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f23b872dd00000000000000000000000000000000000000000000000000000000178152925182516000948594938a169392918291908083835b602083106123f057805182527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe090920191602091820191016123b3565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114612452576040519150601f19603f3d011682016040523d82523d6000602084013e612457565b606091505b5091509150818015612485575080511580612485575080806020019051602081101561248257600080fd5b50515b61097857604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600360248201527f5354460000000000000000000000000000000000000000000000000000000000604482015290519081900360640190fd5b6000816020015173ffffffffffffffffffffffffffffffffffffffff16826000015173ffffffffffffffffffffffffffffffffffffffff161061253257600080fd5b508051602080830151604093840151845173ffffffffffffffffffffffffffffffffffffffff94851681850152939091168385015262ffffff166060808401919091528351808403820181526080840185528051908301207fff0000000000000000000000000000000000000000000000000000000000000060a085015294901b7fffffffffffffffffffffffffffffffffffffffff0000000000000000000000001660a183015260b58201939093527fe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b5460d5808301919091528251808303909101815260f5909101909152805191012090565b604080516060810182526000808252602082018190529181019190915290565b803561181781612ef4565b600082601f830112612661578081fd5b813561267461266f82612e88565b612e64565b818152846020838601011115612688578283fd5b816020850160208301379081016020019190915292915050565b600061010082840312156104b9578081fd5b6000602082840312156126c5578081fd5b81356126d081612ef4565b9392505050565b6000806000606084860312156126eb578182fd5b83356126f681612ef4565b925060208401359150604084013561270d81612ef4565b809150509250925092565b600080600080600060a0868803121561272f578081fd5b853561273a81612ef4565b945060208601359350604086013561275181612ef4565b925060608601359150608086013561276881612ef4565b809150509295509295909350565b60008060008060008060c0878903121561278e578081fd5b863561279981612ef4565b95506020870135945060408701359350606087013560ff811681146127bc578182fd5b9598949750929560808101359460a0909101359350915050565b600080602083850312156127e8578182fd5b823567ffffffffffffffff808211156127ff578384fd5b818501915085601f830112612812578384fd5b813581811115612820578485fd5b8660208083028501011115612833578485fd5b60209290920196919550909350505050565b60008060408385031215612857578182fd5b505080516020909101519092909150565b6000806000806060858703121561287d578182fd5b8435935060208501359250604085013567ffffffffffffffff808211156128a2578384fd5b818701915087601f8301126128b5578384fd5b8135818111156128c3578485fd5b8860208285010111156128d4578485fd5b95989497505060200194505050565b6000602082840312156128f4578081fd5b815167ffffffffffffffff81111561290a578182fd5b8201601f8101841361291a578182fd5b805161292861266f82612e88565b81815285602083850101111561293c578384fd5b611c38826020830160208601612ec8565b60006020828403121561295e578081fd5b813567ffffffffffffffff80821115612975578283fd5b9083019060a08286031215612988578283fd5b60405160a08101818110838211171561299d57fe5b6040528235828111156129ae578485fd5b6129ba87828601612651565b8252506129c960208401612646565b602082015260408301356040820152606083013560608201526080830135608082015280935050505092915050565b60006101008284031215612a0a578081fd5b6126d083836126a2565b600060208284031215612a25578081fd5b813567ffffffffffffffff811115612a3b578182fd5b820160a081850312156126d0578182fd5b600060208284031215612a5d578081fd5b813567ffffffffffffffff80821115612a74578283fd5b9083019060408286031215612a87578283fd5b604051604081018181108382111715612a9c57fe5b604052823582811115612aad578485fd5b612ab987828601612651565b82525060208301359250612acc83612ef4565b6020810192909252509392505050565b600060208284031215612aed578081fd5b813562ffffff811681146126d0578182fd5b60008060408385031215612b11578182fd5b823591506020830135612b2381612ef4565b809150509250929050565b60008060008060808587031215612b43578182fd5b843593506020850135612b5581612ef4565b9250604085013591506060850135612b6c81612ef4565b939692955090935050565b60008151808452612b8f816020860160208601612ec8565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b606093841b7fffffffffffffffffffffffffffffffffffffffff000000000000000000000000908116825260e89390931b7fffffff0000000000000000000000000000000000000000000000000000000000166014820152921b166017820152602b0190565b6000828483379101908152919050565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b600073ffffffffffffffffffffffffffffffffffffffff8088168352861515602084015285604084015280851660608401525060a06080830152612c9f60a0830184612b77565b979650505050505050565b6000602080830181845280855180835260408601915060408482028701019250838701855b82811015612d1b577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0888603018452612d09858351612b77565b94509285019290850190600101612ccf565b5092979650505050505050565b6000602082526126d06020830184612b77565b60208082526012908201527f546f6f206d756368207265717565737465640000000000000000000000000000604082015260600190565b60208082526013908201527f546f6f206c6974746c6520726563656976656400000000000000000000000000604082015260600190565b600060208252825160406020840152612dc56060840182612b77565b905073ffffffffffffffffffffffffffffffffffffffff60208501511660408401528091505092915050565b90815260200190565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe1843603018112612e2e578283fd5b83018035915067ffffffffffffffff821115612e48578283fd5b602001915036819003821315612e5d57600080fd5b9250929050565b60405181810167ffffffffffffffff81118282101715612e8057fe5b604052919050565b600067ffffffffffffffff821115612e9c57fe5b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b60005b83811015612ee3578181015183820152602001612ecb565b8381111561108f5750506000910152565b73ffffffffffffffffffffffffffffffffffffffff81168114612f1657600080fd5b5056fea164736f6c6343000706000a";
var deployedBytecode$1 = "0x6080604052600436106101125760003560e01c8063c04b8d59116100a5578063df2ab5bb11610074578063f28c049811610059578063f28c0498146102f5578063f3995c6714610308578063fa461e331461031b576101bd565b8063df2ab5bb146102cf578063e0e189a0146102e2576101bd565b8063c04b8d5914610281578063c2e3140a14610294578063c45a0155146102a7578063db3e2198146102bc576101bd565b80634aa4a4fc116100e15780634aa4a4fc146102195780639b2c0a371461023b578063a4a78f0c1461024e578063ac9650d814610261576101bd565b806312210e8a146101c2578063414bf389146101ca5780634659a494146101f357806349404b7c14610206576101bd565b366101bd573373ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016146101bb57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600960248201527f4e6f742057455448390000000000000000000000000000000000000000000000604482015290519081900360640190fd5b005b600080fd5b6101bb61033b565b6101dd6101d83660046129f8565b61034d565b6040516101ea9190612df1565b60405180910390f35b6101bb610201366004612776565b6104bf565b6101bb610214366004612aff565b61057f565b34801561022557600080fd5b5061022e610745565b6040516101ea9190612c37565b6101bb610249366004612b2e565b610769565b6101bb61025c366004612776565b610981565b61027461026f3660046127d6565b610a56565b6040516101ea9190612caa565b6101dd61028f36600461294d565b610bb0565b6101bb6102a2366004612776565b610d0f565b3480156102b357600080fd5b5061022e610dc4565b6101dd6102ca3660046129f8565b610de8565b6101bb6102dd3660046126d7565b610f78565b6101bb6102f0366004612718565b611095565b6101dd610303366004612a14565b6111fb565b6101bb610316366004612776565b61132f565b34801561032757600080fd5b506101bb610336366004612868565b6113c7565b471561034b5761034b334761150e565b565b600081608001358061035d61165c565b11156103ca57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f5472616e73616374696f6e20746f6f206f6c6400000000000000000000000000604482015290519081900360640190fd5b61047060a08401356103e260808601606087016126b4565b6103f3610100870160e088016126b4565b604080518082019091528061040b60208a018a6126b4565b61041b60608b0160408c01612adc565b61042b60408c0160208d016126b4565b60405160200161043d93929190612bc1565b60405160208183030381529060405281526020013373ffffffffffffffffffffffffffffffffffffffff16815250611660565b91508260c001358210156104b9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104b090612d72565b60405180910390fd5b50919050565b604080517f8fcbaf0c00000000000000000000000000000000000000000000000000000000815233600482015230602482015260448101879052606481018690526001608482015260ff851660a482015260c4810184905260e48101839052905173ffffffffffffffffffffffffffffffffffffffff881691638fcbaf0c9161010480830192600092919082900301818387803b15801561055f57600080fd5b505af1158015610573573d6000803e3d6000fd5b50505050505050505050565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561060857600080fd5b505afa15801561061c573d6000803e3d6000fd5b505050506040513d602081101561063257600080fd5b50519050828110156106a557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f496e73756666696369656e742057455448390000000000000000000000000000604482015290519081900360640190fd5b8015610740577f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16632e1a7d4d826040518263ffffffff1660e01b815260040180828152602001915050600060405180830381600087803b15801561071e57600080fd5b505af1158015610732573d6000803e3d6000fd5b50505050610740828261150e565b505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b60008211801561077a575060648211155b61078357600080fd5b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561080c57600080fd5b505afa158015610820573d6000803e3d6000fd5b505050506040513d602081101561083657600080fd5b50519050848110156108a957604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f496e73756666696369656e742057455448390000000000000000000000000000604482015290519081900360640190fd5b801561097a577f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16632e1a7d4d826040518263ffffffff1660e01b815260040180828152602001915050600060405180830381600087803b15801561092257600080fd5b505af1158015610936573d6000803e3d6000fd5b50505050600061271061095285846117e690919063ffffffff16565b8161095957fe5b049050801561096c5761096c838261150e565b6109788582840361150e565b505b5050505050565b604080517fdd62ed3e00000000000000000000000000000000000000000000000000000000815233600482015230602482015290517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9173ffffffffffffffffffffffffffffffffffffffff89169163dd62ed3e91604480820192602092909190829003018186803b158015610a1657600080fd5b505afa158015610a2a573d6000803e3d6000fd5b505050506040513d6020811015610a4057600080fd5b50511015610978576109788686868686866104bf565b60608167ffffffffffffffff81118015610a6f57600080fd5b50604051908082528060200260200182016040528015610aa357816020015b6060815260200190600190039081610a8e5790505b50905060005b82811015610ba95760008030868685818110610ac157fe5b9050602002810190610ad39190612dfa565b604051610ae1929190612c27565b600060405180830381855af49150503d8060008114610b1c576040519150601f19603f3d011682016040523d82523d6000602084013e610b21565b606091505b509150915081610b8757604481511015610b3a57600080fd5b60048101905080806020019051810190610b5491906128e3565b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104b09190612d28565b80848481518110610b9457fe5b60209081029190910101525050600101610aa9565b5092915050565b6000816040015180610bc061165c565b1115610c2d57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f5472616e73616374696f6e20746f6f206f6c6400000000000000000000000000604482015290519081900360640190fd5b335b6000610c3e8560000151611810565b9050610c97856060015182610c57578660200151610c59565b305b60006040518060400160405280610c738b6000015161181c565b81526020018773ffffffffffffffffffffffffffffffffffffffff16815250611660565b60608601528015610cb7578451309250610cb09061182b565b8552610cc4565b8460600151935050610cca565b50610c2f565b8360800151831015610d08576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104b090612d72565b5050919050565b604080517fdd62ed3e0000000000000000000000000000000000000000000000000000000081523360048201523060248201529051869173ffffffffffffffffffffffffffffffffffffffff89169163dd62ed3e91604480820192602092909190829003018186803b158015610d8457600080fd5b505afa158015610d98573d6000803e3d6000fd5b505050506040513d6020811015610dae57600080fd5b505110156109785761097886868686868661132f565b7f000000000000000000000000000000000000000000000000000000000000000081565b6000816080013580610df861165c565b1115610e6557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f5472616e73616374696f6e20746f6f206f6c6400000000000000000000000000604482015290519081900360640190fd5b610f0e60a0840135610e7d60808601606087016126b4565b610e8e610100870160e088016126b4565b6040518060400160405280886020016020810190610eac91906126b4565b610ebc60608b0160408c01612adc565b610ec960208c018c6126b4565b604051602001610edb93929190612bc1565b60405160208183030381529060405281526020013373ffffffffffffffffffffffffffffffffffffffff16815250611860565b91508260c00135821115610f4e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104b090612d3b565b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600055919050565b60008373ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015610fe157600080fd5b505afa158015610ff5573d6000803e3d6000fd5b505050506040513d602081101561100b57600080fd5b505190508281101561107e57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f496e73756666696369656e7420746f6b656e0000000000000000000000000000604482015290519081900360640190fd5b801561108f5761108f848383611a1c565b50505050565b6000821180156110a6575060648211155b6110af57600080fd5b60008573ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561111857600080fd5b505afa15801561112c573d6000803e3d6000fd5b505050506040513d602081101561114257600080fd5b50519050848110156111b557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f496e73756666696369656e7420746f6b656e0000000000000000000000000000604482015290519081900360640190fd5b80156109785760006127106111ca83866117e6565b816111d157fe5b04905080156111e5576111e5878483611a1c565b6111f28786838503611a1c565b50505050505050565b600081604001358061120b61165c565b111561127857604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f5472616e73616374696f6e20746f6f206f6c6400000000000000000000000000604482015290519081900360640190fd5b6112eb606084013561129060408601602087016126b4565b60408051808201909152600090806112a88980612dfa565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050509082525033602090910152611860565b5060005491508260800135821115610f4e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104b090612d3b565b604080517fd505accf000000000000000000000000000000000000000000000000000000008152336004820152306024820152604481018790526064810186905260ff8516608482015260a4810184905260c48101839052905173ffffffffffffffffffffffffffffffffffffffff88169163d505accf9160e480830192600092919082900301818387803b15801561055f57600080fd5b60008413806113d65750600083135b6113df57600080fd5b60006113ed82840184612a4c565b905060008060006114018460000151611bf1565b9250925092506114337f0000000000000000000000000000000000000000000000000000000000000000848484611c22565b5060008060008a13611474578473ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1610896114a5565b8373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff16108a5b9150915081156114c4576114bf8587602001513384611c41565b610573565b85516114cf90611810565b156114f45785516114df9061182b565b86526114ee8133600089611860565b50610573565b806000819055508394506105738587602001513384611c41565b6040805160008082526020820190925273ffffffffffffffffffffffffffffffffffffffff84169083906040518082805190602001908083835b6020831061158557805182527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe09092019160209182019101611548565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d80600081146115e7576040519150601f19603f3d011682016040523d82523d6000602084013e6115ec565b606091505b505090508061074057604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600360248201527f5354450000000000000000000000000000000000000000000000000000000000604482015290519081900360640190fd5b4290565b600073ffffffffffffffffffffffffffffffffffffffff8416611681573093505b60008060006116938560000151611bf1565b9194509250905073ffffffffffffffffffffffffffffffffffffffff808316908416106000806116c4868686611e1f565b73ffffffffffffffffffffffffffffffffffffffff1663128acb088b856116ea8f611e5d565b73ffffffffffffffffffffffffffffffffffffffff8e161561170c578d611732565b8761172b5773fffd8963efd1fc6a506488495d951d5263988d25611732565b6401000276a45b8d6040516020016117439190612da9565b6040516020818303038152906040526040518663ffffffff1660e01b8152600401611772959493929190612c58565b6040805180830381600087803b15801561178b57600080fd5b505af115801561179f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117c39190612845565b91509150826117d257816117d4565b805b6000039b9a5050505050505050505050565b6000821580611801575050818102818382816117fe57fe5b04145b61180a57600080fd5b92915050565b8051604211155b919050565b606061180a826000602b611e8f565b805160609061180a9083906017907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe901611e8f565b600073ffffffffffffffffffffffffffffffffffffffff8416611881573093505b60008060006118938560000151611bf1565b9194509250905073ffffffffffffffffffffffffffffffffffffffff808416908316106000806118c4858786611e1f565b73ffffffffffffffffffffffffffffffffffffffff1663128acb088b856118ea8f611e5d565b60000373ffffffffffffffffffffffffffffffffffffffff8e161561190f578d611935565b8761192e5773fffd8963efd1fc6a506488495d951d5263988d25611935565b6401000276a45b8d6040516020016119469190612da9565b6040516020818303038152906040526040518663ffffffff1660e01b8152600401611975959493929190612c58565b6040805180830381600087803b15801561198e57600080fd5b505af11580156119a2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119c69190612845565b915091506000836119db5781836000036119e1565b82826000035b909850905073ffffffffffffffffffffffffffffffffffffffff8a16611a0d578b8114611a0d57600080fd5b50505050505050949350505050565b6040805173ffffffffffffffffffffffffffffffffffffffff8481166024830152604480830185905283518084039091018152606490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fa9059cbb000000000000000000000000000000000000000000000000000000001781529251825160009485949389169392918291908083835b60208310611af157805182527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe09092019160209182019101611ab4565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114611b53576040519150601f19603f3d011682016040523d82523d6000602084013e611b58565b606091505b5091509150818015611b86575080511580611b865750808060200190516020811015611b8357600080fd5b50515b61097a57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600260248201527f5354000000000000000000000000000000000000000000000000000000000000604482015290519081900360640190fd5b60008080611bff8482612076565b9250611c0c846014612176565b9050611c19846017612076565b91509193909250565b6000611c3885611c33868686612266565b6122e3565b95945050505050565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16148015611c9c5750804710155b15611de5577f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663d0e30db0826040518263ffffffff1660e01b81526004016000604051808303818588803b158015611d0957600080fd5b505af1158015611d1d573d6000803e3d6000fd5b50505050507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b158015611db357600080fd5b505af1158015611dc7573d6000803e3d6000fd5b505050506040513d6020811015611ddd57600080fd5b5061108f9050565b73ffffffffffffffffffffffffffffffffffffffff8316301415611e1357611e0e848383611a1c565b61108f565b61108f84848484612313565b6000611e557f0000000000000000000000000000000000000000000000000000000000000000611e50868686612266565b6124f0565b949350505050565b60007f80000000000000000000000000000000000000000000000000000000000000008210611e8b57600080fd5b5090565b60608182601f011015611f0357604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f736c6963655f6f766572666c6f77000000000000000000000000000000000000604482015290519081900360640190fd5b828284011015611f7457604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f736c6963655f6f766572666c6f77000000000000000000000000000000000000604482015290519081900360640190fd5b81830184511015611fe657604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f736c6963655f6f75744f66426f756e6473000000000000000000000000000000604482015290519081900360640190fd5b606082158015612005576040519150600082526020820160405261206d565b6040519150601f8416801560200281840101858101878315602002848b0101015b8183101561203e578051835260209283019201612026565b5050858452601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016604052505b50949350505050565b6000818260140110156120ea57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f746f416464726573735f6f766572666c6f770000000000000000000000000000604482015290519081900360640190fd5b816014018351101561215d57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f746f416464726573735f6f75744f66426f756e64730000000000000000000000604482015290519081900360640190fd5b5001602001516c01000000000000000000000000900490565b6000818260030110156121ea57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f746f55696e7432345f6f766572666c6f77000000000000000000000000000000604482015290519081900360640190fd5b816003018351101561225d57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f746f55696e7432345f6f75744f66426f756e6473000000000000000000000000604482015290519081900360640190fd5b50016003015190565b61226e612626565b8273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1611156122a6579192915b506040805160608101825273ffffffffffffffffffffffffffffffffffffffff948516815292909316602083015262ffffff169181019190915290565b60006122ef83836124f0565b90503373ffffffffffffffffffffffffffffffffffffffff82161461180a57600080fd5b6040805173ffffffffffffffffffffffffffffffffffffffff85811660248301528481166044830152606480830185905283518084039091018152608490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f23b872dd00000000000000000000000000000000000000000000000000000000178152925182516000948594938a169392918291908083835b602083106123f057805182527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe090920191602091820191016123b3565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114612452576040519150601f19603f3d011682016040523d82523d6000602084013e612457565b606091505b5091509150818015612485575080511580612485575080806020019051602081101561248257600080fd5b50515b61097857604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600360248201527f5354460000000000000000000000000000000000000000000000000000000000604482015290519081900360640190fd5b6000816020015173ffffffffffffffffffffffffffffffffffffffff16826000015173ffffffffffffffffffffffffffffffffffffffff161061253257600080fd5b508051602080830151604093840151845173ffffffffffffffffffffffffffffffffffffffff94851681850152939091168385015262ffffff166060808401919091528351808403820181526080840185528051908301207fff0000000000000000000000000000000000000000000000000000000000000060a085015294901b7fffffffffffffffffffffffffffffffffffffffff0000000000000000000000001660a183015260b58201939093527fe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b5460d5808301919091528251808303909101815260f5909101909152805191012090565b604080516060810182526000808252602082018190529181019190915290565b803561181781612ef4565b600082601f830112612661578081fd5b813561267461266f82612e88565b612e64565b818152846020838601011115612688578283fd5b816020850160208301379081016020019190915292915050565b600061010082840312156104b9578081fd5b6000602082840312156126c5578081fd5b81356126d081612ef4565b9392505050565b6000806000606084860312156126eb578182fd5b83356126f681612ef4565b925060208401359150604084013561270d81612ef4565b809150509250925092565b600080600080600060a0868803121561272f578081fd5b853561273a81612ef4565b945060208601359350604086013561275181612ef4565b925060608601359150608086013561276881612ef4565b809150509295509295909350565b60008060008060008060c0878903121561278e578081fd5b863561279981612ef4565b95506020870135945060408701359350606087013560ff811681146127bc578182fd5b9598949750929560808101359460a0909101359350915050565b600080602083850312156127e8578182fd5b823567ffffffffffffffff808211156127ff578384fd5b818501915085601f830112612812578384fd5b813581811115612820578485fd5b8660208083028501011115612833578485fd5b60209290920196919550909350505050565b60008060408385031215612857578182fd5b505080516020909101519092909150565b6000806000806060858703121561287d578182fd5b8435935060208501359250604085013567ffffffffffffffff808211156128a2578384fd5b818701915087601f8301126128b5578384fd5b8135818111156128c3578485fd5b8860208285010111156128d4578485fd5b95989497505060200194505050565b6000602082840312156128f4578081fd5b815167ffffffffffffffff81111561290a578182fd5b8201601f8101841361291a578182fd5b805161292861266f82612e88565b81815285602083850101111561293c578384fd5b611c38826020830160208601612ec8565b60006020828403121561295e578081fd5b813567ffffffffffffffff80821115612975578283fd5b9083019060a08286031215612988578283fd5b60405160a08101818110838211171561299d57fe5b6040528235828111156129ae578485fd5b6129ba87828601612651565b8252506129c960208401612646565b602082015260408301356040820152606083013560608201526080830135608082015280935050505092915050565b60006101008284031215612a0a578081fd5b6126d083836126a2565b600060208284031215612a25578081fd5b813567ffffffffffffffff811115612a3b578182fd5b820160a081850312156126d0578182fd5b600060208284031215612a5d578081fd5b813567ffffffffffffffff80821115612a74578283fd5b9083019060408286031215612a87578283fd5b604051604081018181108382111715612a9c57fe5b604052823582811115612aad578485fd5b612ab987828601612651565b82525060208301359250612acc83612ef4565b6020810192909252509392505050565b600060208284031215612aed578081fd5b813562ffffff811681146126d0578182fd5b60008060408385031215612b11578182fd5b823591506020830135612b2381612ef4565b809150509250929050565b60008060008060808587031215612b43578182fd5b843593506020850135612b5581612ef4565b9250604085013591506060850135612b6c81612ef4565b939692955090935050565b60008151808452612b8f816020860160208601612ec8565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b606093841b7fffffffffffffffffffffffffffffffffffffffff000000000000000000000000908116825260e89390931b7fffffff0000000000000000000000000000000000000000000000000000000000166014820152921b166017820152602b0190565b6000828483379101908152919050565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b600073ffffffffffffffffffffffffffffffffffffffff8088168352861515602084015285604084015280851660608401525060a06080830152612c9f60a0830184612b77565b979650505050505050565b6000602080830181845280855180835260408601915060408482028701019250838701855b82811015612d1b577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0888603018452612d09858351612b77565b94509285019290850190600101612ccf565b5092979650505050505050565b6000602082526126d06020830184612b77565b60208082526012908201527f546f6f206d756368207265717565737465640000000000000000000000000000604082015260600190565b60208082526013908201527f546f6f206c6974746c6520726563656976656400000000000000000000000000604082015260600190565b600060208252825160406020840152612dc56060840182612b77565b905073ffffffffffffffffffffffffffffffffffffffff60208501511660408401528091505092915050565b90815260200190565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe1843603018112612e2e578283fd5b83018035915067ffffffffffffffff821115612e48578283fd5b602001915036819003821315612e5d57600080fd5b9250929050565b60405181810167ffffffffffffffff81118282101715612e8057fe5b604052919050565b600067ffffffffffffffff821115612e9c57fe5b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b60005b83811015612ee3578181015183820152602001612ecb565b8381111561108f5750506000910152565b73ffffffffffffffffffffffffffffffffffffffff81168114612f1657600080fd5b5056fea164736f6c6343000706000a";
var linkReferences$1 = {
};
var deployedLinkReferences$1 = {
};
var ISwapRouter = {
	_format: _format$1,
	contractName: contractName$1,
	sourceName: sourceName$1,
	abi: abi$1,
	bytecode: bytecode$1,
	deployedBytecode: deployedBytecode$1,
	linkReferences: linkReferences$1,
	deployedLinkReferences: deployedLinkReferences$1
};

var _format$2 = "hh-sol-artifact-1";
var contractName$2 = "IMulticall";
var sourceName$2 = "contracts/interfaces/IMulticall.sol";
var abi$2 = [
	{
		inputs: [
			{
				internalType: "bytes[]",
				name: "data",
				type: "bytes[]"
			}
		],
		name: "multicall",
		outputs: [
			{
				internalType: "bytes[]",
				name: "results",
				type: "bytes[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	}
];
var bytecode$2 = "0x";
var deployedBytecode$2 = "0x";
var linkReferences$2 = {
};
var deployedLinkReferences$2 = {
};
var IMulticall = {
	_format: _format$2,
	contractName: contractName$2,
	sourceName: sourceName$2,
	abi: abi$2,
	bytecode: bytecode$2,
	deployedBytecode: deployedBytecode$2,
	linkReferences: linkReferences$2,
	deployedLinkReferences: deployedLinkReferences$2
};

var Multicall = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function Multicall() {}
  Multicall.encodeMulticall = function encodeMulticall(calldatas) {
    if (!Array.isArray(calldatas)) {
      calldatas = [calldatas];
    }
    return calldatas.length === 1 ? calldatas[0] : Multicall.INTERFACE.encodeFunctionData('multicall', [calldatas]);
  };
  return Multicall;
}();
Multicall.INTERFACE = /*#__PURE__*/new Interface(IMulticall.abi);

var _format$3 = "hh-sol-artifact-1";
var contractName$3 = "IPeripheryPaymentsWithFee";
var sourceName$3 = "contracts/interfaces/IPeripheryPaymentsWithFee.sol";
var abi$3 = [
	{
		inputs: [
		],
		name: "refundTC",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "sweepToken",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "feeBips",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "feeRecipient",
				type: "address"
			}
		],
		name: "sweepTokenWithFee",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "unwrapWTC",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "feeBips",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "feeRecipient",
				type: "address"
			}
		],
		name: "unwrapWTCWithFee",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	}
];
var bytecode$3 = "0x";
var deployedBytecode$3 = "0x";
var linkReferences$3 = {
};
var deployedLinkReferences$3 = {
};
var IPeripheryPaymentsWithFee = {
	_format: _format$3,
	contractName: contractName$3,
	sourceName: sourceName$3,
	abi: abi$3,
	bytecode: bytecode$3,
	deployedBytecode: deployedBytecode$3,
	linkReferences: linkReferences$3,
	deployedLinkReferences: deployedLinkReferences$3
};

var Payments = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function Payments() {}
  Payments.encodeFeeBips = function encodeFeeBips(fee) {
    return toHex(fee.multiply(10000).quotient);
  };
  Payments.encodeUnwrapWETH9 = function encodeUnwrapWETH9(amountMinimum, recipient, feeOptions) {
    recipient = validateAndParseAddress(recipient);
    if (!!feeOptions) {
      var feeBips = this.encodeFeeBips(feeOptions.fee);
      var feeRecipient = validateAndParseAddress(feeOptions.recipient);
      return Payments.INTERFACE.encodeFunctionData('unwrapWTCWithFee', [toHex(amountMinimum), recipient, feeBips, feeRecipient]);
    } else {
      return Payments.INTERFACE.encodeFunctionData('unwrapWTC', [toHex(amountMinimum), recipient]);
    }
  };
  Payments.encodeSweepToken = function encodeSweepToken(token, amountMinimum, recipient, feeOptions) {
    recipient = validateAndParseAddress(recipient);
    if (!!feeOptions) {
      var feeBips = this.encodeFeeBips(feeOptions.fee);
      var feeRecipient = validateAndParseAddress(feeOptions.recipient);
      return Payments.INTERFACE.encodeFunctionData('sweepTokenWithFee', [token.address, toHex(amountMinimum), recipient, feeBips, feeRecipient]);
    } else {
      return Payments.INTERFACE.encodeFunctionData('sweepToken', [token.address, toHex(amountMinimum), recipient]);
    }
  };
  Payments.encodeRefundETH = function encodeRefundETH() {
    return Payments.INTERFACE.encodeFunctionData('refundTC');
  };
  return Payments;
}();
Payments.INTERFACE = /*#__PURE__*/new Interface(IPeripheryPaymentsWithFee.abi);

/**
 * A currency is any fungible financial instrument, including Ether, all ERC20 tokens, and other chain-native currencies
 */
var BaseCurrency =
/**
 * Constructs an instance of the base class `BaseCurrency`.
 * @param chainId the chain ID on which this currency resides
 * @param decimals decimals of the currency
 * @param symbol symbol of the currency
 * @param name of the currency
 */
function BaseCurrency(chainId, decimals, symbol, name) {
  !Number.isSafeInteger(chainId) ? process.env.NODE_ENV !== "production" ? invariant(false, 'CHAIN_ID') : invariant(false) : void 0;
  !(decimals >= 0 && decimals < 255 && Number.isInteger(decimals)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'DECIMALS') : invariant(false) : void 0;
  this.chainId = chainId;
  this.decimals = decimals;
  this.symbol = symbol;
  this.name = name;
};

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
var Token = /*#__PURE__*/function (_BaseCurrency) {
  _inheritsLoose(Token, _BaseCurrency);
  /**
   *
   * @param chainId {@link BaseCurrency#chainId}
   * @param address The contract address on the chain on which this token lives
   * @param decimals {@link BaseCurrency#decimals}
   * @param symbol {@link BaseCurrency#symbol}
   * @param name {@link BaseCurrency#name}
   * @param bypassChecksum If true it only checks for length === 42, startsWith 0x and contains only hex characters
   */
  function Token(chainId, address, decimals, symbol, name, bypassChecksum) {
    var _this;
    _this = _BaseCurrency.call(this, chainId, decimals, symbol, name) || this;
    _this.isNative = false;
    _this.isToken = true;
    if (bypassChecksum) {
      _this.address = checkValidAddress(address);
    } else {
      _this.address = validateAndParseAddress(address);
    }
    return _this;
  }
  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  var _proto = Token.prototype;
  _proto.equals = function equals(other) {
    return other.isToken && this.chainId === other.chainId && this.address.toLowerCase() === other.address.toLowerCase();
  }
  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */;
  _proto.sortsBefore = function sortsBefore(other) {
    !(this.chainId === other.chainId) ? process.env.NODE_ENV !== "production" ? invariant(false, 'CHAIN_IDS') : invariant(false) : void 0;
    !(this.address.toLowerCase() !== other.address.toLowerCase()) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ADDRESSES') : invariant(false) : void 0;
    return this.address.toLowerCase() < other.address.toLowerCase();
  }
  /**
   * Return this token, which does not need to be wrapped
   */;
  _createClass(Token, [{
    key: "wrapped",
    get: function get() {
      return this;
    }
  }]);
  return Token;
}(BaseCurrency);

var Environment;
(function (Environment) {
  Environment[Environment["LOCAL"] = 0] = "LOCAL";
  Environment[Environment["TESTNET"] = 1] = "TESTNET";
  Environment[Environment["MAINNET"] = 2] = "MAINNET";
})(Environment || (Environment = {}));
var WalletType;
(function (WalletType) {
  WalletType[WalletType["EXTENSION"] = 0] = "EXTENSION";
  WalletType[WalletType["PRIVATEKEY"] = 1] = "PRIVATEKEY";
})(WalletType || (WalletType = {}));
// Example Configuration
var testnetConfig = {
  env: Environment.TESTNET,
  API_ROOT: "https://stag-dex-api.fprotocol.io",
  rpc: 'https://l2-node.regtest.trustless.computer',
  POOL_FACTORY_CONTRACT_ADDRESS: '0x9D921bF7460d1FcfF77d88edd4D34cD1e2F56BDc',
  QUOTER_CONTRACT_ADDRESS: '0xD228465a3E1C64Ed6C627a87132dc6b1552cd0F2',
  SWAP_ROUTER_ADDRESS: '0x3a3885F7a03beC1F4A1c00f155A5d57168fDE205',
  WETH_CONTRACT_ADDRESS: '0x0fba66555b74f13809862bd6f15fffa0a0237059',
  TC_CONTRACT_ADDRESS: '0x8b485d217096cE20A09AF11D15ccCc63323C1469',
  NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS: '0xe6Dc33d13200f0A9CF7cFC7B484aE1891D934234',
  tokens_list: [/*#__PURE__*/new Token(1, '0x0FBa66555B74F13809862BD6f15FffA0A0237059', 18, 'WETH', 'Wrapped Ether'), /*#__PURE__*/new Token(1, '0xB68BB951883A7c5f24C7e2Cca8d9A68CFC606F41', 18, 'USDC', 'USD//C'), /*#__PURE__*/new Token(1, '0x1d45c32C97707C916b350042CEAC2164fb6D00A1', 18, 'WBTC', 'Wrapped BTC')]
};
var mainnetConfig = {
  env: Environment.MAINNET,
  rpc: 'https://node.l2.trustless.computer',
  API_ROOT: "https://dex-api.fprotocol.io",
  POOL_FACTORY_CONTRACT_ADDRESS: '0x1d12AC81710da54A50e2e9095E20dB2D915Ce3C8',
  QUOTER_CONTRACT_ADDRESS: '0x17f8275c3842f977d42Ab09c35042ddE4ec55856',
  SWAP_ROUTER_ADDRESS: '0xB3eAc9358462356B231801309f553c48667B2CB7',
  WETH_CONTRACT_ADDRESS: '0x43bda480de297a14cec95bfb1c6a313615f809ef',
  NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS: '0x7D9D03317e90E477180dcFE28c75f8007Ecc6031',
  TC_CONTRACT_ADDRESS: '0xad771ed0f8c5df06d21a7eda3b00acd6688dd532',
  tokens_list: [/*#__PURE__*/new Token(1, '0x43bda480de297a14cec95bfb1c6a313615f809ef', 18, 'WETH', 'Wrapped Ether'), /*#__PURE__*/new Token(1, '0xe8B280Ebb57bE03adC9d87e207BCD689EfADef96', 18, 'USDC', 'USD//C'), /*#__PURE__*/new Token(1, '0x111808AbE352c8003e0eFfcc04998EaB26Cebe3c', 18, 'WBTC', 'Wrapped BTC'), /*#__PURE__*/new Token(1, '0xdb380837095fbfAA4Ea65e7388Ef35A5FCad0334', 18, 'token1', 'token1'), /*#__PURE__*/new Token(1, '0xBBA317FD4f2Cc8b8906D77cE410691dD9a6ee64F', 18, 'tk3', 'tk3')]
};
var CurrentConfig = mainnetConfig;
var tokenSwap = {
  "in": CurrentConfig.tokens_list[0],
  amountIn: 1,
  out: CurrentConfig.tokens_list[1],
  poolFee: FeeAmount.MEDIUM
};
var tokenLiquidity = {
  token0: CurrentConfig.tokens_list[3],
  token0Amount: 0.5,
  token1: CurrentConfig.tokens_list[4],
  token1Amount: 0.2,
  poolFee: FeeAmount.MEDIUM,
  fractionToRemove: 1,
  fractionToAdd: 0.5
};
function setTOkenSwap(inputToken, amountIn, outToken, poolFee) {
  tokenSwap = {
    "in": inputToken,
    amountIn: amountIn,
    out: outToken,
    poolFee: poolFee
  };
}
function setTOkenIn(inputToken) {
  tokenSwap["in"] = inputToken;
}
function setTOkenOut(outToken) {
  tokenSwap["out"] = outToken;
}
function resetTOkenSwap() {
  tokenSwap = {
    "in": CurrentConfig.tokens_list[0],
    amountIn: 1,
    out: CurrentConfig.tokens_list[1],
    poolFee: FeeAmount.MEDIUM
  };
}
function choiceConFig(environment) {
  if (environment == Environment.TESTNET) {
    CurrentConfig = testnetConfig;
  } else if (environment == Environment.MAINNET) {
    CurrentConfig = mainnetConfig;
  }
  resetTOkenSwap();
}
var CurrentWallet = {
  address: '',
  privateKey: '',
  type: WalletType.PRIVATEKEY
};
function changeWallet(type, address, privateKey) {
  CurrentWallet.address = address;
  CurrentWallet.privateKey = privateKey;
  CurrentWallet.type = type;
}

/**
 * Represents the trustless-swap V3 SwapRouter, and has static methods for helping execute trades.
 */
var SwapRouter = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function SwapRouter() {}
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */
  SwapRouter.swapCallParameters = function swapCallParameters(trades, options) {
    if (!Array.isArray(trades)) {
      trades = [trades];
    }
    var sampleTrade = trades[0];
    var tokenIn = sampleTrade.inputAmount.currency.wrapped;
    var tokenOut = sampleTrade.outputAmount.currency.wrapped;
    // All trades should have the same starting and ending token.
    !trades.every(function (trade) {
      return trade.inputAmount.currency.wrapped.equals(tokenIn);
    }) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN_IN_DIFF') : invariant(false) : void 0;
    !trades.every(function (trade) {
      return trade.outputAmount.currency.wrapped.equals(tokenOut);
    }) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN_OUT_DIFF') : invariant(false) : void 0;
    var calldatas = [];
    var ZERO_IN = CurrencyAmount.fromRawAmount(trades[0].inputAmount.currency, 0);
    var ZERO_OUT = CurrencyAmount.fromRawAmount(trades[0].outputAmount.currency, 0);
    var totalAmountOut = trades.reduce(function (sum, trade) {
      return sum.add(trade.minimumAmountOut(options.slippageTolerance));
    }, ZERO_OUT);
    // flag for whether a refund needs to happen
    var mustRefund = (sampleTrade.inputAmount.currency.isNative || sampleTrade.inputAmount.currency.address.toLowerCase() == CurrentConfig.TC_CONTRACT_ADDRESS.toLowerCase()) && sampleTrade.tradeType === TradeType.EXACT_OUTPUT;
    var inputIsNative = sampleTrade.inputAmount.currency.isNative || sampleTrade.inputAmount.currency.address.toLowerCase() == CurrentConfig.TC_CONTRACT_ADDRESS.toLowerCase();
    // flags for whether funds should be send first to the router
    var outputIsNative = sampleTrade.outputAmount.currency.isNative || sampleTrade.outputAmount.currency.address.toLowerCase() == CurrentConfig.TC_CONTRACT_ADDRESS.toLowerCase();
    var routerMustCustody = outputIsNative || !!options.fee;
    var totalValue = inputIsNative ? trades.reduce(function (sum, trade) {
      return sum.add(trade.maximumAmountIn(options.slippageTolerance));
    }, ZERO_IN) : ZERO_IN;
    // encode permit if necessary
    if (options.inputTokenPermit) {
      !sampleTrade.inputAmount.currency.isToken ? process.env.NODE_ENV !== "production" ? invariant(false, 'NON_TOKEN_PERMIT') : invariant(false) : void 0;
      calldatas.push(SelfPermit.encodePermit(sampleTrade.inputAmount.currency, options.inputTokenPermit));
    }
    var recipient = validateAndParseAddress(options.recipient);
    var deadline = toHex(options.deadline);
    for (var _iterator = _createForOfIteratorHelperLoose(trades), _step; !(_step = _iterator()).done;) {
      var trade = _step.value;
      for (var _iterator2 = _createForOfIteratorHelperLoose(trade.swaps), _step2; !(_step2 = _iterator2()).done;) {
        var _step2$value = _step2.value,
          route = _step2$value.route,
          inputAmount = _step2$value.inputAmount,
          outputAmount = _step2$value.outputAmount;
        var amountIn = toHex(trade.maximumAmountIn(options.slippageTolerance, inputAmount).quotient);
        var amountOut = toHex(trade.minimumAmountOut(options.slippageTolerance, outputAmount).quotient);
        // flag for whether the trade is single hop or not
        var singleHop = route.pools.length === 1;
        if (singleHop) {
          if (trade.tradeType === TradeType.EXACT_INPUT) {
            var _options$sqrtPriceLim;
            var exactInputSingleParams = {
              tokenIn: route.tokenPath[0].address,
              tokenOut: route.tokenPath[1].address,
              fee: route.pools[0].fee,
              recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
              deadline: deadline,
              amountIn: amountIn,
              amountOutMinimum: amountOut,
              sqrtPriceLimitX96: toHex((_options$sqrtPriceLim = options.sqrtPriceLimitX96) != null ? _options$sqrtPriceLim : 0)
            };
            calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('exactInputSingle', [exactInputSingleParams]));
          } else {
            var _options$sqrtPriceLim2;
            var exactOutputSingleParams = {
              tokenIn: route.tokenPath[0].address,
              tokenOut: route.tokenPath[1].address,
              fee: route.pools[0].fee,
              recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
              deadline: deadline,
              amountOut: amountOut,
              amountInMaximum: amountIn,
              sqrtPriceLimitX96: toHex((_options$sqrtPriceLim2 = options.sqrtPriceLimitX96) != null ? _options$sqrtPriceLim2 : 0)
            };
            calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('exactOutputSingle', [exactOutputSingleParams]));
          }
        } else {
          !(options.sqrtPriceLimitX96 === undefined) ? process.env.NODE_ENV !== "production" ? invariant(false, 'MULTIHOP_PRICE_LIMIT') : invariant(false) : void 0;
          var path = encodeRouteToPath(route, trade.tradeType === TradeType.EXACT_OUTPUT);
          if (trade.tradeType === TradeType.EXACT_INPUT) {
            var exactInputParams = {
              path: path,
              recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
              deadline: deadline,
              amountIn: amountIn,
              amountOutMinimum: amountOut
            };
            calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('exactInput', [exactInputParams]));
          } else {
            var exactOutputParams = {
              path: path,
              recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
              deadline: deadline,
              amountOut: amountOut,
              amountInMaximum: amountIn
            };
            calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('exactOutput', [exactOutputParams]));
          }
        }
      }
    }
    // unwrap
    if (routerMustCustody) {
      if (!!options.fee) {
        if (outputIsNative) {
          calldatas.push(Payments.encodeUnwrapWETH9(totalAmountOut.quotient, recipient, options.fee));
        } else {
          calldatas.push(Payments.encodeSweepToken(sampleTrade.outputAmount.currency.wrapped, totalAmountOut.quotient, recipient, options.fee));
        }
      } else {
        calldatas.push(Payments.encodeUnwrapWETH9(totalAmountOut.quotient, recipient));
      }
    }
    // refund
    if (mustRefund) {
      calldatas.push(Payments.encodeRefundETH());
    }
    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(totalValue.quotient)
    };
  };
  return SwapRouter;
}();
SwapRouter.INTERFACE = /*#__PURE__*/new Interface(ISwapRouter.abi);

var _format$4 = "hh-sol-artifact-1";
var contractName$4 = "Quoter";
var sourceName$4 = "contracts/lens/Quoter.sol";
var abi$4 = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_factory",
				type: "address"
			},
			{
				internalType: "address",
				name: "_WTC",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		inputs: [
		],
		name: "WTC",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes",
				name: "path",
				type: "bytes"
			},
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			}
		],
		name: "quoteExactInput",
		outputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "tokenIn",
				type: "address"
			},
			{
				internalType: "address",
				name: "tokenOut",
				type: "address"
			},
			{
				internalType: "uint24",
				name: "fee",
				type: "uint24"
			},
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint160",
				name: "sqrtPriceLimitX96",
				type: "uint160"
			}
		],
		name: "quoteExactInputSingle",
		outputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes",
				name: "path",
				type: "bytes"
			},
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			}
		],
		name: "quoteExactOutput",
		outputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "tokenIn",
				type: "address"
			},
			{
				internalType: "address",
				name: "tokenOut",
				type: "address"
			},
			{
				internalType: "uint24",
				name: "fee",
				type: "uint24"
			},
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "uint160",
				name: "sqrtPriceLimitX96",
				type: "uint160"
			}
		],
		name: "quoteExactOutputSingle",
		outputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "int256",
				name: "amount0Delta",
				type: "int256"
			},
			{
				internalType: "int256",
				name: "amount1Delta",
				type: "int256"
			},
			{
				internalType: "bytes",
				name: "path",
				type: "bytes"
			}
		],
		name: "V3Callback",
		outputs: [
		],
		stateMutability: "view",
		type: "function"
	}
];
var bytecode$4 = "0x60c060405234801561001057600080fd5b506040516112e53803806112e583398101604081905261002f91610069565b6001600160601b0319606092831b8116608052911b1660a05261009b565b80516001600160a01b038116811461006457600080fd5b919050565b6000806040838503121561007b578182fd5b6100848361004d565b91506100926020840161004d565b90509250929050565b60805160601c60a05160601c6112176100ce60003980610342525080610366528061058652806106d552506112176000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063c45a01551161005b578063c45a0155146100d3578063cdca1753146100db578063f7729d43146100ee578063fa461e33146101015761007d565b80632f80bb1d1461008257806330d07f21146100ab5780634aa4a4fc146100be575b600080fd5b610095610090366004610e9e565b610116565b6040516100a29190611148565b60405180910390f35b6100956100b9366004610e30565b61017b565b6100c6610340565b6040516100a29190611084565b6100c6610364565b6100956100e9366004610e9e565b610388565b6100956100fc366004610e30565b6103d6565b61011461010f366004610f04565b610555565b005b60005b600061012484610660565b9050600080600061013487610668565b92509250925061014882848389600061017b565b955083156101605761015987610699565b965061016c565b85945050505050610175565b50505050610119565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff808616878216109083166101a65760008490555b6101b18787876106ce565b73ffffffffffffffffffffffffffffffffffffffff1663128acb0830836101d78861070c565b60000373ffffffffffffffffffffffffffffffffffffffff8816156101fc5787610222565b8561021b5773fffd8963efd1fc6a506488495d951d5263988d25610222565b6401000276a45b8b8b8e6040516020016102379392919061101e565b6040516020818303038152906040526040518663ffffffff1660e01b81526004016102669594939291906110a5565b6040805180830381600087803b15801561027f57600080fd5b505af19250505080156102cd575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682019092526102ca91810190610ee1565b60015b610333573d8080156102fb576040519150601f19603f3d011682016040523d82523d6000602084013e610300565b606091505b5073ffffffffffffffffffffffffffffffffffffffff841661032157600080555b61032a8161073e565b92505050610337565b5050505b95945050505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b7f000000000000000000000000000000000000000000000000000000000000000081565b60005b600061039684610660565b905060008060006103a687610668565b9250925092506103ba8383838960006103d6565b95508315610160576103cb87610699565b96505050505061038b565b600073ffffffffffffffffffffffffffffffffffffffff808616908716106103ff8787876106ce565b73ffffffffffffffffffffffffffffffffffffffff1663128acb0830836104258861070c565b73ffffffffffffffffffffffffffffffffffffffff881615610447578761046d565b856104665773fffd8963efd1fc6a506488495d951d5263988d2561046d565b6401000276a45b8c8b8d6040516020016104829392919061101e565b6040516020818303038152906040526040518663ffffffff1660e01b81526004016104b19594939291906110a5565b6040805180830381600087803b1580156104ca57600080fd5b505af1925050508015610518575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016820190925261051591810190610ee1565b60015b610333573d808015610546576040519150601f19603f3d011682016040523d82523d6000602084013e61054b565b606091505b5061032a8161073e565b60008313806105645750600082135b61056d57600080fd5b600080600061057b84610668565b9250925092506105ad7f00000000000000000000000000000000000000000000000000000000000000008484846107ef565b5060008060008089136105f3578573ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1610888a600003610628565b8473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff161089896000035b925092509250821561063f57604051818152602081fd5b6000541561065557600054811461065557600080fd5b604051828152602081fd5b516042111590565b600080806106768482610805565b9250610683846014610905565b9050610690846017610805565b91509193909250565b80516060906101759083906017907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe9016109f5565b60006107047f00000000000000000000000000000000000000000000000000000000000000006106ff868686610bdc565b610c59565b949350505050565b60007f8000000000000000000000000000000000000000000000000000000000000000821061073a57600080fd5b5090565b600081516020146107db5760448251101561078e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161078590611111565b60405180910390fd5b600482019150818060200190518101906107a89190610f52565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161078591906110f7565b818060200190518101906101759190610fbc565b600061033785610800868686610bdc565b610d8f565b60008182601401101561087957604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f746f416464726573735f6f766572666c6f770000000000000000000000000000604482015290519081900360640190fd5b81601401835110156108ec57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f746f416464726573735f6f75744f66426f756e64730000000000000000000000604482015290519081900360640190fd5b5001602001516c01000000000000000000000000900490565b60008182600301101561097957604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f746f55696e7432345f6f766572666c6f77000000000000000000000000000000604482015290519081900360640190fd5b81600301835110156109ec57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f746f55696e7432345f6f75744f66426f756e6473000000000000000000000000604482015290519081900360640190fd5b50016003015190565b60608182601f011015610a6957604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f736c6963655f6f766572666c6f77000000000000000000000000000000000000604482015290519081900360640190fd5b828284011015610ada57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f736c6963655f6f766572666c6f77000000000000000000000000000000000000604482015290519081900360640190fd5b81830184511015610b4c57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f736c6963655f6f75744f66426f756e6473000000000000000000000000000000604482015290519081900360640190fd5b606082158015610b6b5760405191506000825260208201604052610bd3565b6040519150601f8416801560200281840101858101878315602002848b0101015b81831015610ba4578051835260209283019201610b8c565b5050858452601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016604052505b50949350505050565b610be4610dbf565b8273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161115610c1c579192915b506040805160608101825273ffffffffffffffffffffffffffffffffffffffff948516815292909316602083015262ffffff169181019190915290565b6000816020015173ffffffffffffffffffffffffffffffffffffffff16826000015173ffffffffffffffffffffffffffffffffffffffff1610610c9b57600080fd5b508051602080830151604093840151845173ffffffffffffffffffffffffffffffffffffffff94851681850152939091168385015262ffffff166060808401919091528351808403820181526080840185528051908301207fff0000000000000000000000000000000000000000000000000000000000000060a085015294901b7fffffffffffffffffffffffffffffffffffffffff0000000000000000000000001660a183015260b58201939093527fe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b5460d5808301919091528251808303909101815260f5909101909152805191012090565b6000610d9b8383610c59565b90503373ffffffffffffffffffffffffffffffffffffffff82161461017557600080fd5b604080516060810182526000808252602082018190529181019190915290565b600082601f830112610def578081fd5b8135610e02610dfd82611175565b611151565b818152846020838601011115610e16578283fd5b816020850160208301379081016020019190915292915050565b600080600080600060a08688031215610e47578081fd5b8535610e52816111e5565b94506020860135610e62816111e5565b9350604086013562ffffff81168114610e79578182fd5b9250606086013591506080860135610e90816111e5565b809150509295509295909350565b60008060408385031215610eb0578182fd5b823567ffffffffffffffff811115610ec6578283fd5b610ed285828601610ddf565b95602094909401359450505050565b60008060408385031215610ef3578182fd5b505080516020909101519092909150565b600080600060608486031215610f18578283fd5b8335925060208401359150604084013567ffffffffffffffff811115610f3c578182fd5b610f4886828701610ddf565b9150509250925092565b600060208284031215610f63578081fd5b815167ffffffffffffffff811115610f79578182fd5b8201601f81018413610f89578182fd5b8051610f97610dfd82611175565b818152856020838501011115610fab578384fd5b6103378260208301602086016111b5565b600060208284031215610fcd578081fd5b5051919050565b60008151808452610fec8160208601602086016111b5565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b606093841b7fffffffffffffffffffffffffffffffffffffffff000000000000000000000000908116825260e89390931b7fffffff0000000000000000000000000000000000000000000000000000000000166014820152921b166017820152602b0190565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b600073ffffffffffffffffffffffffffffffffffffffff8088168352861515602084015285604084015280851660608401525060a060808301526110ec60a0830184610fd4565b979650505050505050565b60006020825261110a6020830184610fd4565b9392505050565b60208082526010908201527f556e6578706563746564206572726f7200000000000000000000000000000000604082015260600190565b90815260200190565b60405181810167ffffffffffffffff8111828210171561116d57fe5b604052919050565b600067ffffffffffffffff82111561118957fe5b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b60005b838110156111d05781810151838201526020016111b8565b838111156111df576000848401525b50505050565b73ffffffffffffffffffffffffffffffffffffffff8116811461120757600080fd5b5056fea164736f6c6343000706000a";
var deployedBytecode$4 = "0x608060405234801561001057600080fd5b506004361061007d5760003560e01c8063c45a01551161005b578063c45a0155146100d3578063cdca1753146100db578063f7729d43146100ee578063fa461e33146101015761007d565b80632f80bb1d1461008257806330d07f21146100ab5780634aa4a4fc146100be575b600080fd5b610095610090366004610e9e565b610116565b6040516100a29190611148565b60405180910390f35b6100956100b9366004610e30565b61017b565b6100c6610340565b6040516100a29190611084565b6100c6610364565b6100956100e9366004610e9e565b610388565b6100956100fc366004610e30565b6103d6565b61011461010f366004610f04565b610555565b005b60005b600061012484610660565b9050600080600061013487610668565b92509250925061014882848389600061017b565b955083156101605761015987610699565b965061016c565b85945050505050610175565b50505050610119565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff808616878216109083166101a65760008490555b6101b18787876106ce565b73ffffffffffffffffffffffffffffffffffffffff1663128acb0830836101d78861070c565b60000373ffffffffffffffffffffffffffffffffffffffff8816156101fc5787610222565b8561021b5773fffd8963efd1fc6a506488495d951d5263988d25610222565b6401000276a45b8b8b8e6040516020016102379392919061101e565b6040516020818303038152906040526040518663ffffffff1660e01b81526004016102669594939291906110a5565b6040805180830381600087803b15801561027f57600080fd5b505af19250505080156102cd575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682019092526102ca91810190610ee1565b60015b610333573d8080156102fb576040519150601f19603f3d011682016040523d82523d6000602084013e610300565b606091505b5073ffffffffffffffffffffffffffffffffffffffff841661032157600080555b61032a8161073e565b92505050610337565b5050505b95945050505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b7f000000000000000000000000000000000000000000000000000000000000000081565b60005b600061039684610660565b905060008060006103a687610668565b9250925092506103ba8383838960006103d6565b95508315610160576103cb87610699565b96505050505061038b565b600073ffffffffffffffffffffffffffffffffffffffff808616908716106103ff8787876106ce565b73ffffffffffffffffffffffffffffffffffffffff1663128acb0830836104258861070c565b73ffffffffffffffffffffffffffffffffffffffff881615610447578761046d565b856104665773fffd8963efd1fc6a506488495d951d5263988d2561046d565b6401000276a45b8c8b8d6040516020016104829392919061101e565b6040516020818303038152906040526040518663ffffffff1660e01b81526004016104b19594939291906110a5565b6040805180830381600087803b1580156104ca57600080fd5b505af1925050508015610518575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016820190925261051591810190610ee1565b60015b610333573d808015610546576040519150601f19603f3d011682016040523d82523d6000602084013e61054b565b606091505b5061032a8161073e565b60008313806105645750600082135b61056d57600080fd5b600080600061057b84610668565b9250925092506105ad7f00000000000000000000000000000000000000000000000000000000000000008484846107ef565b5060008060008089136105f3578573ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1610888a600003610628565b8473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff161089896000035b925092509250821561063f57604051818152602081fd5b6000541561065557600054811461065557600080fd5b604051828152602081fd5b516042111590565b600080806106768482610805565b9250610683846014610905565b9050610690846017610805565b91509193909250565b80516060906101759083906017907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe9016109f5565b60006107047f00000000000000000000000000000000000000000000000000000000000000006106ff868686610bdc565b610c59565b949350505050565b60007f8000000000000000000000000000000000000000000000000000000000000000821061073a57600080fd5b5090565b600081516020146107db5760448251101561078e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161078590611111565b60405180910390fd5b600482019150818060200190518101906107a89190610f52565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161078591906110f7565b818060200190518101906101759190610fbc565b600061033785610800868686610bdc565b610d8f565b60008182601401101561087957604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f746f416464726573735f6f766572666c6f770000000000000000000000000000604482015290519081900360640190fd5b81601401835110156108ec57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f746f416464726573735f6f75744f66426f756e64730000000000000000000000604482015290519081900360640190fd5b5001602001516c01000000000000000000000000900490565b60008182600301101561097957604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f746f55696e7432345f6f766572666c6f77000000000000000000000000000000604482015290519081900360640190fd5b81600301835110156109ec57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f746f55696e7432345f6f75744f66426f756e6473000000000000000000000000604482015290519081900360640190fd5b50016003015190565b60608182601f011015610a6957604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f736c6963655f6f766572666c6f77000000000000000000000000000000000000604482015290519081900360640190fd5b828284011015610ada57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f736c6963655f6f766572666c6f77000000000000000000000000000000000000604482015290519081900360640190fd5b81830184511015610b4c57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f736c6963655f6f75744f66426f756e6473000000000000000000000000000000604482015290519081900360640190fd5b606082158015610b6b5760405191506000825260208201604052610bd3565b6040519150601f8416801560200281840101858101878315602002848b0101015b81831015610ba4578051835260209283019201610b8c565b5050858452601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016604052505b50949350505050565b610be4610dbf565b8273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161115610c1c579192915b506040805160608101825273ffffffffffffffffffffffffffffffffffffffff948516815292909316602083015262ffffff169181019190915290565b6000816020015173ffffffffffffffffffffffffffffffffffffffff16826000015173ffffffffffffffffffffffffffffffffffffffff1610610c9b57600080fd5b508051602080830151604093840151845173ffffffffffffffffffffffffffffffffffffffff94851681850152939091168385015262ffffff166060808401919091528351808403820181526080840185528051908301207fff0000000000000000000000000000000000000000000000000000000000000060a085015294901b7fffffffffffffffffffffffffffffffffffffffff0000000000000000000000001660a183015260b58201939093527fe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b5460d5808301919091528251808303909101815260f5909101909152805191012090565b6000610d9b8383610c59565b90503373ffffffffffffffffffffffffffffffffffffffff82161461017557600080fd5b604080516060810182526000808252602082018190529181019190915290565b600082601f830112610def578081fd5b8135610e02610dfd82611175565b611151565b818152846020838601011115610e16578283fd5b816020850160208301379081016020019190915292915050565b600080600080600060a08688031215610e47578081fd5b8535610e52816111e5565b94506020860135610e62816111e5565b9350604086013562ffffff81168114610e79578182fd5b9250606086013591506080860135610e90816111e5565b809150509295509295909350565b60008060408385031215610eb0578182fd5b823567ffffffffffffffff811115610ec6578283fd5b610ed285828601610ddf565b95602094909401359450505050565b60008060408385031215610ef3578182fd5b505080516020909101519092909150565b600080600060608486031215610f18578283fd5b8335925060208401359150604084013567ffffffffffffffff811115610f3c578182fd5b610f4886828701610ddf565b9150509250925092565b600060208284031215610f63578081fd5b815167ffffffffffffffff811115610f79578182fd5b8201601f81018413610f89578182fd5b8051610f97610dfd82611175565b818152856020838501011115610fab578384fd5b6103378260208301602086016111b5565b600060208284031215610fcd578081fd5b5051919050565b60008151808452610fec8160208601602086016111b5565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b606093841b7fffffffffffffffffffffffffffffffffffffffff000000000000000000000000908116825260e89390931b7fffffff0000000000000000000000000000000000000000000000000000000000166014820152921b166017820152602b0190565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b600073ffffffffffffffffffffffffffffffffffffffff8088168352861515602084015285604084015280851660608401525060a060808301526110ec60a0830184610fd4565b979650505050505050565b60006020825261110a6020830184610fd4565b9392505050565b60208082526010908201527f556e6578706563746564206572726f7200000000000000000000000000000000604082015260600190565b90815260200190565b60405181810167ffffffffffffffff8111828210171561116d57fe5b604052919050565b600067ffffffffffffffff82111561118957fe5b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b60005b838110156111d05781810151838201526020016111b8565b838111156111df576000848401525b50505050565b73ffffffffffffffffffffffffffffffffffffffff8116811461120757600080fd5b5056fea164736f6c6343000706000a";
var linkReferences$4 = {
};
var deployedLinkReferences$4 = {
};
var IQuoter = {
	_format: _format$4,
	contractName: contractName$4,
	sourceName: sourceName$4,
	abi: abi$4,
	bytecode: bytecode$4,
	deployedBytecode: deployedBytecode$4,
	linkReferences: linkReferences$4,
	deployedLinkReferences: deployedLinkReferences$4
};

var _format$5 = "hh-sol-artifact-1";
var contractName$5 = "QuoterV2";
var sourceName$5 = "contracts/lens/QuoterV2.sol";
var abi$5 = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_factory",
				type: "address"
			},
			{
				internalType: "address",
				name: "_WETH9",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		inputs: [
		],
		name: "WETH9",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes",
				name: "path",
				type: "bytes"
			},
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			}
		],
		name: "quoteExactInput",
		outputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "uint160[]",
				name: "sqrtPriceX96AfterList",
				type: "uint160[]"
			},
			{
				internalType: "uint32[]",
				name: "initializedTicksCrossedList",
				type: "uint32[]"
			},
			{
				internalType: "uint256",
				name: "gasEstimate",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "tokenIn",
						type: "address"
					},
					{
						internalType: "address",
						name: "tokenOut",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amountIn",
						type: "uint256"
					},
					{
						internalType: "uint24",
						name: "fee",
						type: "uint24"
					},
					{
						internalType: "uint160",
						name: "sqrtPriceLimitX96",
						type: "uint160"
					}
				],
				internalType: "struct IQuoterV2.QuoteExactInputSingleParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "quoteExactInputSingle",
		outputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "uint160",
				name: "sqrtPriceX96After",
				type: "uint160"
			},
			{
				internalType: "uint32",
				name: "initializedTicksCrossed",
				type: "uint32"
			},
			{
				internalType: "uint256",
				name: "gasEstimate",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes",
				name: "path",
				type: "bytes"
			},
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			}
		],
		name: "quoteExactOutput",
		outputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint160[]",
				name: "sqrtPriceX96AfterList",
				type: "uint160[]"
			},
			{
				internalType: "uint32[]",
				name: "initializedTicksCrossedList",
				type: "uint32[]"
			},
			{
				internalType: "uint256",
				name: "gasEstimate",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "tokenIn",
						type: "address"
					},
					{
						internalType: "address",
						name: "tokenOut",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					},
					{
						internalType: "uint24",
						name: "fee",
						type: "uint24"
					},
					{
						internalType: "uint160",
						name: "sqrtPriceLimitX96",
						type: "uint160"
					}
				],
				internalType: "struct IQuoterV2.QuoteExactOutputSingleParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "quoteExactOutputSingle",
		outputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint160",
				name: "sqrtPriceX96After",
				type: "uint160"
			},
			{
				internalType: "uint32",
				name: "initializedTicksCrossed",
				type: "uint32"
			},
			{
				internalType: "uint256",
				name: "gasEstimate",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "int256",
				name: "amount0Delta",
				type: "int256"
			},
			{
				internalType: "int256",
				name: "amount1Delta",
				type: "int256"
			},
			{
				internalType: "bytes",
				name: "path",
				type: "bytes"
			}
		],
		name: "V3SwapCallback",
		outputs: [
		],
		stateMutability: "view",
		type: "function"
	}
];
var bytecode$5 = "0x60c06040523480156200001157600080fd5b506040516200212c3803806200212c833981016040819052620000349162000070565b6001600160601b0319606092831b8116608052911b1660a052620000a7565b80516001600160a01b03811681146200006b57600080fd5b919050565b6000806040838503121562000083578182fd5b6200008e8362000053565b91506200009e6020840162000053565b90509250929050565b60805160601c60a05160601c612051620000db60003980610321525080610577528061095d5280610b9252506120516000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063c45a01551161005b578063c45a0155146100e6578063c6a5026a146100ee578063cdca175314610101578063fa461e33146101145761007d565b80632f80bb1d146100825780634aa4a4fc146100ae578063bd21704a146100c3575b600080fd5b610095610090366004611b2b565b610129565b6040516100a59493929190611eac565b60405180910390f35b6100b661031f565b6040516100a59190611def565b6100d66100d1366004611c49565b610343565b6040516100a59493929190611f54565b6100b6610575565b6100d66100fc366004611c49565b610599565b61009561010f366004611b2b565b610754565b610127610122366004611b91565b61092c565b005b6000606080600061013986610ae8565b67ffffffffffffffff8111801561014f57600080fd5b50604051908082528060200260200182016040528015610179578160200160208202803683370190505b50925061018586610ae8565b67ffffffffffffffff8111801561019b57600080fd5b506040519080825280602002602001820160405280156101c5578160200160208202803683370190505b50915060005b60008060006101d98a610b17565b92509250925060008060008061025c6040518060a001604052808873ffffffffffffffffffffffffffffffffffffffff1681526020018973ffffffffffffffffffffffffffffffffffffffff1681526020018f81526020018762ffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff16815250610343565b9350935093509350828b898151811061027157fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050818a89815181106102b857fe5b63ffffffff90921660209283029190910190910152929b50968201966001909601958b926102e58e610b48565b156102fa576102f38e610b50565b9d5061030a565b8c9b505050505050505050610316565b505050505050506101cb565b92959194509250565b7f000000000000000000000000000000000000000000000000000000000000000081565b60208101518151606083015160009283928392839273ffffffffffffffffffffffffffffffffffffffff808216908416109284926103819290610b8b565b9050866080015173ffffffffffffffffffffffffffffffffffffffff16600014156103af5760408701516000555b60005a90508173ffffffffffffffffffffffffffffffffffffffff1663128acb0830856103df8c60400151610bc9565b6000038c6080015173ffffffffffffffffffffffffffffffffffffffff1660001461040e578c60800151610434565b8761042d5773fffd8963efd1fc6a506488495d951d5263988d25610434565b6401000276a45b8d602001518e606001518f6000015160405160200161045593929190611d89565b6040516020818303038152906040526040518663ffffffff1660e01b8152600401610484959493929190611e10565b6040805180830381600087803b15801561049d57600080fd5b505af19250505080156104eb575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682019092526104e891810190611b6e565b60015b610568573d808015610519576040519150601f19603f3d011682016040523d82523d6000602084013e61051e565b606091505b505a82039450886080015173ffffffffffffffffffffffffffffffffffffffff166000141561054c57600080555b610557818487610bfb565b97509750975097505050505061056e565b50505050505b9193509193565b7f000000000000000000000000000000000000000000000000000000000000000081565b60208101518151606083015160009283928392839273ffffffffffffffffffffffffffffffffffffffff808216908416109284926105d79290610b8b565b905060005a90508173ffffffffffffffffffffffffffffffffffffffff1663128acb0830856106098c60400151610bc9565b60808d015173ffffffffffffffffffffffffffffffffffffffff1615610633578c60800151610659565b876106525773fffd8963efd1fc6a506488495d951d5263988d25610659565b6401000276a45b8d600001518e606001518f6020015160405160200161067a93929190611d89565b6040516020818303038152906040526040518663ffffffff1660e01b81526004016106a9959493929190611e10565b6040805180830381600087803b1580156106c257600080fd5b505af1925050508015610710575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016820190925261070d91810190611b6e565b60015b610568573d80801561073e576040519150601f19603f3d011682016040523d82523d6000602084013e610743565b606091505b505a82039450610557818487610bfb565b6000606080600061076486610ae8565b67ffffffffffffffff8111801561077a57600080fd5b506040519080825280602002602001820160405280156107a4578160200160208202803683370190505b5092506107b086610ae8565b67ffffffffffffffff811180156107c657600080fd5b506040519080825280602002602001820160405280156107f0578160200160208202803683370190505b50915060005b60008060006108048a610b17565b9250925092506000806000806108876040518060a001604052808973ffffffffffffffffffffffffffffffffffffffff1681526020018873ffffffffffffffffffffffffffffffffffffffff1681526020018f81526020018762ffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff16815250610599565b9350935093509350828b898151811061089c57fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050818a89815181106108e357fe5b63ffffffff90921660209283029190910190910152929b50968201966001909601958b926109108e610b48565b156102fa5761091e8e610b50565b9d50505050505050506107f6565b600083138061093b5750600082135b61094457600080fd5b600080600061095284610b17565b9250925092506109847f0000000000000000000000000000000000000000000000000000000000000000848484610ccf565b5060008060008089136109ca578573ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1610888a6000036109ff565b8473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff161089896000035b9250925092506000610a12878787610b8b565b90506000808273ffffffffffffffffffffffffffffffffffffffff16633850c7bd6040518163ffffffff1660e01b815260040160e06040518083038186803b158015610a5d57600080fd5b505afa158015610a71573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a959190611c6b565b5050505050915091508515610abb57604051848152826020820152816040820152606081fd5b60005415610ad1576000548414610ad157600080fd5b604051858152826020820152816040820152606081fd5b805160177fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec909101045b919050565b60008080610b258482610cee565b9250610b32846014610dee565b9050610b3f846017610cee565b91509193909250565b516042111590565b8051606090610b859083906017907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe901610ede565b92915050565b6000610bc17f0000000000000000000000000000000000000000000000000000000000000000610bbc8686866110c5565b611142565b949350505050565b60007f80000000000000000000000000000000000000000000000000000000000000008210610bf757600080fd5b5090565b6000806000806000808773ffffffffffffffffffffffffffffffffffffffff16633850c7bd6040518163ffffffff1660e01b815260040160e06040518083038186803b158015610c4a57600080fd5b505afa158015610c5e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c829190611c6b565b50939650610c9794508d935061127892505050565b91975095509050610cbf73ffffffffffffffffffffffffffffffffffffffff89168383611339565b9350869250505093509350935093565b6000610ce585610ce08686866110c5565b611991565b95945050505050565b600081826014011015610d6257604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f746f416464726573735f6f766572666c6f770000000000000000000000000000604482015290519081900360640190fd5b8160140183511015610dd557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f746f416464726573735f6f75744f66426f756e64730000000000000000000000604482015290519081900360640190fd5b5001602001516c01000000000000000000000000900490565b600081826003011015610e6257604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f746f55696e7432345f6f766572666c6f77000000000000000000000000000000604482015290519081900360640190fd5b8160030183511015610ed557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f746f55696e7432345f6f75744f66426f756e6473000000000000000000000000604482015290519081900360640190fd5b50016003015190565b60608182601f011015610f5257604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f736c6963655f6f766572666c6f77000000000000000000000000000000000000604482015290519081900360640190fd5b828284011015610fc357604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f736c6963655f6f766572666c6f77000000000000000000000000000000000000604482015290519081900360640190fd5b8183018451101561103557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f736c6963655f6f75744f66426f756e6473000000000000000000000000000000604482015290519081900360640190fd5b60608215801561105457604051915060008252602082016040526110bc565b6040519150601f8416801560200281840101858101878315602002848b0101015b8183101561108d578051835260209283019201611075565b5050858452601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016604052505b50949350505050565b6110cd6119fa565b8273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161115611105579192915b506040805160608101825273ffffffffffffffffffffffffffffffffffffffff948516815292909316602083015262ffffff169181019190915290565b6000816020015173ffffffffffffffffffffffffffffffffffffffff16826000015173ffffffffffffffffffffffffffffffffffffffff161061118457600080fd5b508051602080830151604093840151845173ffffffffffffffffffffffffffffffffffffffff94851681850152939091168385015262ffffff166060808401919091528351808403820181526080840185528051908301207fff0000000000000000000000000000000000000000000000000000000000000060a085015294901b7fffffffffffffffffffffffffffffffffffffffff0000000000000000000000001660a183015260b58201939093527fe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b5460d5808301919091528251808303909101815260f5909101909152805191012090565b60008060008351606014611318576044845110156112cb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112c290611e75565b60405180910390fd5b600484019350838060200190518101906112e59190611bdf565b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112c29190611e62565b8380602001905181019061132c9190611d02565b9250925092509193909250565b60008060008060008060008060088b73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561138d57600080fd5b505afa1580156113a1573d6000803e3d6000fd5b505050506040513d60208110156113b757600080fd5b5051600290810b908c900b816113c957fe5b0560020b901d905060006101008c73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561141c57600080fd5b505afa158015611430573d6000803e3d6000fd5b505050506040513d602081101561144657600080fd5b5051600290810b908d900b8161145857fe5b0560020b8161146357fe5b079050600060088d73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b1580156114b057600080fd5b505afa1580156114c4573d6000803e3d6000fd5b505050506040513d60208110156114da57600080fd5b5051600290810b908d900b816114ec57fe5b0560020b901d905060006101008e73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561153f57600080fd5b505afa158015611553573d6000803e3d6000fd5b505050506040513d602081101561156957600080fd5b5051600290810b908e900b8161157b57fe5b0560020b8161158657fe5b07905060008160ff166001901b8f73ffffffffffffffffffffffffffffffffffffffff16635339c296856040518263ffffffff1660e01b8152600401808260010b815260200191505060206040518083038186803b1580156115e757600080fd5b505afa1580156115fb573d6000803e3d6000fd5b505050506040513d602081101561161157600080fd5b5051161180156116a457508d73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561166257600080fd5b505afa158015611676573d6000803e3d6000fd5b505050506040513d602081101561168c57600080fd5b5051600290810b908d900b8161169e57fe5b0760020b155b80156116b557508b60020b8d60020b135b945060008360ff166001901b8f73ffffffffffffffffffffffffffffffffffffffff16635339c296876040518263ffffffff1660e01b8152600401808260010b815260200191505060206040518083038186803b15801561171557600080fd5b505afa158015611729573d6000803e3d6000fd5b505050506040513d602081101561173f57600080fd5b5051161180156117d257508d73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561179057600080fd5b505afa1580156117a4573d6000803e3d6000fd5b505050506040513d60208110156117ba57600080fd5b5051600290810b908e900b816117cc57fe5b0760020b155b80156117e357508b60020b8d60020b125b95508160010b8460010b128061180f57508160010b8460010b14801561180f57508060ff168360ff1611155b1561182557839950829750819850809650611832565b8199508097508398508296505b50507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60ff87161b9150505b8560010b8760010b13611969578560010b8760010b14156118a3577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60ff858103161c165b6000818c73ffffffffffffffffffffffffffffffffffffffff16635339c2968a6040518263ffffffff1660e01b8152600401808260010b815260200191505060206040518083038186803b1580156118fa57600080fd5b505afa15801561190e573d6000803e3d6000fd5b505050506040513d602081101561192457600080fd5b5051169050611932816119c1565b61ffff16989098019750506001909501947fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff61185e565b8115611976576001880397505b8215611983576001880397505b505050505050509392505050565b600061199d8383611142565b90503373ffffffffffffffffffffffffffffffffffffffff821614610b8557600080fd5b6000805b8215610b85577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8301909216916001016119c5565b604080516060810182526000808252602082018190529181019190915290565b600082601f830112611a2a578081fd5b8135611a3d611a3882611faf565b611f8b565b818152846020838601011115611a51578283fd5b816020850160208301379081016020019190915292915050565b8051600281900b8114610b1257600080fd5b600060a08284031215611a8e578081fd5b60405160a0810181811067ffffffffffffffff82111715611aab57fe5b6040529050808235611abc8161201f565b81526020830135611acc8161201f565b602082015260408381013590820152606083013562ffffff81168114611af157600080fd5b6060820152611b0260808401611b0e565b60808201525092915050565b8035610b128161201f565b805161ffff81168114610b1257600080fd5b60008060408385031215611b3d578182fd5b823567ffffffffffffffff811115611b53578283fd5b611b5f85828601611a1a565b95602094909401359450505050565b60008060408385031215611b80578182fd5b505080516020909101519092909150565b600080600060608486031215611ba5578081fd5b8335925060208401359150604084013567ffffffffffffffff811115611bc9578182fd5b611bd586828701611a1a565b9150509250925092565b600060208284031215611bf0578081fd5b815167ffffffffffffffff811115611c06578182fd5b8201601f81018413611c16578182fd5b8051611c24611a3882611faf565b818152856020838501011115611c38578384fd5b610ce5826020830160208601611fef565b600060a08284031215611c5a578081fd5b611c648383611a7d565b9392505050565b600080600080600080600060e0888a031215611c85578283fd5b8751611c908161201f565b9650611c9e60208901611a6b565b9550611cac60408901611b19565b9450611cba60608901611b19565b9350611cc860808901611b19565b925060a088015160ff81168114611cdd578283fd5b60c08901519092508015158114611cf2578182fd5b8091505092959891949750929550565b600080600060608486031215611d16578081fd5b835192506020840151611d288161201f565b9150611d3660408501611a6b565b90509250925092565b60008151808452611d57816020860160208601611fef565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b606093841b7fffffffffffffffffffffffffffffffffffffffff000000000000000000000000908116825260e89390931b7fffffff0000000000000000000000000000000000000000000000000000000000166014820152921b166017820152602b0190565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b600073ffffffffffffffffffffffffffffffffffffffff8088168352861515602084015285604084015280851660608401525060a06080830152611e5760a0830184611d3f565b979650505050505050565b600060208252611c646020830184611d3f565b60208082526010908201527f556e6578706563746564206572726f7200000000000000000000000000000000604082015260600190565b600060808201868352602060808185015281875180845260a0860191508289019350845b81811015611f0257845173ffffffffffffffffffffffffffffffffffffffff1683529383019391830191600101611ed0565b505084810360408601528651808252908201925081870190845b81811015611f3e57825163ffffffff1685529383019391830191600101611f1c565b5050505060609290920192909252949350505050565b93845273ffffffffffffffffffffffffffffffffffffffff92909216602084015263ffffffff166040830152606082015260800190565b60405181810167ffffffffffffffff81118282101715611fa757fe5b604052919050565b600067ffffffffffffffff821115611fc357fe5b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b60005b8381101561200a578181015183820152602001611ff2565b83811115612019576000848401525b50505050565b73ffffffffffffffffffffffffffffffffffffffff8116811461204157600080fd5b5056fea164736f6c6343000706000a";
var deployedBytecode$5 = "0x608060405234801561001057600080fd5b506004361061007d5760003560e01c8063c45a01551161005b578063c45a0155146100e6578063c6a5026a146100ee578063cdca175314610101578063fa461e33146101145761007d565b80632f80bb1d146100825780634aa4a4fc146100ae578063bd21704a146100c3575b600080fd5b610095610090366004611b2b565b610129565b6040516100a59493929190611eac565b60405180910390f35b6100b661031f565b6040516100a59190611def565b6100d66100d1366004611c49565b610343565b6040516100a59493929190611f54565b6100b6610575565b6100d66100fc366004611c49565b610599565b61009561010f366004611b2b565b610754565b610127610122366004611b91565b61092c565b005b6000606080600061013986610ae8565b67ffffffffffffffff8111801561014f57600080fd5b50604051908082528060200260200182016040528015610179578160200160208202803683370190505b50925061018586610ae8565b67ffffffffffffffff8111801561019b57600080fd5b506040519080825280602002602001820160405280156101c5578160200160208202803683370190505b50915060005b60008060006101d98a610b17565b92509250925060008060008061025c6040518060a001604052808873ffffffffffffffffffffffffffffffffffffffff1681526020018973ffffffffffffffffffffffffffffffffffffffff1681526020018f81526020018762ffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff16815250610343565b9350935093509350828b898151811061027157fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050818a89815181106102b857fe5b63ffffffff90921660209283029190910190910152929b50968201966001909601958b926102e58e610b48565b156102fa576102f38e610b50565b9d5061030a565b8c9b505050505050505050610316565b505050505050506101cb565b92959194509250565b7f000000000000000000000000000000000000000000000000000000000000000081565b60208101518151606083015160009283928392839273ffffffffffffffffffffffffffffffffffffffff808216908416109284926103819290610b8b565b9050866080015173ffffffffffffffffffffffffffffffffffffffff16600014156103af5760408701516000555b60005a90508173ffffffffffffffffffffffffffffffffffffffff1663128acb0830856103df8c60400151610bc9565b6000038c6080015173ffffffffffffffffffffffffffffffffffffffff1660001461040e578c60800151610434565b8761042d5773fffd8963efd1fc6a506488495d951d5263988d25610434565b6401000276a45b8d602001518e606001518f6000015160405160200161045593929190611d89565b6040516020818303038152906040526040518663ffffffff1660e01b8152600401610484959493929190611e10565b6040805180830381600087803b15801561049d57600080fd5b505af19250505080156104eb575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682019092526104e891810190611b6e565b60015b610568573d808015610519576040519150601f19603f3d011682016040523d82523d6000602084013e61051e565b606091505b505a82039450886080015173ffffffffffffffffffffffffffffffffffffffff166000141561054c57600080555b610557818487610bfb565b97509750975097505050505061056e565b50505050505b9193509193565b7f000000000000000000000000000000000000000000000000000000000000000081565b60208101518151606083015160009283928392839273ffffffffffffffffffffffffffffffffffffffff808216908416109284926105d79290610b8b565b905060005a90508173ffffffffffffffffffffffffffffffffffffffff1663128acb0830856106098c60400151610bc9565b60808d015173ffffffffffffffffffffffffffffffffffffffff1615610633578c60800151610659565b876106525773fffd8963efd1fc6a506488495d951d5263988d25610659565b6401000276a45b8d600001518e606001518f6020015160405160200161067a93929190611d89565b6040516020818303038152906040526040518663ffffffff1660e01b81526004016106a9959493929190611e10565b6040805180830381600087803b1580156106c257600080fd5b505af1925050508015610710575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016820190925261070d91810190611b6e565b60015b610568573d80801561073e576040519150601f19603f3d011682016040523d82523d6000602084013e610743565b606091505b505a82039450610557818487610bfb565b6000606080600061076486610ae8565b67ffffffffffffffff8111801561077a57600080fd5b506040519080825280602002602001820160405280156107a4578160200160208202803683370190505b5092506107b086610ae8565b67ffffffffffffffff811180156107c657600080fd5b506040519080825280602002602001820160405280156107f0578160200160208202803683370190505b50915060005b60008060006108048a610b17565b9250925092506000806000806108876040518060a001604052808973ffffffffffffffffffffffffffffffffffffffff1681526020018873ffffffffffffffffffffffffffffffffffffffff1681526020018f81526020018762ffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff16815250610599565b9350935093509350828b898151811061089c57fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050818a89815181106108e357fe5b63ffffffff90921660209283029190910190910152929b50968201966001909601958b926109108e610b48565b156102fa5761091e8e610b50565b9d50505050505050506107f6565b600083138061093b5750600082135b61094457600080fd5b600080600061095284610b17565b9250925092506109847f0000000000000000000000000000000000000000000000000000000000000000848484610ccf565b5060008060008089136109ca578573ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1610888a6000036109ff565b8473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff161089896000035b9250925092506000610a12878787610b8b565b90506000808273ffffffffffffffffffffffffffffffffffffffff16633850c7bd6040518163ffffffff1660e01b815260040160e06040518083038186803b158015610a5d57600080fd5b505afa158015610a71573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a959190611c6b565b5050505050915091508515610abb57604051848152826020820152816040820152606081fd5b60005415610ad1576000548414610ad157600080fd5b604051858152826020820152816040820152606081fd5b805160177fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec909101045b919050565b60008080610b258482610cee565b9250610b32846014610dee565b9050610b3f846017610cee565b91509193909250565b516042111590565b8051606090610b859083906017907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe901610ede565b92915050565b6000610bc17f0000000000000000000000000000000000000000000000000000000000000000610bbc8686866110c5565b611142565b949350505050565b60007f80000000000000000000000000000000000000000000000000000000000000008210610bf757600080fd5b5090565b6000806000806000808773ffffffffffffffffffffffffffffffffffffffff16633850c7bd6040518163ffffffff1660e01b815260040160e06040518083038186803b158015610c4a57600080fd5b505afa158015610c5e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c829190611c6b565b50939650610c9794508d935061127892505050565b91975095509050610cbf73ffffffffffffffffffffffffffffffffffffffff89168383611339565b9350869250505093509350935093565b6000610ce585610ce08686866110c5565b611991565b95945050505050565b600081826014011015610d6257604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f746f416464726573735f6f766572666c6f770000000000000000000000000000604482015290519081900360640190fd5b8160140183511015610dd557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f746f416464726573735f6f75744f66426f756e64730000000000000000000000604482015290519081900360640190fd5b5001602001516c01000000000000000000000000900490565b600081826003011015610e6257604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f746f55696e7432345f6f766572666c6f77000000000000000000000000000000604482015290519081900360640190fd5b8160030183511015610ed557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f746f55696e7432345f6f75744f66426f756e6473000000000000000000000000604482015290519081900360640190fd5b50016003015190565b60608182601f011015610f5257604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f736c6963655f6f766572666c6f77000000000000000000000000000000000000604482015290519081900360640190fd5b828284011015610fc357604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f736c6963655f6f766572666c6f77000000000000000000000000000000000000604482015290519081900360640190fd5b8183018451101561103557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f736c6963655f6f75744f66426f756e6473000000000000000000000000000000604482015290519081900360640190fd5b60608215801561105457604051915060008252602082016040526110bc565b6040519150601f8416801560200281840101858101878315602002848b0101015b8183101561108d578051835260209283019201611075565b5050858452601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016604052505b50949350505050565b6110cd6119fa565b8273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161115611105579192915b506040805160608101825273ffffffffffffffffffffffffffffffffffffffff948516815292909316602083015262ffffff169181019190915290565b6000816020015173ffffffffffffffffffffffffffffffffffffffff16826000015173ffffffffffffffffffffffffffffffffffffffff161061118457600080fd5b508051602080830151604093840151845173ffffffffffffffffffffffffffffffffffffffff94851681850152939091168385015262ffffff166060808401919091528351808403820181526080840185528051908301207fff0000000000000000000000000000000000000000000000000000000000000060a085015294901b7fffffffffffffffffffffffffffffffffffffffff0000000000000000000000001660a183015260b58201939093527fe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b5460d5808301919091528251808303909101815260f5909101909152805191012090565b60008060008351606014611318576044845110156112cb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112c290611e75565b60405180910390fd5b600484019350838060200190518101906112e59190611bdf565b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112c29190611e62565b8380602001905181019061132c9190611d02565b9250925092509193909250565b60008060008060008060008060088b73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561138d57600080fd5b505afa1580156113a1573d6000803e3d6000fd5b505050506040513d60208110156113b757600080fd5b5051600290810b908c900b816113c957fe5b0560020b901d905060006101008c73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561141c57600080fd5b505afa158015611430573d6000803e3d6000fd5b505050506040513d602081101561144657600080fd5b5051600290810b908d900b8161145857fe5b0560020b8161146357fe5b079050600060088d73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b1580156114b057600080fd5b505afa1580156114c4573d6000803e3d6000fd5b505050506040513d60208110156114da57600080fd5b5051600290810b908d900b816114ec57fe5b0560020b901d905060006101008e73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561153f57600080fd5b505afa158015611553573d6000803e3d6000fd5b505050506040513d602081101561156957600080fd5b5051600290810b908e900b8161157b57fe5b0560020b8161158657fe5b07905060008160ff166001901b8f73ffffffffffffffffffffffffffffffffffffffff16635339c296856040518263ffffffff1660e01b8152600401808260010b815260200191505060206040518083038186803b1580156115e757600080fd5b505afa1580156115fb573d6000803e3d6000fd5b505050506040513d602081101561161157600080fd5b5051161180156116a457508d73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561166257600080fd5b505afa158015611676573d6000803e3d6000fd5b505050506040513d602081101561168c57600080fd5b5051600290810b908d900b8161169e57fe5b0760020b155b80156116b557508b60020b8d60020b135b945060008360ff166001901b8f73ffffffffffffffffffffffffffffffffffffffff16635339c296876040518263ffffffff1660e01b8152600401808260010b815260200191505060206040518083038186803b15801561171557600080fd5b505afa158015611729573d6000803e3d6000fd5b505050506040513d602081101561173f57600080fd5b5051161180156117d257508d73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561179057600080fd5b505afa1580156117a4573d6000803e3d6000fd5b505050506040513d60208110156117ba57600080fd5b5051600290810b908e900b816117cc57fe5b0760020b155b80156117e357508b60020b8d60020b125b95508160010b8460010b128061180f57508160010b8460010b14801561180f57508060ff168360ff1611155b1561182557839950829750819850809650611832565b8199508097508398508296505b50507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60ff87161b9150505b8560010b8760010b13611969578560010b8760010b14156118a3577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60ff858103161c165b6000818c73ffffffffffffffffffffffffffffffffffffffff16635339c2968a6040518263ffffffff1660e01b8152600401808260010b815260200191505060206040518083038186803b1580156118fa57600080fd5b505afa15801561190e573d6000803e3d6000fd5b505050506040513d602081101561192457600080fd5b5051169050611932816119c1565b61ffff16989098019750506001909501947fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff61185e565b8115611976576001880397505b8215611983576001880397505b505050505050509392505050565b600061199d8383611142565b90503373ffffffffffffffffffffffffffffffffffffffff821614610b8557600080fd5b6000805b8215610b85577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8301909216916001016119c5565b604080516060810182526000808252602082018190529181019190915290565b600082601f830112611a2a578081fd5b8135611a3d611a3882611faf565b611f8b565b818152846020838601011115611a51578283fd5b816020850160208301379081016020019190915292915050565b8051600281900b8114610b1257600080fd5b600060a08284031215611a8e578081fd5b60405160a0810181811067ffffffffffffffff82111715611aab57fe5b6040529050808235611abc8161201f565b81526020830135611acc8161201f565b602082015260408381013590820152606083013562ffffff81168114611af157600080fd5b6060820152611b0260808401611b0e565b60808201525092915050565b8035610b128161201f565b805161ffff81168114610b1257600080fd5b60008060408385031215611b3d578182fd5b823567ffffffffffffffff811115611b53578283fd5b611b5f85828601611a1a565b95602094909401359450505050565b60008060408385031215611b80578182fd5b505080516020909101519092909150565b600080600060608486031215611ba5578081fd5b8335925060208401359150604084013567ffffffffffffffff811115611bc9578182fd5b611bd586828701611a1a565b9150509250925092565b600060208284031215611bf0578081fd5b815167ffffffffffffffff811115611c06578182fd5b8201601f81018413611c16578182fd5b8051611c24611a3882611faf565b818152856020838501011115611c38578384fd5b610ce5826020830160208601611fef565b600060a08284031215611c5a578081fd5b611c648383611a7d565b9392505050565b600080600080600080600060e0888a031215611c85578283fd5b8751611c908161201f565b9650611c9e60208901611a6b565b9550611cac60408901611b19565b9450611cba60608901611b19565b9350611cc860808901611b19565b925060a088015160ff81168114611cdd578283fd5b60c08901519092508015158114611cf2578182fd5b8091505092959891949750929550565b600080600060608486031215611d16578081fd5b835192506020840151611d288161201f565b9150611d3660408501611a6b565b90509250925092565b60008151808452611d57816020860160208601611fef565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b606093841b7fffffffffffffffffffffffffffffffffffffffff000000000000000000000000908116825260e89390931b7fffffff0000000000000000000000000000000000000000000000000000000000166014820152921b166017820152602b0190565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b600073ffffffffffffffffffffffffffffffffffffffff8088168352861515602084015285604084015280851660608401525060a06080830152611e5760a0830184611d3f565b979650505050505050565b600060208252611c646020830184611d3f565b60208082526010908201527f556e6578706563746564206572726f7200000000000000000000000000000000604082015260600190565b600060808201868352602060808185015281875180845260a0860191508289019350845b81811015611f0257845173ffffffffffffffffffffffffffffffffffffffff1683529383019391830191600101611ed0565b505084810360408601528651808252908201925081870190845b81811015611f3e57825163ffffffff1685529383019391830191600101611f1c565b5050505060609290920192909252949350505050565b93845273ffffffffffffffffffffffffffffffffffffffff92909216602084015263ffffffff166040830152606082015260800190565b60405181810167ffffffffffffffff81118282101715611fa757fe5b604052919050565b600067ffffffffffffffff821115611fc357fe5b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b60005b8381101561200a578181015183820152602001611ff2565b83811115612019576000848401525b50505050565b73ffffffffffffffffffffffffffffffffffffffff8116811461204157600080fd5b5056fea164736f6c6343000706000a";
var linkReferences$5 = {
};
var deployedLinkReferences$5 = {
};
var IQuoterV2 = {
	_format: _format$5,
	contractName: contractName$5,
	sourceName: sourceName$5,
	abi: abi$5,
	bytecode: bytecode$5,
	deployedBytecode: deployedBytecode$5,
	linkReferences: linkReferences$5,
	deployedLinkReferences: deployedLinkReferences$5
};

/**
 * Represents the trustless-swap V3 QuoterV1 contract with a method for returning the formatted
 * calldata needed to call the quoter contract.
 */
var SwapQuoter = /*#__PURE__*/function () {
  function SwapQuoter() {}
  /**
   * Produces the on-chain method name of the appropriate function within QuoterV2,
   * and the relevant hex encoded parameters.
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @param route The swap route, a list of pools through which a swap can occur
   * @param amount The amount of the quote, either an amount in, or an amount out
   * @param tradeType The trade type, either exact input or exact output
   * @param options The optional params including price limit and Quoter contract switch
   * @returns The formatted calldata
   */
  SwapQuoter.quoteCallParameters = function quoteCallParameters(route, amount, tradeType, options) {
    if (options === void 0) {
      options = {};
    }
    var singleHop = route.pools.length === 1;
    var quoteAmount = toHex(amount.quotient);
    var calldata;
    var swapInterface = options.useQuoterV2 ? this.V2INTERFACE : this.V1INTERFACE;
    if (singleHop) {
      var _options$sqrtPriceLim, _options;
      var baseQuoteParams = {
        tokenIn: route.tokenPath[0].address,
        tokenOut: route.tokenPath[1].address,
        fee: route.pools[0].fee,
        sqrtPriceLimitX96: toHex((_options$sqrtPriceLim = (_options = options) == null ? void 0 : _options.sqrtPriceLimitX96) != null ? _options$sqrtPriceLim : 0)
      };
      var v2QuoteParams = _extends({}, baseQuoteParams, tradeType == TradeType.EXACT_INPUT ? {
        amountIn: quoteAmount
      } : {
        amount: quoteAmount
      });
      var v1QuoteParams = [baseQuoteParams.tokenIn, baseQuoteParams.tokenOut, baseQuoteParams.fee, quoteAmount, baseQuoteParams.sqrtPriceLimitX96];
      var tradeTypeFunctionName = tradeType === TradeType.EXACT_INPUT ? 'quoteExactInputSingle' : 'quoteExactOutputSingle';
      calldata = swapInterface.encodeFunctionData(tradeTypeFunctionName, options.useQuoterV2 ? [v2QuoteParams] : v1QuoteParams);
    } else {
      var _options2;
      !(((_options2 = options) == null ? void 0 : _options2.sqrtPriceLimitX96) === undefined) ? process.env.NODE_ENV !== "production" ? invariant(false, 'MULTIHOP_PRICE_LIMIT') : invariant(false) : void 0;
      var path = encodeRouteToPath(route, tradeType === TradeType.EXACT_OUTPUT);
      var _tradeTypeFunctionName = tradeType === TradeType.EXACT_INPUT ? 'quoteExactInput' : 'quoteExactOutput';
      calldata = swapInterface.encodeFunctionData(_tradeTypeFunctionName, [path, quoteAmount]);
    }
    return {
      calldata: calldata,
      value: toHex(0)
    };
  };
  return SwapQuoter;
}();
SwapQuoter.V1INTERFACE = /*#__PURE__*/new Interface(IQuoter.abi);
SwapQuoter.V2INTERFACE = /*#__PURE__*/new Interface(IQuoterV2.abi);

var Price = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(Price, _Fraction);
  /**
   * Construct a price, either with the base and quote currency amount, or the
   * @param args
   */
  function Price() {
    var _this;
    var baseCurrency, quoteCurrency, denominator, numerator;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (args.length === 4) {
      baseCurrency = args[0];
      quoteCurrency = args[1];
      denominator = args[2];
      numerator = args[3];
    } else {
      var result = args[0].quoteAmount.divide(args[0].baseAmount);
      var _ref = [args[0].baseAmount.currency, args[0].quoteAmount.currency, result.denominator, result.numerator];
      baseCurrency = _ref[0];
      quoteCurrency = _ref[1];
      denominator = _ref[2];
      numerator = _ref[3];
    }
    _this = _Fraction.call(this, numerator, denominator) || this;
    _this.baseCurrency = baseCurrency;
    _this.quoteCurrency = quoteCurrency;
    _this.scalar = new Fraction(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(baseCurrency.decimals)), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(quoteCurrency.decimals)));
    return _this;
  }
  /**
   * Flip the price, switching the base and quote currency
   */
  var _proto = Price.prototype;
  _proto.invert = function invert() {
    return new Price(this.quoteCurrency, this.baseCurrency, this.numerator, this.denominator);
  }
  /**
   * Multiply the price by another price, returning a new price. The other price must have the same base currency as this price's quote currency
   * @param other the other price
   */;
  _proto.multiply = function multiply(other) {
    !this.quoteCurrency.equals(other.baseCurrency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    var fraction = _Fraction.prototype.multiply.call(this, other);
    return new Price(this.baseCurrency, other.quoteCurrency, fraction.denominator, fraction.numerator);
  }
  /**
   * Return the amount of quote currency corresponding to a given amount of the base currency
   * @param currencyAmount the amount of base currency to quote against the price
   */;
  _proto.quote = function quote(currencyAmount) {
    !currencyAmount.currency.equals(this.baseCurrency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    var result = _Fraction.prototype.multiply.call(this, currencyAmount);
    return CurrencyAmount.fromFractionalAmount(this.quoteCurrency, result.numerator, result.denominator);
  }
  /**
   * Get the value scaled by decimals for formatting
   * @private
   */;
  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 6;
    }
    return this.adjustedForDecimals.toSignificant(significantDigits, format, rounding);
  };
  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = 4;
    }
    return this.adjustedForDecimals.toFixed(decimalPlaces, format, rounding);
  };
  _createClass(Price, [{
    key: "adjustedForDecimals",
    get: function get() {
      return _Fraction.prototype.multiply.call(this, this.scalar);
    }
  }]);
  return Price;
}(Fraction);

// constants used internally but not expected to be used externally
var NEGATIVE_ONE = /*#__PURE__*/JSBI.BigInt(-1);
var ZERO = /*#__PURE__*/JSBI.BigInt(0);
var ONE = /*#__PURE__*/JSBI.BigInt(1);
// used in liquidity amount math
var Q96 = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(96));
var Q192 = /*#__PURE__*/JSBI.exponentiate(Q96, /*#__PURE__*/JSBI.BigInt(2));

/**
 * Computes a pool address
 * @param factoryAddress The trustless-swap V3 factory address
 * @param tokenA The first token of the pair, irrespective of sort order
 * @param tokenB The second token of the pair, irrespective of sort order
 * @param fee The fee tier of the pool
 * @param initCodeHashManualOverride Override the init code hash used to compute the pool address if necessary
 * @returns The pool address
 */
function computePoolAddress(_ref) {
  var factoryAddress = _ref.factoryAddress,
    tokenA = _ref.tokenA,
    tokenB = _ref.tokenB,
    fee = _ref.fee,
    initCodeHashManualOverride = _ref.initCodeHashManualOverride;
  var _ref2 = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA],
    token0 = _ref2[0],
    token1 = _ref2[1]; // does safety checks
  return getCreate2Address(factoryAddress, keccak256(['bytes'], [defaultAbiCoder.encode(['address', 'address', 'uint24'], [token0.address, token1.address, fee])]), initCodeHashManualOverride != null ? initCodeHashManualOverride : POOL_INIT_CODE_HASH);
}

var LiquidityMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function LiquidityMath() {}
  LiquidityMath.addDelta = function addDelta(x, y) {
    if (JSBI.lessThan(y, ZERO)) {
      return JSBI.subtract(x, JSBI.multiply(y, NEGATIVE_ONE));
    } else {
      return JSBI.add(x, y);
    }
  };
  return LiquidityMath;
}();

var FullMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function FullMath() {}
  FullMath.mulDivRoundingUp = function mulDivRoundingUp(a, b, denominator) {
    var product = JSBI.multiply(a, b);
    var result = JSBI.divide(product, denominator);
    if (JSBI.notEqual(JSBI.remainder(product, denominator), ZERO)) result = JSBI.add(result, ONE);
    return result;
  };
  return FullMath;
}();

var MaxUint160 = /*#__PURE__*/JSBI.subtract( /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(160)), ONE);
function multiplyIn256(x, y) {
  var product = JSBI.multiply(x, y);
  return JSBI.bitwiseAnd(product, MaxUint256);
}
function addIn256(x, y) {
  var sum = JSBI.add(x, y);
  return JSBI.bitwiseAnd(sum, MaxUint256);
}
var SqrtPriceMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function SqrtPriceMath() {}
  SqrtPriceMath.getAmount0Delta = function getAmount0Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) {
    if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
      var _ref = [sqrtRatioBX96, sqrtRatioAX96];
      sqrtRatioAX96 = _ref[0];
      sqrtRatioBX96 = _ref[1];
    }
    var numerator1 = JSBI.leftShift(liquidity, JSBI.BigInt(96));
    var numerator2 = JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96);
    return roundUp ? FullMath.mulDivRoundingUp(FullMath.mulDivRoundingUp(numerator1, numerator2, sqrtRatioBX96), ONE, sqrtRatioAX96) : JSBI.divide(JSBI.divide(JSBI.multiply(numerator1, numerator2), sqrtRatioBX96), sqrtRatioAX96);
  };
  SqrtPriceMath.getAmount1Delta = function getAmount1Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) {
    if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
      var _ref2 = [sqrtRatioBX96, sqrtRatioAX96];
      sqrtRatioAX96 = _ref2[0];
      sqrtRatioBX96 = _ref2[1];
    }
    return roundUp ? FullMath.mulDivRoundingUp(liquidity, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96), Q96) : JSBI.divide(JSBI.multiply(liquidity, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96)), Q96);
  };
  SqrtPriceMath.getNextSqrtPriceFromInput = function getNextSqrtPriceFromInput(sqrtPX96, liquidity, amountIn, zeroForOne) {
    !JSBI.greaterThan(sqrtPX96, ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false) : invariant(false) : void 0;
    !JSBI.greaterThan(liquidity, ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false) : invariant(false) : void 0;
    return zeroForOne ? this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountIn, true) : this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountIn, true);
  };
  SqrtPriceMath.getNextSqrtPriceFromOutput = function getNextSqrtPriceFromOutput(sqrtPX96, liquidity, amountOut, zeroForOne) {
    !JSBI.greaterThan(sqrtPX96, ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false) : invariant(false) : void 0;
    !JSBI.greaterThan(liquidity, ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false) : invariant(false) : void 0;
    return zeroForOne ? this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountOut, false) : this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountOut, false);
  };
  SqrtPriceMath.getNextSqrtPriceFromAmount0RoundingUp = function getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amount, add) {
    if (JSBI.equal(amount, ZERO)) return sqrtPX96;
    var numerator1 = JSBI.leftShift(liquidity, JSBI.BigInt(96));
    if (add) {
      var product = multiplyIn256(amount, sqrtPX96);
      if (JSBI.equal(JSBI.divide(product, amount), sqrtPX96)) {
        var denominator = addIn256(numerator1, product);
        if (JSBI.greaterThanOrEqual(denominator, numerator1)) {
          return FullMath.mulDivRoundingUp(numerator1, sqrtPX96, denominator);
        }
      }
      return FullMath.mulDivRoundingUp(numerator1, ONE, JSBI.add(JSBI.divide(numerator1, sqrtPX96), amount));
    } else {
      var _product = multiplyIn256(amount, sqrtPX96);
      !JSBI.equal(JSBI.divide(_product, amount), sqrtPX96) ? process.env.NODE_ENV !== "production" ? invariant(false) : invariant(false) : void 0;
      !JSBI.greaterThan(numerator1, _product) ? process.env.NODE_ENV !== "production" ? invariant(false) : invariant(false) : void 0;
      var _denominator = JSBI.subtract(numerator1, _product);
      return FullMath.mulDivRoundingUp(numerator1, sqrtPX96, _denominator);
    }
  };
  SqrtPriceMath.getNextSqrtPriceFromAmount1RoundingDown = function getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amount, add) {
    if (add) {
      var quotient = JSBI.lessThanOrEqual(amount, MaxUint160) ? JSBI.divide(JSBI.leftShift(amount, JSBI.BigInt(96)), liquidity) : JSBI.divide(JSBI.multiply(amount, Q96), liquidity);
      return JSBI.add(sqrtPX96, quotient);
    } else {
      var _quotient = FullMath.mulDivRoundingUp(amount, Q96, liquidity);
      !JSBI.greaterThan(sqrtPX96, _quotient) ? process.env.NODE_ENV !== "production" ? invariant(false) : invariant(false) : void 0;
      return JSBI.subtract(sqrtPX96, _quotient);
    }
  };
  return SqrtPriceMath;
}();

var MAX_FEE = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(10), /*#__PURE__*/JSBI.BigInt(6));
var SwapMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function SwapMath() {}
  SwapMath.computeSwapStep = function computeSwapStep(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, amountRemaining, feePips) {
    var returnValues = {};
    var zeroForOne = JSBI.greaterThanOrEqual(sqrtRatioCurrentX96, sqrtRatioTargetX96);
    var exactIn = JSBI.greaterThanOrEqual(amountRemaining, ZERO);
    if (exactIn) {
      var amountRemainingLessFee = JSBI.divide(JSBI.multiply(amountRemaining, JSBI.subtract(MAX_FEE, JSBI.BigInt(feePips))), MAX_FEE);
      returnValues.amountIn = zeroForOne ? SqrtPriceMath.getAmount0Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, true) : SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, true);
      if (JSBI.greaterThanOrEqual(amountRemainingLessFee, returnValues.amountIn)) {
        returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96;
      } else {
        returnValues.sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromInput(sqrtRatioCurrentX96, liquidity, amountRemainingLessFee, zeroForOne);
      }
    } else {
      returnValues.amountOut = zeroForOne ? SqrtPriceMath.getAmount1Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, false) : SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, false);
      if (JSBI.greaterThanOrEqual(JSBI.multiply(amountRemaining, NEGATIVE_ONE), returnValues.amountOut)) {
        returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96;
      } else {
        returnValues.sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromOutput(sqrtRatioCurrentX96, liquidity, JSBI.multiply(amountRemaining, NEGATIVE_ONE), zeroForOne);
      }
    }
    var max = JSBI.equal(sqrtRatioTargetX96, returnValues.sqrtRatioNextX96);
    if (zeroForOne) {
      returnValues.amountIn = max && exactIn ? returnValues.amountIn : SqrtPriceMath.getAmount0Delta(returnValues.sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, true);
      returnValues.amountOut = max && !exactIn ? returnValues.amountOut : SqrtPriceMath.getAmount1Delta(returnValues.sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, false);
    } else {
      returnValues.amountIn = max && exactIn ? returnValues.amountIn : SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, true);
      returnValues.amountOut = max && !exactIn ? returnValues.amountOut : SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, false);
    }
    if (!exactIn && JSBI.greaterThan(returnValues.amountOut, JSBI.multiply(amountRemaining, NEGATIVE_ONE))) {
      returnValues.amountOut = JSBI.multiply(amountRemaining, NEGATIVE_ONE);
    }
    if (exactIn && JSBI.notEqual(returnValues.sqrtRatioNextX96, sqrtRatioTargetX96)) {
      // we didn't reach the target, so take the remainder of the maximum input as fee
      returnValues.feeAmount = JSBI.subtract(amountRemaining, returnValues.amountIn);
    } else {
      returnValues.feeAmount = FullMath.mulDivRoundingUp(returnValues.amountIn, JSBI.BigInt(feePips), JSBI.subtract(MAX_FEE, JSBI.BigInt(feePips)));
    }
    return [returnValues.sqrtRatioNextX96, returnValues.amountIn, returnValues.amountOut, returnValues.feeAmount];
  };
  return SwapMath;
}();

var TWO = /*#__PURE__*/JSBI.BigInt(2);
var POWERS_OF_2 = /*#__PURE__*/[128, 64, 32, 16, 8, 4, 2, 1].map(function (pow) {
  return [pow, JSBI.exponentiate(TWO, JSBI.BigInt(pow))];
});
function mostSignificantBit(x) {
  !JSBI.greaterThan(x, ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ZERO') : invariant(false) : void 0;
  !JSBI.lessThanOrEqual(x, MaxUint256) ? process.env.NODE_ENV !== "production" ? invariant(false, 'MAX') : invariant(false) : void 0;
  var msb = 0;
  for (var _iterator = _createForOfIteratorHelperLoose(POWERS_OF_2), _step; !(_step = _iterator()).done;) {
    var _step$value = _step.value,
      power = _step$value[0],
      min = _step$value[1];
    if (JSBI.greaterThanOrEqual(x, min)) {
      x = JSBI.signedRightShift(x, JSBI.BigInt(power));
      msb += power;
    }
  }
  return msb;
}

function mulShift(val, mulBy) {
  return JSBI.signedRightShift(JSBI.multiply(val, JSBI.BigInt(mulBy)), JSBI.BigInt(128));
}
var Q32 = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(32));
var TickMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function TickMath() {}
  /**
   * Returns the sqrt ratio as a Q64.96 for the given tick. The sqrt ratio is computed as sqrt(1.0001)^tick
   * @param tick the tick for which to compute the sqrt ratio
   */
  TickMath.getSqrtRatioAtTick = function getSqrtRatioAtTick(tick) {
    !(tick >= TickMath.MIN_TICK && tick <= TickMath.MAX_TICK && Number.isInteger(tick)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TICK') : invariant(false) : void 0;
    var absTick = tick < 0 ? tick * -1 : tick;
    var ratio = (absTick & 0x1) != 0 ? JSBI.BigInt('0xfffcb933bd6fad37aa2d162d1a594001') : JSBI.BigInt('0x100000000000000000000000000000000');
    if ((absTick & 0x2) != 0) ratio = mulShift(ratio, '0xfff97272373d413259a46990580e213a');
    if ((absTick & 0x4) != 0) ratio = mulShift(ratio, '0xfff2e50f5f656932ef12357cf3c7fdcc');
    if ((absTick & 0x8) != 0) ratio = mulShift(ratio, '0xffe5caca7e10e4e61c3624eaa0941cd0');
    if ((absTick & 0x10) != 0) ratio = mulShift(ratio, '0xffcb9843d60f6159c9db58835c926644');
    if ((absTick & 0x20) != 0) ratio = mulShift(ratio, '0xff973b41fa98c081472e6896dfb254c0');
    if ((absTick & 0x40) != 0) ratio = mulShift(ratio, '0xff2ea16466c96a3843ec78b326b52861');
    if ((absTick & 0x80) != 0) ratio = mulShift(ratio, '0xfe5dee046a99a2a811c461f1969c3053');
    if ((absTick & 0x100) != 0) ratio = mulShift(ratio, '0xfcbe86c7900a88aedcffc83b479aa3a4');
    if ((absTick & 0x200) != 0) ratio = mulShift(ratio, '0xf987a7253ac413176f2b074cf7815e54');
    if ((absTick & 0x400) != 0) ratio = mulShift(ratio, '0xf3392b0822b70005940c7a398e4b70f3');
    if ((absTick & 0x800) != 0) ratio = mulShift(ratio, '0xe7159475a2c29b7443b29c7fa6e889d9');
    if ((absTick & 0x1000) != 0) ratio = mulShift(ratio, '0xd097f3bdfd2022b8845ad8f792aa5825');
    if ((absTick & 0x2000) != 0) ratio = mulShift(ratio, '0xa9f746462d870fdf8a65dc1f90e061e5');
    if ((absTick & 0x4000) != 0) ratio = mulShift(ratio, '0x70d869a156d2a1b890bb3df62baf32f7');
    if ((absTick & 0x8000) != 0) ratio = mulShift(ratio, '0x31be135f97d08fd981231505542fcfa6');
    if ((absTick & 0x10000) != 0) ratio = mulShift(ratio, '0x9aa508b5b7a84e1c677de54f3e99bc9');
    if ((absTick & 0x20000) != 0) ratio = mulShift(ratio, '0x5d6af8dedb81196699c329225ee604');
    if ((absTick & 0x40000) != 0) ratio = mulShift(ratio, '0x2216e584f5fa1ea926041bedfe98');
    if ((absTick & 0x80000) != 0) ratio = mulShift(ratio, '0x48a170391f7dc42444e8fa2');
    if (tick > 0) ratio = JSBI.divide(MaxUint256, ratio);
    // back to Q96
    return JSBI.greaterThan(JSBI.remainder(ratio, Q32), ZERO) ? JSBI.add(JSBI.divide(ratio, Q32), ONE) : JSBI.divide(ratio, Q32);
  }
  /**
   * Returns the tick corresponding to a given sqrt ratio, s.t. #getSqrtRatioAtTick(tick) <= sqrtRatioX96
   * and #getSqrtRatioAtTick(tick + 1) > sqrtRatioX96
   * @param sqrtRatioX96 the sqrt ratio as a Q64.96 for which to compute the tick
   */;
  TickMath.getTickAtSqrtRatio = function getTickAtSqrtRatio(sqrtRatioX96) {
    !(JSBI.greaterThanOrEqual(sqrtRatioX96, TickMath.MIN_SQRT_RATIO) && JSBI.lessThan(sqrtRatioX96, TickMath.MAX_SQRT_RATIO)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'SQRT_RATIO') : invariant(false) : void 0;
    var sqrtRatioX128 = JSBI.leftShift(sqrtRatioX96, JSBI.BigInt(32));
    var msb = mostSignificantBit(sqrtRatioX128);
    var r;
    if (JSBI.greaterThanOrEqual(JSBI.BigInt(msb), JSBI.BigInt(128))) {
      r = JSBI.signedRightShift(sqrtRatioX128, JSBI.BigInt(msb - 127));
    } else {
      r = JSBI.leftShift(sqrtRatioX128, JSBI.BigInt(127 - msb));
    }
    var log_2 = JSBI.leftShift(JSBI.subtract(JSBI.BigInt(msb), JSBI.BigInt(128)), JSBI.BigInt(64));
    for (var i = 0; i < 14; i++) {
      r = JSBI.signedRightShift(JSBI.multiply(r, r), JSBI.BigInt(127));
      var f = JSBI.signedRightShift(r, JSBI.BigInt(128));
      log_2 = JSBI.bitwiseOr(log_2, JSBI.leftShift(f, JSBI.BigInt(63 - i)));
      r = JSBI.signedRightShift(r, f);
    }
    var log_sqrt10001 = JSBI.multiply(log_2, JSBI.BigInt('255738958999603826347141'));
    var tickLow = JSBI.toNumber(JSBI.signedRightShift(JSBI.subtract(log_sqrt10001, JSBI.BigInt('3402992956809132418596140100660247210')), JSBI.BigInt(128)));
    var tickHigh = JSBI.toNumber(JSBI.signedRightShift(JSBI.add(log_sqrt10001, JSBI.BigInt('291339464771989622907027621153398088495')), JSBI.BigInt(128)));
    return tickLow === tickHigh ? tickLow : JSBI.lessThanOrEqual(TickMath.getSqrtRatioAtTick(tickHigh), sqrtRatioX96) ? tickHigh : tickLow;
  };
  return TickMath;
}();
/**
 * The minimum tick that can be used on any pool.
 */
TickMath.MIN_TICK = -887272;
/**
 * The maximum tick that can be used on any pool.
 */
TickMath.MAX_TICK = -TickMath.MIN_TICK;
/**
 * The sqrt ratio corresponding to the minimum tick that could be used on any pool.
 */
TickMath.MIN_SQRT_RATIO = /*#__PURE__*/JSBI.BigInt('4295128739');
/**
 * The sqrt ratio corresponding to the maximum tick that could be used on any pool.
 */
TickMath.MAX_SQRT_RATIO = /*#__PURE__*/JSBI.BigInt('1461446703485210103287273052203988822378723970342');

/**
 * This tick data provider does not know how to fetch any tick data. It throws whenever it is required. Useful if you
 * do not need to load tick data for your use case.
 */
var NoTickDataProvider = /*#__PURE__*/function () {
  function NoTickDataProvider() {}
  var _proto = NoTickDataProvider.prototype;
  _proto.getTick = /*#__PURE__*/function () {
    var _getTick = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_tick) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            throw new Error(NoTickDataProvider.ERROR_MESSAGE);
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function getTick(_x) {
      return _getTick.apply(this, arguments);
    }
    return getTick;
  }();
  _proto.nextInitializedTickWithinOneWord = /*#__PURE__*/function () {
    var _nextInitializedTickWithinOneWord = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(_tick, _lte, _tickSpacing) {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            throw new Error(NoTickDataProvider.ERROR_MESSAGE);
          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    function nextInitializedTickWithinOneWord(_x2, _x3, _x4) {
      return _nextInitializedTickWithinOneWord.apply(this, arguments);
    }
    return nextInitializedTickWithinOneWord;
  }();
  return NoTickDataProvider;
}();
NoTickDataProvider.ERROR_MESSAGE = 'No tick data provider was given';

/**
 * Determines if a tick list is sorted
 * @param list The tick list
 * @param comparator The comparator
 * @returns true if sorted
 */
function isSorted(list, comparator) {
  for (var i = 0; i < list.length - 1; i++) {
    if (comparator(list[i], list[i + 1]) > 0) {
      return false;
    }
  }
  return true;
}

function tickComparator(a, b) {
  return a.index - b.index;
}
/**
 * Utility methods for interacting with sorted lists of ticks
 */
var TickList = /*#__PURE__*/function () {
  /**
   * Cannot be constructed
   */
  function TickList() {}
  TickList.validateList = function validateList(ticks, tickSpacing) {
    !(tickSpacing > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TICK_SPACING_NONZERO') : invariant(false) : void 0;
    // ensure ticks are spaced appropriately
    !ticks.every(function (_ref) {
      var index = _ref.index;
      return index % tickSpacing === 0;
    }) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TICK_SPACING') : invariant(false) : void 0;
    // ensure tick liquidity deltas sum to 0
    !JSBI.equal(ticks.reduce(function (accumulator, _ref2) {
      var liquidityNet = _ref2.liquidityNet;
      return JSBI.add(accumulator, liquidityNet);
    }, ZERO), ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ZERO_NET') : invariant(false) : void 0;
    !isSorted(ticks, tickComparator) ? process.env.NODE_ENV !== "production" ? invariant(false, 'SORTED') : invariant(false) : void 0;
  };
  TickList.isBelowSmallest = function isBelowSmallest(ticks, tick) {
    !(ticks.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'LENGTH') : invariant(false) : void 0;
    return tick < ticks[0].index;
  };
  TickList.isAtOrAboveLargest = function isAtOrAboveLargest(ticks, tick) {
    !(ticks.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'LENGTH') : invariant(false) : void 0;
    return tick >= ticks[ticks.length - 1].index;
  };
  TickList.getTick = function getTick(ticks, index) {
    var tick = ticks[this.binarySearch(ticks, index)];
    !(tick.index === index) ? process.env.NODE_ENV !== "production" ? invariant(false, 'NOT_CONTAINED') : invariant(false) : void 0;
    return tick;
  }
  /**
   * Finds the largest tick in the list of ticks that is less than or equal to tick
   * @param ticks list of ticks
   * @param tick tick to find the largest tick that is less than or equal to tick
   * @private
   */;
  TickList.binarySearch = function binarySearch(ticks, tick) {
    !!this.isBelowSmallest(ticks, tick) ? process.env.NODE_ENV !== "production" ? invariant(false, 'BELOW_SMALLEST') : invariant(false) : void 0;
    var l = 0;
    var r = ticks.length - 1;
    var i;
    while (true) {
      i = Math.floor((l + r) / 2);
      if (ticks[i].index <= tick && (i === ticks.length - 1 || ticks[i + 1].index > tick)) {
        return i;
      }
      if (ticks[i].index < tick) {
        l = i + 1;
      } else {
        r = i - 1;
      }
    }
  };
  TickList.nextInitializedTick = function nextInitializedTick(ticks, tick, lte) {
    if (lte) {
      !!TickList.isBelowSmallest(ticks, tick) ? process.env.NODE_ENV !== "production" ? invariant(false, 'BELOW_SMALLEST') : invariant(false) : void 0;
      if (TickList.isAtOrAboveLargest(ticks, tick)) {
        return ticks[ticks.length - 1];
      }
      var index = this.binarySearch(ticks, tick);
      return ticks[index];
    } else {
      !!this.isAtOrAboveLargest(ticks, tick) ? process.env.NODE_ENV !== "production" ? invariant(false, 'AT_OR_ABOVE_LARGEST') : invariant(false) : void 0;
      if (this.isBelowSmallest(ticks, tick)) {
        return ticks[0];
      }
      var _index = this.binarySearch(ticks, tick);
      return ticks[_index + 1];
    }
  };
  TickList.nextInitializedTickWithinOneWord = function nextInitializedTickWithinOneWord(ticks, tick, lte, tickSpacing) {
    var compressed = Math.floor(tick / tickSpacing); // matches rounding in the code
    if (lte) {
      var wordPos = compressed >> 8;
      var minimum = (wordPos << 8) * tickSpacing;
      if (TickList.isBelowSmallest(ticks, tick)) {
        return [minimum, false];
      }
      var index = TickList.nextInitializedTick(ticks, tick, lte).index;
      var nextInitializedTick = Math.max(minimum, index);
      return [nextInitializedTick, nextInitializedTick === index];
    } else {
      var _wordPos = compressed + 1 >> 8;
      var maximum = ((_wordPos + 1 << 8) - 1) * tickSpacing;
      if (this.isAtOrAboveLargest(ticks, tick)) {
        return [maximum, false];
      }
      var _index2 = this.nextInitializedTick(ticks, tick, lte).index;
      var _nextInitializedTick = Math.min(maximum, _index2);
      return [_nextInitializedTick, _nextInitializedTick === _index2];
    }
  };
  return TickList;
}();

var Tick = function Tick(_ref) {
  var index = _ref.index,
    liquidityGross = _ref.liquidityGross,
    liquidityNet = _ref.liquidityNet;
  !(index >= TickMath.MIN_TICK && index <= TickMath.MAX_TICK) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TICK') : invariant(false) : void 0;
  this.index = index;
  this.liquidityGross = JSBI.BigInt(liquidityGross);
  this.liquidityNet = JSBI.BigInt(liquidityNet);
};

/**
 * A data provider for ticks that is backed by an in-memory array of ticks.
 */
var TickListDataProvider = /*#__PURE__*/function () {
  function TickListDataProvider(ticks, tickSpacing) {
    var ticksMapped = ticks.map(function (t) {
      return t instanceof Tick ? t : new Tick(t);
    });
    TickList.validateList(ticksMapped, tickSpacing);
    this.ticks = ticksMapped;
  }
  var _proto = TickListDataProvider.prototype;
  _proto.getTick = /*#__PURE__*/function () {
    var _getTick = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(tick) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", TickList.getTick(this.ticks, tick));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function getTick(_x) {
      return _getTick.apply(this, arguments);
    }
    return getTick;
  }();
  _proto.nextInitializedTickWithinOneWord = /*#__PURE__*/function () {
    var _nextInitializedTickWithinOneWord = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(tick, lte, tickSpacing) {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", TickList.nextInitializedTickWithinOneWord(this.ticks, tick, lte, tickSpacing));
          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
    }));
    function nextInitializedTickWithinOneWord(_x2, _x3, _x4) {
      return _nextInitializedTickWithinOneWord.apply(this, arguments);
    }
    return nextInitializedTickWithinOneWord;
  }();
  return TickListDataProvider;
}();

/**
 * By default, pools will not allow operations that require ticks.
 */
var NO_TICK_DATA_PROVIDER_DEFAULT = /*#__PURE__*/new NoTickDataProvider();
/**
 * Represents a V3 pool
 */
var Pool = /*#__PURE__*/function () {
  /**
   * Construct a pool
   * @param tokenA One of the tokens in the pool
   * @param tokenB The other token in the pool
   * @param fee The fee in hundredths of a bips of the input amount of every swap that is collected by the pool
   * @param sqrtRatioX96 The sqrt of the current ratio of amounts of token1 to token0
   * @param liquidity The current value of in range liquidity
   * @param tickCurrent The current tick of the pool
   * @param ticks The current state of the pool ticks or a data provider that can return tick data
   */
  function Pool(tokenA, tokenB, fee, sqrtRatioX96, liquidity, tickCurrent, ticks) {
    if (ticks === void 0) {
      ticks = NO_TICK_DATA_PROVIDER_DEFAULT;
    }
    !(Number.isInteger(fee) && fee < 1000000) ? process.env.NODE_ENV !== "production" ? invariant(false, 'FEE') : invariant(false) : void 0;
    var tickCurrentSqrtRatioX96 = TickMath.getSqrtRatioAtTick(tickCurrent);
    var nextTickSqrtRatioX96 = TickMath.getSqrtRatioAtTick(tickCurrent + 1);
    !(JSBI.greaterThanOrEqual(JSBI.BigInt(sqrtRatioX96), tickCurrentSqrtRatioX96) && JSBI.lessThanOrEqual(JSBI.BigInt(sqrtRatioX96), nextTickSqrtRatioX96)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'PRICE_BOUNDS') : invariant(false) : void 0;
    var _ref = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
    this.token0 = _ref[0];
    this.token1 = _ref[1];
    this.fee = fee;
    this.sqrtRatioX96 = JSBI.BigInt(sqrtRatioX96);
    this.liquidity = JSBI.BigInt(liquidity);
    this.tickCurrent = tickCurrent;
    this.tickDataProvider = Array.isArray(ticks) ? new TickListDataProvider(ticks, TICK_SPACINGS[fee]) : ticks;
  }
  Pool.getAddress = function getAddress(tokenA, tokenB, fee, initCodeHashManualOverride, factoryAddressOverride) {
    return computePoolAddress({
      factoryAddress: factoryAddressOverride != null ? factoryAddressOverride : FACTORY_ADDRESS,
      fee: fee,
      tokenA: tokenA,
      tokenB: tokenB,
      initCodeHashManualOverride: initCodeHashManualOverride
    });
  }
  /**
   * Returns true if the token is either token0 or token1
   * @param token The token to check
   * @returns True if token is either token0 or token
   */;
  var _proto = Pool.prototype;
  _proto.involvesToken = function involvesToken(token) {
    return token.equals(this.token0) || token.equals(this.token1);
  }
  /**
   * Returns the current mid price of the pool in terms of token0, i.e. the ratio of token1 over token0
   */;
  /**
   * Return the price of the given token in terms of the other token in the pool.
   * @param token The token to return price of
   * @returns The price of the given token, in terms of the other.
   */
  _proto.priceOf = function priceOf(token) {
    !this.involvesToken(token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    return token.equals(this.token0) ? this.token0Price : this.token1Price;
  }
  /**
   * Returns the chain ID of the tokens in the pool.
   */;
  /**
   * Given an input amount of a token, return the computed output amount, and a pool with state updated after the trade
   * @param inputAmount The input amount for which to quote the output amount
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit
   * @returns The output amount and the pool with updated state
   */
  _proto.getOutputAmount =
  /*#__PURE__*/
  function () {
    var _getOutputAmount = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(inputAmount, sqrtPriceLimitX96) {
      var zeroForOne, _yield$this$swap, outputAmount, sqrtRatioX96, liquidity, tickCurrent, outputToken;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            !this.involvesToken(inputAmount.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
            zeroForOne = inputAmount.currency.equals(this.token0);
            _context.next = 4;
            return this.swap(zeroForOne, inputAmount.quotient, sqrtPriceLimitX96);
          case 4:
            _yield$this$swap = _context.sent;
            outputAmount = _yield$this$swap.amountCalculated;
            sqrtRatioX96 = _yield$this$swap.sqrtRatioX96;
            liquidity = _yield$this$swap.liquidity;
            tickCurrent = _yield$this$swap.tickCurrent;
            outputToken = zeroForOne ? this.token1 : this.token0;
            return _context.abrupt("return", [CurrencyAmount.fromRawAmount(outputToken, JSBI.multiply(outputAmount, NEGATIVE_ONE)), new Pool(this.token0, this.token1, this.fee, sqrtRatioX96, liquidity, tickCurrent, this.tickDataProvider)]);
          case 11:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function getOutputAmount(_x, _x2) {
      return _getOutputAmount.apply(this, arguments);
    }
    return getOutputAmount;
  }()
  /**
   * Given a desired output amount of a token, return the computed input amount and a pool with state updated after the trade
   * @param outputAmount the output amount for which to quote the input amount
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
   * @returns The input amount and the pool with updated state
   */
  ;
  _proto.getInputAmount =
  /*#__PURE__*/
  function () {
    var _getInputAmount = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(outputAmount, sqrtPriceLimitX96) {
      var zeroForOne, _yield$this$swap2, inputAmount, sqrtRatioX96, liquidity, tickCurrent, inputToken;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            !(outputAmount.currency.isToken && this.involvesToken(outputAmount.currency)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
            zeroForOne = outputAmount.currency.equals(this.token1);
            _context2.next = 4;
            return this.swap(zeroForOne, JSBI.multiply(outputAmount.quotient, NEGATIVE_ONE), sqrtPriceLimitX96);
          case 4:
            _yield$this$swap2 = _context2.sent;
            inputAmount = _yield$this$swap2.amountCalculated;
            sqrtRatioX96 = _yield$this$swap2.sqrtRatioX96;
            liquidity = _yield$this$swap2.liquidity;
            tickCurrent = _yield$this$swap2.tickCurrent;
            inputToken = zeroForOne ? this.token0 : this.token1;
            return _context2.abrupt("return", [CurrencyAmount.fromRawAmount(inputToken, inputAmount), new Pool(this.token0, this.token1, this.fee, sqrtRatioX96, liquidity, tickCurrent, this.tickDataProvider)]);
          case 11:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
    }));
    function getInputAmount(_x3, _x4) {
      return _getInputAmount.apply(this, arguments);
    }
    return getInputAmount;
  }()
  /**
   * Executes a swap
   * @param zeroForOne Whether the amount in is token0 or token1
   * @param amountSpecified The amount of the swap, which implicitly configures the swap as exact input (positive), or exact output (negative)
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
   * @returns amountCalculated
   * @returns sqrtRatioX96
   * @returns liquidity
   * @returns tickCurrent
   */
  ;
  _proto.swap =
  /*#__PURE__*/
  function () {
    var _swap = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(zeroForOne, amountSpecified, sqrtPriceLimitX96) {
      var exactInput, state, step, _yield$this$tickDataP, _SwapMath$computeSwap, liquidityNet;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (!sqrtPriceLimitX96) sqrtPriceLimitX96 = zeroForOne ? JSBI.add(TickMath.MIN_SQRT_RATIO, ONE) : JSBI.subtract(TickMath.MAX_SQRT_RATIO, ONE);
            if (zeroForOne) {
              !JSBI.greaterThan(sqrtPriceLimitX96, TickMath.MIN_SQRT_RATIO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RATIO_MIN') : invariant(false) : void 0;
              !JSBI.lessThan(sqrtPriceLimitX96, this.sqrtRatioX96) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RATIO_CURRENT') : invariant(false) : void 0;
            } else {
              !JSBI.lessThan(sqrtPriceLimitX96, TickMath.MAX_SQRT_RATIO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RATIO_MAX') : invariant(false) : void 0;
              !JSBI.greaterThan(sqrtPriceLimitX96, this.sqrtRatioX96) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RATIO_CURRENT') : invariant(false) : void 0;
            }
            exactInput = JSBI.greaterThanOrEqual(amountSpecified, ZERO); // keep track of swap state
            state = {
              amountSpecifiedRemaining: amountSpecified,
              amountCalculated: ZERO,
              sqrtPriceX96: this.sqrtRatioX96,
              tick: this.tickCurrent,
              liquidity: this.liquidity
            }; // start swap while loop
          case 4:
            if (!(JSBI.notEqual(state.amountSpecifiedRemaining, ZERO) && state.sqrtPriceX96 != sqrtPriceLimitX96)) {
              _context3.next = 35;
              break;
            }
            step = {};
            step.sqrtPriceStartX96 = state.sqrtPriceX96;
            _context3.next = 9;
            return this.tickDataProvider.nextInitializedTickWithinOneWord(state.tick, zeroForOne, this.tickSpacing);
          case 9:
            _yield$this$tickDataP = _context3.sent;
            step.tickNext = _yield$this$tickDataP[0];
            step.initialized = _yield$this$tickDataP[1];
            if (step.tickNext < TickMath.MIN_TICK) {
              step.tickNext = TickMath.MIN_TICK;
            } else if (step.tickNext > TickMath.MAX_TICK) {
              step.tickNext = TickMath.MAX_TICK;
            }
            step.sqrtPriceNextX96 = TickMath.getSqrtRatioAtTick(step.tickNext);
            _SwapMath$computeSwap = SwapMath.computeSwapStep(state.sqrtPriceX96, (zeroForOne ? JSBI.lessThan(step.sqrtPriceNextX96, sqrtPriceLimitX96) : JSBI.greaterThan(step.sqrtPriceNextX96, sqrtPriceLimitX96)) ? sqrtPriceLimitX96 : step.sqrtPriceNextX96, state.liquidity, state.amountSpecifiedRemaining, this.fee);
            state.sqrtPriceX96 = _SwapMath$computeSwap[0];
            step.amountIn = _SwapMath$computeSwap[1];
            step.amountOut = _SwapMath$computeSwap[2];
            step.feeAmount = _SwapMath$computeSwap[3];
            if (exactInput) {
              state.amountSpecifiedRemaining = JSBI.subtract(state.amountSpecifiedRemaining, JSBI.add(step.amountIn, step.feeAmount));
              state.amountCalculated = JSBI.subtract(state.amountCalculated, step.amountOut);
            } else {
              state.amountSpecifiedRemaining = JSBI.add(state.amountSpecifiedRemaining, step.amountOut);
              state.amountCalculated = JSBI.add(state.amountCalculated, JSBI.add(step.amountIn, step.feeAmount));
            }
            // TODO
            if (!JSBI.equal(state.sqrtPriceX96, step.sqrtPriceNextX96)) {
              _context3.next = 32;
              break;
            }
            if (!step.initialized) {
              _context3.next = 29;
              break;
            }
            _context3.t0 = JSBI;
            _context3.next = 25;
            return this.tickDataProvider.getTick(step.tickNext);
          case 25:
            _context3.t1 = _context3.sent.liquidityNet;
            liquidityNet = _context3.t0.BigInt.call(_context3.t0, _context3.t1);
            // if we're moving leftward, we interpret liquidityNet as the opposite sign
            // safe because liquidityNet cannot be type(int128).min
            if (zeroForOne) liquidityNet = JSBI.multiply(liquidityNet, NEGATIVE_ONE);
            state.liquidity = LiquidityMath.addDelta(state.liquidity, liquidityNet);
          case 29:
            state.tick = zeroForOne ? step.tickNext - 1 : step.tickNext;
            _context3.next = 33;
            break;
          case 32:
            if (JSBI.notEqual(state.sqrtPriceX96, step.sqrtPriceStartX96)) {
              // updated comparison function
              // recompute unless we're on a lower tick boundary (i.e. already transitioned ticks), and haven't moved
              state.tick = TickMath.getTickAtSqrtRatio(state.sqrtPriceX96);
            }
          case 33:
            _context3.next = 4;
            break;
          case 35:
            return _context3.abrupt("return", {
              amountCalculated: state.amountCalculated,
              sqrtRatioX96: state.sqrtPriceX96,
              liquidity: state.liquidity,
              tickCurrent: state.tick
            });
          case 36:
          case "end":
            return _context3.stop();
        }
      }, _callee3, this);
    }));
    function swap(_x5, _x6, _x7) {
      return _swap.apply(this, arguments);
    }
    return swap;
  }();
  _createClass(Pool, [{
    key: "token0Price",
    get: function get() {
      var _this$_token0Price;
      return (_this$_token0Price = this._token0Price) != null ? _this$_token0Price : this._token0Price = new Price(this.token0, this.token1, Q192, JSBI.multiply(this.sqrtRatioX96, this.sqrtRatioX96));
    }
    /**
     * Returns the current mid price of the pool in terms of token1, i.e. the ratio of token0 over token1
     */
  }, {
    key: "token1Price",
    get: function get() {
      var _this$_token1Price;
      return (_this$_token1Price = this._token1Price) != null ? _this$_token1Price : this._token1Price = new Price(this.token1, this.token0, JSBI.multiply(this.sqrtRatioX96, this.sqrtRatioX96), Q192);
    }
  }, {
    key: "chainId",
    get: function get() {
      return this.token0.chainId;
    }
  }, {
    key: "tickSpacing",
    get: function get() {
      return TICK_SPACINGS[this.fee];
    }
  }]);
  return Pool;
}();

/**
 * Represents a list of pools through which a swap can occur
 * @template TInput The input token
 * @template TOutput The output token
 */
var Route = /*#__PURE__*/function () {
  /**
   * Creates an instance of route.
   * @param pools An array of `Pool` objects, ordered by the route the swap will take
   * @param input The input token
   * @param output The output token
   */
  function Route(pools, input, output) {
    this._midPrice = null;
    !(pools.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'POOLS') : invariant(false) : void 0;
    var chainId = pools[0].chainId;
    var allOnSameChain = pools.every(function (pool) {
      return pool.chainId === chainId;
    });
    !allOnSameChain ? process.env.NODE_ENV !== "production" ? invariant(false, 'CHAIN_IDS') : invariant(false) : void 0;
    var wrappedInput = input.wrapped;
    !pools[0].involvesToken(wrappedInput) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INPUT') : invariant(false) : void 0;
    !pools[pools.length - 1].involvesToken(output.wrapped) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OUTPUT') : invariant(false) : void 0;
    /**
     * Normalizes token0-token1 order and selects the next token/fee step to add to the path
     * */
    var tokenPath = [wrappedInput];
    for (var _iterator = _createForOfIteratorHelperLoose(pools.entries()), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
        i = _step$value[0],
        pool = _step$value[1];
      var currentInputToken = tokenPath[i];
      !(currentInputToken.equals(pool.token0) || currentInputToken.equals(pool.token1)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'PATH') : invariant(false) : void 0;
      var nextToken = currentInputToken.equals(pool.token0) ? pool.token1 : pool.token0;
      tokenPath.push(nextToken);
    }
    this.pools = pools;
    this.tokenPath = tokenPath;
    this.input = input;
    this.output = output != null ? output : tokenPath[tokenPath.length - 1];
  }
  _createClass(Route, [{
    key: "chainId",
    get: function get() {
      return this.pools[0].chainId;
    }
    /**
     * Returns the mid price of the route
     */
  }, {
    key: "midPrice",
    get: function get() {
      if (this._midPrice !== null) return this._midPrice;
      var price = this.pools.slice(1).reduce(function (_ref, pool) {
        var nextInput = _ref.nextInput,
          price = _ref.price;
        return nextInput.equals(pool.token0) ? {
          nextInput: pool.token1,
          price: price.multiply(pool.token0Price)
        } : {
          nextInput: pool.token0,
          price: price.multiply(pool.token1Price)
        };
      }, this.pools[0].token0.equals(this.input.wrapped) ? {
        nextInput: this.pools[0].token1,
        price: this.pools[0].token0Price
      } : {
        nextInput: this.pools[0].token0,
        price: this.pools[0].token1Price
      }).price;
      return this._midPrice = new Price(this.input, this.output, price.denominator, price.numerator);
    }
  }]);
  return Route;
}();

// given an array of items sorted by `comparator`, insert an item into its sort index and constrain the size to
// `maxSize` by removing the last item
function sortedInsert(items, add, maxSize, comparator) {
  !(maxSize > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'MAX_SIZE_ZERO') : invariant(false) : void 0;
  // this is an invariant because the interface cannot return multiple removed items if items.length exceeds maxSize
  !(items.length <= maxSize) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ITEMS_SIZE') : invariant(false) : void 0;
  // short circuit first item add
  if (items.length === 0) {
    items.push(add);
    return null;
  } else {
    var isFull = items.length === maxSize;
    // short circuit if full and the additional item does not come before the last item
    if (isFull && comparator(items[items.length - 1], add) <= 0) {
      return add;
    }
    var lo = 0,
      hi = items.length;
    while (lo < hi) {
      var mid = lo + hi >>> 1;
      if (comparator(items[mid], add) <= 0) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    items.splice(lo, 0, add);
    return isFull ? items.pop() : null;
  }
}

var ONE_HUNDRED = /*#__PURE__*/new Fraction( /*#__PURE__*/JSBI.BigInt(100));
/**
 * Converts a fraction to a percent
 * @param fraction the fraction to convert
 */
function toPercent(fraction) {
  return new Percent(fraction.numerator, fraction.denominator);
}
var Percent = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(Percent, _Fraction);
  function Percent() {
    var _this;
    _this = _Fraction.apply(this, arguments) || this;
    /**
     * This boolean prevents a fraction from being interpreted as a Percent
     */
    _this.isPercent = true;
    return _this;
  }
  var _proto = Percent.prototype;
  _proto.add = function add(other) {
    return toPercent(_Fraction.prototype.add.call(this, other));
  };
  _proto.subtract = function subtract(other) {
    return toPercent(_Fraction.prototype.subtract.call(this, other));
  };
  _proto.multiply = function multiply(other) {
    return toPercent(_Fraction.prototype.multiply.call(this, other));
  };
  _proto.divide = function divide(other) {
    return toPercent(_Fraction.prototype.divide.call(this, other));
  };
  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 5;
    }
    return _Fraction.prototype.multiply.call(this, ONE_HUNDRED).toSignificant(significantDigits, format, rounding);
  };
  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = 2;
    }
    return _Fraction.prototype.multiply.call(this, ONE_HUNDRED).toFixed(decimalPlaces, format, rounding);
  };
  return Percent;
}(Fraction);

/**
 * Trades comparator, an extension of the input output comparator that also considers other dimensions of the trade in ranking them
 * @template TInput The input token, either Ether or an ERC-20
 * @template TOutput The output token, either Ether or an ERC-20
 * @template TTradeType The trade type, either exact input or exact output
 * @param a The first trade to compare
 * @param b The second trade to compare
 * @returns A sorted ordering for two neighboring elements in a trade array
 */
function tradeComparator(a, b) {
  // must have same input and output token for comparison
  !a.inputAmount.currency.equals(b.inputAmount.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INPUT_CURRENCY') : invariant(false) : void 0;
  !a.outputAmount.currency.equals(b.outputAmount.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OUTPUT_CURRENCY') : invariant(false) : void 0;
  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount)) {
      // consider the number of hops since each hop costs gas
      var aHops = a.swaps.reduce(function (total, cur) {
        return total + cur.route.tokenPath.length;
      }, 0);
      var bHops = b.swaps.reduce(function (total, cur) {
        return total + cur.route.tokenPath.length;
      }, 0);
      return aHops - bHops;
    }
    // trade A requires less input than trade B, so A should come first
    if (a.inputAmount.lessThan(b.inputAmount)) {
      return -1;
    } else {
      return 1;
    }
  } else {
    // tradeA has less output than trade B, so should come second
    if (a.outputAmount.lessThan(b.outputAmount)) {
      return 1;
    } else {
      return -1;
    }
  }
}
/**
 * Represents a trade executed against a set of routes where some percentage of the input is
 * split across each route.
 *
 * Each route has its own set of pools. Pools can not be re-used across routes.
 *
 * Does not account for slippage, i.e., changes in price environment that can occur between
 * the time the trade is submitted and when it is executed.
 * @template TInput The input token, either Ether or an ERC-20
 * @template TOutput The output token, either Ether or an ERC-20
 * @template TTradeType The trade type, either exact input or exact output
 */
var Trade = /*#__PURE__*/function () {
  /**
   * Construct a trade by passing in the pre-computed property values
   * @param routes The routes through which the trade occurs
   * @param tradeType The type of trade, exact input or exact output
   */
  function Trade(_ref) {
    var routes = _ref.routes,
      tradeType = _ref.tradeType;
    var inputCurrency = routes[0].inputAmount.currency;
    var outputCurrency = routes[0].outputAmount.currency;
    !routes.every(function (_ref2) {
      var route = _ref2.route;
      return inputCurrency.wrapped.equals(route.input.wrapped);
    }) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INPUT_CURRENCY_MATCH') : invariant(false) : void 0;
    !routes.every(function (_ref3) {
      var route = _ref3.route;
      return outputCurrency.wrapped.equals(route.output.wrapped);
    }) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OUTPUT_CURRENCY_MATCH') : invariant(false) : void 0;
    var numPools = routes.map(function (_ref4) {
      var route = _ref4.route;
      return route.pools.length;
    }).reduce(function (total, cur) {
      return total + cur;
    }, 0);
    var poolAddressSet = new Set();
    for (var _iterator = _createForOfIteratorHelperLoose(routes), _step; !(_step = _iterator()).done;) {
      var route = _step.value.route;
      for (var _iterator2 = _createForOfIteratorHelperLoose(route.pools), _step2; !(_step2 = _iterator2()).done;) {
        var pool = _step2.value;
        poolAddressSet.add(Pool.getAddress(pool.token0, pool.token1, pool.fee));
      }
    }
    !(numPools == poolAddressSet.size) ? process.env.NODE_ENV !== "production" ? invariant(false, 'POOLS_DUPLICATED') : invariant(false) : void 0;
    this.swaps = routes;
    this.tradeType = tradeType;
  }
  /**
   * @deprecated Deprecated in favor of 'swaps' property. If the trade consists of multiple routes
   * this will return an error.
   *
   * When the trade consists of just a single route, this returns the route of the trade,
   * i.e. which pools the trade goes through.
   */
  /**
   * Constructs an exact in trade with the given amount in and route
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @param route The route of the exact in trade
   * @param amountIn The amount being passed in
   * @returns The exact in trade
   */
  Trade.exactIn =
  /*#__PURE__*/
  function () {
    var _exactIn = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(route, amountIn) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", Trade.fromRoute(route, amountIn, TradeType.EXACT_INPUT));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function exactIn(_x, _x2) {
      return _exactIn.apply(this, arguments);
    }
    return exactIn;
  }()
  /**
   * Constructs an exact out trade with the given amount out and route
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @param route The route of the exact out trade
   * @param amountOut The amount returned by the trade
   * @returns The exact out trade
   */
  ;
  Trade.exactOut =
  /*#__PURE__*/
  function () {
    var _exactOut = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(route, amountOut) {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", Trade.fromRoute(route, amountOut, TradeType.EXACT_OUTPUT));
          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    function exactOut(_x3, _x4) {
      return _exactOut.apply(this, arguments);
    }
    return exactOut;
  }()
  /**
   * Constructs a trade by simulating swaps through the given route
   * @template TInput The input token, either Ether or an ERC-20.
   * @template TOutput The output token, either Ether or an ERC-20.
   * @template TTradeType The type of the trade, either exact in or exact out.
   * @param route route to swap through
   * @param amount the amount specified, either input or output, depending on tradeType
   * @param tradeType whether the trade is an exact input or exact output swap
   * @returns The route
   */
  ;
  Trade.fromRoute =
  /*#__PURE__*/
  function () {
    var _fromRoute = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(route, amount, tradeType) {
      var amounts, inputAmount, outputAmount, i, pool, _yield$pool$getOutput, _outputAmount, _i, _pool, _yield$_pool$getInput, _inputAmount;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            amounts = new Array(route.tokenPath.length);
            if (!(tradeType === TradeType.EXACT_INPUT)) {
              _context3.next = 19;
              break;
            }
            !amount.currency.equals(route.input) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INPUT') : invariant(false) : void 0;
            amounts[0] = amount.wrapped;
            i = 0;
          case 5:
            if (!(i < route.tokenPath.length - 1)) {
              _context3.next = 15;
              break;
            }
            pool = route.pools[i];
            _context3.next = 9;
            return pool.getOutputAmount(amounts[i]);
          case 9:
            _yield$pool$getOutput = _context3.sent;
            _outputAmount = _yield$pool$getOutput[0];
            amounts[i + 1] = _outputAmount;
          case 12:
            i++;
            _context3.next = 5;
            break;
          case 15:
            inputAmount = CurrencyAmount.fromFractionalAmount(route.input, amount.numerator, amount.denominator);
            outputAmount = CurrencyAmount.fromFractionalAmount(route.output, amounts[amounts.length - 1].numerator, amounts[amounts.length - 1].denominator);
            _context3.next = 34;
            break;
          case 19:
            !amount.currency.equals(route.output) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OUTPUT') : invariant(false) : void 0;
            amounts[amounts.length - 1] = amount.wrapped;
            _i = route.tokenPath.length - 1;
          case 22:
            if (!(_i > 0)) {
              _context3.next = 32;
              break;
            }
            _pool = route.pools[_i - 1];
            _context3.next = 26;
            return _pool.getInputAmount(amounts[_i]);
          case 26:
            _yield$_pool$getInput = _context3.sent;
            _inputAmount = _yield$_pool$getInput[0];
            amounts[_i - 1] = _inputAmount;
          case 29:
            _i--;
            _context3.next = 22;
            break;
          case 32:
            inputAmount = CurrencyAmount.fromFractionalAmount(route.input, amounts[0].numerator, amounts[0].denominator);
            outputAmount = CurrencyAmount.fromFractionalAmount(route.output, amount.numerator, amount.denominator);
          case 34:
            return _context3.abrupt("return", new Trade({
              routes: [{
                inputAmount: inputAmount,
                outputAmount: outputAmount,
                route: route
              }],
              tradeType: tradeType
            }));
          case 35:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    function fromRoute(_x5, _x6, _x7) {
      return _fromRoute.apply(this, arguments);
    }
    return fromRoute;
  }()
  /**
   * Constructs a trade from routes by simulating swaps
   *
   * @template TInput The input token, either Ether or an ERC-20.
   * @template TOutput The output token, either Ether or an ERC-20.
   * @template TTradeType The type of the trade, either exact in or exact out.
   * @param routes the routes to swap through and how much of the amount should be routed through each
   * @param tradeType whether the trade is an exact input or exact output swap
   * @returns The trade
   */
  ;
  Trade.fromRoutes =
  /*#__PURE__*/
  function () {
    var _fromRoutes = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(routes, tradeType) {
      var populatedRoutes, _iterator3, _step3, _step3$value, route, amount, amounts, inputAmount, outputAmount, i, pool, _yield$pool$getOutput2, _outputAmount2, _i2, _pool2, _yield$_pool2$getInpu, _inputAmount2;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            populatedRoutes = [];
            _iterator3 = _createForOfIteratorHelperLoose(routes);
          case 2:
            if ((_step3 = _iterator3()).done) {
              _context4.next = 43;
              break;
            }
            _step3$value = _step3.value, route = _step3$value.route, amount = _step3$value.amount;
            amounts = new Array(route.tokenPath.length);
            inputAmount = void 0;
            outputAmount = void 0;
            if (!(tradeType === TradeType.EXACT_INPUT)) {
              _context4.next = 25;
              break;
            }
            !amount.currency.equals(route.input) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INPUT') : invariant(false) : void 0;
            inputAmount = CurrencyAmount.fromFractionalAmount(route.input, amount.numerator, amount.denominator);
            amounts[0] = CurrencyAmount.fromFractionalAmount(route.input.wrapped, amount.numerator, amount.denominator);
            i = 0;
          case 12:
            if (!(i < route.tokenPath.length - 1)) {
              _context4.next = 22;
              break;
            }
            pool = route.pools[i];
            _context4.next = 16;
            return pool.getOutputAmount(amounts[i]);
          case 16:
            _yield$pool$getOutput2 = _context4.sent;
            _outputAmount2 = _yield$pool$getOutput2[0];
            amounts[i + 1] = _outputAmount2;
          case 19:
            i++;
            _context4.next = 12;
            break;
          case 22:
            outputAmount = CurrencyAmount.fromFractionalAmount(route.output, amounts[amounts.length - 1].numerator, amounts[amounts.length - 1].denominator);
            _context4.next = 40;
            break;
          case 25:
            !amount.currency.equals(route.output) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OUTPUT') : invariant(false) : void 0;
            outputAmount = CurrencyAmount.fromFractionalAmount(route.output, amount.numerator, amount.denominator);
            amounts[amounts.length - 1] = CurrencyAmount.fromFractionalAmount(route.output.wrapped, amount.numerator, amount.denominator);
            _i2 = route.tokenPath.length - 1;
          case 29:
            if (!(_i2 > 0)) {
              _context4.next = 39;
              break;
            }
            _pool2 = route.pools[_i2 - 1];
            _context4.next = 33;
            return _pool2.getInputAmount(amounts[_i2]);
          case 33:
            _yield$_pool2$getInpu = _context4.sent;
            _inputAmount2 = _yield$_pool2$getInpu[0];
            amounts[_i2 - 1] = _inputAmount2;
          case 36:
            _i2--;
            _context4.next = 29;
            break;
          case 39:
            inputAmount = CurrencyAmount.fromFractionalAmount(route.input, amounts[0].numerator, amounts[0].denominator);
          case 40:
            populatedRoutes.push({
              route: route,
              inputAmount: inputAmount,
              outputAmount: outputAmount
            });
          case 41:
            _context4.next = 2;
            break;
          case 43:
            return _context4.abrupt("return", new Trade({
              routes: populatedRoutes,
              tradeType: tradeType
            }));
          case 44:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    function fromRoutes(_x8, _x9) {
      return _fromRoutes.apply(this, arguments);
    }
    return fromRoutes;
  }()
  /**
   * Creates a trade without computing the result of swapping through the route. Useful when you have simulated the trade
   * elsewhere and do not have any tick data
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @template TTradeType The type of the trade, either exact in or exact out
   * @param constructorArguments The arguments passed to the trade constructor
   * @returns The unchecked trade
   */
  ;
  Trade.createUncheckedTrade = function createUncheckedTrade(constructorArguments) {
    return new Trade(_extends({}, constructorArguments, {
      routes: [{
        inputAmount: constructorArguments.inputAmount,
        outputAmount: constructorArguments.outputAmount,
        route: constructorArguments.route
      }]
    }));
  }
  /**
   * Creates a trade without computing the result of swapping through the routes. Useful when you have simulated the trade
   * elsewhere and do not have any tick data
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @template TTradeType The type of the trade, either exact in or exact out
   * @param constructorArguments The arguments passed to the trade constructor
   * @returns The unchecked trade
   */;
  Trade.createUncheckedTradeWithMultipleRoutes = function createUncheckedTradeWithMultipleRoutes(constructorArguments) {
    return new Trade(constructorArguments);
  }
  /**
   * Get the minimum amount that must be received from this trade for the given slippage tolerance
   * @param slippageTolerance The tolerance of unfavorable slippage from the execution price of this trade
   * @returns The amount out
   */;
  var _proto = Trade.prototype;
  _proto.minimumAmountOut = function minimumAmountOut(slippageTolerance, amountOut) {
    if (amountOut === void 0) {
      amountOut = this.outputAmount;
    }
    !!slippageTolerance.lessThan(ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'SLIPPAGE_TOLERANCE') : invariant(false) : void 0;
    if (this.tradeType === TradeType.EXACT_OUTPUT) {
      return amountOut;
    } else {
      var slippageAdjustedAmountOut = new Fraction(ONE).add(slippageTolerance).invert().multiply(amountOut.quotient).quotient;
      return CurrencyAmount.fromRawAmount(amountOut.currency, slippageAdjustedAmountOut);
    }
  }
  /**
   * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
   * @param slippageTolerance The tolerance of unfavorable slippage from the execution price of this trade
   * @returns The amount in
   */;
  _proto.maximumAmountIn = function maximumAmountIn(slippageTolerance, amountIn) {
    if (amountIn === void 0) {
      amountIn = this.inputAmount;
    }
    !!slippageTolerance.lessThan(ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'SLIPPAGE_TOLERANCE') : invariant(false) : void 0;
    if (this.tradeType === TradeType.EXACT_INPUT) {
      return amountIn;
    } else {
      var slippageAdjustedAmountIn = new Fraction(ONE).add(slippageTolerance).multiply(amountIn.quotient).quotient;
      return CurrencyAmount.fromRawAmount(amountIn.currency, slippageAdjustedAmountIn);
    }
  }
  /**
   * Return the execution price after accounting for slippage tolerance
   * @param slippageTolerance the allowed tolerated slippage
   * @returns The execution price
   */;
  _proto.worstExecutionPrice = function worstExecutionPrice(slippageTolerance) {
    return new Price(this.inputAmount.currency, this.outputAmount.currency, this.maximumAmountIn(slippageTolerance).quotient, this.minimumAmountOut(slippageTolerance).quotient);
  }
  /**
   * Given a list of pools, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
   * amount to an output token, making at most `maxHops` hops.
   * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pools the pools to consider in finding the best trade
   * @param nextAmountIn exact amount of input currency to spend
   * @param currencyOut the desired currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pool
   * @param currentPools used in recursion; the current list of pools
   * @param currencyAmountIn used in recursion; the original value of the currencyAmountIn parameter
   * @param bestTrades used in recursion; the current list of best trades
   * @returns The exact in trade
   */;
  Trade.bestTradeExactIn =
  /*#__PURE__*/
  function () {
    var _bestTradeExactIn = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(pools, currencyAmountIn, currencyOut, _temp,
    // used in recursion.
    currentPools, nextAmountIn, bestTrades) {
      var _ref5, _ref5$maxNumResults, maxNumResults, _ref5$maxHops, maxHops, amountIn, tokenOut, i, pool, amountOut, _yield$pool$getOutput3, poolsExcludingThisPool;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            _ref5 = _temp === void 0 ? {} : _temp, _ref5$maxNumResults = _ref5.maxNumResults, maxNumResults = _ref5$maxNumResults === void 0 ? 3 : _ref5$maxNumResults, _ref5$maxHops = _ref5.maxHops, maxHops = _ref5$maxHops === void 0 ? 3 : _ref5$maxHops;
            if (currentPools === void 0) {
              currentPools = [];
            }
            if (nextAmountIn === void 0) {
              nextAmountIn = currencyAmountIn;
            }
            if (bestTrades === void 0) {
              bestTrades = [];
            }
            !(pools.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'POOLS') : invariant(false) : void 0;
            !(maxHops > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'MAX_HOPS') : invariant(false) : void 0;
            !(currencyAmountIn === nextAmountIn || currentPools.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INVALID_RECURSION') : invariant(false) : void 0;
            amountIn = nextAmountIn.wrapped;
            tokenOut = currencyOut.wrapped;
            i = 0;
          case 10:
            if (!(i < pools.length)) {
              _context5.next = 46;
              break;
            }
            pool = pools[i]; // pool irrelevant
            if (!(!pool.token0.equals(amountIn.currency) && !pool.token1.equals(amountIn.currency))) {
              _context5.next = 14;
              break;
            }
            return _context5.abrupt("continue", 43);
          case 14:
            amountOut = void 0;
            _context5.prev = 15;
            _context5.next = 19;
            return pool.getOutputAmount(amountIn);
          case 19:
            _yield$pool$getOutput3 = _context5.sent;
            amountOut = _yield$pool$getOutput3[0];
            _context5.next = 28;
            break;
          case 23:
            _context5.prev = 23;
            _context5.t0 = _context5["catch"](15);
            if (!_context5.t0.isInsufficientInputAmountError) {
              _context5.next = 27;
              break;
            }
            return _context5.abrupt("continue", 43);
          case 27:
            throw _context5.t0;
          case 28:
            if (!(amountOut.currency.isToken && amountOut.currency.equals(tokenOut))) {
              _context5.next = 39;
              break;
            }
            _context5.t1 = sortedInsert;
            _context5.t2 = bestTrades;
            _context5.next = 33;
            return Trade.fromRoute(new Route([].concat(currentPools, [pool]), currencyAmountIn.currency, currencyOut), currencyAmountIn, TradeType.EXACT_INPUT);
          case 33:
            _context5.t3 = _context5.sent;
            _context5.t4 = maxNumResults;
            _context5.t5 = tradeComparator;
            (0, _context5.t1)(_context5.t2, _context5.t3, _context5.t4, _context5.t5);
            _context5.next = 43;
            break;
          case 39:
            if (!(maxHops > 1 && pools.length > 1)) {
              _context5.next = 43;
              break;
            }
            poolsExcludingThisPool = pools.slice(0, i).concat(pools.slice(i + 1, pools.length)); // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops
            _context5.next = 43;
            return Trade.bestTradeExactIn(poolsExcludingThisPool, currencyAmountIn, currencyOut, {
              maxNumResults: maxNumResults,
              maxHops: maxHops - 1
            }, [].concat(currentPools, [pool]), amountOut, bestTrades);
          case 43:
            i++;
            _context5.next = 10;
            break;
          case 46:
            return _context5.abrupt("return", bestTrades);
          case 47:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[15, 23]]);
    }));
    function bestTradeExactIn(_x10, _x11, _x12, _x13, _x14, _x15, _x16) {
      return _bestTradeExactIn.apply(this, arguments);
    }
    return bestTradeExactIn;
  }()
  /**
   * similar to the above method but instead targets a fixed output amount
   * given a list of pools, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
   * to an output token amount, making at most `maxHops` hops
   * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pools the pools to consider in finding the best trade
   * @param currencyIn the currency to spend
   * @param currencyAmountOut the desired currency amount out
   * @param nextAmountOut the exact amount of currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pool
   * @param currentPools used in recursion; the current list of pools
   * @param bestTrades used in recursion; the current list of best trades
   * @returns The exact out trade
   */
  ;
  Trade.bestTradeExactOut =
  /*#__PURE__*/
  function () {
    var _bestTradeExactOut = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(pools, currencyIn, currencyAmountOut, _temp2,
    // used in recursion.
    currentPools, nextAmountOut, bestTrades) {
      var _ref6, _ref6$maxNumResults, maxNumResults, _ref6$maxHops, maxHops, amountOut, tokenIn, i, pool, amountIn, _yield$pool$getInputA, poolsExcludingThisPool;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            _ref6 = _temp2 === void 0 ? {} : _temp2, _ref6$maxNumResults = _ref6.maxNumResults, maxNumResults = _ref6$maxNumResults === void 0 ? 3 : _ref6$maxNumResults, _ref6$maxHops = _ref6.maxHops, maxHops = _ref6$maxHops === void 0 ? 3 : _ref6$maxHops;
            if (currentPools === void 0) {
              currentPools = [];
            }
            if (nextAmountOut === void 0) {
              nextAmountOut = currencyAmountOut;
            }
            if (bestTrades === void 0) {
              bestTrades = [];
            }
            !(pools.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'POOLS') : invariant(false) : void 0;
            !(maxHops > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'MAX_HOPS') : invariant(false) : void 0;
            !(currencyAmountOut === nextAmountOut || currentPools.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INVALID_RECURSION') : invariant(false) : void 0;
            amountOut = nextAmountOut.wrapped;
            tokenIn = currencyIn.wrapped;
            i = 0;
          case 10:
            if (!(i < pools.length)) {
              _context6.next = 46;
              break;
            }
            pool = pools[i]; // pool irrelevant
            if (!(!pool.token0.equals(amountOut.currency) && !pool.token1.equals(amountOut.currency))) {
              _context6.next = 14;
              break;
            }
            return _context6.abrupt("continue", 43);
          case 14:
            amountIn = void 0;
            _context6.prev = 15;
            _context6.next = 19;
            return pool.getInputAmount(amountOut);
          case 19:
            _yield$pool$getInputA = _context6.sent;
            amountIn = _yield$pool$getInputA[0];
            _context6.next = 28;
            break;
          case 23:
            _context6.prev = 23;
            _context6.t0 = _context6["catch"](15);
            if (!_context6.t0.isInsufficientReservesError) {
              _context6.next = 27;
              break;
            }
            return _context6.abrupt("continue", 43);
          case 27:
            throw _context6.t0;
          case 28:
            if (!amountIn.currency.equals(tokenIn)) {
              _context6.next = 39;
              break;
            }
            _context6.t1 = sortedInsert;
            _context6.t2 = bestTrades;
            _context6.next = 33;
            return Trade.fromRoute(new Route([pool].concat(currentPools), currencyIn, currencyAmountOut.currency), currencyAmountOut, TradeType.EXACT_OUTPUT);
          case 33:
            _context6.t3 = _context6.sent;
            _context6.t4 = maxNumResults;
            _context6.t5 = tradeComparator;
            (0, _context6.t1)(_context6.t2, _context6.t3, _context6.t4, _context6.t5);
            _context6.next = 43;
            break;
          case 39:
            if (!(maxHops > 1 && pools.length > 1)) {
              _context6.next = 43;
              break;
            }
            poolsExcludingThisPool = pools.slice(0, i).concat(pools.slice(i + 1, pools.length)); // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops
            _context6.next = 43;
            return Trade.bestTradeExactOut(poolsExcludingThisPool, currencyIn, currencyAmountOut, {
              maxNumResults: maxNumResults,
              maxHops: maxHops - 1
            }, [pool].concat(currentPools), amountIn, bestTrades);
          case 43:
            i++;
            _context6.next = 10;
            break;
          case 46:
            return _context6.abrupt("return", bestTrades);
          case 47:
          case "end":
            return _context6.stop();
        }
      }, _callee6, null, [[15, 23]]);
    }));
    function bestTradeExactOut(_x17, _x18, _x19, _x20, _x21, _x22, _x23) {
      return _bestTradeExactOut.apply(this, arguments);
    }
    return bestTradeExactOut;
  }();
  _createClass(Trade, [{
    key: "route",
    get: function get() {
      !(this.swaps.length == 1) ? process.env.NODE_ENV !== "production" ? invariant(false, 'MULTIPLE_ROUTES') : invariant(false) : void 0;
      return this.swaps[0].route;
    }
    /**
     * The input amount for the trade assuming no slippage.
     */
  }, {
    key: "inputAmount",
    get: function get() {
      if (this._inputAmount) {
        return this._inputAmount;
      }
      var inputCurrency = this.swaps[0].inputAmount.currency;
      var totalInputFromRoutes = this.swaps.map(function (_ref7) {
        var inputAmount = _ref7.inputAmount;
        return inputAmount;
      }).reduce(function (total, cur) {
        return total.add(cur);
      }, CurrencyAmount.fromRawAmount(inputCurrency, 0));
      this._inputAmount = totalInputFromRoutes;
      return this._inputAmount;
    }
    /**
     * The output amount for the trade assuming no slippage.
     */
  }, {
    key: "outputAmount",
    get: function get() {
      if (this._outputAmount) {
        return this._outputAmount;
      }
      var outputCurrency = this.swaps[0].outputAmount.currency;
      var totalOutputFromRoutes = this.swaps.map(function (_ref8) {
        var outputAmount = _ref8.outputAmount;
        return outputAmount;
      }).reduce(function (total, cur) {
        return total.add(cur);
      }, CurrencyAmount.fromRawAmount(outputCurrency, 0));
      this._outputAmount = totalOutputFromRoutes;
      return this._outputAmount;
    }
    /**
     * The price expressed in terms of output amount/input amount.
     */
  }, {
    key: "executionPrice",
    get: function get() {
      var _this$_executionPrice;
      return (_this$_executionPrice = this._executionPrice) != null ? _this$_executionPrice : this._executionPrice = new Price(this.inputAmount.currency, this.outputAmount.currency, this.inputAmount.quotient, this.outputAmount.quotient);
    }
    /**
     * Returns the percent difference between the route's mid price and the price impact
     */
  }, {
    key: "priceImpact",
    get: function get() {
      if (this._priceImpact) {
        return this._priceImpact;
      }
      var spotOutputAmount = CurrencyAmount.fromRawAmount(this.outputAmount.currency, 0);
      for (var _iterator4 = _createForOfIteratorHelperLoose(this.swaps), _step4; !(_step4 = _iterator4()).done;) {
        var _step4$value = _step4.value,
          route = _step4$value.route,
          inputAmount = _step4$value.inputAmount;
        var midPrice = route.midPrice;
        spotOutputAmount = spotOutputAmount.add(midPrice.quote(inputAmount));
      }
      var priceImpact = spotOutputAmount.subtract(this.outputAmount).divide(spotOutputAmount);
      this._priceImpact = new Percent(priceImpact.numerator, priceImpact.denominator);
      return this._priceImpact;
    }
  }]);
  return Trade;
}();

/**
 * Represents the native currency of the chain on which it resides, e.g.
 */
var NativeCurrency = /*#__PURE__*/function (_BaseCurrency) {
  _inheritsLoose(NativeCurrency, _BaseCurrency);
  function NativeCurrency() {
    var _this;
    _this = _BaseCurrency.apply(this, arguments) || this;
    _this.isNative = true;
    _this.isToken = false;
    return _this;
  }
  return NativeCurrency;
}(BaseCurrency);

/**
 * Returns an imprecise maximum amount of liquidity received for a given amount of token 0.
 * This function is available to accommodate LiquidityAmounts#getLiquidityForAmount0 in the v3 periphery,
 * which could be more precise by at least 32 bits by dividing by Q64 instead of Q96 in the intermediate step,
 * and shifting the subtracted ratio left by 32 bits. This imprecise calculation will likely be replaced in a future
 * v3 router contract.
 * @param sqrtRatioAX96 The price at the lower boundary
 * @param sqrtRatioBX96 The price at the upper boundary
 * @param amount0 The token0 amount
 * @returns liquidity for amount0, imprecise
 */
function maxLiquidityForAmount0Imprecise(sqrtRatioAX96, sqrtRatioBX96, amount0) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref[0];
    sqrtRatioBX96 = _ref[1];
  }
  var intermediate = JSBI.divide(JSBI.multiply(sqrtRatioAX96, sqrtRatioBX96), Q96);
  return JSBI.divide(JSBI.multiply(JSBI.BigInt(amount0), intermediate), JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96));
}
/**
 * Returns a precise maximum amount of liquidity received for a given amount of token 0 by dividing by Q64 instead of Q96 in the intermediate step,
 * and shifting the subtracted ratio left by 32 bits.
 * @param sqrtRatioAX96 The price at the lower boundary
 * @param sqrtRatioBX96 The price at the upper boundary
 * @param amount0 The token0 amount
 * @returns liquidity for amount0, precise
 */
function maxLiquidityForAmount0Precise(sqrtRatioAX96, sqrtRatioBX96, amount0) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref2 = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref2[0];
    sqrtRatioBX96 = _ref2[1];
  }
  var numerator = JSBI.multiply(JSBI.multiply(JSBI.BigInt(amount0), sqrtRatioAX96), sqrtRatioBX96);
  var denominator = JSBI.multiply(Q96, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96));
  return JSBI.divide(numerator, denominator);
}
/**
 * Computes the maximum amount of liquidity received for a given amount of token1
 * @param sqrtRatioAX96 The price at the lower tick boundary
 * @param sqrtRatioBX96 The price at the upper tick boundary
 * @param amount1 The token1 amount
 * @returns liquidity for amount1
 */
function maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref3 = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref3[0];
    sqrtRatioBX96 = _ref3[1];
  }
  return JSBI.divide(JSBI.multiply(JSBI.BigInt(amount1), Q96), JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96));
}
/**
 * Computes the maximum amount of liquidity received for a given amount of token0, token1,
 * and the prices at the tick boundaries.
 * @param sqrtRatioCurrentX96 the current price
 * @param sqrtRatioAX96 price at lower boundary
 * @param sqrtRatioBX96 price at upper boundary
 * @param amount0 token0 amount
 * @param amount1 token1 amount
 * @param useFullPrecision if false, liquidity will be maximized according to what the router can calculate,
 * not what core can theoretically support
 */
function maxLiquidityForAmounts(sqrtRatioCurrentX96, sqrtRatioAX96, sqrtRatioBX96, amount0, amount1, useFullPrecision) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref4 = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref4[0];
    sqrtRatioBX96 = _ref4[1];
  }
  var maxLiquidityForAmount0 = useFullPrecision ? maxLiquidityForAmount0Precise : maxLiquidityForAmount0Imprecise;
  if (JSBI.lessThanOrEqual(sqrtRatioCurrentX96, sqrtRatioAX96)) {
    return maxLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0);
  } else if (JSBI.lessThan(sqrtRatioCurrentX96, sqrtRatioBX96)) {
    var liquidity0 = maxLiquidityForAmount0(sqrtRatioCurrentX96, sqrtRatioBX96, amount0);
    var liquidity1 = maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioCurrentX96, amount1);
    return JSBI.lessThan(liquidity0, liquidity1) ? liquidity0 : liquidity1;
  } else {
    return maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1);
  }
}

var MAX_SAFE_INTEGER = /*#__PURE__*/JSBI.BigInt(Number.MAX_SAFE_INTEGER);
var ZERO$1 = /*#__PURE__*/JSBI.BigInt(0);
var ONE$1 = /*#__PURE__*/JSBI.BigInt(1);
var TWO$1 = /*#__PURE__*/JSBI.BigInt(2);
/**
 * Computes floor(sqrt(value))
 * @param value the value for which to compute the square root, rounded down
 */
function sqrt(value) {
  !JSBI.greaterThanOrEqual(value, ZERO$1) ? process.env.NODE_ENV !== "production" ? invariant(false, 'NEGATIVE') : invariant(false) : void 0;
  // rely on built in sqrt if possible
  if (JSBI.lessThan(value, MAX_SAFE_INTEGER)) {
    return JSBI.BigInt(Math.floor(Math.sqrt(JSBI.toNumber(value))));
  }
  var z;
  var x;
  z = value;
  x = JSBI.add(JSBI.divide(value, TWO$1), ONE$1);
  while (JSBI.lessThan(x, z)) {
    z = x;
    x = JSBI.divide(JSBI.add(JSBI.divide(value, x), x), TWO$1);
  }
  return z;
}

/**
 * Returns the sqrt ratio as a Q64.96 corresponding to a given ratio of amount1 and amount0
 * @param amount1 The numerator amount i.e., the amount of token1
 * @param amount0 The denominator amount i.e., the amount of token0
 * @returns The sqrt ratio
 */
function encodeSqrtRatioX96(amount1, amount0) {
  var numerator = JSBI.leftShift(JSBI.BigInt(amount1), JSBI.BigInt(192));
  var denominator = JSBI.BigInt(amount0);
  var ratioX192 = JSBI.divide(numerator, denominator);
  return sqrt(ratioX192);
}

/**
 * Returns a price object corresponding to the input tick and the base/quote token
 * Inputs must be tokens because the address order is used to interpret the price represented by the tick
 * @param baseToken the base token of the price
 * @param quoteToken the quote token of the price
 * @param tick the tick for which to return the price
 */
function tickToPrice(baseToken, quoteToken, tick) {
  var sqrtRatioX96 = TickMath.getSqrtRatioAtTick(tick);
  var ratioX192 = JSBI.multiply(sqrtRatioX96, sqrtRatioX96);
  return baseToken.sortsBefore(quoteToken) ? new Price(baseToken, quoteToken, Q192, ratioX192) : new Price(baseToken, quoteToken, ratioX192, Q192);
}

/**
 * Represents a position on a Uniswap V3 Pool
 */
var Position = /*#__PURE__*/function () {
  /**
   * Constructs a position for a given pool with the given liquidity
   * @param pool For which pool the liquidity is assigned
   * @param liquidity The amount of liquidity that is in the position
   * @param tickLower The lower tick of the position
   * @param tickUpper The upper tick of the position
   */
  function Position(_ref) {
    var pool = _ref.pool,
      liquidity = _ref.liquidity,
      tickLower = _ref.tickLower,
      tickUpper = _ref.tickUpper;
    // cached resuts for the getters
    this._token0Amount = null;
    this._token1Amount = null;
    this._mintAmounts = null;
    !(tickLower < tickUpper) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TICK_ORDER') : invariant(false) : void 0;
    !(tickLower >= TickMath.MIN_TICK && tickLower % pool.tickSpacing === 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TICK_LOWER') : invariant(false) : void 0;
    !(tickUpper <= TickMath.MAX_TICK && tickUpper % pool.tickSpacing === 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TICK_UPPER') : invariant(false) : void 0;
    this.pool = pool;
    this.tickLower = tickLower;
    this.tickUpper = tickUpper;
    this.liquidity = JSBI.BigInt(liquidity);
  }
  /**
   * Returns the price of token0 at the lower tick
   */
  var _proto = Position.prototype;
  /**
   * Returns the lower and upper sqrt ratios if the price 'slips' up to slippage tolerance percentage
   * @param slippageTolerance The amount by which the price can 'slip' before the transaction will revert
   * @returns The sqrt ratios after slippage
   */
  _proto.ratiosAfterSlippage = function ratiosAfterSlippage(slippageTolerance) {
    var priceLower = this.pool.token0Price.asFraction.multiply(new Percent(1).subtract(slippageTolerance));
    var priceUpper = this.pool.token0Price.asFraction.multiply(slippageTolerance.add(1));
    var sqrtRatioX96Lower = encodeSqrtRatioX96(priceLower.numerator, priceLower.denominator);
    if (JSBI.lessThanOrEqual(sqrtRatioX96Lower, TickMath.MIN_SQRT_RATIO)) {
      sqrtRatioX96Lower = JSBI.add(TickMath.MIN_SQRT_RATIO, JSBI.BigInt(1));
    }
    var sqrtRatioX96Upper = encodeSqrtRatioX96(priceUpper.numerator, priceUpper.denominator);
    if (JSBI.greaterThanOrEqual(sqrtRatioX96Upper, TickMath.MAX_SQRT_RATIO)) {
      sqrtRatioX96Upper = JSBI.subtract(TickMath.MAX_SQRT_RATIO, JSBI.BigInt(1));
    }
    return {
      sqrtRatioX96Lower: sqrtRatioX96Lower,
      sqrtRatioX96Upper: sqrtRatioX96Upper
    };
  }
  /**
   * Returns the minimum amounts that must be sent in order to safely mint the amount of liquidity held by the position
   * with the given slippage tolerance
   * @param slippageTolerance Tolerance of unfavorable slippage from the current price
   * @returns The amounts, with slippage
   */;
  _proto.mintAmountsWithSlippage = function mintAmountsWithSlippage(slippageTolerance) {
    // get lower/upper prices
    var _this$ratiosAfterSlip = this.ratiosAfterSlippage(slippageTolerance),
      sqrtRatioX96Upper = _this$ratiosAfterSlip.sqrtRatioX96Upper,
      sqrtRatioX96Lower = _this$ratiosAfterSlip.sqrtRatioX96Lower;
    // construct counterfactual pools
    var poolLower = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Lower, 0 /* liquidity doesn't matter */, TickMath.getTickAtSqrtRatio(sqrtRatioX96Lower));
    var poolUpper = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Upper, 0 /* liquidity doesn't matter */, TickMath.getTickAtSqrtRatio(sqrtRatioX96Upper));
    // because the router is imprecise, we need to calculate the position that will be created (assuming no slippage)
    var positionThatWillBeCreated = Position.fromAmounts(_extends({
      pool: this.pool,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }, this.mintAmounts, {
      useFullPrecision: false
    }));
    // we want the smaller amounts...
    // ...which occurs at the upper price for amount0...
    var amount0 = new Position({
      pool: poolUpper,
      liquidity: positionThatWillBeCreated.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).mintAmounts.amount0;
    // ...and the lower for amount1
    var amount1 = new Position({
      pool: poolLower,
      liquidity: positionThatWillBeCreated.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).mintAmounts.amount1;
    return {
      amount0: amount0,
      amount1: amount1
    };
  }
  /**
   * Returns the minimum amounts that should be requested in order to safely burn the amount of liquidity held by the
   * position with the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the current price
   * @returns The amounts, with slippage
   */;
  _proto.burnAmountsWithSlippage = function burnAmountsWithSlippage(slippageTolerance) {
    // get lower/upper prices
    var _this$ratiosAfterSlip2 = this.ratiosAfterSlippage(slippageTolerance),
      sqrtRatioX96Upper = _this$ratiosAfterSlip2.sqrtRatioX96Upper,
      sqrtRatioX96Lower = _this$ratiosAfterSlip2.sqrtRatioX96Lower;
    // construct counterfactual pools
    var poolLower = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Lower, 0 /* liquidity doesn't matter */, TickMath.getTickAtSqrtRatio(sqrtRatioX96Lower));
    var poolUpper = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Upper, 0 /* liquidity doesn't matter */, TickMath.getTickAtSqrtRatio(sqrtRatioX96Upper));
    // we want the smaller amounts...
    // ...which occurs at the upper price for amount0...
    var amount0 = new Position({
      pool: poolUpper,
      liquidity: this.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).amount0;
    // ...and the lower for amount1
    var amount1 = new Position({
      pool: poolLower,
      liquidity: this.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).amount1;
    return {
      amount0: amount0.quotient,
      amount1: amount1.quotient
    };
  }
  /**
   * Returns the minimum amounts that must be sent in order to mint the amount of liquidity held by the position at
   * the current price for the pool
   */;
  /**
   * Computes the maximum amount of liquidity received for a given amount of token0, token1,
   * and the prices at the tick boundaries.
   * @param pool The pool for which the position should be created
   * @param tickLower The lower tick of the position
   * @param tickUpper The upper tick of the position
   * @param amount0 token0 amount
   * @param amount1 token1 amount
   * @param useFullPrecision If false, liquidity will be maximized according to what the router can calculate,
   * not what core can theoretically support
   * @returns The amount of liquidity for the position
   */
  Position.fromAmounts = function fromAmounts(_ref2) {
    var pool = _ref2.pool,
      tickLower = _ref2.tickLower,
      tickUpper = _ref2.tickUpper,
      amount0 = _ref2.amount0,
      amount1 = _ref2.amount1,
      useFullPrecision = _ref2.useFullPrecision;
    var sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower);
    var sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper);
    return new Position({
      pool: pool,
      tickLower: tickLower,
      tickUpper: tickUpper,
      liquidity: maxLiquidityForAmounts(pool.sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96, amount0, amount1, useFullPrecision)
    });
  }
  /**
   * Computes a position with the maximum amount of liquidity received for a given amount of token0, assuming an unlimited amount of token1
   * @param pool The pool for which the position is created
   * @param tickLower The lower tick
   * @param tickUpper The upper tick
   * @param amount0 The desired amount of token0
   * @param useFullPrecision If true, liquidity will be maximized according to what the router can calculate,
   * not what core can theoretically support
   * @returns The position
   */;
  Position.fromAmount0 = function fromAmount0(_ref3) {
    var pool = _ref3.pool,
      tickLower = _ref3.tickLower,
      tickUpper = _ref3.tickUpper,
      amount0 = _ref3.amount0,
      useFullPrecision = _ref3.useFullPrecision;
    return Position.fromAmounts({
      pool: pool,
      tickLower: tickLower,
      tickUpper: tickUpper,
      amount0: amount0,
      amount1: MaxUint256,
      useFullPrecision: useFullPrecision
    });
  }
  /**
   * Computes a position with the maximum amount of liquidity received for a given amount of token1, assuming an unlimited amount of token0
   * @param pool The pool for which the position is created
   * @param tickLower The lower tick
   * @param tickUpper The upper tick
   * @param amount1 The desired amount of token1
   * @returns The position
   */;
  Position.fromAmount1 = function fromAmount1(_ref4) {
    var pool = _ref4.pool,
      tickLower = _ref4.tickLower,
      tickUpper = _ref4.tickUpper,
      amount1 = _ref4.amount1;
    // this function always uses full precision,
    return Position.fromAmounts({
      pool: pool,
      tickLower: tickLower,
      tickUpper: tickUpper,
      amount0: MaxUint256,
      amount1: amount1,
      useFullPrecision: true
    });
  };
  _createClass(Position, [{
    key: "token0PriceLower",
    get: function get() {
      return tickToPrice(this.pool.token0, this.pool.token1, this.tickLower);
    }
    /**
     * Returns the price of token0 at the upper tick
     */
  }, {
    key: "token0PriceUpper",
    get: function get() {
      return tickToPrice(this.pool.token0, this.pool.token1, this.tickUpper);
    }
    /**
     * Returns the amount of token0 that this position's liquidity could be burned for at the current pool price
     */
  }, {
    key: "amount0",
    get: function get() {
      if (this._token0Amount === null) {
        if (this.pool.tickCurrent < this.tickLower) {
          this._token0Amount = CurrencyAmount.fromRawAmount(this.pool.token0, SqrtPriceMath.getAmount0Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, false));
        } else if (this.pool.tickCurrent < this.tickUpper) {
          this._token0Amount = CurrencyAmount.fromRawAmount(this.pool.token0, SqrtPriceMath.getAmount0Delta(this.pool.sqrtRatioX96, TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, false));
        } else {
          this._token0Amount = CurrencyAmount.fromRawAmount(this.pool.token0, ZERO);
        }
      }
      return this._token0Amount;
    }
    /**
     * Returns the amount of token1 that this position's liquidity could be burned for at the current pool price
     */
  }, {
    key: "amount1",
    get: function get() {
      if (this._token1Amount === null) {
        if (this.pool.tickCurrent < this.tickLower) {
          this._token1Amount = CurrencyAmount.fromRawAmount(this.pool.token1, ZERO);
        } else if (this.pool.tickCurrent < this.tickUpper) {
          this._token1Amount = CurrencyAmount.fromRawAmount(this.pool.token1, SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), this.pool.sqrtRatioX96, this.liquidity, false));
        } else {
          this._token1Amount = CurrencyAmount.fromRawAmount(this.pool.token1, SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, false));
        }
      }
      return this._token1Amount;
    }
  }, {
    key: "mintAmounts",
    get: function get() {
      if (this._mintAmounts === null) {
        if (this.pool.tickCurrent < this.tickLower) {
          return {
            amount0: SqrtPriceMath.getAmount0Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, true),
            amount1: ZERO
          };
        } else if (this.pool.tickCurrent < this.tickUpper) {
          return {
            amount0: SqrtPriceMath.getAmount0Delta(this.pool.sqrtRatioX96, TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, true),
            amount1: SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), this.pool.sqrtRatioX96, this.liquidity, true)
          };
        } else {
          return {
            amount0: ZERO,
            amount1: SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, true)
          };
        }
      }
      return this._mintAmounts;
    }
  }]);
  return Position;
}();

var ChainId;
(function (ChainId) {
  ChainId[ChainId["MAINNET"] = 1] = "MAINNET";
  ChainId[ChainId["GOERLI"] = 5] = "GOERLI";
  ChainId[ChainId["SEPOLIA"] = 11155111] = "SEPOLIA";
  ChainId[ChainId["OPTIMISM"] = 10] = "OPTIMISM";
  ChainId[ChainId["OPTIMISM_GOERLI"] = 420] = "OPTIMISM_GOERLI";
  ChainId[ChainId["ARBITRUM_ONE"] = 42161] = "ARBITRUM_ONE";
  ChainId[ChainId["ARBITRUM_GOERLI"] = 421613] = "ARBITRUM_GOERLI";
  ChainId[ChainId["POLYGON"] = 137] = "POLYGON";
  ChainId[ChainId["POLYGON_MUMBAI"] = 80001] = "POLYGON_MUMBAI";
  ChainId[ChainId["CELO"] = 42220] = "CELO";
  ChainId[ChainId["CELO_ALFAJORES"] = 44787] = "CELO_ALFAJORES";
  ChainId[ChainId["GNOSIS"] = 100] = "GNOSIS";
  ChainId[ChainId["MOONBEAM"] = 1284] = "MOONBEAM";
  ChainId[ChainId["BNB"] = 56] = "BNB";
  ChainId[ChainId["AVALANCHE"] = 43114] = "AVALANCHE";
  ChainId[ChainId["BASE_GOERLI"] = 84531] = "BASE_GOERLI";
  ChainId[ChainId["BASE"] = 8453] = "BASE";
  ChainId[ChainId["NOSTEST"] = 42070] = "NOSTEST";
  ChainId[ChainId["NOS"] = 42213] = "NOS";
})(ChainId || (ChainId = {}));
var SUPPORTED_CHAINS = [ChainId.MAINNET, ChainId.OPTIMISM, ChainId.OPTIMISM_GOERLI, ChainId.ARBITRUM_ONE, ChainId.ARBITRUM_GOERLI, ChainId.POLYGON, ChainId.POLYGON_MUMBAI, ChainId.GOERLI, ChainId.SEPOLIA, ChainId.CELO_ALFAJORES, ChainId.CELO, ChainId.BNB, ChainId.AVALANCHE, ChainId.BASE_GOERLI, ChainId.NOSTEST, ChainId.NOS];
var NativeCurrencyName;
(function (NativeCurrencyName) {
  // Strings match input for CLI
  NativeCurrencyName["ETHER"] = "ETH";
  NativeCurrencyName["MATIC"] = "MATIC";
  NativeCurrencyName["CELO"] = "CELO";
  NativeCurrencyName["GNOSIS"] = "XDAI";
  NativeCurrencyName["MOONBEAM"] = "GLMR";
  NativeCurrencyName["BNB"] = "BNB";
  NativeCurrencyName["AVAX"] = "AVAX";
  NativeCurrencyName["TC"] = "TC";
})(NativeCurrencyName || (NativeCurrencyName = {}));

/**
 * Returns the closest tick that is nearest a given tick and usable for the given tick spacing
 * @param tick the target tick
 * @param tickSpacing the spacing of the pool
 */
function nearestUsableTick(tick, tickSpacing) {
  !(Number.isInteger(tick) && Number.isInteger(tickSpacing)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INTEGERS') : invariant(false) : void 0;
  !(tickSpacing > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TICK_SPACING') : invariant(false) : void 0;
  !(tick >= TickMath.MIN_TICK && tick <= TickMath.MAX_TICK) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TICK_BOUND') : invariant(false) : void 0;
  var rounded = Math.round(tick / tickSpacing) * tickSpacing;
  if (rounded < TickMath.MIN_TICK) return rounded + tickSpacing;else if (rounded > TickMath.MAX_TICK) return rounded - tickSpacing;else return rounded;
}

var INonfungiblePositionManager = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "approved",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "operator",
				type: "address"
			},
			{
				indexed: false,
				internalType: "bool",
				name: "approved",
				type: "bool"
			}
		],
		name: "ApprovalForAll",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		name: "Collect",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		name: "DecreaseLiquidity",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		name: "IncreaseLiquidity",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "OwnershipTransferred",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		inputs: [
		],
		name: "DOMAIN_SEPARATOR",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "PERMIT_TYPEHASH",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "WTC",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "approve",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "baseURI",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "burn",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "tokenId",
						type: "uint256"
					},
					{
						internalType: "address",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "uint128",
						name: "amount0Max",
						type: "uint128"
					},
					{
						internalType: "uint128",
						name: "amount1Max",
						type: "uint128"
					}
				],
				internalType: "struct UniswapV3Broker.CollectParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "collect",
		outputs: [
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token0",
				type: "address"
			},
			{
				internalType: "address",
				name: "token1",
				type: "address"
			},
			{
				internalType: "uint24",
				name: "fee",
				type: "uint24"
			},
			{
				internalType: "uint160",
				name: "sqrtPriceX96",
				type: "uint160"
			}
		],
		name: "createAndInitializePoolIfNecessary",
		outputs: [
			{
				internalType: "address",
				name: "pool",
				type: "address"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "tokenId",
						type: "uint256"
					},
					{
						internalType: "uint128",
						name: "liquidity",
						type: "uint128"
					},
					{
						internalType: "uint256",
						name: "amount0Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					}
				],
				internalType: "struct UniswapV3Broker.DecreaseLiquidityParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "decreaseLiquidity",
		outputs: [
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "getApproved",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "tokenId",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount0Desired",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Desired",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount0Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					}
				],
				internalType: "struct UniswapV3Broker.IncreaseLiquidityParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "increaseLiquidity",
		outputs: [
			{
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_factory",
				type: "address"
			},
			{
				internalType: "address",
				name: "_WTC",
				type: "address"
			},
			{
				internalType: "address",
				name: "_tokenDescriptor_",
				type: "address"
			}
		],
		name: "initialize",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "operator",
				type: "address"
			}
		],
		name: "isApprovedForAll",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "token0",
						type: "address"
					},
					{
						internalType: "address",
						name: "token1",
						type: "address"
					},
					{
						internalType: "uint24",
						name: "fee",
						type: "uint24"
					},
					{
						internalType: "int24",
						name: "tickLower",
						type: "int24"
					},
					{
						internalType: "int24",
						name: "tickUpper",
						type: "int24"
					},
					{
						internalType: "uint256",
						name: "amount0Desired",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Desired",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount0Min",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amount1Min",
						type: "uint256"
					},
					{
						internalType: "address",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "deadline",
						type: "uint256"
					}
				],
				internalType: "struct INonfungiblePositionManager.MintParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "mint",
		outputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes[]",
				name: "data",
				type: "bytes[]"
			}
		],
		name: "multicall",
		outputs: [
			{
				internalType: "bytes[]",
				name: "results",
				type: "bytes[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "name",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "ownerOf",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "permit",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "positions",
		outputs: [
			{
				internalType: "uint96",
				name: "nonce",
				type: "uint96"
			},
			{
				internalType: "address",
				name: "operator",
				type: "address"
			},
			{
				internalType: "address",
				name: "token0",
				type: "address"
			},
			{
				internalType: "address",
				name: "token1",
				type: "address"
			},
			{
				internalType: "uint24",
				name: "fee",
				type: "uint24"
			},
			{
				internalType: "int24",
				name: "tickLower",
				type: "int24"
			},
			{
				internalType: "int24",
				name: "tickUpper",
				type: "int24"
			},
			{
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				internalType: "uint256",
				name: "feeGrowthInside0LastX128",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "feeGrowthInside1LastX128",
				type: "uint256"
			},
			{
				internalType: "uint128",
				name: "tokensOwed0",
				type: "uint128"
			},
			{
				internalType: "uint128",
				name: "tokensOwed1",
				type: "uint128"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "refundTC",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "renounceOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "safeTransferFrom",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "_data",
				type: "bytes"
			}
		],
		name: "safeTransferFrom",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "selfPermit",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "nonce",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "expiry",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "selfPermitAllowed",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "nonce",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "expiry",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "selfPermitAllowedIfNecessary",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "selfPermitIfNecessary",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "operator",
				type: "address"
			},
			{
				internalType: "bool",
				name: "approved",
				type: "bool"
			}
		],
		name: "setApprovalForAll",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "WTCArg",
				type: "address"
			}
		],
		name: "setWTC",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes4",
				name: "interfaceId",
				type: "bytes4"
			}
		],
		name: "supportsInterface",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "sweepToken",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "symbol",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "index",
				type: "uint256"
			}
		],
		name: "tokenByIndex",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "index",
				type: "uint256"
			}
		],
		name: "tokenOfOwnerByIndex",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "tokenURI",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "transferOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amount0Owed",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1Owed",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "uniswapV3MintCallback",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "unwrapWTC",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		stateMutability: "payable",
		type: "receive"
	}
];

var _format$6 = "hh-sol-artifact-1";
var contractName$6 = "IMulticall";
var sourceName$6 = "contracts/interfaces/IMulticall.sol";
var abi$6 = [
	{
		inputs: [
			{
				internalType: "bytes[]",
				name: "data",
				type: "bytes[]"
			}
		],
		name: "multicall",
		outputs: [
			{
				internalType: "bytes[]",
				name: "results",
				type: "bytes[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	}
];
var bytecode$6 = "0x";
var deployedBytecode$6 = "0x";
var linkReferences$6 = {
};
var deployedLinkReferences$6 = {
};
var IMulticall$1 = {
	_format: _format$6,
	contractName: contractName$6,
	sourceName: sourceName$6,
	abi: abi$6,
	bytecode: bytecode$6,
	deployedBytecode: deployedBytecode$6,
	linkReferences: linkReferences$6,
	deployedLinkReferences: deployedLinkReferences$6
};

var Multicall$1 = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function Multicall() {}
  Multicall.encodeMulticall = function encodeMulticall(calldatas) {
    if (!Array.isArray(calldatas)) {
      calldatas = [calldatas];
    }
    return calldatas.length === 1 ? calldatas[0] : Multicall.INTERFACE.encodeFunctionData('multicall', [calldatas]);
  };
  return Multicall;
}();
Multicall$1.INTERFACE = /*#__PURE__*/new Interface(IMulticall$1.abi);

var _format$7 = "hh-sol-artifact-1";
var contractName$7 = "IPeripheryPaymentsWithFee";
var sourceName$7 = "contracts/interfaces/IPeripheryPaymentsWithFee.sol";
var abi$7 = [
	{
		inputs: [
		],
		name: "refundTC",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "sweepToken",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "feeBips",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "feeRecipient",
				type: "address"
			}
		],
		name: "sweepTokenWithFee",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			}
		],
		name: "unwrapWTC",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountMinimum",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "feeBips",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "feeRecipient",
				type: "address"
			}
		],
		name: "unwrapWTCWithFee",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	}
];
var bytecode$7 = "0x";
var deployedBytecode$7 = "0x";
var linkReferences$7 = {
};
var deployedLinkReferences$7 = {
};
var IPeripheryPaymentsWithFee$1 = {
	_format: _format$7,
	contractName: contractName$7,
	sourceName: sourceName$7,
	abi: abi$7,
	bytecode: bytecode$7,
	deployedBytecode: deployedBytecode$7,
	linkReferences: linkReferences$7,
	deployedLinkReferences: deployedLinkReferences$7
};

var Payments$1 = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function Payments() {}
  Payments.encodeFeeBips = function encodeFeeBips(fee) {
    return toHex(fee.multiply(10000).quotient);
  };
  Payments.encodeUnwrapWETH9 = function encodeUnwrapWETH9(amountMinimum, recipient, feeOptions) {
    recipient = validateAndParseAddress(recipient);
    if (!!feeOptions) {
      var feeBips = this.encodeFeeBips(feeOptions.fee);
      var feeRecipient = validateAndParseAddress(feeOptions.recipient);
      return Payments.INTERFACE.encodeFunctionData('unwrapWETH9WithFee', [toHex(amountMinimum), recipient, feeBips, feeRecipient]);
    } else {
      return Payments.INTERFACE.encodeFunctionData('unwrapWETH9', [toHex(amountMinimum), recipient]);
    }
  };
  Payments.encodeSweepToken = function encodeSweepToken(token, amountMinimum, recipient, feeOptions) {
    recipient = validateAndParseAddress(recipient);
    if (!!feeOptions) {
      var feeBips = this.encodeFeeBips(feeOptions.fee);
      var feeRecipient = validateAndParseAddress(feeOptions.recipient);
      return Payments.INTERFACE.encodeFunctionData('sweepTokenWithFee', [token.address, toHex(amountMinimum), recipient, feeBips, feeRecipient]);
    } else {
      return Payments.INTERFACE.encodeFunctionData('sweepToken', [token.address, toHex(amountMinimum), recipient]);
    }
  };
  Payments.encodeRefundETH = function encodeRefundETH() {
    return Payments.INTERFACE.encodeFunctionData('refundTC');
  };
  return Payments;
}();
Payments$1.INTERFACE = /*#__PURE__*/new Interface(IPeripheryPaymentsWithFee$1.abi);

function fromReadableAmount(amount, decimals) {
  return ethers.utils.parseUnits(amount.toString(), decimals);
}
function toReadableAmount(rawAmount, decimals) {
  return ethers.utils.formatUnits(rawAmount, decimals);
}
function displayTrade(trade) {
  return trade.inputAmount.toExact() + " " + trade.inputAmount.currency.symbol + " for " + trade.outputAmount.toExact() + " " + trade.outputAmount.currency.symbol;
}
function formatPriceToPriceSqrt(price) {
  console.log('price', price);
  alert("vao day 5");
  var sqrt = BigNumber.from(new bn(price.toString()).sqrt().multipliedBy(new bn(2).pow(96)).integerValue(3).toString());
  alert("vao day 6");
  return sqrt;
}

var _excluded = ["expectedCurrencyOwed0", "expectedCurrencyOwed1"];
var MaxUint128$1 = /*#__PURE__*/toHex( /*#__PURE__*/JSBI.subtract( /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(128)), /*#__PURE__*/JSBI.BigInt(1)));
// type guard
function isMint(options) {
  return Object.keys(options).some(function (k) {
    return k === 'recipient';
  });
}
var NonfungiblePositionManager = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function NonfungiblePositionManager() {}
  NonfungiblePositionManager.encodeCreate = function encodeCreate(pool) {
    return NonfungiblePositionManager.INTERFACE.encodeFunctionData('createAndInitializePoolIfNecessary', [pool.token0.address, pool.token1.address, pool.fee, toHex(pool.sqrtRatioX96)]);
  };
  NonfungiblePositionManager.createCallParameters = function createCallParameters(pool) {
    return {
      calldata: this.encodeCreate(pool),
      value: toHex(0)
    };
  };
  NonfungiblePositionManager.encodeCollectById = function encodeCollectById(tokenId, account) {
    var calldatas = [];
    // collect
    calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('collect', [{
      tokenId: tokenId,
      recipient: account,
      amount0Max: MaxUint128$1,
      amount1Max: MaxUint128$1
    }]));
    return {
      calldata: Multicall$1.encodeMulticall(calldatas),
      value: toHex(0)
    };
  };
  NonfungiblePositionManager.encodeIncrease = function encodeIncrease(tokenId, amount0Desired, amount1Desired, amount0Min, amount1Min, deadline) {
    var calldatas = [];
    // collect
    calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('increaseLiquidity', [{
      tokenId: tokenId,
      amount0Desired: amount0Desired,
      amount1Desired: amount1Desired,
      amount0Min: amount0Min,
      amount1Min: amount1Min,
      deadline: deadline
    }]));
    return {
      calldata: Multicall$1.encodeMulticall(calldatas),
      value: toHex(0)
    };
  };
  NonfungiblePositionManager.encodeRemoveLiqidity = function encodeRemoveLiqidity(tokenId, liquidity, amount0Min, amount1Min, deadline, account) {
    var calldatas = [];
    // collect
    calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('decreaseLiquidity', [{
      tokenId: tokenId,
      liquidity: liquidity,
      amount0Min: amount0Min,
      amount1Min: amount1Min,
      deadline: deadline
    }]));
    calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('collect', [{
      tokenId: tokenId,
      recipient: account,
      amount0Max: MaxUint128$1,
      amount1Max: MaxUint128$1
    }]));
    return {
      calldata: Multicall$1.encodeMulticall(calldatas),
      value: toHex(0)
    };
  };
  NonfungiblePositionManager.encodeRemovePosition = function encodeRemovePosition(tokenId) {
    var calldatas = [];
    // collect
    calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('burn', [{
      tokenId: tokenId
    }]));
    return {
      calldata: Multicall$1.encodeMulticall(calldatas),
      value: toHex(0)
    };
  };
  NonfungiblePositionManager.addCallParametersCreate = function addCallParametersCreate(isNewPool, fee, token0, token1, amountADesired, amountBDesired, lowerTick, upperTick, amount0Min, amount1Min, currentPrice, account, deadline) {
    var calldatas = [];
    var value = toHex(0);
    if (!isNewPool) {
      calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('mint', [{
        token0: token0,
        token1: token1,
        fee: fee,
        tickLower: lowerTick,
        tickUpper: upperTick,
        amount0Desired: fromReadableAmount(amountADesired, 18),
        amount1Desired: fromReadableAmount(amountBDesired, 18),
        amount0Min: amount0Min,
        amount1Min: amount1Min,
        recipient: account,
        deadline: deadline
      }]));
    } else {
      calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('createAndInitializePoolIfNecessary', [token0, token1, fee, currentPrice]));
      calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('mint', [{
        token0: token0,
        token1: token1,
        fee: fee,
        tickLower: lowerTick,
        tickUpper: upperTick,
        amount0Desired: fromReadableAmount(amountADesired, 18),
        amount1Desired: fromReadableAmount(amountBDesired, 18),
        amount0Min: amount0Min,
        amount1Min: amount1Min,
        recipient: account,
        deadline: deadline
      }]));
    }
    if (token0.toLowerCase() === CurrentConfig.TC_CONTRACT_ADDRESS.toLowerCase() || token1.toLowerCase() === CurrentConfig.TC_CONTRACT_ADDRESS.toLowerCase()) {
      var wrappedValue = token0.toLowerCase() === CurrentConfig.TC_CONTRACT_ADDRESS.toLowerCase() ? fromReadableAmount(amountADesired, 18) : fromReadableAmount(amountBDesired, 18);
      if (wrappedValue.gt(0)) {
        calldatas.push(Payments$1.encodeRefundETH());
      }
      value = toHex(wrappedValue.toString());
    }
    return {
      calldata: Multicall$1.encodeMulticall(calldatas),
      value: value
    };
  };
  NonfungiblePositionManager.addCallParameters = function addCallParameters(position, options) {
    !JSBI.greaterThan(position.liquidity, ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ZERO_LIQUIDITY') : invariant(false) : void 0;
    var calldatas = [];
    // get amounts
    var _position$mintAmounts = position.mintAmounts,
      amount0Desired = _position$mintAmounts.amount0,
      amount1Desired = _position$mintAmounts.amount1;
    // adjust for slippage
    var minimumAmounts = position.mintAmountsWithSlippage(options.slippageTolerance);
    var amount0Min = toHex(minimumAmounts.amount0);
    var amount1Min = toHex(minimumAmounts.amount1);
    var deadline = toHex(options.deadline);
    // create pool if needed
    if (isMint(options) && options.createPool) {
      calldatas.push(this.encodeCreate(position.pool));
    }
    // permits if necessary
    if (options.token0Permit) {
      calldatas.push(SelfPermit.encodePermit(position.pool.token0, options.token0Permit));
    }
    if (options.token1Permit) {
      calldatas.push(SelfPermit.encodePermit(position.pool.token1, options.token1Permit));
    }
    // mint
    if (isMint(options)) {
      var recipient = validateAndParseAddress(options.recipient);
      calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('mint', [{
        token0: position.pool.token0.address,
        token1: position.pool.token1.address,
        fee: position.pool.fee,
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        amount0Desired: toHex(amount0Desired),
        amount1Desired: toHex(amount1Desired),
        amount0Min: amount0Min,
        amount1Min: amount1Min,
        recipient: recipient,
        deadline: deadline
      }]));
    } else {
      // increase
      calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('increaseLiquidity', [{
        tokenId: toHex(options.tokenId),
        amount0Desired: toHex(amount0Desired),
        amount1Desired: toHex(amount1Desired),
        amount0Min: amount0Min,
        amount1Min: amount1Min,
        deadline: deadline
      }]));
    }
    var value = toHex(0);
    if (options.useNative) {
      var wrapped = options.useNative.wrapped;
      !(position.pool.token0.equals(wrapped) || position.pool.token1.equals(wrapped)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'NO_WETH') : invariant(false) : void 0;
      var wrappedValue = position.pool.token0.equals(wrapped) ? amount0Desired : amount1Desired;
      // we only need to refund if we're actually sending ETH
      if (JSBI.greaterThan(wrappedValue, ZERO)) {
        calldatas.push(Payments$1.encodeRefundETH());
      }
      value = toHex(wrappedValue);
    }
    return {
      calldata: Multicall$1.encodeMulticall(calldatas),
      value: value
    };
  };
  NonfungiblePositionManager.encodeCollect = function encodeCollect(options) {
    var calldatas = [];
    var tokenId = toHex(options.tokenId);
    var involvesETH = options.expectedCurrencyOwed0.currency.isNative || options.expectedCurrencyOwed1.currency.isNative;
    var recipient = validateAndParseAddress(options.recipient);
    // collect
    calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('collect', [{
      tokenId: tokenId,
      recipient: involvesETH ? ADDRESS_ZERO : recipient,
      amount0Max: MaxUint128$1,
      amount1Max: MaxUint128$1
    }]));
    if (involvesETH) {
      var ethAmount = options.expectedCurrencyOwed0.currency.isNative ? options.expectedCurrencyOwed0.quotient : options.expectedCurrencyOwed1.quotient;
      var token = options.expectedCurrencyOwed0.currency.isNative ? options.expectedCurrencyOwed1.currency : options.expectedCurrencyOwed0.currency;
      var tokenAmount = options.expectedCurrencyOwed0.currency.isNative ? options.expectedCurrencyOwed1.quotient : options.expectedCurrencyOwed0.quotient;
      calldatas.push(Payments$1.encodeUnwrapWETH9(ethAmount, recipient));
      calldatas.push(Payments$1.encodeSweepToken(token, tokenAmount, recipient));
    }
    return calldatas;
  };
  NonfungiblePositionManager.collectCallParameters = function collectCallParameters(options) {
    var calldatas = NonfungiblePositionManager.encodeCollect(options);
    return {
      calldata: Multicall$1.encodeMulticall(calldatas),
      value: toHex(0)
    };
  }
  /**
   * Produces the calldata for completely or partially exiting a position
   * @param position The position to exit
   * @param options Additional information necessary for generating the calldata
   * @returns The call parameters
   */;
  NonfungiblePositionManager.removeCallParameters = function removeCallParameters(position, options) {
    var calldatas = [];
    var deadline = toHex(options.deadline);
    var tokenId = toHex(options.tokenId);
    // construct a partial position with a percentage of liquidity
    var partialPosition = new Position({
      pool: position.pool,
      liquidity: options.liquidityPercentage.multiply(position.liquidity).quotient,
      tickLower: position.tickLower,
      tickUpper: position.tickUpper
    });
    !JSBI.greaterThan(partialPosition.liquidity, ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ZERO_LIQUIDITY') : invariant(false) : void 0;
    // slippage-adjusted underlying amounts
    var _partialPosition$burn = partialPosition.burnAmountsWithSlippage(options.slippageTolerance),
      amount0Min = _partialPosition$burn.amount0,
      amount1Min = _partialPosition$burn.amount1;
    if (options.permit) {
      calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('permit', [validateAndParseAddress(options.permit.spender), tokenId, toHex(options.permit.deadline), options.permit.v, options.permit.r, options.permit.s]));
    }
    // remove liquidity
    calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('decreaseLiquidity', [{
      tokenId: tokenId,
      liquidity: toHex(partialPosition.liquidity),
      amount0Min: toHex(amount0Min),
      amount1Min: toHex(amount1Min),
      deadline: deadline
    }]));
    var _options$collectOptio = options.collectOptions,
      expectedCurrencyOwed0 = _options$collectOptio.expectedCurrencyOwed0,
      expectedCurrencyOwed1 = _options$collectOptio.expectedCurrencyOwed1,
      rest = _objectWithoutPropertiesLoose(_options$collectOptio, _excluded);
    calldatas.push.apply(calldatas, NonfungiblePositionManager.encodeCollect(_extends({
      tokenId: toHex(options.tokenId),
      // add the underlying value to the expected currency already owed
      expectedCurrencyOwed0: expectedCurrencyOwed0.add(CurrencyAmount.fromRawAmount(expectedCurrencyOwed0.currency, amount0Min)),
      expectedCurrencyOwed1: expectedCurrencyOwed1.add(CurrencyAmount.fromRawAmount(expectedCurrencyOwed1.currency, amount1Min))
    }, rest)));
    if (options.liquidityPercentage.equalTo(ONE)) {
      if (options.burnToken) {
        calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('burn', [tokenId]));
      }
    } else {
      !(options.burnToken !== true) ? process.env.NODE_ENV !== "production" ? invariant(false, 'CANNOT_BURN') : invariant(false) : void 0;
    }
    return {
      calldata: Multicall$1.encodeMulticall(calldatas),
      value: toHex(0)
    };
  };
  NonfungiblePositionManager.safeTransferFromParameters = function safeTransferFromParameters(options) {
    var recipient = validateAndParseAddress(options.recipient);
    var sender = validateAndParseAddress(options.sender);
    var calldata;
    if (options.data) {
      calldata = NonfungiblePositionManager.INTERFACE.encodeFunctionData('safeTransferFrom(address,address,uint256,bytes)', [sender, recipient, toHex(options.tokenId), options.data]);
    } else {
      calldata = NonfungiblePositionManager.INTERFACE.encodeFunctionData('safeTransferFrom(address,address,uint256)', [sender, recipient, toHex(options.tokenId)]);
    }
    return {
      calldata: calldata,
      value: toHex(0)
    };
  };
  return NonfungiblePositionManager;
}();
NonfungiblePositionManager.INTERFACE = /*#__PURE__*/new Interface(INonfungiblePositionManager);

var _format$8 = "hh-sol-artifact-1";
var contractName$8 = "IV3Pool";
var sourceName$8 = "contracts/interfaces/IV3Pool.sol";
var abi$8 = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "int24",
				name: "tickLower",
				type: "int24"
			},
			{
				indexed: true,
				internalType: "int24",
				name: "tickUpper",
				type: "int24"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "amount",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		name: "Burn",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: false,
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				indexed: true,
				internalType: "int24",
				name: "tickLower",
				type: "int24"
			},
			{
				indexed: true,
				internalType: "int24",
				name: "tickUpper",
				type: "int24"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "amount0",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "amount1",
				type: "uint128"
			}
		],
		name: "Collect",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "amount0",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "amount1",
				type: "uint128"
			}
		],
		name: "CollectProtocol",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "paid0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "paid1",
				type: "uint256"
			}
		],
		name: "Flash",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint16",
				name: "observationCardinalityNextOld",
				type: "uint16"
			},
			{
				indexed: false,
				internalType: "uint16",
				name: "observationCardinalityNextNew",
				type: "uint16"
			}
		],
		name: "IncreaseObservationCardinalityNext",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint160",
				name: "sqrtPriceX96",
				type: "uint160"
			},
			{
				indexed: false,
				internalType: "int24",
				name: "tick",
				type: "int24"
			}
		],
		name: "Initialize",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "int24",
				name: "tickLower",
				type: "int24"
			},
			{
				indexed: true,
				internalType: "int24",
				name: "tickUpper",
				type: "int24"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "amount",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		name: "Mint",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint8",
				name: "feeProtocol0Old",
				type: "uint8"
			},
			{
				indexed: false,
				internalType: "uint8",
				name: "feeProtocol1Old",
				type: "uint8"
			},
			{
				indexed: false,
				internalType: "uint8",
				name: "feeProtocol0New",
				type: "uint8"
			},
			{
				indexed: false,
				internalType: "uint8",
				name: "feeProtocol1New",
				type: "uint8"
			}
		],
		name: "SetFeeProtocol",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				indexed: false,
				internalType: "int256",
				name: "amount0",
				type: "int256"
			},
			{
				indexed: false,
				internalType: "int256",
				name: "amount1",
				type: "int256"
			},
			{
				indexed: false,
				internalType: "uint160",
				name: "sqrtPriceX96",
				type: "uint160"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "liquidity",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "int24",
				name: "tick",
				type: "int24"
			}
		],
		name: "Swap",
		type: "event"
	},
	{
		inputs: [
			{
				internalType: "int24",
				name: "tickLower",
				type: "int24"
			},
			{
				internalType: "int24",
				name: "tickUpper",
				type: "int24"
			},
			{
				internalType: "uint128",
				name: "amount",
				type: "uint128"
			}
		],
		name: "burn",
		outputs: [
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "int24",
				name: "tickLower",
				type: "int24"
			},
			{
				internalType: "int24",
				name: "tickUpper",
				type: "int24"
			},
			{
				internalType: "uint128",
				name: "amount0Requested",
				type: "uint128"
			},
			{
				internalType: "uint128",
				name: "amount1Requested",
				type: "uint128"
			}
		],
		name: "collect",
		outputs: [
			{
				internalType: "uint128",
				name: "amount0",
				type: "uint128"
			},
			{
				internalType: "uint128",
				name: "amount1",
				type: "uint128"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint128",
				name: "amount0Requested",
				type: "uint128"
			},
			{
				internalType: "uint128",
				name: "amount1Requested",
				type: "uint128"
			}
		],
		name: "collectProtocol",
		outputs: [
			{
				internalType: "uint128",
				name: "amount0",
				type: "uint128"
			},
			{
				internalType: "uint128",
				name: "amount1",
				type: "uint128"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "fee",
		outputs: [
			{
				internalType: "uint24",
				name: "",
				type: "uint24"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "feeGrowthGlobal0X128",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "feeGrowthGlobal1X128",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "flash",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint16",
				name: "observationCardinalityNext",
				type: "uint16"
			}
		],
		name: "increaseObservationCardinalityNext",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint160",
				name: "sqrtPriceX96",
				type: "uint160"
			}
		],
		name: "initialize",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "liquidity",
		outputs: [
			{
				internalType: "uint128",
				name: "",
				type: "uint128"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "maxLiquidityPerTick",
		outputs: [
			{
				internalType: "uint128",
				name: "",
				type: "uint128"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "int24",
				name: "tickLower",
				type: "int24"
			},
			{
				internalType: "int24",
				name: "tickUpper",
				type: "int24"
			},
			{
				internalType: "uint128",
				name: "amount",
				type: "uint128"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "mint",
		outputs: [
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "index",
				type: "uint256"
			}
		],
		name: "observations",
		outputs: [
			{
				internalType: "uint32",
				name: "blockTimestamp",
				type: "uint32"
			},
			{
				internalType: "int56",
				name: "tickCumulative",
				type: "int56"
			},
			{
				internalType: "uint160",
				name: "secondsPerLiquidityCumulativeX128",
				type: "uint160"
			},
			{
				internalType: "bool",
				name: "initialized",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint32[]",
				name: "secondsAgos",
				type: "uint32[]"
			}
		],
		name: "observe",
		outputs: [
			{
				internalType: "int56[]",
				name: "tickCumulatives",
				type: "int56[]"
			},
			{
				internalType: "uint160[]",
				name: "secondsPerLiquidityCumulativeX128s",
				type: "uint160[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "key",
				type: "bytes32"
			}
		],
		name: "positions",
		outputs: [
			{
				internalType: "uint128",
				name: "_liquidity",
				type: "uint128"
			},
			{
				internalType: "uint256",
				name: "feeGrowthInside0LastX128",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "feeGrowthInside1LastX128",
				type: "uint256"
			},
			{
				internalType: "uint128",
				name: "tokensOwed0",
				type: "uint128"
			},
			{
				internalType: "uint128",
				name: "tokensOwed1",
				type: "uint128"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "protocolFees",
		outputs: [
			{
				internalType: "uint128",
				name: "token0",
				type: "uint128"
			},
			{
				internalType: "uint128",
				name: "token1",
				type: "uint128"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint8",
				name: "feeProtocol0",
				type: "uint8"
			},
			{
				internalType: "uint8",
				name: "feeProtocol1",
				type: "uint8"
			}
		],
		name: "setFeeProtocol",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "slot0",
		outputs: [
			{
				internalType: "uint160",
				name: "sqrtPriceX96",
				type: "uint160"
			},
			{
				internalType: "int24",
				name: "tick",
				type: "int24"
			},
			{
				internalType: "uint16",
				name: "observationIndex",
				type: "uint16"
			},
			{
				internalType: "uint16",
				name: "observationCardinality",
				type: "uint16"
			},
			{
				internalType: "uint16",
				name: "observationCardinalityNext",
				type: "uint16"
			},
			{
				internalType: "uint8",
				name: "feeProtocol",
				type: "uint8"
			},
			{
				internalType: "bool",
				name: "unlocked",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "int24",
				name: "tickLower",
				type: "int24"
			},
			{
				internalType: "int24",
				name: "tickUpper",
				type: "int24"
			}
		],
		name: "snapshotCumulativesInside",
		outputs: [
			{
				internalType: "int56",
				name: "tickCumulativeInside",
				type: "int56"
			},
			{
				internalType: "uint160",
				name: "secondsPerLiquidityInsideX128",
				type: "uint160"
			},
			{
				internalType: "uint32",
				name: "secondsInside",
				type: "uint32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "bool",
				name: "zeroForOne",
				type: "bool"
			},
			{
				internalType: "int256",
				name: "amountSpecified",
				type: "int256"
			},
			{
				internalType: "uint160",
				name: "sqrtPriceLimitX96",
				type: "uint160"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "swap",
		outputs: [
			{
				internalType: "int256",
				name: "amount0",
				type: "int256"
			},
			{
				internalType: "int256",
				name: "amount1",
				type: "int256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "int16",
				name: "wordPosition",
				type: "int16"
			}
		],
		name: "tickBitmap",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "tickSpacing",
		outputs: [
			{
				internalType: "int24",
				name: "",
				type: "int24"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "int24",
				name: "tick",
				type: "int24"
			}
		],
		name: "ticks",
		outputs: [
			{
				internalType: "uint128",
				name: "liquidityGross",
				type: "uint128"
			},
			{
				internalType: "int128",
				name: "liquidityNet",
				type: "int128"
			},
			{
				internalType: "uint256",
				name: "feeGrowthOutside0X128",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "feeGrowthOutside1X128",
				type: "uint256"
			},
			{
				internalType: "int56",
				name: "tickCumulativeOutside",
				type: "int56"
			},
			{
				internalType: "uint160",
				name: "secondsPerLiquidityOutsideX128",
				type: "uint160"
			},
			{
				internalType: "uint32",
				name: "secondsOutside",
				type: "uint32"
			},
			{
				internalType: "bool",
				name: "initialized",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "token0",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "token1",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	}
];
var bytecode$8 = "0x";
var deployedBytecode$8 = "0x";
var linkReferences$8 = {
};
var deployedLinkReferences$8 = {
};
var IV3PoolABI = {
	_format: _format$8,
	contractName: contractName$8,
	sourceName: sourceName$8,
	abi: abi$8,
	bytecode: bytecode$8,
	deployedBytecode: deployedBytecode$8,
	linkReferences: linkReferences$8,
	deployedLinkReferences: deployedLinkReferences$8
};

// Single copies of provider and wallet
var mainnetProvider = /*#__PURE__*/new ethers.providers.JsonRpcProvider(CurrentConfig.rpc);
var wallet;
var browserExtensionProvider;
var walletExtensionAddress = null;
function refreshProvider(provider) {
  mainnetProvider = new ethers.providers.JsonRpcProvider(CurrentConfig.rpc);
  if (CurrentWallet.type == WalletType.PRIVATEKEY && CurrentWallet.privateKey != "") {
    wallet = createWallet();
  } else if (CurrentWallet.type == WalletType.EXTENSION) {
    if (!provider) {
      provider = createBrowserExtensionProvider();
    }
    browserExtensionProvider = provider;
  }
}
// Interfaces
var TransactionState;
(function (TransactionState) {
  TransactionState["Failed"] = "Failed";
  TransactionState["New"] = "New";
  TransactionState["Rejected"] = "Rejected";
  TransactionState["Sending"] = "Sending";
  TransactionState["Sent"] = "Sent";
})(TransactionState || (TransactionState = {}));
// Provider and Wallet Functions
function getMainnetProvider() {
  return mainnetProvider;
}
function getProvider() {
  return CurrentWallet.type === WalletType.EXTENSION ? browserExtensionProvider : wallet.provider;
}
function getWalletAddress() {
  return CurrentWallet.type === WalletType.EXTENSION ? walletExtensionAddress : wallet.address;
}
function geSignerAddress() {
  return _geSignerAddress.apply(this, arguments);
}
function _geSignerAddress() {
  _geSignerAddress = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var _browserExtensionProv;
    var signer, address;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          signer = (_browserExtensionProv = browserExtensionProvider) == null ? void 0 : _browserExtensionProv.getSigner();
          if (signer) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return", "");
        case 3:
          _context.next = 5;
          return signer.getAddress();
        case 5:
          address = _context.sent;
          console.log("signer address", address);
          return _context.abrupt("return", address);
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _geSignerAddress.apply(this, arguments);
}
function sendTransaction(_x) {
  return _sendTransaction.apply(this, arguments);
}
function _sendTransaction() {
  _sendTransaction = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(transaction) {
    var _transaction$maxFeePe, _transaction$maxPrior;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (!(CurrentWallet.type === WalletType.EXTENSION)) {
            _context2.next = 6;
            break;
          }
          transaction.maxFeePerGas = (_transaction$maxFeePe = transaction.maxFeePerGas) == null ? void 0 : _transaction$maxFeePe.toString();
          transaction.maxPriorityFeePerGas = (_transaction$maxPrior = transaction.maxPriorityFeePerGas) == null ? void 0 : _transaction$maxPrior.toString();
          return _context2.abrupt("return", sendTransactionViaExtension(transaction));
        case 6:
          if (transaction.value) {
            transaction.value = BigNumber.from(transaction.value);
          }
          //transaction.gasLimit = 1000000
          return _context2.abrupt("return", sendTransactionViaWallet(transaction));
        case 8:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _sendTransaction.apply(this, arguments);
}
function sendTransactionGetReceipt(_x2) {
  return _sendTransactionGetReceipt.apply(this, arguments);
}
function _sendTransactionGetReceipt() {
  _sendTransactionGetReceipt = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(transaction) {
    var _transaction$maxFeePe2, _transaction$maxPrior2;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          if (!(CurrentWallet.type === WalletType.EXTENSION)) {
            _context3.next = 6;
            break;
          }
          transaction.maxFeePerGas = (_transaction$maxFeePe2 = transaction.maxFeePerGas) == null ? void 0 : _transaction$maxFeePe2.toString();
          transaction.maxPriorityFeePerGas = (_transaction$maxPrior2 = transaction.maxPriorityFeePerGas) == null ? void 0 : _transaction$maxPrior2.toString();
          return _context3.abrupt("return", sendTransactionViaExtensionGetReceipt(transaction));
        case 6:
          if (transaction.value) {
            transaction.value = BigNumber.from(transaction.value);
          }
          transaction.gasLimit = 1000000;
          return _context3.abrupt("return", sendTransactionViaWalletReceipt(transaction));
        case 9:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _sendTransactionGetReceipt.apply(this, arguments);
}
function connectBrowserExtensionWallet(_x3) {
  return _connectBrowserExtensionWallet.apply(this, arguments);
}
// Internal Functionality
function _connectBrowserExtensionWallet() {
  _connectBrowserExtensionWallet = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(provider) {
    var _window2, ethereum, accounts;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          if (provider === void 0) {
            provider = null;
          }
          if (provider) {
            _context4.next = 6;
            break;
          }
          if (window.ethereum) {
            _context4.next = 4;
            break;
          }
          return _context4.abrupt("return", null);
        case 4:
          _window2 = window, ethereum = _window2.ethereum;
          provider = new ethers.providers.Web3Provider(ethereum);
        case 6:
          _context4.next = 8;
          return provider.send('eth_requestAccounts', []);
        case 8:
          accounts = _context4.sent;
          if (!(accounts.length !== 1)) {
            _context4.next = 11;
            break;
          }
          return _context4.abrupt("return");
        case 11:
          walletExtensionAddress = accounts[0];
          return _context4.abrupt("return", walletExtensionAddress);
        case 13:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _connectBrowserExtensionWallet.apply(this, arguments);
}
function createWallet() {
  var provider = mainnetProvider;
  return new ethers.Wallet(CurrentWallet.privateKey, provider);
}
function createBrowserExtensionProvider() {
  try {
    var _window;
    return new ethers.providers.Web3Provider((_window = window) == null ? void 0 : _window.ethereum, 'any');
  } catch (e) {
    console.log('No Wallet Extension Found');
    return null;
  }
}
// Transacting with a wallet extension via a Web3 Provider
function sendTransactionViaExtension(_x4) {
  return _sendTransactionViaExtension.apply(this, arguments);
} // Transacting with a wallet extension via a Web3 Provider
function _sendTransactionViaExtension() {
  _sendTransactionViaExtension = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(transaction) {
    var _browserExtensionProv2, receipt;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return (_browserExtensionProv2 = browserExtensionProvider) == null ? void 0 : _browserExtensionProv2.send('eth_sendTransaction', [transaction]);
        case 3:
          receipt = _context5.sent;
          if (!receipt) {
            _context5.next = 9;
            break;
          }
          console.log("Meta mask receipt ", receipt);
          return _context5.abrupt("return", TransactionState.Sent);
        case 9:
          return _context5.abrupt("return", TransactionState.Failed);
        case 10:
          _context5.next = 16;
          break;
        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](0);
          console.log("Meta mask error ", _context5.t0);
          return _context5.abrupt("return", TransactionState.Rejected);
        case 16:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 12]]);
  }));
  return _sendTransactionViaExtension.apply(this, arguments);
}
function sendTransactionViaExtensionGetReceipt(_x5) {
  return _sendTransactionViaExtensionGetReceipt.apply(this, arguments);
}
function _sendTransactionViaExtensionGetReceipt() {
  _sendTransactionViaExtensionGetReceipt = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(transaction) {
    var _browserExtensionProv3, receipt;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return (_browserExtensionProv3 = browserExtensionProvider) == null ? void 0 : _browserExtensionProv3.send('eth_sendTransaction', [transaction]);
        case 3:
          receipt = _context6.sent;
          if (!receipt) {
            _context6.next = 9;
            break;
          }
          console.log("Meta mask receipt ", receipt);
          return _context6.abrupt("return", [TransactionState.Sent, receipt]);
        case 9:
          return _context6.abrupt("return", [TransactionState.Failed, null]);
        case 10:
          _context6.next = 16;
          break;
        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](0);
          console.log("Meta mask error ", _context6.t0);
          return _context6.abrupt("return", [TransactionState.Rejected, null]);
        case 16:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 12]]);
  }));
  return _sendTransactionViaExtensionGetReceipt.apply(this, arguments);
}
function sendTransactionViaWallet(_x6) {
  return _sendTransactionViaWallet.apply(this, arguments);
}
function _sendTransactionViaWallet() {
  _sendTransactionViaWallet = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(transaction) {
    var txRes, receipt, provider;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          if (transaction.value) {
            transaction.value = BigNumber.from(transaction.value);
          }
          _context7.next = 3;
          return wallet.sendTransaction(transaction);
        case 3:
          txRes = _context7.sent;
          receipt = null;
          provider = getProvider();
          if (provider) {
            _context7.next = 8;
            break;
          }
          return _context7.abrupt("return", TransactionState.Failed);
        case 8:
          if (!(receipt === null)) {
            _context7.next = 24;
            break;
          }
          _context7.prev = 9;
          _context7.next = 12;
          return provider.getTransactionReceipt(txRes.hash);
        case 12:
          receipt = _context7.sent;
          if (!(receipt === null)) {
            _context7.next = 15;
            break;
          }
          return _context7.abrupt("continue", 8);
        case 15:
          console.log("Receipt recived:", receipt);
          _context7.next = 22;
          break;
        case 18:
          _context7.prev = 18;
          _context7.t0 = _context7["catch"](9);
          console.log("Receipt error:", _context7.t0);
          return _context7.abrupt("break", 24);
        case 22:
          _context7.next = 8;
          break;
        case 24:
          if (!receipt) {
            _context7.next = 28;
            break;
          }
          return _context7.abrupt("return", TransactionState.Sent);
        case 28:
          return _context7.abrupt("return", TransactionState.Failed);
        case 29:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[9, 18]]);
  }));
  return _sendTransactionViaWallet.apply(this, arguments);
}
function sendTransactionViaWalletReceipt(_x7) {
  return _sendTransactionViaWalletReceipt.apply(this, arguments);
}
function _sendTransactionViaWalletReceipt() {
  _sendTransactionViaWalletReceipt = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(transaction) {
    var txRes, receipt, provider;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          if (transaction.value) {
            transaction.value = BigNumber.from(transaction.value);
          }
          _context8.next = 3;
          return wallet.sendTransaction(transaction);
        case 3:
          txRes = _context8.sent;
          receipt = null;
          provider = getProvider();
          if (provider) {
            _context8.next = 8;
            break;
          }
          return _context8.abrupt("return", [TransactionState.Failed, null]);
        case 8:
          if (!(receipt === null)) {
            _context8.next = 24;
            break;
          }
          _context8.prev = 9;
          _context8.next = 12;
          return provider.getTransactionReceipt(txRes.hash);
        case 12:
          receipt = _context8.sent;
          if (!(receipt === null)) {
            _context8.next = 15;
            break;
          }
          return _context8.abrupt("continue", 8);
        case 15:
          console.log("Receipt recived:", receipt);
          _context8.next = 22;
          break;
        case 18:
          _context8.prev = 18;
          _context8.t0 = _context8["catch"](9);
          console.log("Receipt error:", _context8.t0);
          return _context8.abrupt("break", 24);
        case 22:
          _context8.next = 8;
          break;
        case 24:
          if (!receipt) {
            _context8.next = 28;
            break;
          }
          return _context8.abrupt("return", [TransactionState.Sent, receipt]);
        case 28:
          return _context8.abrupt("return", [TransactionState.Failed, null]);
        case 29:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[9, 18]]);
  }));
  return _sendTransactionViaWalletReceipt.apply(this, arguments);
}

function getPoolInfoByToken(_x, _x2, _x3) {
  return _getPoolInfoByToken.apply(this, arguments);
}
function _getPoolInfoByToken() {
  _getPoolInfoByToken = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(tokenIn, tokenOut, poolFee) {
    var provider, currentPoolAddress, poolContract, liquidity, slot0, p;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          provider = getProvider();
          if (provider) {
            _context.next = 3;
            break;
          }
          throw new Error('No provider');
        case 3:
          currentPoolAddress = computePoolAddress({
            factoryAddress: CurrentConfig.POOL_FACTORY_CONTRACT_ADDRESS,
            tokenA: tokenIn,
            tokenB: tokenOut,
            fee: poolFee
          });
          poolContract = new ethers.Contract(currentPoolAddress, IV3PoolABI.abi, provider); //const token0 = await poolContract.token0()
          //const token1 = await poolContract.token1()
          //const fee = await poolContract.fee()
          //const tickSpacing = await poolContract.tickSpacing()
          _context.next = 7;
          return poolContract.liquidity();
        case 7:
          liquidity = _context.sent;
          _context.next = 10;
          return poolContract.slot0();
        case 10:
          slot0 = _context.sent;
          p = new Pool(tokenIn, tokenOut, poolFee, slot0[0].toString(), liquidity.toString(), slot0[1]);
          return _context.abrupt("return", p);
        case 13:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _getPoolInfoByToken.apply(this, arguments);
}
function getPoolInfo(_x4, _x5, _x6) {
  return _getPoolInfo.apply(this, arguments);
}
function _getPoolInfo() {
  _getPoolInfo = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(tokenIn, tokenOut, poolFee) {
    var provider, currentPoolAddress, poolContract, _yield$Promise$all, token0, token1, fee, tickSpacing, liquidity, slot0;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          provider = getProvider();
          if (provider) {
            _context2.next = 3;
            break;
          }
          throw new Error('No provider');
        case 3:
          currentPoolAddress = computePoolAddress({
            factoryAddress: CurrentConfig.POOL_FACTORY_CONTRACT_ADDRESS,
            tokenA: tokenIn,
            tokenB: tokenOut,
            fee: poolFee
          });
          console.log("param", {
            factoryAddress: CurrentConfig.POOL_FACTORY_CONTRACT_ADDRESS,
            tokenA: tokenIn,
            tokenB: tokenOut,
            fee: poolFee
          });
          poolContract = new ethers.Contract(currentPoolAddress, IV3PoolABI.abi, provider);
          _context2.next = 8;
          return Promise.all([poolContract.token0(), poolContract.token1(), poolContract.fee(), poolContract.tickSpacing(), poolContract.liquidity(), poolContract.slot0()]);
        case 8:
          _yield$Promise$all = _context2.sent;
          token0 = _yield$Promise$all[0];
          token1 = _yield$Promise$all[1];
          fee = _yield$Promise$all[2];
          tickSpacing = _yield$Promise$all[3];
          liquidity = _yield$Promise$all[4];
          slot0 = _yield$Promise$all[5];
          console.log("vao day 6");
          return _context2.abrupt("return", {
            token0: token0,
            token1: token1,
            fee: fee,
            tickSpacing: tickSpacing,
            liquidity: liquidity,
            sqrtPriceX96: slot0[0],
            tick: slot0[1]
          });
        case 17:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _getPoolInfo.apply(this, arguments);
}
var FEE_SIZE = 3;
function encodePath(path, fees) {
  if (path.length != fees.length + 1) {
    throw new Error('path/fee lengths do not match');
  }
  var encoded = '0x';
  for (var i = 0; i < fees.length; i++) {
    // 20 byte encoding of the address
    encoded += path[i].slice(2);
    // 3 byte encoding of the fee
    encoded += fees[i].toString(16).padStart(2 * FEE_SIZE, '0');
  }
  // encode the final token
  encoded += path[path.length - 1].slice(2);
  return encoded.toLowerCase();
}

function getCurrencyBalance(_x, _x2, _x3) {
  return _getCurrencyBalance.apply(this, arguments);
}
function _getCurrencyBalance() {
  _getCurrencyBalance = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(provider, address, currency) {
    var ERC20Contract, balance, decimals;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!(currency.isNative || currency.address.toLowerCase() == CurrentConfig.TC_CONTRACT_ADDRESS.toLowerCase())) {
            _context.next = 6;
            break;
          }
          _context.t0 = ethers.utils;
          _context.next = 4;
          return provider.getBalance(address);
        case 4:
          _context.t1 = _context.sent;
          return _context.abrupt("return", _context.t0.formatEther.call(_context.t0, _context.t1));
        case 6:
          // Get currency otherwise
          ERC20Contract = new ethers.Contract(currency.address, ERC20_ABI, provider);
          _context.next = 9;
          return ERC20Contract.balanceOf(address);
        case 9:
          balance = _context.sent;
          _context.next = 12;
          return ERC20Contract.decimals();
        case 12:
          decimals = _context.sent;
          return _context.abrupt("return", toReadableAmount(balance, decimals));
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _getCurrencyBalance.apply(this, arguments);
}
function getCurrencyApproveRouter(_x4, _x5, _x6) {
  return _getCurrencyApproveRouter.apply(this, arguments);
}
// wraps ETH (rounding up to the nearest ETH for decimal places)
function _getCurrencyApproveRouter() {
  _getCurrencyApproveRouter = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(provider, address, currency) {
    var ERC20Contract, amountAprrove, decimals;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (!currency.isNative) {
            _context2.next = 2;
            break;
          }
          return _context2.abrupt("return", -1);
        case 2:
          console.log("address", address);
          // Get currency otherwise
          ERC20Contract = new ethers.Contract(currency.address, ERC20_ABI, provider);
          _context2.next = 6;
          return ERC20Contract.allowance(address, CurrentConfig.SWAP_ROUTER_ADDRESS);
        case 6:
          amountAprrove = _context2.sent;
          console.log("address1", address);
          _context2.next = 10;
          return ERC20Contract.decimals();
        case 10:
          decimals = _context2.sent;
          console.log("amountAprrove", amountAprrove);
          // Format with proper units (approximate)
          return _context2.abrupt("return", Number(toReadableAmount(amountAprrove, decimals)));
        case 13:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _getCurrencyApproveRouter.apply(this, arguments);
}
function wrapETH(_x7) {
  return _wrapETH.apply(this, arguments);
}
// unwraps ETH (rounding up to the nearest ETH for decimal places)
function _wrapETH() {
  _wrapETH = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(eth) {
    var provider, address, wethContract, transaction;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          provider = getProvider();
          address = getWalletAddress();
          if (!(!provider || !address)) {
            _context3.next = 4;
            break;
          }
          throw new Error('Cannot wrap ETH without a provider and wallet address');
        case 4:
          wethContract = new ethers.Contract(CurrentConfig.WETH_CONTRACT_ADDRESS, WETH_ABI, provider);
          transaction = {
            data: wethContract["interface"].encodeFunctionData('deposit'),
            value: BigNumber.from(Math.ceil(eth)).mul(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)).toString()).toString(),
            from: address,
            to: CurrentConfig.WETH_CONTRACT_ADDRESS,
            maxFeePerGas: MAX_FEE_PER_GAS,
            maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS
          };
          _context3.next = 8;
          return sendTransaction(transaction);
        case 8:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _wrapETH.apply(this, arguments);
}
function unwrapETH(_x8) {
  return _unwrapETH.apply(this, arguments);
}
function _unwrapETH() {
  _unwrapETH = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(eth) {
    var provider, address, wethContract, transaction;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          provider = getProvider();
          address = getWalletAddress();
          if (!(!provider || !address)) {
            _context4.next = 4;
            break;
          }
          throw new Error('Cannot unwrap ETH without a provider and wallet address');
        case 4:
          wethContract = new ethers.Contract(CurrentConfig.WETH_CONTRACT_ADDRESS, WETH_ABI, provider);
          transaction = {
            data: wethContract["interface"].encodeFunctionData('withdraw', [BigNumber.from(Math.ceil(eth)).mul(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)).toString()).toString()]),
            from: address,
            to: CurrentConfig.WETH_CONTRACT_ADDRESS,
            maxFeePerGas: MAX_FEE_PER_GAS,
            maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS
          };
          _context4.next = 8;
          return sendTransaction(transaction);
        case 8:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _unwrapETH.apply(this, arguments);
}

var _format$9 = "hh-sol-artifact-1";
var contractName$9 = "QuoterV2";
var sourceName$9 = "contracts/lens/QuoterV2.sol";
var abi$9 = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_factory",
				type: "address"
			},
			{
				internalType: "address",
				name: "_WETH9",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		inputs: [
		],
		name: "WETH9",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes",
				name: "path",
				type: "bytes"
			},
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			}
		],
		name: "quoteExactInput",
		outputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "uint160[]",
				name: "sqrtPriceX96AfterList",
				type: "uint160[]"
			},
			{
				internalType: "uint32[]",
				name: "initializedTicksCrossedList",
				type: "uint32[]"
			},
			{
				internalType: "uint256",
				name: "gasEstimate",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "tokenIn",
						type: "address"
					},
					{
						internalType: "address",
						name: "tokenOut",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amountIn",
						type: "uint256"
					},
					{
						internalType: "uint24",
						name: "fee",
						type: "uint24"
					},
					{
						internalType: "uint160",
						name: "sqrtPriceLimitX96",
						type: "uint160"
					}
				],
				internalType: "struct IQuoterV2.QuoteExactInputSingleParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "quoteExactInputSingle",
		outputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "uint160",
				name: "sqrtPriceX96After",
				type: "uint160"
			},
			{
				internalType: "uint32",
				name: "initializedTicksCrossed",
				type: "uint32"
			},
			{
				internalType: "uint256",
				name: "gasEstimate",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes",
				name: "path",
				type: "bytes"
			},
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			}
		],
		name: "quoteExactOutput",
		outputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint160[]",
				name: "sqrtPriceX96AfterList",
				type: "uint160[]"
			},
			{
				internalType: "uint32[]",
				name: "initializedTicksCrossedList",
				type: "uint32[]"
			},
			{
				internalType: "uint256",
				name: "gasEstimate",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "tokenIn",
						type: "address"
					},
					{
						internalType: "address",
						name: "tokenOut",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					},
					{
						internalType: "uint24",
						name: "fee",
						type: "uint24"
					},
					{
						internalType: "uint160",
						name: "sqrtPriceLimitX96",
						type: "uint160"
					}
				],
				internalType: "struct IQuoterV2.QuoteExactOutputSingleParams",
				name: "params",
				type: "tuple"
			}
		],
		name: "quoteExactOutputSingle",
		outputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint160",
				name: "sqrtPriceX96After",
				type: "uint160"
			},
			{
				internalType: "uint32",
				name: "initializedTicksCrossed",
				type: "uint32"
			},
			{
				internalType: "uint256",
				name: "gasEstimate",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "int256",
				name: "amount0Delta",
				type: "int256"
			},
			{
				internalType: "int256",
				name: "amount1Delta",
				type: "int256"
			},
			{
				internalType: "bytes",
				name: "path",
				type: "bytes"
			}
		],
		name: "V3SwapCallback",
		outputs: [
		],
		stateMutability: "view",
		type: "function"
	}
];
var bytecode$9 = "0x60c06040523480156200001157600080fd5b506040516200212c3803806200212c833981016040819052620000349162000070565b6001600160601b0319606092831b8116608052911b1660a052620000a7565b80516001600160a01b03811681146200006b57600080fd5b919050565b6000806040838503121562000083578182fd5b6200008e8362000053565b91506200009e6020840162000053565b90509250929050565b60805160601c60a05160601c612051620000db60003980610321525080610577528061095d5280610b9252506120516000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063c45a01551161005b578063c45a0155146100e6578063c6a5026a146100ee578063cdca175314610101578063fa461e33146101145761007d565b80632f80bb1d146100825780634aa4a4fc146100ae578063bd21704a146100c3575b600080fd5b610095610090366004611b2b565b610129565b6040516100a59493929190611eac565b60405180910390f35b6100b661031f565b6040516100a59190611def565b6100d66100d1366004611c49565b610343565b6040516100a59493929190611f54565b6100b6610575565b6100d66100fc366004611c49565b610599565b61009561010f366004611b2b565b610754565b610127610122366004611b91565b61092c565b005b6000606080600061013986610ae8565b67ffffffffffffffff8111801561014f57600080fd5b50604051908082528060200260200182016040528015610179578160200160208202803683370190505b50925061018586610ae8565b67ffffffffffffffff8111801561019b57600080fd5b506040519080825280602002602001820160405280156101c5578160200160208202803683370190505b50915060005b60008060006101d98a610b17565b92509250925060008060008061025c6040518060a001604052808873ffffffffffffffffffffffffffffffffffffffff1681526020018973ffffffffffffffffffffffffffffffffffffffff1681526020018f81526020018762ffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff16815250610343565b9350935093509350828b898151811061027157fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050818a89815181106102b857fe5b63ffffffff90921660209283029190910190910152929b50968201966001909601958b926102e58e610b48565b156102fa576102f38e610b50565b9d5061030a565b8c9b505050505050505050610316565b505050505050506101cb565b92959194509250565b7f000000000000000000000000000000000000000000000000000000000000000081565b60208101518151606083015160009283928392839273ffffffffffffffffffffffffffffffffffffffff808216908416109284926103819290610b8b565b9050866080015173ffffffffffffffffffffffffffffffffffffffff16600014156103af5760408701516000555b60005a90508173ffffffffffffffffffffffffffffffffffffffff1663128acb0830856103df8c60400151610bc9565b6000038c6080015173ffffffffffffffffffffffffffffffffffffffff1660001461040e578c60800151610434565b8761042d5773fffd8963efd1fc6a506488495d951d5263988d25610434565b6401000276a45b8d602001518e606001518f6000015160405160200161045593929190611d89565b6040516020818303038152906040526040518663ffffffff1660e01b8152600401610484959493929190611e10565b6040805180830381600087803b15801561049d57600080fd5b505af19250505080156104eb575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682019092526104e891810190611b6e565b60015b610568573d808015610519576040519150601f19603f3d011682016040523d82523d6000602084013e61051e565b606091505b505a82039450886080015173ffffffffffffffffffffffffffffffffffffffff166000141561054c57600080555b610557818487610bfb565b97509750975097505050505061056e565b50505050505b9193509193565b7f000000000000000000000000000000000000000000000000000000000000000081565b60208101518151606083015160009283928392839273ffffffffffffffffffffffffffffffffffffffff808216908416109284926105d79290610b8b565b905060005a90508173ffffffffffffffffffffffffffffffffffffffff1663128acb0830856106098c60400151610bc9565b60808d015173ffffffffffffffffffffffffffffffffffffffff1615610633578c60800151610659565b876106525773fffd8963efd1fc6a506488495d951d5263988d25610659565b6401000276a45b8d600001518e606001518f6020015160405160200161067a93929190611d89565b6040516020818303038152906040526040518663ffffffff1660e01b81526004016106a9959493929190611e10565b6040805180830381600087803b1580156106c257600080fd5b505af1925050508015610710575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016820190925261070d91810190611b6e565b60015b610568573d80801561073e576040519150601f19603f3d011682016040523d82523d6000602084013e610743565b606091505b505a82039450610557818487610bfb565b6000606080600061076486610ae8565b67ffffffffffffffff8111801561077a57600080fd5b506040519080825280602002602001820160405280156107a4578160200160208202803683370190505b5092506107b086610ae8565b67ffffffffffffffff811180156107c657600080fd5b506040519080825280602002602001820160405280156107f0578160200160208202803683370190505b50915060005b60008060006108048a610b17565b9250925092506000806000806108876040518060a001604052808973ffffffffffffffffffffffffffffffffffffffff1681526020018873ffffffffffffffffffffffffffffffffffffffff1681526020018f81526020018762ffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff16815250610599565b9350935093509350828b898151811061089c57fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050818a89815181106108e357fe5b63ffffffff90921660209283029190910190910152929b50968201966001909601958b926109108e610b48565b156102fa5761091e8e610b50565b9d50505050505050506107f6565b600083138061093b5750600082135b61094457600080fd5b600080600061095284610b17565b9250925092506109847f0000000000000000000000000000000000000000000000000000000000000000848484610ccf565b5060008060008089136109ca578573ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1610888a6000036109ff565b8473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff161089896000035b9250925092506000610a12878787610b8b565b90506000808273ffffffffffffffffffffffffffffffffffffffff16633850c7bd6040518163ffffffff1660e01b815260040160e06040518083038186803b158015610a5d57600080fd5b505afa158015610a71573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a959190611c6b565b5050505050915091508515610abb57604051848152826020820152816040820152606081fd5b60005415610ad1576000548414610ad157600080fd5b604051858152826020820152816040820152606081fd5b805160177fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec909101045b919050565b60008080610b258482610cee565b9250610b32846014610dee565b9050610b3f846017610cee565b91509193909250565b516042111590565b8051606090610b859083906017907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe901610ede565b92915050565b6000610bc17f0000000000000000000000000000000000000000000000000000000000000000610bbc8686866110c5565b611142565b949350505050565b60007f80000000000000000000000000000000000000000000000000000000000000008210610bf757600080fd5b5090565b6000806000806000808773ffffffffffffffffffffffffffffffffffffffff16633850c7bd6040518163ffffffff1660e01b815260040160e06040518083038186803b158015610c4a57600080fd5b505afa158015610c5e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c829190611c6b565b50939650610c9794508d935061127892505050565b91975095509050610cbf73ffffffffffffffffffffffffffffffffffffffff89168383611339565b9350869250505093509350935093565b6000610ce585610ce08686866110c5565b611991565b95945050505050565b600081826014011015610d6257604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f746f416464726573735f6f766572666c6f770000000000000000000000000000604482015290519081900360640190fd5b8160140183511015610dd557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f746f416464726573735f6f75744f66426f756e64730000000000000000000000604482015290519081900360640190fd5b5001602001516c01000000000000000000000000900490565b600081826003011015610e6257604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f746f55696e7432345f6f766572666c6f77000000000000000000000000000000604482015290519081900360640190fd5b8160030183511015610ed557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f746f55696e7432345f6f75744f66426f756e6473000000000000000000000000604482015290519081900360640190fd5b50016003015190565b60608182601f011015610f5257604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f736c6963655f6f766572666c6f77000000000000000000000000000000000000604482015290519081900360640190fd5b828284011015610fc357604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f736c6963655f6f766572666c6f77000000000000000000000000000000000000604482015290519081900360640190fd5b8183018451101561103557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f736c6963655f6f75744f66426f756e6473000000000000000000000000000000604482015290519081900360640190fd5b60608215801561105457604051915060008252602082016040526110bc565b6040519150601f8416801560200281840101858101878315602002848b0101015b8183101561108d578051835260209283019201611075565b5050858452601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016604052505b50949350505050565b6110cd6119fa565b8273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161115611105579192915b506040805160608101825273ffffffffffffffffffffffffffffffffffffffff948516815292909316602083015262ffffff169181019190915290565b6000816020015173ffffffffffffffffffffffffffffffffffffffff16826000015173ffffffffffffffffffffffffffffffffffffffff161061118457600080fd5b508051602080830151604093840151845173ffffffffffffffffffffffffffffffffffffffff94851681850152939091168385015262ffffff166060808401919091528351808403820181526080840185528051908301207fff0000000000000000000000000000000000000000000000000000000000000060a085015294901b7fffffffffffffffffffffffffffffffffffffffff0000000000000000000000001660a183015260b58201939093527fe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b5460d5808301919091528251808303909101815260f5909101909152805191012090565b60008060008351606014611318576044845110156112cb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112c290611e75565b60405180910390fd5b600484019350838060200190518101906112e59190611bdf565b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112c29190611e62565b8380602001905181019061132c9190611d02565b9250925092509193909250565b60008060008060008060008060088b73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561138d57600080fd5b505afa1580156113a1573d6000803e3d6000fd5b505050506040513d60208110156113b757600080fd5b5051600290810b908c900b816113c957fe5b0560020b901d905060006101008c73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561141c57600080fd5b505afa158015611430573d6000803e3d6000fd5b505050506040513d602081101561144657600080fd5b5051600290810b908d900b8161145857fe5b0560020b8161146357fe5b079050600060088d73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b1580156114b057600080fd5b505afa1580156114c4573d6000803e3d6000fd5b505050506040513d60208110156114da57600080fd5b5051600290810b908d900b816114ec57fe5b0560020b901d905060006101008e73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561153f57600080fd5b505afa158015611553573d6000803e3d6000fd5b505050506040513d602081101561156957600080fd5b5051600290810b908e900b8161157b57fe5b0560020b8161158657fe5b07905060008160ff166001901b8f73ffffffffffffffffffffffffffffffffffffffff16635339c296856040518263ffffffff1660e01b8152600401808260010b815260200191505060206040518083038186803b1580156115e757600080fd5b505afa1580156115fb573d6000803e3d6000fd5b505050506040513d602081101561161157600080fd5b5051161180156116a457508d73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561166257600080fd5b505afa158015611676573d6000803e3d6000fd5b505050506040513d602081101561168c57600080fd5b5051600290810b908d900b8161169e57fe5b0760020b155b80156116b557508b60020b8d60020b135b945060008360ff166001901b8f73ffffffffffffffffffffffffffffffffffffffff16635339c296876040518263ffffffff1660e01b8152600401808260010b815260200191505060206040518083038186803b15801561171557600080fd5b505afa158015611729573d6000803e3d6000fd5b505050506040513d602081101561173f57600080fd5b5051161180156117d257508d73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561179057600080fd5b505afa1580156117a4573d6000803e3d6000fd5b505050506040513d60208110156117ba57600080fd5b5051600290810b908e900b816117cc57fe5b0760020b155b80156117e357508b60020b8d60020b125b95508160010b8460010b128061180f57508160010b8460010b14801561180f57508060ff168360ff1611155b1561182557839950829750819850809650611832565b8199508097508398508296505b50507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60ff87161b9150505b8560010b8760010b13611969578560010b8760010b14156118a3577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60ff858103161c165b6000818c73ffffffffffffffffffffffffffffffffffffffff16635339c2968a6040518263ffffffff1660e01b8152600401808260010b815260200191505060206040518083038186803b1580156118fa57600080fd5b505afa15801561190e573d6000803e3d6000fd5b505050506040513d602081101561192457600080fd5b5051169050611932816119c1565b61ffff16989098019750506001909501947fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff61185e565b8115611976576001880397505b8215611983576001880397505b505050505050509392505050565b600061199d8383611142565b90503373ffffffffffffffffffffffffffffffffffffffff821614610b8557600080fd5b6000805b8215610b85577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8301909216916001016119c5565b604080516060810182526000808252602082018190529181019190915290565b600082601f830112611a2a578081fd5b8135611a3d611a3882611faf565b611f8b565b818152846020838601011115611a51578283fd5b816020850160208301379081016020019190915292915050565b8051600281900b8114610b1257600080fd5b600060a08284031215611a8e578081fd5b60405160a0810181811067ffffffffffffffff82111715611aab57fe5b6040529050808235611abc8161201f565b81526020830135611acc8161201f565b602082015260408381013590820152606083013562ffffff81168114611af157600080fd5b6060820152611b0260808401611b0e565b60808201525092915050565b8035610b128161201f565b805161ffff81168114610b1257600080fd5b60008060408385031215611b3d578182fd5b823567ffffffffffffffff811115611b53578283fd5b611b5f85828601611a1a565b95602094909401359450505050565b60008060408385031215611b80578182fd5b505080516020909101519092909150565b600080600060608486031215611ba5578081fd5b8335925060208401359150604084013567ffffffffffffffff811115611bc9578182fd5b611bd586828701611a1a565b9150509250925092565b600060208284031215611bf0578081fd5b815167ffffffffffffffff811115611c06578182fd5b8201601f81018413611c16578182fd5b8051611c24611a3882611faf565b818152856020838501011115611c38578384fd5b610ce5826020830160208601611fef565b600060a08284031215611c5a578081fd5b611c648383611a7d565b9392505050565b600080600080600080600060e0888a031215611c85578283fd5b8751611c908161201f565b9650611c9e60208901611a6b565b9550611cac60408901611b19565b9450611cba60608901611b19565b9350611cc860808901611b19565b925060a088015160ff81168114611cdd578283fd5b60c08901519092508015158114611cf2578182fd5b8091505092959891949750929550565b600080600060608486031215611d16578081fd5b835192506020840151611d288161201f565b9150611d3660408501611a6b565b90509250925092565b60008151808452611d57816020860160208601611fef565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b606093841b7fffffffffffffffffffffffffffffffffffffffff000000000000000000000000908116825260e89390931b7fffffff0000000000000000000000000000000000000000000000000000000000166014820152921b166017820152602b0190565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b600073ffffffffffffffffffffffffffffffffffffffff8088168352861515602084015285604084015280851660608401525060a06080830152611e5760a0830184611d3f565b979650505050505050565b600060208252611c646020830184611d3f565b60208082526010908201527f556e6578706563746564206572726f7200000000000000000000000000000000604082015260600190565b600060808201868352602060808185015281875180845260a0860191508289019350845b81811015611f0257845173ffffffffffffffffffffffffffffffffffffffff1683529383019391830191600101611ed0565b505084810360408601528651808252908201925081870190845b81811015611f3e57825163ffffffff1685529383019391830191600101611f1c565b5050505060609290920192909252949350505050565b93845273ffffffffffffffffffffffffffffffffffffffff92909216602084015263ffffffff166040830152606082015260800190565b60405181810167ffffffffffffffff81118282101715611fa757fe5b604052919050565b600067ffffffffffffffff821115611fc357fe5b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b60005b8381101561200a578181015183820152602001611ff2565b83811115612019576000848401525b50505050565b73ffffffffffffffffffffffffffffffffffffffff8116811461204157600080fd5b5056fea164736f6c6343000706000a";
var deployedBytecode$9 = "0x608060405234801561001057600080fd5b506004361061007d5760003560e01c8063c45a01551161005b578063c45a0155146100e6578063c6a5026a146100ee578063cdca175314610101578063fa461e33146101145761007d565b80632f80bb1d146100825780634aa4a4fc146100ae578063bd21704a146100c3575b600080fd5b610095610090366004611b2b565b610129565b6040516100a59493929190611eac565b60405180910390f35b6100b661031f565b6040516100a59190611def565b6100d66100d1366004611c49565b610343565b6040516100a59493929190611f54565b6100b6610575565b6100d66100fc366004611c49565b610599565b61009561010f366004611b2b565b610754565b610127610122366004611b91565b61092c565b005b6000606080600061013986610ae8565b67ffffffffffffffff8111801561014f57600080fd5b50604051908082528060200260200182016040528015610179578160200160208202803683370190505b50925061018586610ae8565b67ffffffffffffffff8111801561019b57600080fd5b506040519080825280602002602001820160405280156101c5578160200160208202803683370190505b50915060005b60008060006101d98a610b17565b92509250925060008060008061025c6040518060a001604052808873ffffffffffffffffffffffffffffffffffffffff1681526020018973ffffffffffffffffffffffffffffffffffffffff1681526020018f81526020018762ffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff16815250610343565b9350935093509350828b898151811061027157fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050818a89815181106102b857fe5b63ffffffff90921660209283029190910190910152929b50968201966001909601958b926102e58e610b48565b156102fa576102f38e610b50565b9d5061030a565b8c9b505050505050505050610316565b505050505050506101cb565b92959194509250565b7f000000000000000000000000000000000000000000000000000000000000000081565b60208101518151606083015160009283928392839273ffffffffffffffffffffffffffffffffffffffff808216908416109284926103819290610b8b565b9050866080015173ffffffffffffffffffffffffffffffffffffffff16600014156103af5760408701516000555b60005a90508173ffffffffffffffffffffffffffffffffffffffff1663128acb0830856103df8c60400151610bc9565b6000038c6080015173ffffffffffffffffffffffffffffffffffffffff1660001461040e578c60800151610434565b8761042d5773fffd8963efd1fc6a506488495d951d5263988d25610434565b6401000276a45b8d602001518e606001518f6000015160405160200161045593929190611d89565b6040516020818303038152906040526040518663ffffffff1660e01b8152600401610484959493929190611e10565b6040805180830381600087803b15801561049d57600080fd5b505af19250505080156104eb575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682019092526104e891810190611b6e565b60015b610568573d808015610519576040519150601f19603f3d011682016040523d82523d6000602084013e61051e565b606091505b505a82039450886080015173ffffffffffffffffffffffffffffffffffffffff166000141561054c57600080555b610557818487610bfb565b97509750975097505050505061056e565b50505050505b9193509193565b7f000000000000000000000000000000000000000000000000000000000000000081565b60208101518151606083015160009283928392839273ffffffffffffffffffffffffffffffffffffffff808216908416109284926105d79290610b8b565b905060005a90508173ffffffffffffffffffffffffffffffffffffffff1663128acb0830856106098c60400151610bc9565b60808d015173ffffffffffffffffffffffffffffffffffffffff1615610633578c60800151610659565b876106525773fffd8963efd1fc6a506488495d951d5263988d25610659565b6401000276a45b8d600001518e606001518f6020015160405160200161067a93929190611d89565b6040516020818303038152906040526040518663ffffffff1660e01b81526004016106a9959493929190611e10565b6040805180830381600087803b1580156106c257600080fd5b505af1925050508015610710575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016820190925261070d91810190611b6e565b60015b610568573d80801561073e576040519150601f19603f3d011682016040523d82523d6000602084013e610743565b606091505b505a82039450610557818487610bfb565b6000606080600061076486610ae8565b67ffffffffffffffff8111801561077a57600080fd5b506040519080825280602002602001820160405280156107a4578160200160208202803683370190505b5092506107b086610ae8565b67ffffffffffffffff811180156107c657600080fd5b506040519080825280602002602001820160405280156107f0578160200160208202803683370190505b50915060005b60008060006108048a610b17565b9250925092506000806000806108876040518060a001604052808973ffffffffffffffffffffffffffffffffffffffff1681526020018873ffffffffffffffffffffffffffffffffffffffff1681526020018f81526020018762ffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff16815250610599565b9350935093509350828b898151811061089c57fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050818a89815181106108e357fe5b63ffffffff90921660209283029190910190910152929b50968201966001909601958b926109108e610b48565b156102fa5761091e8e610b50565b9d50505050505050506107f6565b600083138061093b5750600082135b61094457600080fd5b600080600061095284610b17565b9250925092506109847f0000000000000000000000000000000000000000000000000000000000000000848484610ccf565b5060008060008089136109ca578573ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1610888a6000036109ff565b8473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff161089896000035b9250925092506000610a12878787610b8b565b90506000808273ffffffffffffffffffffffffffffffffffffffff16633850c7bd6040518163ffffffff1660e01b815260040160e06040518083038186803b158015610a5d57600080fd5b505afa158015610a71573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a959190611c6b565b5050505050915091508515610abb57604051848152826020820152816040820152606081fd5b60005415610ad1576000548414610ad157600080fd5b604051858152826020820152816040820152606081fd5b805160177fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec909101045b919050565b60008080610b258482610cee565b9250610b32846014610dee565b9050610b3f846017610cee565b91509193909250565b516042111590565b8051606090610b859083906017907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe901610ede565b92915050565b6000610bc17f0000000000000000000000000000000000000000000000000000000000000000610bbc8686866110c5565b611142565b949350505050565b60007f80000000000000000000000000000000000000000000000000000000000000008210610bf757600080fd5b5090565b6000806000806000808773ffffffffffffffffffffffffffffffffffffffff16633850c7bd6040518163ffffffff1660e01b815260040160e06040518083038186803b158015610c4a57600080fd5b505afa158015610c5e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c829190611c6b565b50939650610c9794508d935061127892505050565b91975095509050610cbf73ffffffffffffffffffffffffffffffffffffffff89168383611339565b9350869250505093509350935093565b6000610ce585610ce08686866110c5565b611991565b95945050505050565b600081826014011015610d6257604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f746f416464726573735f6f766572666c6f770000000000000000000000000000604482015290519081900360640190fd5b8160140183511015610dd557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f746f416464726573735f6f75744f66426f756e64730000000000000000000000604482015290519081900360640190fd5b5001602001516c01000000000000000000000000900490565b600081826003011015610e6257604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f746f55696e7432345f6f766572666c6f77000000000000000000000000000000604482015290519081900360640190fd5b8160030183511015610ed557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f746f55696e7432345f6f75744f66426f756e6473000000000000000000000000604482015290519081900360640190fd5b50016003015190565b60608182601f011015610f5257604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f736c6963655f6f766572666c6f77000000000000000000000000000000000000604482015290519081900360640190fd5b828284011015610fc357604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f736c6963655f6f766572666c6f77000000000000000000000000000000000000604482015290519081900360640190fd5b8183018451101561103557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f736c6963655f6f75744f66426f756e6473000000000000000000000000000000604482015290519081900360640190fd5b60608215801561105457604051915060008252602082016040526110bc565b6040519150601f8416801560200281840101858101878315602002848b0101015b8183101561108d578051835260209283019201611075565b5050858452601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016604052505b50949350505050565b6110cd6119fa565b8273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161115611105579192915b506040805160608101825273ffffffffffffffffffffffffffffffffffffffff948516815292909316602083015262ffffff169181019190915290565b6000816020015173ffffffffffffffffffffffffffffffffffffffff16826000015173ffffffffffffffffffffffffffffffffffffffff161061118457600080fd5b508051602080830151604093840151845173ffffffffffffffffffffffffffffffffffffffff94851681850152939091168385015262ffffff166060808401919091528351808403820181526080840185528051908301207fff0000000000000000000000000000000000000000000000000000000000000060a085015294901b7fffffffffffffffffffffffffffffffffffffffff0000000000000000000000001660a183015260b58201939093527fe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b5460d5808301919091528251808303909101815260f5909101909152805191012090565b60008060008351606014611318576044845110156112cb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112c290611e75565b60405180910390fd5b600484019350838060200190518101906112e59190611bdf565b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112c29190611e62565b8380602001905181019061132c9190611d02565b9250925092509193909250565b60008060008060008060008060088b73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561138d57600080fd5b505afa1580156113a1573d6000803e3d6000fd5b505050506040513d60208110156113b757600080fd5b5051600290810b908c900b816113c957fe5b0560020b901d905060006101008c73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561141c57600080fd5b505afa158015611430573d6000803e3d6000fd5b505050506040513d602081101561144657600080fd5b5051600290810b908d900b8161145857fe5b0560020b8161146357fe5b079050600060088d73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b1580156114b057600080fd5b505afa1580156114c4573d6000803e3d6000fd5b505050506040513d60208110156114da57600080fd5b5051600290810b908d900b816114ec57fe5b0560020b901d905060006101008e73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561153f57600080fd5b505afa158015611553573d6000803e3d6000fd5b505050506040513d602081101561156957600080fd5b5051600290810b908e900b8161157b57fe5b0560020b8161158657fe5b07905060008160ff166001901b8f73ffffffffffffffffffffffffffffffffffffffff16635339c296856040518263ffffffff1660e01b8152600401808260010b815260200191505060206040518083038186803b1580156115e757600080fd5b505afa1580156115fb573d6000803e3d6000fd5b505050506040513d602081101561161157600080fd5b5051161180156116a457508d73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561166257600080fd5b505afa158015611676573d6000803e3d6000fd5b505050506040513d602081101561168c57600080fd5b5051600290810b908d900b8161169e57fe5b0760020b155b80156116b557508b60020b8d60020b135b945060008360ff166001901b8f73ffffffffffffffffffffffffffffffffffffffff16635339c296876040518263ffffffff1660e01b8152600401808260010b815260200191505060206040518083038186803b15801561171557600080fd5b505afa158015611729573d6000803e3d6000fd5b505050506040513d602081101561173f57600080fd5b5051161180156117d257508d73ffffffffffffffffffffffffffffffffffffffff1663d0c93a7c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561179057600080fd5b505afa1580156117a4573d6000803e3d6000fd5b505050506040513d60208110156117ba57600080fd5b5051600290810b908e900b816117cc57fe5b0760020b155b80156117e357508b60020b8d60020b125b95508160010b8460010b128061180f57508160010b8460010b14801561180f57508060ff168360ff1611155b1561182557839950829750819850809650611832565b8199508097508398508296505b50507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60ff87161b9150505b8560010b8760010b13611969578560010b8760010b14156118a3577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60ff858103161c165b6000818c73ffffffffffffffffffffffffffffffffffffffff16635339c2968a6040518263ffffffff1660e01b8152600401808260010b815260200191505060206040518083038186803b1580156118fa57600080fd5b505afa15801561190e573d6000803e3d6000fd5b505050506040513d602081101561192457600080fd5b5051169050611932816119c1565b61ffff16989098019750506001909501947fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff61185e565b8115611976576001880397505b8215611983576001880397505b505050505050509392505050565b600061199d8383611142565b90503373ffffffffffffffffffffffffffffffffffffffff821614610b8557600080fd5b6000805b8215610b85577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8301909216916001016119c5565b604080516060810182526000808252602082018190529181019190915290565b600082601f830112611a2a578081fd5b8135611a3d611a3882611faf565b611f8b565b818152846020838601011115611a51578283fd5b816020850160208301379081016020019190915292915050565b8051600281900b8114610b1257600080fd5b600060a08284031215611a8e578081fd5b60405160a0810181811067ffffffffffffffff82111715611aab57fe5b6040529050808235611abc8161201f565b81526020830135611acc8161201f565b602082015260408381013590820152606083013562ffffff81168114611af157600080fd5b6060820152611b0260808401611b0e565b60808201525092915050565b8035610b128161201f565b805161ffff81168114610b1257600080fd5b60008060408385031215611b3d578182fd5b823567ffffffffffffffff811115611b53578283fd5b611b5f85828601611a1a565b95602094909401359450505050565b60008060408385031215611b80578182fd5b505080516020909101519092909150565b600080600060608486031215611ba5578081fd5b8335925060208401359150604084013567ffffffffffffffff811115611bc9578182fd5b611bd586828701611a1a565b9150509250925092565b600060208284031215611bf0578081fd5b815167ffffffffffffffff811115611c06578182fd5b8201601f81018413611c16578182fd5b8051611c24611a3882611faf565b818152856020838501011115611c38578384fd5b610ce5826020830160208601611fef565b600060a08284031215611c5a578081fd5b611c648383611a7d565b9392505050565b600080600080600080600060e0888a031215611c85578283fd5b8751611c908161201f565b9650611c9e60208901611a6b565b9550611cac60408901611b19565b9450611cba60608901611b19565b9350611cc860808901611b19565b925060a088015160ff81168114611cdd578283fd5b60c08901519092508015158114611cf2578182fd5b8091505092959891949750929550565b600080600060608486031215611d16578081fd5b835192506020840151611d288161201f565b9150611d3660408501611a6b565b90509250925092565b60008151808452611d57816020860160208601611fef565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b606093841b7fffffffffffffffffffffffffffffffffffffffff000000000000000000000000908116825260e89390931b7fffffff0000000000000000000000000000000000000000000000000000000000166014820152921b166017820152602b0190565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b600073ffffffffffffffffffffffffffffffffffffffff8088168352861515602084015285604084015280851660608401525060a06080830152611e5760a0830184611d3f565b979650505050505050565b600060208252611c646020830184611d3f565b60208082526010908201527f556e6578706563746564206572726f7200000000000000000000000000000000604082015260600190565b600060808201868352602060808185015281875180845260a0860191508289019350845b81811015611f0257845173ffffffffffffffffffffffffffffffffffffffff1683529383019391830191600101611ed0565b505084810360408601528651808252908201925081870190845b81811015611f3e57825163ffffffff1685529383019391830191600101611f1c565b5050505060609290920192909252949350505050565b93845273ffffffffffffffffffffffffffffffffffffffff92909216602084015263ffffffff166040830152606082015260800190565b60405181810167ffffffffffffffff81118282101715611fa757fe5b604052919050565b600067ffffffffffffffff821115611fc357fe5b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b60005b8381101561200a578181015183820152602001611ff2565b83811115612019576000848401525b50505050565b73ffffffffffffffffffffffffffffffffffffffff8116811461204157600080fd5b5056fea164736f6c6343000706000a";
var linkReferences$9 = {
};
var deployedLinkReferences$9 = {
};
var QuoterV2ABI = {
	_format: _format$9,
	contractName: contractName$9,
	sourceName: sourceName$9,
	abi: abi$9,
	bytecode: bytecode$9,
	deployedBytecode: deployedBytecode$9,
	linkReferences: linkReferences$9,
	deployedLinkReferences: deployedLinkReferences$9
};

var _excluded$1 = ["method", "data"];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var camelCaseKeys = function camelCaseKeys(obj) {
  if (Boolean(obj) && !isEmpty(obj) && Array.isArray(obj)) {
    return obj.map(function (v) {
      return camelCaseKeys(v);
    });
  }
  if (Boolean(obj) && obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(function (result, key) {
      var _extends2;
      return _extends({}, result, (_extends2 = {}, _extends2[camelCase(key)] = camelCaseKeys(obj[key]), _extends2));
    }, {});
  }
  return obj;
};
var swrFetcher = /*#__PURE__*/function () {
  var _ref = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(url, options) {
    var method, data, rest, _response$data, _response$data2, response;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          method = options.method, data = options.data, rest = _objectWithoutPropertiesLoose(options, _excluded$1);
          _context.prev = 1;
          _context.next = 4;
          return axios.request(_extends({
            url: url,
            method: method,
            data: data
          }, rest));
        case 4:
          response = _context.sent;
          return _context.abrupt("return", camelCaseKeys((response == null || (_response$data = response.data) == null ? void 0 : _response$data.data) || (response == null || (_response$data2 = response.data) == null ? void 0 : _response$data2.result)));
        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          throw new Error('Something went wrong');
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 8]]);
  }));
  return function swrFetcher(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
function getListRoute(_x3, _x4) {
  return _getListRoute.apply(this, arguments);
}
function _getListRoute() {
  _getListRoute = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(from, to) {
    var listrs, res, index;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          listrs = [];
          _context9.prev = 1;
          _context9.next = 4;
          return fetch(CurrentConfig.API_ROOT + "/api/swap/token/route/v2?network=nos&from_token=" + from + '&to_token=' + to).then(function (res) {
            return res.json();
          });
        case 4:
          res = _context9.sent;
          for (index = 0; index < res.data.length; index++) {
            listrs.push(res.data[index]);
          }
          _context9.next = 10;
          break;
        case 8:
          _context9.prev = 8;
          _context9.t0 = _context9["catch"](1);
        case 10:
          _context9.prev = 10;
          return _context9.finish(10);
        case 12:
          return _context9.abrupt("return", listrs);
        case 13:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[1, 8, 10, 12]]);
  }));
  return _getListRoute.apply(this, arguments);
}
var getSwapTokensV1 = /*#__PURE__*/function () {
  var _ref2 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(params) {
    var qs;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          qs = '?' + new URLSearchParams(params).toString();
          return _context2.abrupt("return", swrFetcher(CurrentConfig.API_ROOT + "/api/swap/token/list/v1" + qs, {
            method: 'GET',
            error: 'Fail to get tokens data'
          }));
        case 2:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getSwapTokensV1(_x5) {
    return _ref2.apply(this, arguments);
  };
}();
var getSwapRoutesV2 = /*#__PURE__*/function () {
  var _ref3 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(params) {
    var qs;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          qs = '?' + new URLSearchParams(params).toString();
          return _context3.abrupt("return", swrFetcher(CurrentConfig.API_ROOT + "/api/swap/token/route/v2" + qs, {
            method: 'GET',
            error: 'Fail to get route'
          }));
        case 2:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function getSwapRoutesV2(_x6) {
    return _ref3.apply(this, arguments);
  };
}();
var listToken = [];
function gettokenIndex(listToken, address) {
  var position = -1;
  for (var index = 0; index < listToken.length; index++) {
    if (listToken[index].address.toLowerCase() == address.toLowerCase()) {
      position = index;
    }
  }
  return position;
}
// Trading Functions
var getBestRouteExactIn = /*#__PURE__*/function () {
  var _ref4 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(amountIn, swapRoutes, listToken1) {
    var provider, quoteContract, listPools, params, _res, swapRoutes1, _iterator, _step, _route, _route2, _route3, route, promises, res, result, indexBestRoute, bestRoute, _iterator2, _step2, pair, index0, token0, index1, token1, p, swapRout1, uncheckedTrade;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          if (swapRoutes === void 0) {
            swapRoutes = [];
          }
          if (listToken1 === void 0) {
            listToken1 = [];
          }
          _context5.prev = 2;
          provider = getProvider();
          if (provider) {
            _context5.next = 6;
            break;
          }
          throw new Error('No provider');
        case 6:
          quoteContract = new ethers.Contract(CurrentConfig.QUOTER_CONTRACT_ADDRESS, QuoterV2ABI.abi, provider);
          listPools = [];
          if (!(swapRoutes == null || swapRoutes.length == 0)) {
            _context5.next = 13;
            break;
          }
          params = {
            from_token: tokenSwap["in"].address,
            to_token: tokenSwap.out.address,
            network: "nos"
          };
          _context5.next = 12;
          return getSwapRoutesV2(params);
        case 12:
          swapRoutes = _context5.sent;
        case 13:
          if (!(listToken1.length == 0)) {
            _context5.next = 18;
            break;
          }
          _context5.next = 16;
          return getSwapTokensV1({
            limit: 500,
            page: 1,
            is_test: CurrentConfig.env == Environment.TESTNET ? '1' : '',
            network: "nos"
          });
        case 16:
          _res = _context5.sent;
          listToken1 = _res ? camelCaseKeys(_res) : [];
        case 18:
          swapRoutes1 = [];
          for (_iterator = _createForOfIteratorHelperLoose(swapRoutes); !(_step = _iterator()).done;) {
            route = _step.value;
            if (((_route = route) == null ? void 0 : _route.pathPairs.length) > 0 && (Number((_route2 = route) == null ? void 0 : _route2.pathPairs[0].reserve0) > 0.000001 || Number((_route3 = route) == null ? void 0 : _route3.pathPairs[0].reserve1) > 0.000001)) {
              swapRoutes1.push(route);
            }
          }
          promises = swapRoutes1.map( /*#__PURE__*/function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(route) {
              var _route$pathTokens, _route$pathPairs;
              var addresses, fees, transaction;
              return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                  case 0:
                    addresses = route == null || (_route$pathTokens = route.pathTokens) == null ? void 0 : _route$pathTokens.map(function (token) {
                      return token.address;
                    });
                    fees = route == null || (_route$pathPairs = route.pathPairs) == null ? void 0 : _route$pathPairs.map(function (pair) {
                      return Number(pair.fee);
                    }); //console.log("route?.pathPairs",route?.pathPairs);
                    /*
                    if(route?.pathPairs.length>0 && Number(route?.pathPairs[0].reserve0)<0.000001 && Number(route?.pathPairs[0].reserve1)<0.000001)
                    {
                      return 0;
                    }
                     */
                    _context4.next = 4;
                    return quoteContract.connect(provider).callStatic.quoteExactInput(encodePath(addresses, fees), ethers.utils.parseEther(amountIn.toString()));
                  case 4:
                    transaction = _context4.sent;
                    return _context4.abrupt("return", Number(transaction.amountOut.toString()));
                  case 6:
                  case "end":
                    return _context4.stop();
                }
              }, _callee4);
            }));
            return function (_x10) {
              return _ref5.apply(this, arguments);
            };
          }());
          _context5.next = 23;
          return Promise.all(promises);
        case 23:
          res = _context5.sent;
          console.log("res", res);
          result = Math.max.apply(Math, res);
          indexBestRoute = res.indexOf(result);
          bestRoute = swapRoutes1[indexBestRoute];
          _iterator2 = _createForOfIteratorHelperLoose(bestRoute.pathPairs);
        case 29:
          if ((_step2 = _iterator2()).done) {
            _context5.next = 41;
            break;
          }
          pair = _step2.value;
          index0 = gettokenIndex(listToken1, pair.token0);
          token0 = new Token(1, listToken1[index0].address, Number(listToken1[index0].decimal), listToken1[index0].symbol, listToken1[index0].symbol);
          index1 = gettokenIndex(listToken1, pair.token1);
          token1 = new Token(1, listToken1[index1].address, Number(listToken1[index1].decimal), listToken1[index1].symbol, listToken1[index1].symbol);
          _context5.next = 37;
          return getPoolInfoByToken(token0, token1, parseInt(pair.fee));
        case 37:
          p = _context5.sent;
          listPools.push(p);
        case 39:
          _context5.next = 29;
          break;
        case 41:
          swapRout1 = new Route(listPools, tokenSwap["in"], tokenSwap.out);
          uncheckedTrade = Trade.createUncheckedTrade({
            route: swapRout1,
            inputAmount: CurrencyAmount.fromRawAmount(tokenSwap["in"], fromReadableAmount(tokenSwap.amountIn, tokenSwap["in"].decimals).toString()),
            outputAmount: CurrencyAmount.fromRawAmount(tokenSwap.out, JSBI.BigInt(result)),
            tradeType: TradeType.EXACT_INPUT
          });
          return _context5.abrupt("return", [result, bestRoute, uncheckedTrade, result.toLocaleString('fullwide', {
            useGrouping: false
          })]);
        case 46:
          _context5.prev = 46;
          _context5.t0 = _context5["catch"](2);
        case 48:
          _context5.prev = 48;
          return _context5.finish(48);
        case 50:
          return _context5.abrupt("return", [-1]);
        case 51:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[2, 46, 48, 50]]);
  }));
  return function getBestRouteExactIn(_x7, _x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}();
var getBestRouteExactOut = /*#__PURE__*/function () {
  var _ref6 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(amountOut, swapRoutes, listToken1) {
    var provider, quoteContract, listPools, params, _res2, swapRoutes1, _iterator3, _step3, _route4, _route5, _route6, route, promises, res, result, indexBestRoute, bestRoute, _iterator4, _step4, pair, index0, token0, index1, token1, p, swapRout1, uncheckedTrade;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          if (swapRoutes === void 0) {
            swapRoutes = [];
          }
          if (listToken1 === void 0) {
            listToken1 = [];
          }
          _context7.prev = 2;
          provider = getProvider();
          if (provider) {
            _context7.next = 6;
            break;
          }
          throw new Error('No provider');
        case 6:
          quoteContract = new ethers.Contract(CurrentConfig.QUOTER_CONTRACT_ADDRESS, QuoterV2ABI.abi, provider);
          listPools = [];
          if (!(swapRoutes == null || swapRoutes.length == 0)) {
            _context7.next = 13;
            break;
          }
          params = {
            from_token: tokenSwap["in"].address,
            to_token: tokenSwap.out.address,
            network: "nos"
          };
          _context7.next = 12;
          return getSwapRoutesV2(params);
        case 12:
          swapRoutes = _context7.sent;
        case 13:
          if (!(listToken1 == null || listToken1.length == 0)) {
            _context7.next = 18;
            break;
          }
          _context7.next = 16;
          return getSwapTokensV1({
            limit: 500,
            page: 1,
            is_test: CurrentConfig.env == Environment.TESTNET ? '1' : '',
            network: "nos"
          });
        case 16:
          _res2 = _context7.sent;
          listToken1 = _res2 ? camelCaseKeys(_res2) : [];
        case 18:
          swapRoutes1 = [];
          for (_iterator3 = _createForOfIteratorHelperLoose(swapRoutes); !(_step3 = _iterator3()).done;) {
            route = _step3.value;
            if (((_route4 = route) == null ? void 0 : _route4.pathPairs.length) > 0 && (Number((_route5 = route) == null ? void 0 : _route5.pathPairs[0].reserve0) > 0.000001 || Number((_route6 = route) == null ? void 0 : _route6.pathPairs[0].reserve1) > 0.000001)) {
              swapRoutes1.push(route);
            }
          }
          promises = swapRoutes1.map( /*#__PURE__*/function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(route) {
              var _route$pathTokens2, _route$pathPairs2;
              var addresses, fees, transaction;
              return _regeneratorRuntime().wrap(function _callee6$(_context6) {
                while (1) switch (_context6.prev = _context6.next) {
                  case 0:
                    addresses = route == null || (_route$pathTokens2 = route.pathTokens) == null ? void 0 : _route$pathTokens2.map(function (token) {
                      return token.address;
                    });
                    fees = route == null || (_route$pathPairs2 = route.pathPairs) == null ? void 0 : _route$pathPairs2.map(function (pair) {
                      return Number(pair.fee);
                    });
                    addresses = addresses.reverse();
                    fees = fees.reverse();
                    _context6.next = 6;
                    return quoteContract.connect(provider).callStatic.quoteExactOutput(encodePath(addresses, fees), ethers.utils.parseEther(amountOut.toString()));
                  case 6:
                    transaction = _context6.sent;
                    return _context6.abrupt("return", Number(transaction.amountIn.toString()));
                  case 8:
                  case "end":
                    return _context6.stop();
                }
              }, _callee6);
            }));
            return function (_x14) {
              return _ref7.apply(this, arguments);
            };
          }());
          _context7.next = 23;
          return Promise.all(promises);
        case 23:
          res = _context7.sent;
          console.log("res", res);
          result = Math.min.apply(Math, res);
          indexBestRoute = res.indexOf(result);
          bestRoute = swapRoutes1[indexBestRoute];
          _iterator4 = _createForOfIteratorHelperLoose(bestRoute.pathPairs);
        case 29:
          if ((_step4 = _iterator4()).done) {
            _context7.next = 41;
            break;
          }
          pair = _step4.value;
          index0 = gettokenIndex(listToken1, pair.token0);
          token0 = new Token(1, listToken1[index0].address, Number(listToken1[index0].decimal), listToken1[index0].symbol, listToken1[index0].symbol);
          index1 = gettokenIndex(listToken1, pair.token1);
          token1 = new Token(1, listToken1[index1].address, Number(listToken1[index1].decimal), listToken1[index1].symbol, listToken1[index1].symbol);
          _context7.next = 37;
          return getPoolInfoByToken(token0, token1, parseInt(pair.fee));
        case 37:
          p = _context7.sent;
          listPools.push(p);
        case 39:
          _context7.next = 29;
          break;
        case 41:
          swapRout1 = new Route(listPools, tokenSwap["in"], tokenSwap.out);
          uncheckedTrade = Trade.createUncheckedTrade({
            route: swapRout1,
            inputAmount: CurrencyAmount.fromRawAmount(tokenSwap["in"], JSBI.BigInt(result)),
            outputAmount: CurrencyAmount.fromRawAmount(tokenSwap.out, fromReadableAmount(amountOut, tokenSwap["in"].decimals).toString()),
            tradeType: TradeType.EXACT_OUTPUT
          });
          return _context7.abrupt("return", [result, bestRoute, uncheckedTrade]);
        case 46:
          _context7.prev = 46;
          _context7.t0 = _context7["catch"](2);
        case 48:
          _context7.prev = 48;
          return _context7.finish(48);
        case 50:
          return _context7.abrupt("return", [-1]);
        case 51:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[2, 46, 48, 50]]);
  }));
  return function getBestRouteExactOut(_x11, _x12, _x13) {
    return _ref6.apply(this, arguments);
  };
}();
function createTrade() {
  return _createTrade.apply(this, arguments);
}
function _createTrade() {
  _createTrade = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
    var provider, quoteContract, swapRoutes, listPools, promises, res, result, indexBestRoute, bestRoute, _iterator5, _step5, pair, index0, token0, index1, token1, p, swapRout1, uncheckedTrade;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          provider = getProvider();
          if (provider) {
            _context11.next = 3;
            break;
          }
          throw new Error('No provider');
        case 3:
          quoteContract = new ethers.Contract(CurrentConfig.QUOTER_CONTRACT_ADDRESS, QuoterV2ABI.abi, provider);
          _context11.next = 6;
          return getListRoute(tokenSwap["in"].address, tokenSwap.out.address);
        case 6:
          swapRoutes = _context11.sent;
          listPools = [];
          promises = swapRoutes.map( /*#__PURE__*/function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(route) {
              var addresses, fees, transaction;
              return _regeneratorRuntime().wrap(function _callee10$(_context10) {
                while (1) switch (_context10.prev = _context10.next) {
                  case 0:
                    addresses = route.path_tokens.map(function (token) {
                      return token['address'];
                    });
                    fees = route.path_pairs.map(function (pair) {
                      return Number(pair.fee);
                    });
                    _context10.next = 4;
                    return quoteContract.connect(provider).callStatic.quoteExactInput(encodePath(addresses, fees), ethers.utils.parseEther(tokenSwap.amountIn.toString()));
                  case 4:
                    transaction = _context10.sent;
                    return _context10.abrupt("return", Number(transaction.amountOut.toString()));
                  case 6:
                  case "end":
                    return _context10.stop();
                }
              }, _callee10);
            }));
            return function (_x22) {
              return _ref9.apply(this, arguments);
            };
          }());
          _context11.next = 11;
          return Promise.all(promises);
        case 11:
          res = _context11.sent;
          result = Math.max.apply(Math, res);
          indexBestRoute = res.indexOf(result);
          bestRoute = swapRoutes[indexBestRoute];
          _iterator5 = _createForOfIteratorHelperLoose(bestRoute.path_pairs);
        case 16:
          if ((_step5 = _iterator5()).done) {
            _context11.next = 28;
            break;
          }
          pair = _step5.value;
          index0 = gettokenIndex(listToken, pair.token0);
          token0 = new Token(1, listToken[index0].address, listToken[index0].decimal, listToken[index0].symbol, listToken[index0].symbol);
          index1 = gettokenIndex(listToken, pair.token1);
          token1 = new Token(1, listToken[index1].address, listToken[index1].decimal, listToken[index1].symbol, listToken[index1].symbol);
          _context11.next = 24;
          return getPoolInfoByToken(token0, token1, parseInt(pair.fee));
        case 24:
          p = _context11.sent;
          listPools.push(p);
        case 26:
          _context11.next = 16;
          break;
        case 28:
          swapRout1 = new Route(listPools, tokenSwap["in"], tokenSwap.out);
          uncheckedTrade = Trade.createUncheckedTrade({
            route: swapRout1,
            inputAmount: CurrencyAmount.fromRawAmount(tokenSwap["in"], fromReadableAmount(tokenSwap.amountIn, tokenSwap["in"].decimals).toString()),
            outputAmount: CurrencyAmount.fromRawAmount(tokenSwap.out, JSBI.BigInt(result)),
            tradeType: TradeType.EXACT_INPUT
          });
          return _context11.abrupt("return", uncheckedTrade);
        case 31:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return _createTrade.apply(this, arguments);
}
function executeTradeSlippage(_x15, _x16, _x17) {
  return _executeTradeSlippage.apply(this, arguments);
}
function _executeTradeSlippage() {
  _executeTradeSlippage = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(trade, slippage, recipient) {
    var walletAddress, options, methodParameters, tx, res;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          if (recipient === void 0) {
            recipient = null;
          }
          walletAddress = getWalletAddress();
          if (!(!walletAddress && CurrentWallet.type === WalletType.EXTENSION)) {
            _context12.next = 6;
            break;
          }
          _context12.next = 5;
          return geSignerAddress();
        case 5:
          walletAddress = _context12.sent;
        case 6:
          if (walletAddress) {
            _context12.next = 8;
            break;
          }
          throw new Error('Cannot execute a trade without a connected wallet');
        case 8:
          /*
          // Give approval to the router to spend the token
            const tokenApproval = await getTokenTransferApproval(tokenSwap.in,Number(trade.inputAmount.toExact()))
          
          // Fail if transfer approvals do not go through
            if (tokenApproval !== TransactionState.Sent) {
              return TransactionState.Failed
            }
           */
          recipient = recipient != null && recipient != "" ? recipient : walletAddress;
          options = {
            slippageTolerance: new Percent(slippage, 10000),
            deadline: Math.floor(Date.now() / 1000) + 60 * 20,
            recipient: recipient
          };
          methodParameters = SwapRouter.swapCallParameters([trade], options);
          tx = {
            data: methodParameters.calldata,
            to: CurrentConfig.SWAP_ROUTER_ADDRESS,
            value: methodParameters.value,
            from: walletAddress
          };
          _context12.next = 14;
          return sendTransactionGetReceipt(tx);
        case 14:
          res = _context12.sent;
          return _context12.abrupt("return", res);
        case 16:
        case "end":
          return _context12.stop();
      }
    }, _callee12);
  }));
  return _executeTradeSlippage.apply(this, arguments);
}
function executeTrade(_x18) {
  return _executeTrade.apply(this, arguments);
}
/*
// Helper Quoting and Pool Functions

async function getOutputQuote(route: Route<Currency, Currency>) {
  const provider = getProvider()

  if (!provider) {
    throw new Error('Provider required to get pool state')
  }

  const { calldata } = await SwapQuoter.quoteCallParameters(
      route,
      CurrencyAmount.fromRawAmount(
          tokenSwap.in,
          fromReadableAmount(
              tokenSwap.amountIn,
              tokenSwap.in.decimals
          ).toString()
      ),
      TradeType.EXACT_INPUT,
      {
        useQuoterV2: true,
      }
  )

  const quoteCallReturnData = await provider.call({
    to: CurrentConfig.QUOTER_CONTRACT_ADDRESS,
    data: calldata,
  })

  return ethers.utils.defaultAbiCoder.decode(['uint256'], quoteCallReturnData)
}

 */
function _executeTrade() {
  _executeTrade = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(trade) {
    var walletAddress, provider, options, methodParameters, tx, res;
    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          walletAddress = getWalletAddress();
          provider = getProvider();
          if (!(!walletAddress || !provider)) {
            _context13.next = 4;
            break;
          }
          throw new Error('Cannot execute a trade without a connected wallet');
        case 4:
          /*
          
          // Give approval to the router to spend the token
            const tokenApproval = await getTokenTransferApproval(tokenSwap.in,Number(trade.inputAmount.toExact()))
          
          // Fail if transfer approvals do not go through
            if (tokenApproval !== TransactionState.Sent) {
              return TransactionState.Failed
            }
           */
          options = {
            slippageTolerance: new Percent(50, 10000),
            deadline: Math.floor(Date.now() / 1000) + 60 * 20,
            recipient: walletAddress
          };
          methodParameters = SwapRouter.swapCallParameters([trade], options);
          tx = {
            data: methodParameters.calldata,
            to: CurrentConfig.SWAP_ROUTER_ADDRESS,
            value: methodParameters.value,
            from: walletAddress
          };
          _context13.next = 9;
          return sendTransaction(tx);
        case 9:
          res = _context13.sent;
          return _context13.abrupt("return", res);
        case 11:
        case "end":
          return _context13.stop();
      }
    }, _callee13);
  }));
  return _executeTrade.apply(this, arguments);
}
function setTokens(listTk) {
  listToken = [].concat(listTk);
}
function getTokenTransferApprovalSwap(_x19) {
  return _getTokenTransferApprovalSwap.apply(this, arguments);
}
function _getTokenTransferApprovalSwap() {
  _getTokenTransferApprovalSwap = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(token) {
    var provider, walletAddress;
    return _regeneratorRuntime().wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          provider = getProvider();
          walletAddress = getWalletAddress();
          if (!(!provider || !walletAddress)) {
            _context14.next = 5;
            break;
          }
          console.log('No Provider Found');
          return _context14.abrupt("return", -1);
        case 5:
          _context14.next = 7;
          return getCurrencyApproveRouter(provider, walletAddress, token);
        case 7:
          return _context14.abrupt("return", _context14.sent);
        case 8:
        case "end":
          return _context14.stop();
      }
    }, _callee14);
  }));
  return _getTokenTransferApprovalSwap.apply(this, arguments);
}
function tokenTransferApproval(_x20, _x21) {
  return _tokenTransferApproval.apply(this, arguments);
}
function _tokenTransferApproval() {
  _tokenTransferApproval = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(token, amount) {
    var provider, address, tokenContract, transaction;
    return _regeneratorRuntime().wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          if (amount === void 0) {
            amount = TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER;
          }
          provider = getProvider();
          address = getWalletAddress();
          if (!(!provider || !address)) {
            _context15.next = 6;
            break;
          }
          console.log('No Provider Found');
          return _context15.abrupt("return", TransactionState.Failed);
        case 6:
          _context15.prev = 6;
          tokenContract = new ethers.Contract(token.address, ERC20_ABI, provider);
          _context15.next = 10;
          return tokenContract.populateTransaction.approve(CurrentConfig.SWAP_ROUTER_ADDRESS, fromReadableAmount(amount, token.decimals).toString());
        case 10:
          transaction = _context15.sent;
          return _context15.abrupt("return", sendTransaction(_extends({}, transaction, {
            from: address
          })));
        case 14:
          _context15.prev = 14;
          _context15.t0 = _context15["catch"](6);
          return _context15.abrupt("return", TransactionState.Failed);
        case 17:
        case "end":
          return _context15.stop();
      }
    }, _callee15, null, [[6, 14]]);
  }));
  return _tokenTransferApproval.apply(this, arguments);
}
var getGasFee = /*#__PURE__*/function () {
  var _ref8 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
    var _rpc, provider, gasPrice;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _rpc = CurrentConfig.rpc;
          if (!_rpc) {
            _context8.next = 7;
            break;
          }
          provider = new ethers.providers.JsonRpcProvider(_rpc);
          _context8.next = 5;
          return provider.getGasPrice();
        case 5:
          gasPrice = _context8.sent;
          return _context8.abrupt("return", Number(gasPrice == null ? void 0 : gasPrice.toString()));
        case 7:
          return _context8.abrupt("return", 0);
        case 8:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function getGasFee() {
    return _ref8.apply(this, arguments);
  };
}();
var DEFAULT_GAS_PRICE = 1e9;
var getDefaultGasPrice = function getDefaultGasPrice() {
  return random(35, 45) * DEFAULT_GAS_PRICE;
};

function fromReadableAmount$1(amount, decimals) {
  var extraDigits = Math.pow(10, countDecimals(amount));
  var adjustedAmount = amount * extraDigits;
  return JSBI.divide(JSBI.multiply(JSBI.BigInt(adjustedAmount), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))), JSBI.BigInt(extraDigits));
}
function countDecimals(x) {
  if (Math.floor(x) === x) {
    return 0;
  }
  return x.toString().split('.')[1].length || 0;
}

var IV3FactoryABI = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint24",
				name: "fee",
				type: "uint24"
			},
			{
				indexed: true,
				internalType: "int24",
				name: "tickSpacing",
				type: "int24"
			}
		],
		name: "FeeAmountEnabled",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "oldOwner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "OwnerChanged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "OwnershipTransferred",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "token0",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "token1",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint24",
				name: "fee",
				type: "uint24"
			},
			{
				indexed: false,
				internalType: "int24",
				name: "tickSpacing",
				type: "int24"
			},
			{
				indexed: false,
				internalType: "address",
				name: "pool",
				type: "address"
			}
		],
		name: "PoolCreated",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint8",
				name: "feeProtocol0Old",
				type: "uint8"
			},
			{
				indexed: false,
				internalType: "uint8",
				name: "feeProtocol1Old",
				type: "uint8"
			},
			{
				indexed: false,
				internalType: "uint8",
				name: "feeProtocol0New",
				type: "uint8"
			},
			{
				indexed: false,
				internalType: "uint8",
				name: "feeProtocol1New",
				type: "uint8"
			}
		],
		name: "SetFeeProtocol",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "feeToOld",
				type: "address"
			},
			{
				indexed: false,
				internalType: "address",
				name: "feeTo",
				type: "address"
			}
		],
		name: "SetFeeTo",
		type: "event"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "tokenA",
				type: "address"
			},
			{
				internalType: "address",
				name: "tokenB",
				type: "address"
			},
			{
				internalType: "uint24",
				name: "fee",
				type: "uint24"
			}
		],
		name: "createPool",
		outputs: [
			{
				internalType: "address",
				name: "pool",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint24",
				name: "fee",
				type: "uint24"
			},
			{
				internalType: "int24",
				name: "tickSpacing",
				type: "int24"
			}
		],
		name: "enableFeeAmount",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint24",
				name: "",
				type: "uint24"
			}
		],
		name: "feeAmountTickSpacing",
		outputs: [
			{
				internalType: "int24",
				name: "",
				type: "int24"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "feeProtocol",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "feeTo",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			},
			{
				internalType: "address",
				name: "",
				type: "address"
			},
			{
				internalType: "uint24",
				name: "",
				type: "uint24"
			}
		],
		name: "getPool",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getUniswapV3PoolImplementation",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "initialize",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "parameters",
		outputs: [
			{
				internalType: "address",
				name: "factory",
				type: "address"
			},
			{
				internalType: "address",
				name: "token0",
				type: "address"
			},
			{
				internalType: "address",
				name: "token1",
				type: "address"
			},
			{
				internalType: "uint24",
				name: "fee",
				type: "uint24"
			},
			{
				internalType: "int24",
				name: "tickSpacing",
				type: "int24"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "renounceOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint8",
				name: "feeProtocol0",
				type: "uint8"
			},
			{
				internalType: "uint8",
				name: "feeProtocol1",
				type: "uint8"
			}
		],
		name: "setFeeProtocol",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "feeToArg",
				type: "address"
			}
		],
		name: "setFeeTo",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "uniswapV3PoolImplementationArg",
				type: "address"
			}
		],
		name: "setUniswapV3PoolImplementation",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "transferOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

var _excluded$2 = ["method", "data"];
var swrFetcher$1 = /*#__PURE__*/function () {
  var _ref = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(url, options) {
    var method, data, rest, _response$data, _response$data2, response;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          method = options.method, data = options.data, rest = _objectWithoutPropertiesLoose(options, _excluded$2);
          _context.prev = 1;
          _context.next = 4;
          return axios.request(_extends({
            url: url,
            method: method,
            data: data
          }, rest));
        case 4:
          response = _context.sent;
          return _context.abrupt("return", camelCaseKeys((response == null || (_response$data = response.data) == null ? void 0 : _response$data.data) || (response == null || (_response$data2 = response.data) == null ? void 0 : _response$data2.result)));
        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          throw new Error('Something went wrong');
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 8]]);
  }));
  return function swrFetcher(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var getListLiquidity = /*#__PURE__*/function () {
  var _ref2 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(address) {
    var qs;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          qs = "?limit=100&network=nos&page=1&address=" + address;
          return _context2.abrupt("return", swrFetcher$1(CurrentConfig.API_ROOT + "/api/swap/pair/apr/list" + qs, {
            method: 'GET',
            error: 'Fail to get list liquidity'
          }));
        case 2:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getListLiquidity(_x3) {
    return _ref2.apply(this, arguments);
  };
}();
//TODO:  add type
var getTokens = /*#__PURE__*/function () {
  var _ref3 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(limit) {
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", swrFetcher$1(CurrentConfig.API_ROOT + "/api/token-explorer/tokens?limit=" + limit.toString() + "&network=nos&page=1", {
            method: 'GET',
            error: 'Fail to get tokens data'
          }));
        case 1:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function getTokens(_x4) {
    return _ref3.apply(this, arguments);
  };
}();
var getPositionDetail = /*#__PURE__*/function () {
  var _ref4 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(id) {
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", swrFetcher$1(CurrentConfig.API_ROOT + "/api/swap-v3/pool/user-position/" + id, {
            method: 'GET',
            error: 'Fail to get list user positions'
          }));
        case 1:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function getPositionDetail(_x5) {
    return _ref4.apply(this, arguments);
  };
}();
function CollectFeeeById(_x6) {
  return _CollectFeeeById.apply(this, arguments);
}
function _CollectFeeeById() {
  _CollectFeeeById = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(tokenId) {
    var walletAddress, _NonfungiblePositionM, calldata, value, transaction;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          walletAddress = getWalletAddress();
          if (!(!walletAddress && CurrentWallet.type === WalletType.EXTENSION)) {
            _context5.next = 5;
            break;
          }
          _context5.next = 4;
          return geSignerAddress();
        case 4:
          walletAddress = _context5.sent;
        case 5:
          if (walletAddress) {
            _context5.next = 7;
            break;
          }
          return _context5.abrupt("return", TransactionState.Failed);
        case 7:
          // get calldata for increasing a position
          _NonfungiblePositionM = NonfungiblePositionManager.encodeCollectById(tokenId, walletAddress), calldata = _NonfungiblePositionM.calldata, value = _NonfungiblePositionM.value; // build transaction
          transaction = {
            data: calldata,
            to: CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
            value: value,
            from: walletAddress
          };
          _context5.next = 11;
          return sendTransactionGetReceipt(transaction);
        case 11:
          return _context5.abrupt("return", _context5.sent);
        case 12:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _CollectFeeeById.apply(this, arguments);
}
function increaseLiquidity(_x7, _x8, _x9, _x10, _x11, _x12) {
  return _increaseLiquidity.apply(this, arguments);
}
function _increaseLiquidity() {
  _increaseLiquidity = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(tokenId, amount0Desired, amount1Desired, amount0Min, amount1Min, deadline) {
    var walletAddress, _NonfungiblePositionM2, calldata, value, transaction;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          walletAddress = getWalletAddress();
          if (!(!walletAddress && CurrentWallet.type === WalletType.EXTENSION)) {
            _context6.next = 5;
            break;
          }
          _context6.next = 4;
          return geSignerAddress();
        case 4:
          walletAddress = _context6.sent;
        case 5:
          if (walletAddress) {
            _context6.next = 7;
            break;
          }
          return _context6.abrupt("return", TransactionState.Failed);
        case 7:
          // get calldata for increasing a position
          _NonfungiblePositionM2 = NonfungiblePositionManager.encodeIncrease(tokenId, amount0Desired, amount1Desired, amount0Min, amount1Min, deadline), calldata = _NonfungiblePositionM2.calldata, value = _NonfungiblePositionM2.value; // build transaction
          transaction = {
            data: calldata,
            to: CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
            value: value,
            from: walletAddress
          };
          _context6.next = 11;
          return sendTransactionGetReceipt(transaction);
        case 11:
          return _context6.abrupt("return", _context6.sent);
        case 12:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _increaseLiquidity.apply(this, arguments);
}
function decreaseLiquidity(_x13, _x14, _x15, _x16, _x17) {
  return _decreaseLiquidity.apply(this, arguments);
}
function _decreaseLiquidity() {
  _decreaseLiquidity = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(tokenId, liquidity, amount0Min, amount1Min, deadline) {
    var walletAddress, _NonfungiblePositionM3, calldata, value, transaction;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          walletAddress = getWalletAddress();
          if (!(!walletAddress && CurrentWallet.type === WalletType.EXTENSION)) {
            _context7.next = 5;
            break;
          }
          _context7.next = 4;
          return geSignerAddress();
        case 4:
          walletAddress = _context7.sent;
        case 5:
          if (walletAddress) {
            _context7.next = 7;
            break;
          }
          return _context7.abrupt("return", TransactionState.Failed);
        case 7:
          // get calldata for increasing a position
          _NonfungiblePositionM3 = NonfungiblePositionManager.encodeRemoveLiqidity(tokenId, liquidity, amount0Min, amount1Min, deadline, walletAddress), calldata = _NonfungiblePositionM3.calldata, value = _NonfungiblePositionM3.value; // build transaction
          transaction = {
            data: calldata,
            to: CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
            value: value,
            from: walletAddress
          };
          _context7.next = 11;
          return sendTransactionGetReceipt(transaction);
        case 11:
          return _context7.abrupt("return", _context7.sent);
        case 12:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return _decreaseLiquidity.apply(this, arguments);
}
function removePosition(_x18) {
  return _removePosition.apply(this, arguments);
}
function _removePosition() {
  _removePosition = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(tokenId) {
    var walletAddress, _NonfungiblePositionM4, calldata, value, transaction;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          walletAddress = getWalletAddress();
          if (!(!walletAddress && CurrentWallet.type === WalletType.EXTENSION)) {
            _context8.next = 5;
            break;
          }
          _context8.next = 4;
          return geSignerAddress();
        case 4:
          walletAddress = _context8.sent;
        case 5:
          if (walletAddress) {
            _context8.next = 7;
            break;
          }
          return _context8.abrupt("return", TransactionState.Failed);
        case 7:
          // get calldata for increasing a position
          _NonfungiblePositionM4 = NonfungiblePositionManager.encodeRemovePosition(tokenId), calldata = _NonfungiblePositionM4.calldata, value = _NonfungiblePositionM4.value; // build transaction
          transaction = {
            data: calldata,
            to: CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
            value: value,
            from: walletAddress
          };
          _context8.next = 11;
          return sendTransactionGetReceipt(transaction);
        case 11:
          return _context8.abrupt("return", _context8.sent);
        case 12:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return _removePosition.apply(this, arguments);
}
function addLiquidityIncludeCreatePool(_x19, _x20, _x21, _x22, _x23, _x24, _x25, _x26, _x27, _x28, _x29, _x30) {
  return _addLiquidityIncludeCreatePool.apply(this, arguments);
}
function _addLiquidityIncludeCreatePool() {
  _addLiquidityIncludeCreatePool = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(isNewPool, fee, token0, token1, amountADesired, amountBDesired, lowerTick, upperTick, amount0Min, amount1Min, currentPrice, deadline) {
    var walletAddress, _NonfungiblePositionM5, calldata, value, transaction;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          walletAddress = getWalletAddress();
          if (!(!walletAddress && CurrentWallet.type === WalletType.EXTENSION)) {
            _context9.next = 5;
            break;
          }
          _context9.next = 4;
          return geSignerAddress();
        case 4:
          walletAddress = _context9.sent;
        case 5:
          if (walletAddress) {
            _context9.next = 7;
            break;
          }
          return _context9.abrupt("return", TransactionState.Failed);
        case 7:
          // get calldata for increasing a position
          _NonfungiblePositionM5 = NonfungiblePositionManager.addCallParametersCreate(isNewPool, fee, token0, token1, amountADesired, amountBDesired, lowerTick, upperTick, amount0Min, amount1Min, currentPrice, walletAddress, deadline), calldata = _NonfungiblePositionM5.calldata, value = _NonfungiblePositionM5.value; // build transaction
          transaction = {
            data: calldata,
            to: CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
            value: value,
            from: walletAddress
          };
          _context9.next = 11;
          return sendTransactionGetReceipt(transaction);
        case 11:
          return _context9.abrupt("return", _context9.sent);
        case 12:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return _addLiquidityIncludeCreatePool.apply(this, arguments);
}
function addLiquidity(_x31) {
  return _addLiquidity.apply(this, arguments);
}
function _addLiquidity() {
  _addLiquidity = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(positionId) {
    var address, provider, positionToIncreaseBy, addLiquidityOptions, _NonfungiblePositionM6, calldata, value, transaction;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          address = getWalletAddress();
          provider = getProvider();
          if (!(!address || !provider)) {
            _context10.next = 4;
            break;
          }
          return _context10.abrupt("return", TransactionState.Failed);
        case 4:
          _context10.next = 6;
          return constructPosition(CurrencyAmount.fromRawAmount(tokenLiquidity.token0, fromReadableAmount$1(tokenLiquidity.token0Amount * tokenLiquidity.fractionToAdd, tokenLiquidity.token0.decimals)), CurrencyAmount.fromRawAmount(tokenLiquidity.token1, fromReadableAmount$1(tokenLiquidity.token1Amount * tokenLiquidity.fractionToAdd, tokenLiquidity.token1.decimals)));
        case 6:
          positionToIncreaseBy = _context10.sent;
          addLiquidityOptions = {
            deadline: Math.floor(Date.now() / 1000) + 60 * 20,
            slippageTolerance: new Percent(50, 10000),
            tokenId: positionId
          }; // get calldata for increasing a position
          _NonfungiblePositionM6 = NonfungiblePositionManager.addCallParameters(positionToIncreaseBy, addLiquidityOptions), calldata = _NonfungiblePositionM6.calldata, value = _NonfungiblePositionM6.value; // build transaction
          transaction = {
            data: calldata,
            to: CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
            value: value,
            from: address,
            maxFeePerGas: MAX_FEE_PER_GAS,
            maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS
          };
          return _context10.abrupt("return", sendTransaction(transaction));
        case 11:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return _addLiquidity.apply(this, arguments);
}
function removeLiquidity(_x32) {
  return _removeLiquidity.apply(this, arguments);
}
function _removeLiquidity() {
  _removeLiquidity = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(positionId) {
    var address, provider, currentPosition, collectOptions, removeLiquidityOptions, _NonfungiblePositionM7, calldata, value, transaction;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          address = getWalletAddress();
          provider = getProvider();
          if (!(!address || !provider)) {
            _context11.next = 4;
            break;
          }
          return _context11.abrupt("return", TransactionState.Failed);
        case 4:
          _context11.next = 6;
          return constructPosition(CurrencyAmount.fromRawAmount(tokenLiquidity.token0, fromReadableAmount$1(tokenLiquidity.token0Amount, tokenLiquidity.token0.decimals)), CurrencyAmount.fromRawAmount(tokenLiquidity.token1, fromReadableAmount$1(tokenLiquidity.token1Amount, tokenLiquidity.token1.decimals)));
        case 6:
          currentPosition = _context11.sent;
          collectOptions = {
            expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(tokenLiquidity.token0, 0),
            expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(tokenLiquidity.token1, 0),
            recipient: address
          };
          removeLiquidityOptions = {
            deadline: Math.floor(Date.now() / 1000) + 60 * 20,
            slippageTolerance: new Percent(50, 10000),
            tokenId: positionId,
            // percentage of liquidity to remove
            liquidityPercentage: new Percent(tokenLiquidity.fractionToRemove),
            collectOptions: collectOptions
          }; // get calldata for minting a position
          _NonfungiblePositionM7 = NonfungiblePositionManager.removeCallParameters(currentPosition, removeLiquidityOptions), calldata = _NonfungiblePositionM7.calldata, value = _NonfungiblePositionM7.value; // build transaction
          transaction = {
            data: calldata,
            to: CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
            value: value,
            from: address,
            maxFeePerGas: MAX_FEE_PER_GAS,
            maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS
          };
          return _context11.abrupt("return", sendTransaction(transaction));
        case 12:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return _removeLiquidity.apply(this, arguments);
}
function getPositionIds() {
  return _getPositionIds.apply(this, arguments);
}
function _getPositionIds() {
  _getPositionIds = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12() {
    var provider, address, positionContract, balance, tokenIds, i, tokenOfOwnerByIndex;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          provider = getProvider();
          address = getWalletAddress();
          if (!(!provider || !address)) {
            _context12.next = 4;
            break;
          }
          throw new Error('No provider available');
        case 4:
          positionContract = new ethers.Contract(CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, NONFUNGIBLE_POSITION_MANAGER_ABI, provider); // Get number of positions
          _context12.next = 7;
          return positionContract.balanceOf(address);
        case 7:
          balance = _context12.sent;
          // Get all positions
          tokenIds = [];
          i = 0;
        case 10:
          if (!(i < balance)) {
            _context12.next = 18;
            break;
          }
          _context12.next = 13;
          return positionContract.tokenOfOwnerByIndex(address, i);
        case 13:
          tokenOfOwnerByIndex = _context12.sent;
          tokenIds.push(tokenOfOwnerByIndex);
        case 15:
          i++;
          _context12.next = 10;
          break;
        case 18:
          return _context12.abrupt("return", tokenIds);
        case 19:
        case "end":
          return _context12.stop();
      }
    }, _callee12);
  }));
  return _getPositionIds.apply(this, arguments);
}
function getPositionInfo(_x33) {
  return _getPositionInfo.apply(this, arguments);
}
function _getPositionInfo() {
  _getPositionInfo = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(tokenId) {
    var provider, positionContract, position;
    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          provider = getProvider();
          if (provider) {
            _context13.next = 3;
            break;
          }
          throw new Error('No provider available');
        case 3:
          positionContract = new ethers.Contract(CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, NONFUNGIBLE_POSITION_MANAGER_ABI, provider);
          _context13.next = 6;
          return positionContract.positions(tokenId);
        case 6:
          position = _context13.sent;
          return _context13.abrupt("return", {
            tickLower: position.tickLower,
            tickUpper: position.tickUpper,
            liquidity: position.liquidity,
            feeGrowthInside0LastX128: position.feeGrowthInside0LastX128,
            feeGrowthInside1LastX128: position.feeGrowthInside1LastX128,
            tokensOwed0: position.tokensOwed0,
            tokensOwed1: position.tokensOwed1
          });
        case 8:
        case "end":
          return _context13.stop();
      }
    }, _callee13);
  }));
  return _getPositionInfo.apply(this, arguments);
}
function getTokenTransferApprovalPosition(_x34) {
  return _getTokenTransferApprovalPosition.apply(this, arguments);
}
function _getTokenTransferApprovalPosition() {
  _getTokenTransferApprovalPosition = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(token) {
    var provider, address, tokenContract, transaction;
    return _regeneratorRuntime().wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          provider = getProvider();
          address = getWalletAddress();
          if (!(!provider || !address)) {
            _context14.next = 5;
            break;
          }
          console.log('No Provider Found');
          return _context14.abrupt("return", TransactionState.Failed);
        case 5:
          _context14.prev = 5;
          tokenContract = new ethers.Contract(token.address, ERC20_ABI, provider);
          _context14.next = 9;
          return tokenContract.populateTransaction.approve(CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER);
        case 9:
          transaction = _context14.sent;
          return _context14.abrupt("return", sendTransaction(_extends({}, transaction, {
            from: address
          })));
        case 13:
          _context14.prev = 13;
          _context14.t0 = _context14["catch"](5);
          console.error(_context14.t0);
          return _context14.abrupt("return", TransactionState.Failed);
        case 17:
        case "end":
          return _context14.stop();
      }
    }, _callee14, null, [[5, 13]]);
  }));
  return _getTokenTransferApprovalPosition.apply(this, arguments);
}
function constructPosition(_x35, _x36) {
  return _constructPosition.apply(this, arguments);
}
function _constructPosition() {
  _constructPosition = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(token0Amount, token1Amount) {
    var poolInfo, configuredPool;
    return _regeneratorRuntime().wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          _context15.next = 2;
          return getPoolInfo(tokenLiquidity.token0, tokenLiquidity.token1, tokenLiquidity.poolFee);
        case 2:
          poolInfo = _context15.sent;
          // construct pool instance
          configuredPool = new Pool(token0Amount.currency, token1Amount.currency, poolInfo.fee, poolInfo.sqrtPriceX96.toString(), poolInfo.liquidity.toString(), poolInfo.tick); // create position using the maximum liquidity from input amounts
          return _context15.abrupt("return", Position.fromAmounts({
            pool: configuredPool,
            tickLower: nearestUsableTick(poolInfo.tick, poolInfo.tickSpacing) - poolInfo.tickSpacing * 2,
            tickUpper: nearestUsableTick(poolInfo.tick, poolInfo.tickSpacing) + poolInfo.tickSpacing * 2,
            amount0: token0Amount.quotient,
            amount1: token1Amount.quotient,
            useFullPrecision: true
          }));
        case 5:
        case "end":
          return _context15.stop();
      }
    }, _callee15);
  }));
  return _constructPosition.apply(this, arguments);
}
function mintPosition() {
  return _mintPosition.apply(this, arguments);
}
function _mintPosition() {
  _mintPosition = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16() {
    var address, provider, positionToMint, mintOptions, _NonfungiblePositionM8, calldata, value, transaction;
    return _regeneratorRuntime().wrap(function _callee16$(_context16) {
      while (1) switch (_context16.prev = _context16.next) {
        case 0:
          address = getWalletAddress();
          provider = getProvider();
          if (!(!address || !provider)) {
            _context16.next = 4;
            break;
          }
          return _context16.abrupt("return", TransactionState.Failed);
        case 4:
          _context16.next = 6;
          return constructPosition(CurrencyAmount.fromRawAmount(tokenLiquidity.token0, fromReadableAmount$1(tokenLiquidity.token0Amount, tokenLiquidity.token0.decimals)), CurrencyAmount.fromRawAmount(tokenLiquidity.token1, fromReadableAmount$1(tokenLiquidity.token1Amount, tokenLiquidity.token1.decimals)));
        case 6:
          positionToMint = _context16.sent;
          mintOptions = {
            recipient: address,
            deadline: Math.floor(Date.now() / 1000) + 60 * 20,
            slippageTolerance: new Percent(50, 10000)
          }; // get calldata for minting a position
          _NonfungiblePositionM8 = NonfungiblePositionManager.addCallParameters(positionToMint, mintOptions), calldata = _NonfungiblePositionM8.calldata, value = _NonfungiblePositionM8.value; // build transaction
          transaction = {
            data: calldata,
            to: CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
            value: value,
            from: address,
            maxFeePerGas: MAX_FEE_PER_GAS,
            maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS
          };
          return _context16.abrupt("return", sendTransaction(transaction));
        case 11:
        case "end":
          return _context16.stop();
      }
    }, _callee16);
  }));
  return _mintPosition.apply(this, arguments);
}
function getEarnedFee(_x37) {
  return _getEarnedFee.apply(this, arguments);
}
function _getEarnedFee() {
  _getEarnedFee = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17(tokenId) {
    var walletAddress, provider, quoteContract, transaction;
    return _regeneratorRuntime().wrap(function _callee17$(_context17) {
      while (1) switch (_context17.prev = _context17.next) {
        case 0:
          walletAddress = getWalletAddress();
          if (!(!walletAddress && CurrentWallet.type === WalletType.EXTENSION)) {
            _context17.next = 5;
            break;
          }
          _context17.next = 4;
          return geSignerAddress();
        case 4:
          walletAddress = _context17.sent;
        case 5:
          provider = getProvider();
          if (!(!provider || !walletAddress)) {
            _context17.next = 8;
            break;
          }
          throw new Error('No provider or address');
        case 8:
          quoteContract = new ethers.Contract(CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, INonfungiblePositionManager, provider);
          _context17.next = 11;
          return quoteContract.connect(provider).callStatic.collect({
            tokenId: tokenId,
            recipient: walletAddress,
            amount0Max: MaxUint128,
            amount1Max: MaxUint128
          });
        case 11:
          transaction = _context17.sent;
          return _context17.abrupt("return", [transaction.amount0.toString(), transaction.amount1.toString()]);
        case 13:
        case "end":
          return _context17.stop();
      }
    }, _callee17);
  }));
  return _getEarnedFee.apply(this, arguments);
}
function getPoolAddress(_x38, _x39, _x40) {
  return _getPoolAddress.apply(this, arguments);
}
function _getPoolAddress() {
  _getPoolAddress = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee18(token0, token1, fee) {
    var walletAddress, provider, factoryContract, transaction;
    return _regeneratorRuntime().wrap(function _callee18$(_context18) {
      while (1) switch (_context18.prev = _context18.next) {
        case 0:
          walletAddress = getWalletAddress();
          if (!(!walletAddress && CurrentWallet.type === WalletType.EXTENSION)) {
            _context18.next = 5;
            break;
          }
          _context18.next = 4;
          return geSignerAddress();
        case 4:
          walletAddress = _context18.sent;
        case 5:
          provider = getProvider();
          if (!(!provider || !walletAddress)) {
            _context18.next = 8;
            break;
          }
          throw new Error('No provider or address');
        case 8:
          factoryContract = new ethers.Contract(CurrentConfig.POOL_FACTORY_CONTRACT_ADDRESS, IV3FactoryABI, provider);
          _context18.next = 11;
          return factoryContract.connect(provider).callStatic.getPool(token0, token1, fee);
        case 11:
          transaction = _context18.sent;
          return _context18.abrupt("return", transaction);
        case 13:
        case "end":
          return _context18.stop();
      }
    }, _callee18);
  }));
  return _getPoolAddress.apply(this, arguments);
}
function getPoolFromAddress(_x41) {
  return _getPoolFromAddress.apply(this, arguments);
}
function _getPoolFromAddress() {
  _getPoolFromAddress = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee19(poolAddress) {
    var walletAddress, provider, poolContract, contract;
    return _regeneratorRuntime().wrap(function _callee19$(_context19) {
      while (1) switch (_context19.prev = _context19.next) {
        case 0:
          walletAddress = getWalletAddress();
          if (!(!walletAddress && CurrentWallet.type === WalletType.EXTENSION)) {
            _context19.next = 5;
            break;
          }
          _context19.next = 4;
          return geSignerAddress();
        case 4:
          walletAddress = _context19.sent;
        case 5:
          provider = getProvider();
          if (!(!provider || !walletAddress)) {
            _context19.next = 8;
            break;
          }
          throw new Error('No provider or address');
        case 8:
          poolContract = new ethers.Contract(poolAddress, IV3PoolABI.abi, provider);
          _context19.next = 11;
          return poolContract.connect(provider);
        case 11:
          contract = _context19.sent;
          return _context19.abrupt("return", contract);
        case 13:
        case "end":
          return _context19.stop();
      }
    }, _callee19);
  }));
  return _getPoolFromAddress.apply(this, arguments);
}
function getPositionImage(_x42) {
  return _getPositionImage.apply(this, arguments);
}
function _getPositionImage() {
  _getPositionImage = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee20(tokenId) {
    var walletAddress, provider, quoteContract, transaction;
    return _regeneratorRuntime().wrap(function _callee20$(_context20) {
      while (1) switch (_context20.prev = _context20.next) {
        case 0:
          walletAddress = getWalletAddress();
          if (!(!walletAddress && CurrentWallet.type === WalletType.EXTENSION)) {
            _context20.next = 5;
            break;
          }
          _context20.next = 4;
          return geSignerAddress();
        case 4:
          walletAddress = _context20.sent;
        case 5:
          provider = getProvider();
          if (!(!provider || !walletAddress)) {
            _context20.next = 8;
            break;
          }
          throw new Error('No provider or address');
        case 8:
          quoteContract = new ethers.Contract(CurrentConfig.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, INonfungiblePositionManager, provider);
          _context20.next = 11;
          return quoteContract.connect(provider).callStatic.tokenURI(tokenId);
        case 11:
          transaction = _context20.sent;
          return _context20.abrupt("return", transaction);
        case 13:
        case "end":
          return _context20.stop();
      }
    }, _callee20);
  }));
  return _getPositionImage.apply(this, arguments);
}

export { ADDRESS_ZERO, ChainId, CollectFeeeById, CurrencyAmount, CurrentConfig, CurrentWallet, DEFAULT_GAS_PRICE, ERC20_ABI, Environment, FACTORY_ADDRESS, FeeAmount, Fraction, FullMath, LiquidityMath, MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS, MaxUint128, MaxUint256, NONFUNGIBLE_POSITION_MANAGER_ABI, NativeCurrency, NativeCurrencyName, NoTickDataProvider, NonfungiblePositionManager, POOL_INIT_CODE_HASH, Percent, Pool, Position, Price, Rounding, Route, SUPPORTED_CHAINS, SelfPermit, SqrtPriceMath, SwapMath, SwapQuoter, SwapRouter, TICK_SPACINGS, TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER, Tick, TickList, TickListDataProvider, TickMath, Token, Trade, TradeType, TransactionState, WETH_ABI, WalletType, addLiquidity, addLiquidityIncludeCreatePool, camelCaseKeys, changeWallet, choiceConFig, computePoolAddress, connectBrowserExtensionWallet, constructPosition, createTrade, decreaseLiquidity, displayTrade, encodePath, encodeRouteToPath, executeTrade, executeTradeSlippage, formatPriceToPriceSqrt, fromReadableAmount, geSignerAddress, getBestRouteExactIn, getBestRouteExactOut, getCurrencyApproveRouter, getCurrencyBalance, getDefaultGasPrice, getEarnedFee, getGasFee, getListLiquidity, getListRoute, getMainnetProvider, getPoolAddress, getPoolFromAddress, getPoolInfo, getPoolInfoByToken, getPositionDetail, getPositionIds, getPositionImage, getPositionInfo, getProvider, getSwapRoutesV2, getSwapTokensV1, getTokenTransferApprovalPosition, getTokenTransferApprovalSwap, getTokens, getWalletAddress, gettokenIndex, increaseLiquidity, isSorted, mainnetConfig, mintPosition, mostSignificantBit, nearestUsableTick, refreshProvider, removeLiquidity, removePosition, resetTOkenSwap, sendTransaction, sendTransactionGetReceipt, sendTransactionViaExtensionGetReceipt, setTOkenIn, setTOkenOut, setTOkenSwap, setTokens, sortedInsert, swrFetcher, testnetConfig, toHex, toReadableAmount, tokenLiquidity, tokenSwap, tokenTransferApproval, tradeComparator, unwrapETH, validateAndParseAddress, wrapETH };
//# sourceMappingURL=trustless-swap-sdk.esm.js.map
