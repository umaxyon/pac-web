import _ from 'lodash';
import { URL_MAIN } from '../lib/const';
import PacAjax from '../lib/ajax';
import PacDate from '../lib/date';
import PacCacheRepository from './PacCacheRepository';

class PacSuggestManager {
  constructor(dbCtx) {
    this.repo = new PacCacheRepository(dbCtx, 'suggest');
  }

  getSuggest() {
    return new Promise((resolve) => {
      if (this.isExpire()) {
        this.repo.clearAll();
      }

      const dbSug = this.repo.get();
      if (!_.isEmpty(dbSug)) {
        resolve(dbSug.suggest);
        return;
      }

      this.getServerSuggest((sug) => {
        if (sug) {
          this.repo.save(sug);
          this.updateStatus();
        }
        resolve(sug);
      });
    });
  }

  getServerSuggest(successCb) {
    PacAjax.get({
      url: `${URL_MAIN}/suggest/dat.json`,
    },
    (dt) => {
      successCb(dt);
    });
  }

  updateStatus() {
    this.repo.upState();
  }

  isExpire() {
    // true: 期限切れ
    const lastup = this.repo.lastUpdate();
    if (!lastup) {
      return true;
    }
    const nowH = PacDate.now('HH');
    const todayHour6 = PacDate.sameDayTime(PacDate.now(), '06');
    if (nowH < '06') {
      // 日付変更から朝6時まで->lastupが6時を過ぎてたら期限切れ
      return lastup > todayHour6;
    }
    return lastup <= todayHour6;
  }
}

export default PacSuggestManager;
