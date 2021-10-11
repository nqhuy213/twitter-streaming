"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _require = require("../../libs/api"),
    getMyOwnRules = _require.getMyOwnRules,
    deleteRules = _require.deleteRules;

var getRedisKey = require("../redis/getRedisKey"); //global set


var connections = new Set();
/** Socket to handle incoming connections from clients.
 * Create a socket server that receive streaming event
 * from clients and handle logic.
 */

function createSocketServer(server, app) {
  var io = require("socket.io")(server);

  console.log("---- Creating Socket Server ----");
  app.io = io;
  app.clientConnectionIds = new Set();
  console.log("---- Socket server created ----");
  io.on("connection", function (socket) {
    connections.add(socket);
    app.clientConnectionIds.add(socket.id);
    console.log("Socket ".concat(socket.id, " connected."));
    /** Send client ID along with the keywords */

    socket.on("streaming", /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
        var clientId, keywords, ownRules, Stream, newStream, history, newHistory;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                clientId = _ref.clientId, keywords = _ref.keywords;

                /** Flush all history from the redis client */
                app.redisClient.del(getRedisKey(clientId));
                /** Store socket and keywords in db */

                _context.next = 4;
                return getMyOwnRules(keywords);

              case 4:
                ownRules = _context.sent;
                Stream = app.db.Stream;
                newStream = new Stream({
                  socketId: socket.id,
                  rules: ownRules,
                  clientId: clientId
                });
                _context.next = 9;
                return newStream.save();

              case 9:
                _context.next = 11;
                return app.db.History.findOne({
                  clientId: clientId,
                  rules: keywords.map(function (keyword) {
                    return keyword + " lang:en";
                  })
                });

              case 11:
                history = _context.sent;

                if (!history) {
                  _context.next = 18;
                  break;
                }

                history.rules = (0, _toConsumableArray2["default"])(new Set([].concat((0, _toConsumableArray2["default"])(history.rules), (0, _toConsumableArray2["default"])(keywords.map(function (keyword) {
                  return keyword + " lang:en";
                })))));
                _context.next = 16;
                return history.save();

              case 16:
                _context.next = 21;
                break;

              case 18:
                /** Not exists, create new one */
                newHistory = new app.db.History({
                  clientId: clientId,
                  rules: keywords.map(function (keyword) {
                    return keyword + " lang:en";
                  })
                });
                _context.next = 21;
                return newHistory.save();

              case 21:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
    socket.on("disconnect", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              connections["delete"](socket);
              app.clientConnectionIds["delete"](socket.id);
              /** Delete in database */

              app.db.Stream.findOneAndDelete({
                socketId: socket.id
              }).then(function (deletedStream) {
                if (deletedStream !== null) {
                  deleteRules(deletedStream.rules).then(function (res) {
                    console.log("To delete ".concat(deletedStream.socketId));
                    /** Delete rules in Twitter */

                    console.log("Socket ".concat(socket.id, " disconnected"));
                  })["catch"](function (err) {
                    throw err;
                  });
                }
              });

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
    socket.on("deleteRules", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              /** Delete in database */
              app.db.Stream.findOne({
                socketId: socket.id
              }).then(function (stream) {
                if (stream.rules !== []) {
                  deleteRules(stream.rules).then(function (res) {
                    if (!res.message) {
                      console.log("Delete rules!");
                    }
                  });
                }
              })["catch"](function (err) {
                console.log(err);
              });

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
  });
}

function deregisterAllSockets() {
  if (connections.size > 0) {
    console.log("---- Deregister all sockets ----");

    var _iterator = _createForOfIteratorHelper(connections),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var socket = _step.value;
        socket.disconnect();
        connections["delete"](socket);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
}

module.exports = {
  createSocketServer: createSocketServer,
  deregisterAllSockets: deregisterAllSockets
};
//# sourceMappingURL=createSocketServer.js.map