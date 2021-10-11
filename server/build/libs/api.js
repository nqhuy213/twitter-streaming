"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/** This module is to integrate with Twitter API */
var axios = require("axios")["default"];

var needle = require("needle");

var _require = require("../libs/utils"),
    rulesConstructor = _require.rulesConstructor;

var twitterStreamUrl = "https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics";
var twitterStreamRules = "https://api.twitter.com/2/tweets/search/stream/rules";
/**Add rules into Twitter API, ignore existing rules */

var getMyOwnRules = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(keywords) {
    var existRules, _rulesConstructor, _rulesConstructor2, toAddRules, myRules, ownRules;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return getRules();

          case 3:
            existRules = _context.sent;
            existRules = existRules.data ? existRules.data : [];
            /** Add non-existing rules */

            _rulesConstructor = rulesConstructor(keywords, existRules), _rulesConstructor2 = (0, _slicedToArray2["default"])(_rulesConstructor, 2), toAddRules = _rulesConstructor2[0], myRules = _rulesConstructor2[1];
            ownRules = addRules(toAddRules).then(function (res) {
              if (res.data !== undefined) {
                myRules = [].concat((0, _toConsumableArray2["default"])(myRules), (0, _toConsumableArray2["default"])(res.data));
                return myRules;
              }
            })["catch"](function (err) {
              return console.log(err);
            });
            return _context.abrupt("return", ownRules);

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            throw _context.t0;

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 10]]);
  }));

  return function getMyOwnRules(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getStream = function getStream() {
  var stream = needle.get(twitterStreamUrl, {
    headers: {
      Authorization: "Bearer ".concat(process.env.TWITTER_TOKEN)
    }
  });
  return stream;
};

var addRules = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(rules) {
    var body, response;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            if (!(rules.length > 0)) {
              _context2.next = 9;
              break;
            }

            body = {
              add: rules
            };
            _context2.next = 5;
            return twitterApiCall("POST", twitterStreamRules, null, body);

          case 5:
            response = _context2.sent;
            return _context2.abrupt("return", response);

          case 9:
            return _context2.abrupt("return", {
              data: []
            });

          case 10:
            _context2.next = 15;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](0);
            throw _context2.t0;

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 12]]);
  }));

  return function addRules(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var deleteRules = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(rules) {
    var existedRules, values, ids, _iterator, _step, rule, body, response;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return getRules();

          case 2:
            existedRules = _context3.sent;

            if (!(existedRules.data !== undefined)) {
              _context3.next = 22;
              break;
            }

            existedRules = existedRules.data;
            values = rules.map(function (rule) {
              return rule.value;
            });
            ids = [];
            _iterator = _createForOfIteratorHelper(existedRules);

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                rule = _step.value;

                if (values.includes(rule.value)) {
                  ids.push(rule.id);
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            body = {
              "delete": {
                ids: ids
              }
            };
            _context3.prev = 10;
            _context3.next = 13;
            return twitterApiCall("POST", twitterStreamRules, null, body);

          case 13:
            response = _context3.sent;
            return _context3.abrupt("return", response);

          case 17:
            _context3.prev = 17;
            _context3.t0 = _context3["catch"](10);
            throw _context3.t0;

          case 20:
            _context3.next = 23;
            break;

          case 22:
            return _context3.abrupt("return", {
              message: "Nothing to delete!"
            });

          case 23:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[10, 17]]);
  }));

  return function deleteRules(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var getRules = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var response;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return twitterApiCall("GET", twitterStreamRules);

          case 3:
            response = _context4.sent;
            return _context4.abrupt("return", response);

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            throw _context4.t0;

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 7]]);
  }));

  return function getRules() {
    return _ref4.apply(this, arguments);
  };
}();

var twitterApiCall = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var method,
        url,
        params,
        body,
        options,
        response,
        _args5 = arguments;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            method = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : "GET";
            url = _args5.length > 1 ? _args5[1] : undefined;
            params = _args5.length > 2 ? _args5[2] : undefined;
            body = _args5.length > 3 ? _args5[3] : undefined;
            options = {
              method: method,
              url: url,
              params: params,
              data: body,
              headers: {
                Authorization: "Bearer ".concat(process.env.TWITTER_TOKEN),
                "Content-Type": "application/json"
              }
            };
            _context5.prev = 5;
            _context5.next = 8;
            return axios.request(options);

          case 8:
            response = _context5.sent;
            return _context5.abrupt("return", response.data);

          case 12:
            _context5.prev = 12;
            _context5.t0 = _context5["catch"](5);
            throw _context5.t0;

          case 15:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[5, 12]]);
  }));

  return function twitterApiCall() {
    return _ref5.apply(this, arguments);
  };
}(); //delete all the rules in twitter


var deleteAllRules = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    var existedRules, ids, _iterator2, _step2, rule, body, response;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return getRules();

          case 2:
            existedRules = _context6.sent;

            if (!(existedRules.meta.result_count > 0)) {
              _context6.next = 19;
              break;
            }

            existedRules = existedRules.data;
            ids = [];
            _iterator2 = _createForOfIteratorHelper(existedRules);

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                rule = _step2.value;
                ids.push(rule.id);
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }

            body = {
              "delete": {
                ids: ids
              }
            };
            _context6.prev = 9;
            _context6.next = 12;
            return twitterApiCall("POST", twitterStreamRules, null, body);

          case 12:
            response = _context6.sent;
            return _context6.abrupt("return", response);

          case 16:
            _context6.prev = 16;
            _context6.t0 = _context6["catch"](9);
            throw _context6.t0;

          case 19:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[9, 16]]);
  }));

  return function deleteAllRules() {
    return _ref6.apply(this, arguments);
  };
}();

module.exports = {
  getMyOwnRules: getMyOwnRules,
  getStream: getStream,
  getRules: getRules,
  deleteRules: deleteRules,
  addRules: addRules,
  deleteAllRules: deleteAllRules
};
//# sourceMappingURL=api.js.map