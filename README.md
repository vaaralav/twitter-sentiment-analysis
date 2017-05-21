# twitter-sentiment-analysis

## Getting started

Download the project, setup `.env`, install and compile.

```shell
git clone https://github.com/vaaralav/twitter-sentiment-analysis.git
cd twitter-sentiment-analysis
cp .env.example .env # Remember to update the keys and secrets!
yarn && yarn compile
```

## Usage

`execute` script takes the search phrase as the first command line argument. You can provide up to 15 search phrases. Just separate them with a space (`' '`).

```shell
yarn execute -- first_search_phrase [optional_search_phrases]
```

### Example:

```shell
yarn execute -- "iphone\ 6" galaxys7 "oneplus\ 3t"
yarn execute v0.17.10
$ node build/index.js iphone\ 6 galaxys7 oneplus\ 3t
See the results at 'out/5da15a08-e00d-4e8a-b1a2-4e2bc152f409.csv'
✨  Done in 4.18s.
```

Results in the .csv file:

| search_phrase | mean_sentiment_score | max_sentiment_score | min_sentiment_score | n   |
| ------------- | -------------------- | ------------------- | ------------------- | --- |
| iphone+6      |   0.5805778743242342 |                   6 |                  -2 |  77 |
| galaxys7      |   0.2500014916782014 |                   9 |                  -1 |  96 |
| oneplus+3t    |    4.000872629710595 |                   9 |                  -3 | 100 |


## Developing

Watch `src/` and compile the changes.

```shell
yarn watch
```
