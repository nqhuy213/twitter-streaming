"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _require = require("../../libs/api"),
    getMyOwnRules = _require.getMyOwnRules,
    getRules = _require.getRules,
    deleteRules = _require.deleteRules,
    addRules = _require.addRules;

var _require2 = require("../../libs/utils"),
    successResponse = _require2.successResponse,
    errorResponse = _require2.errorResponse;

var _require3 = require("uuid"),
    uuidv4 = _require3.v4;

var getRedisKey = require("../redis/getRedisKey");

var Controller = function Controller(app) {
  var _this = this;

  (0, _classCallCheck2["default"])(this, Controller);
  (0, _defineProperty2["default"])(this, "searchTweets", /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
      var _req$body, keywords, socket, ownRules, newStream;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _req$body = req.body, keywords = _req$body.keywords, socket = _req$body.socket; // console.log(keywords);

              _context.next = 4;
              return getMyOwnRules(keywords);

            case 4:
              ownRules = _context.sent;

              /** Store the socket with the specific rules */
              newStream = new _this.app.db.Stream({
                socket: socket,
                rules: ownRules
              });
              _context.next = 8;
              return newStream.save();

            case 8:
              successResponse(res, {
                ownRules: ownRules
              });
              _context.next = 14;
              break;

            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](0);
              errorResponse(res, 500, _context.t0.message);

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 11]]);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
  (0, _defineProperty2["default"])(this, "getStreamRules", /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
      var rules;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return getRules();

            case 3:
              rules = _context2.sent;
              successResponse(res, {
                results: rules.data ? rules.data : []
              });
              _context2.next = 10;
              break;

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              errorResponse(res, 500, _context2.t0.message);

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 7]]);
    }));

    return function (_x4, _x5, _x6) {
      return _ref2.apply(this, arguments);
    };
  }());
  (0, _defineProperty2["default"])(this, "addStreamRules", /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
      var rules, response;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              try {
                rules = req.body.rules;
                response = addRules(rules);
                successResponse(res, {
                  add: response
                });
              } catch (error) {
                errorResponse(res, 500, error.message);
              }

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x7, _x8, _x9) {
      return _ref3.apply(this, arguments);
    };
  }());
  (0, _defineProperty2["default"])(this, "deleteStreamRules", /*#__PURE__*/function () {
    var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
      var rules, response;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              rules = req.body.rules;
              _context4.next = 4;
              return deleteRules(rules);

            case 4:
              response = _context4.sent;
              successResponse(res, {
                deleted: response
              });
              _context4.next = 11;
              break;

            case 8:
              _context4.prev = 8;
              _context4.t0 = _context4["catch"](0);
              errorResponse(res, 500, _context4.t0.message);

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 8]]);
    }));

    return function (_x10, _x11, _x12) {
      return _ref4.apply(this, arguments);
    };
  }());
  (0, _defineProperty2["default"])(this, "getUserId", function (req, res, next) {
    try {
      //create uuid and send back to client
      return res.status(200).send(uuidv4());
    } catch (err) {
      //if error
      return res.status(400).send({
        message: "Failed to create UUID",
        error: true
      });
    }
  });
  (0, _defineProperty2["default"])(this, "getAllRules", /*#__PURE__*/function () {
    var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
      var uuid, redisKey;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              uuid = req.query.uuid; //redis key

              redisKey = getRedisKey(uuid); //try get data from redis

              return _context6.abrupt("return", _this.app.redisClient.get(redisKey, /*#__PURE__*/function () {
                var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(err, result) {
                  var resultJSON, data;
                  return _regenerator["default"].wrap(function _callee5$(_context5) {
                    while (1) {
                      switch (_context5.prev = _context5.next) {
                        case 0:
                          if (!result) {
                            _context5.next = 5;
                            break;
                          }

                          resultJSON = JSON.parse(result);
                          return _context5.abrupt("return", res.status(200).json(resultJSON));

                        case 5:
                          _context5.next = 7;
                          return _this.app.db.History.find({
                            clientId: uuid
                          });

                        case 7:
                          data = _context5.sent;

                          if (!(data.length > 0)) {
                            _context5.next = 13;
                            break;
                          }

                          _this.app.redisClient.setex(redisKey, 3600, JSON.stringify({
                            source: "Redis Cache",
                            clientId: data[0].clientId,
                            rules: data.map(function (data) {
                              return {
                                label: data.rules.map(function (data) {
                                  return data.replace(" lang:en", " ");
                                }),
                                value: data.rules
                              };
                            })
                          }));

                          return _context5.abrupt("return", res.status(200).json({
                            source: "MongoDB",
                            clientId: data[0].clientId,
                            rules: data.map(function (data) {
                              return {
                                label: data.rules.map(function (data) {
                                  return data.replace(" lang:en", " ");
                                }),
                                value: data.rules
                              };
                            })
                          }));

                        case 13:
                          res.status(200).json({
                            source: null,
                            rules: []
                          });

                        case 14:
                        case "end":
                          return _context5.stop();
                      }
                    }
                  }, _callee5);
                }));

                return function (_x16, _x17) {
                  return _ref6.apply(this, arguments);
                };
              }()));

            case 3:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x13, _x14, _x15) {
      return _ref5.apply(this, arguments);
    };
  }());
  (0, _defineProperty2["default"])(this, "getTweets", /*#__PURE__*/function () {
    var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
      var uuid, rules, redisKey;
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              //uuid
              uuid = req.query.uuid;
              rules = req.query.rules; //redis key

              redisKey = getRedisKey("".concat(uuid, "-").concat(rules));
              console.log(rules.split(",")); //try get data from redis

              return _context8.abrupt("return", _this.app.redisClient.get(redisKey, /*#__PURE__*/function () {
                var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(err, result) {
                  var resultJSON, data;
                  return _regenerator["default"].wrap(function _callee7$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          if (!result) {
                            _context7.next = 5;
                            break;
                          }

                          resultJSON = JSON.parse(result);
                          return _context7.abrupt("return", res.status(200).json(resultJSON));

                        case 5:
                          _context7.next = 7;
                          return _this.app.db.History.find({
                            clientId: uuid,
                            rules: rules.split(",")
                          });

                        case 7:
                          data = _context7.sent;
                          console.log(data);

                          if (data.length > 0) {
                            _this.app.redisClient.setex(redisKey, 3600, JSON.stringify({
                              source: "Redis Cache",
                              data: data
                            }));
                          }

                          return _context7.abrupt("return", res.status(200).json({
                            source: "MongoDB",
                            data: data
                          }));

                        case 11:
                        case "end":
                          return _context7.stop();
                      }
                    }
                  }, _callee7);
                }));

                return function (_x21, _x22) {
                  return _ref8.apply(this, arguments);
                };
              }()));

            case 5:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));

    return function (_x18, _x19, _x20) {
      return _ref7.apply(this, arguments);
    };
  }());
  this.app = app;
};

module.exports = Controller;
//# sourceMappingURL=index.js.map