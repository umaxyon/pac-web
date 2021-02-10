import XRegExp from 'xregexp';

export const URL_MAIN = 'https://kabupac.net';
export const API_URL_BASE = 'https://e0nqjc6tyi.execute-api.ap-northeast-1.amazonaws.com/api';
export const STR_REG_URL = 'https?://[-_.!~*\'()a-zA-Z0-9;/?:@&=+$,%#]+';
export const STR_REG_RETWEET = 'RT\\s@\\w+:\\s';
export const STR_RETWEET_MARK = '_RTWEET_:';
export const STR_TWITTER_USER = '@[a-zA-Z0-9_]{5,}';
export const REG_URL = new RegExp(`(${STR_REG_URL})`);
export const REG_RETWEET = new RegExp(`(${STR_REG_RETWEET})`);
export const REG_TWITTER_USER = XRegExp(`(${STR_TWITTER_USER})`);
export const RETWEET_MARK = new RegExp(`(${STR_RETWEET_MARK})`);
