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

`execute` script takes the search phrase as the first command line argument.

```shell
yarn execute -- search_phrase_here
```

## Developing

Watch `src/` and compile the changes.

```shell
yarn watch
```
