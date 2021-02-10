import _ from 'lodash';
import { API_URL_BASE } from '../lib/const';
import PacAjax from '../lib/ajax';
import PacDate from '../lib/date';
import PacCacheRepository from './PacCacheRepository';

class PacHighLowManager {
  constructor(dbCtx, key) {
    this.apiUrl = `${API_URL_BASE}/Web009`;
    this.key = key;
    this.repo = new PacCacheRepository(dbCtx, 'highlow', key);
  }

  getHighLow() {
    return new Promise((resolve) => {
      if (this.isExpire()) {
        this.repo.clearAll();
      }

      const dbHighLow = this.repo.get();
      if (!_.isEmpty(dbHighLow)) {
        resolve(dbHighLow);
        return;
      }

      this.getServerHighLow((hl) => {
        this.repo.save(hl);
        this.updateStatus();
        resolve(hl);
      });
    });
  }

  getServerHighLow(successCb) {
    const param = `?cd=${this.key}`;
    PacAjax.get({
      url: this.apiUrl + param,
    },
    (dt) => {
      const ret = JSON.parse(dt.body);
      this.repo.upSysVer(ret.v);
      successCb(ret.hl);
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
    const todayHour3 = PacDate.sameDayTime(PacDate.now(), '03');
    if (nowH < '05') {
      return lastup > todayHour3;
    }
    return lastup <= todayHour3;
  }
}

export default PacHighLowManager;
