require('dotenv').config();

import fs from 'fs';
import Twitter from 'twitter';
import sentiment from 'sentiment';
import csvWriter from 'csv-write-stream';

// Create a directory where to write results as csv
fs.mkdirSync(process.cwd() + '/out');

const SEARCH_PHRASE_INDEX = 2;

const searchPhrase = process.argv[SEARCH_PHRASE_INDEX];

if (searchPhrase === undefined) {
  throw new Error('Please search something using a command line argument!');
}

const twitter = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

console.log(`Searching for ${searchPhrase}`);

function getMeanSentimentScore(tweets) {
  return tweets.statuses
      .map(tweet => tweet.text)
      .reduce((avgScore, text) => {
        return (avgScore + sentiment(text).score)/2;
      }, 0);
}

twitter.get('search/tweets', {q: 'elmlang'}, function(error, tweets, response) {
  const writer = csvWriter({
    headers: ['search_phrase', 'mean_sentiment_score']
  });
  writer.pipe(fs.createWriteStream(`out/${searchPhrase}.csv`));
  writer.write([searchPhrase, getMeanSentimentScore(tweets)]);
  writer.end();
  console.log(getMeanSentimentScore(tweets));
});