"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var io = require("socket.io-client");

function connectToServer(url, app) {
  var socket = io(url);
  socket.on("connect", function () {
    console.log("Stream socket connected");
  });
  socket.on("data", /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
      var matchingRules, allStream, _iterator, _step, stream, _iterator2, _step2, streamRule;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              /** Handle incoming tweet */
              matchingRules = data.matching_rules.map(function (r) {
                return r.id;
              });
              /** Query database stream that has matching rules */

              _context.next = 3;
              return app.db.Stream.find({
                socketId: {
                  $in: (0, _toConsumableArray2["default"])(app.clientConnectionIds)
                }
              });

            case 3:
              allStream = _context.sent;
              console.log(allStream);
              _iterator = _createForOfIteratorHelper(allStream);
              _context.prev = 6;

              _iterator.s();

            case 8:
              if ((_step = _iterator.n()).done) {
                _context.next = 31;
                break;
              }

              stream = _step.value;
              _iterator2 = _createForOfIteratorHelper(stream.rules);
              _context.prev = 11;

              _iterator2.s();

            case 13:
              if ((_step2 = _iterator2.n()).done) {
                _context.next = 21;
                break;
              }

              streamRule = _step2.value;

              if (!matchingRules.includes(streamRule.id)) {
                _context.next = 19;
                break;
              }

              /** Send data to that streaming client socket */
              console.log(data);
              app.io.to(stream.socketId).emit("data", data);
              return _context.abrupt("break", 21);

            case 19:
              _context.next = 13;
              break;

            case 21:
              _context.next = 26;
              break;

            case 23:
              _context.prev = 23;
              _context.t0 = _context["catch"](11);

              _iterator2.e(_context.t0);

            case 26:
              _context.prev = 26;

              _iterator2.f();

              return _context.finish(26);

            case 29:
              _context.next = 8;
              break;

            case 31:
              _context.next = 36;
              break;

            case 33:
              _context.prev = 33;
              _context.t1 = _context["catch"](6);

              _iterator.e(_context.t1);

            case 36:
              _context.prev = 36;

              _iterator.f();

              return _context.finish(36);

            case 39:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[6, 33, 36, 39], [11, 23, 26, 29]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  socket.on("disconnect", function () {
    console.log("Disconnected from Stream service.");
  });
}

module.exports = connectToServer;
//# sourceMappingURL=client.js.map