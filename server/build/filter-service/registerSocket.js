"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _require = require("../libs/api"),
    searchTweets = _require.searchTweets,
    deleteRules = _require.deleteRules;

function registerSocket(server, app) {
  var io = require("socket.io")(server);

  console.log("---- Connecting Socket ----");
  app.io = io;
  app.clientConnectionIds = new Set();
  var connections = new Set();
  io.on("connection", function (socket) {
    connections.add(socket);
    app.clientConnectionIds.add(socket.id);
    console.log("Socket ".concat(socket.id, " connected."));

    try {
      socket.on("streaming", /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(keywords) {
          var ownRules, Stream, newStream;
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return searchTweets(keywords);

                case 2:
                  ownRules = _context.sent;
                  Stream = app.db.Stream;
                  newStream = new Stream({
                    socketId: socket.id,
                    rules: ownRules
                  });
                  _context.next = 7;
                  return newStream.save();

                case 7:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
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
                  deleteRules(deletedStream.rules).then(function (res) {
                    console.log("To delete ".concat(deletedStream.socketId));
                    /** Delete rules in Twitter */

                    console.log("Socket ".concat(socket.id, " disconnected"));
                  });
                });

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      })));
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
}

module.exports = registerSocket;
//# sourceMappingURL=registerSocket.js.map