"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var natural = require("natural");

var Analyzer = require("natural").SentimentAnalyzer;

var stemmer = require("natural").PorterStemmer;

var analyzer = new Analyzer("English", stemmer, "afinn");
var tokenizer = new natural.WordTokenizer();
/** analysis good words and bad words based on the text */

function naturalAnalyseText(_x) {
  return _naturalAnalyseText.apply(this, arguments);
}

function _naturalAnalyseText() {
  _naturalAnalyseText = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(text) {
    var words;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            //return an array of words from the text
            words = tokenizer.tokenize(text); //return the sentiment result as an integer (positive is good; negative is bad)
            //console.log(analyzer.getSentiment(words));

            return _context.abrupt("return", analyzer.getSentiment(words));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _naturalAnalyseText.apply(this, arguments);
}

module.exports = naturalAnalyseText;
//# sourceMappingURL=naturalAnalysis.js.map