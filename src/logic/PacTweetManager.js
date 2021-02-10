import _ from 'lodash';
import PacAjax from '../lib/ajax';
import PacCacheRepository from './PacCacheRepository';
import { API_URL_BASE } from '../lib/const';

class PacTweetManager {
  constructor(dbCtx, ccode, pageCnt) {
    this.ccode = ccode;
    this.apiUrl = `${API_URL_BASE}/Web003`;
    this.pageCnt = pageCnt || 10;
    this.sysDb = dbCtx.sysDb;
    this.repo = new PacCacheRepository(dbCtx, 'tweets', this.ccode);
  }

  getTweets(lastId) {
    return new Promise((resolve) => {
      const dbTweets = this.repo.get();
      let dr = '';
      let lt = lastId || '';
      if (dbTweets && dbTweets.length > 0) {
        if (lastId) {
          // [もっと読み込む]
          const pos = _.findIndex(dbTweets, { id_str: lastId }) + 1;
          const moreList = dbTweets.slice(pos, Math.min(pos + this.pageCnt, dbTweets.length));
          if (moreList.length === this.pageCnt ||
              (moreList && this.isEnd(moreList[moreList.length - 1])) ||
              this.isEnd(dbTweets[dbTweets.length - 1])) {
            resolve(moreList);
            return;
          }
        } else {
          // [最新取得]
          if (this.repo.isElapsedMinute(5)) {
            dr = 'new';
            lt = dbTweets[0].id_str;
          } else {
            // DBの最新tweetが5分以内
            resolve(dbTweets.slice(0, Math.min(this.pageCnt, dbTweets.length)));
            return;
          }
        }
      } else {
        dr = 'new';
      }

      this.getServerTweets(lt, dr, (tweets, lid) => {
        this.repo.save(tweets, lid);
        if (dr === 'new') {
          this.updateStatus();
          if (tweets.length < 10 && dbTweets && dbTweets.length > 0) {
            const localTws = dbTweets.slice(0, Math.min(10 - tweets.length, dbTweets.length));
            resolve(tweets.concat(localTws));
            return;
          }
        }
        resolve(tweets.slice(0, Math.min(this.pageCnt, tweets.length)));
      });
    });
  }

  getServerTweets(lastId, direction, successCb) {
    const param = `?cd=${this.ccode}&lt=${lastId}&dr=${direction}`;
    PacAjax.get({ url: this.apiUrl + param },
      (dt) => {
        const ret = JSON.parse(dt.body);
        this.repo.upSysVer(ret.v);
        successCb(ret.tweets, lastId);
      });
  }

  updateStatus() {
    this.repo.upState();
  }

  isEnd(tw) {
    return tw && Object.prototype.hasOwnProperty.call(tw, 'e');
  }
}

export default PacTweetManager;
