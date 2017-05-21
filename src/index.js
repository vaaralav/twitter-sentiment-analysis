require('dotenv').config();

import fs from 'fs';
import Twitter from 'twitter';
import sentiment from 'sentiment';
import csvWriter from 'csv-write-stream';
import uuid from 'uuid';

// Create a directory where to write results as csv
try {
  fs.mkdirSync(process.cwd() + '/out');
} catch(err) {
  if (err.code !== 'EEXIST') {
    throw err;
  }
}

const SEARCH_PHRASE_INDEX = 2;
const CSV_HEADERS = [
  'search_phrase',
  'mean_sentiment_score',
  'max_sentiment_score',
  'min_sentiment_score',
  'n'
];
const INITIAL_ANALYSIS = {
  mean: 0,
  max: 0,
  min: 0
};

if (process.argv.length <= SEARCH_PHRASE_INDEX) {
  throw new Error('Please search for something using a command line argument!');
}
if (process.argv.length > SEARCH_PHRASE_INDEX + 15) {
  throw new Error('Search phrase count is restricted to 15!');
}

const searchPhrases = process.argv.slice(SEARCH_PHRASE_INDEX);
const results = {};

const twitter = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

function getMeanSentiment(texts) {
  return texts.reduce((avgScore, text) => 
    (avgScore + sentiment(text).score) / 2 ,0
  );
}

function getSentimentAnalysis(texts) {
  return texts.reduce(({mean, max, min}, text) => {
    const score = sentiment(text).score;
    return ({
      mean: (mean + score) / 2,
      min: min < score ? min : score,
      max: max > score ? max : score
    });
  }, INITIAL_ANALYSIS)
}

function mapTweetsToScoreObject(tweets) {
  const {statuses, search_metadata: {query}} = tweets;
  const analysis = getSentimentAnalysis(statuses.map(({text}) => text));
  
  return ({
    phrase: query,
    n: statuses.length,
    ...analysis
  });
}

function mapScoreObjectToCSVRow(score) {
  return [
    score.phrase,
    score.mean,
    score.max,
    score.min,
    score.n
  ];
}

function writeScoresToFile(scores) {
  const writer = csvWriter({
    headers: CSV_HEADERS
  });
  const fileName = `${uuid()}.csv`;
  writer.pipe(fs.createWriteStream(`out/${fileName}`));
  scores.map(score => 
    writer.write(mapScoreObjectToCSVRow(score))
  );
  writer.end();
  return fileName;
}

// Where all the magic happens...
Promise.all(
  searchPhrases.map( phrase =>
    twitter.get('search/tweets', {q: phrase, count: 100})
  )
).then( responses => {
  return Promise.all(
    responses.map((tweets) =>
      mapTweetsToScoreObject(tweets)
    ))
}).then( scores => {
  const fileName = writeScoresToFile(scores);
  console.log(`See the results at 'out/${fileName}'`);
}).catch(err => console.log(err));
