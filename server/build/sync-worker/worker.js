"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _require = require("../libs/api"),
    getRules = _require.getRules,
    addRules = _require.addRules;

var registerDatabase = require("../libs/database/registerDatabase");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

function run() {
  var app = {};
  registerDatabase(app);
  var worker = setInterval( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var allStream, allRules, missingRules, _iterator, _step, stream, _iterator2, _step2, rule, added;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!app.db) {
              _context.next = 15;
              break;
            }

            _context.next = 3;
            return app.db.Stream.find({});

          case 3:
            allStream = _context.sent;
            _context.next = 6;
            return getRules();

          case 6:
            allRules = _context.sent;
            allRules = allRules.data ? allRules.data.map(function (r) {
              return r.value;
            }) : [];
            missingRules = [];
            _iterator = _createForOfIteratorHelper(allStream);

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                stream = _step.value;
                _iterator2 = _createForOfIteratorHelper(stream.rules);

                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    rule = _step2.value;

                    if (!allRules.includes(rule.value)) {
                      missingRules.push({
                        value: rule.value
                      });
                    }
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            _context.next = 13;
            return addRules(missingRules);

          case 13:
            added = _context.sent;

            if (missingRules.length > 0) {
              console.log(missingRules);
            }

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })), 2000);
}

run();
//# sourceMappingURL=worker.js.map