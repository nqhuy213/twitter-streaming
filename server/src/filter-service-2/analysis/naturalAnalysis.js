var natural = require("natural");
const Analyzer = require("natural").SentimentAnalyzer;
const stemmer = require("natural").PorterStemmer;
const analyzer = new Analyzer("English", stemmer, "afinn");
const tokenizer = new natural.WordTokenizer();

/** analysis good words and bad words based on the text */
async function naturalAnalyseText(text) {
  //return an array of words from the text
  const words = tokenizer.tokenize(text);
  //return the sentiment result as an integer (positive is good; negative is bad)
  //console.log(analyzer.getSentiment(words));
  return analyzer.getSentiment(words);
}

module.exports = naturalAnalyseText;
