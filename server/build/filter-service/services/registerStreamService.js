"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var io = require("socket.io-client");

var naturalAnalyseText = require("../analysis/naturalAnalysis");

function registerStreamService(url, app) {
  var socket = io(url);
  socket.on("connect", function () {
    console.log("Stream socket connected");
  });
  socket.on("connect_failed", function () {
    console.log("Connection Failed");
  });
  socket.on("data", /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data) {
      var matchingRules, allStream, _iterator, _step, _loop;

      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              /** Handle incoming tweet */
              matchingRules = data.matching_rules.map(function (r) {
                return r.id;
              });
              /** Query database stream that has matching rules */

              _context2.next = 3;
              return app.db.Stream.find({
                socketId: {
                  $in: (0, _toConsumableArray2["default"])(app.clientConnectionIds)
                }
              });

            case 3:
              allStream = _context2.sent;
              _iterator = _createForOfIteratorHelper(allStream);

              try {
                _loop = function _loop() {
                  var stream = _step.value;

                  var _iterator2 = _createForOfIteratorHelper(stream.rules),
                      _step2;

                  try {
                    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                      var streamRule = _step2.value;

                      if (matchingRules.includes(streamRule.id)) {
                        /** Natural analysis is here */

                        /** Send data to that streaming client socket */
                        // let sentimentData = await naturalAnalyseText(data.data.text);

                        /** Save historical data into database */
                        naturalAnalyseText(data.data.text).then( /*#__PURE__*/function () {
                          var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(sentimentData) {
                            var sentiment;
                            return _regenerator["default"].wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    sentiment = {
                                      tweetId: data.data.id,
                                      // text:
                                      sentimentData: sentimentData,
                                      createdTime: new Date(data.data.created_at).getTime()
                                    };
                                    /** Updating history data in database */

                                    app.db.History.updateOne({
                                      clientId: stream.clientId,
                                      rules: {
                                        $all: stream.rules.map(function (rule) {
                                          return rule.value;
                                        }),
                                        $size: stream.rules.length
                                      }
                                    }, {
                                      $push: {
                                        data: sentiment
                                      }
                                    }).then(function () {
                                      app.io.to(stream.socketId).emit("data", {
                                        data: data,
                                        sentiment: sentiment
                                      });
                                    });

                                  case 2:
                                  case "end":
                                    return _context.stop();
                                }
                              }
                            }, _callee);
                          }));

                          return function (_x2) {
                            return _ref2.apply(this, arguments);
                          };
                        }());
                        break;
                      }
                    }
                  } catch (err) {
                    _iterator2.e(err);
                  } finally {
                    _iterator2.f();
                  }
                };

                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  _loop();
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  socket.on("disconnect", function (reason) {
    console.log("Disconnected from Stream service.");
  });
}

module.exports = registerStreamService;
//# sourceMappingURL=registerStreamService.js.map