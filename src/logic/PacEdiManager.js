import _ from 'lodash';
import { API_URL_BASE } from '../lib/const';
import PacAjax from '../lib/ajax';
import PacDate from '../lib/date';
import PacCacheRepository from './PacCacheRepository';

class PacEdiManager {
  constructor(dbCtx, key) {
    this.apiUrl = `${API_URL_BASE}/Web007`;
    this.key = key;
    this.repo = new PacCacheRepository(dbCtx, 'edi', key);
  }

  getEdi() {
    return new Promise((resolve) => {
      if (this.isExpire()) {
        this.repo.clearAll();
      }

      const dbEdi = this.repo.get();
      if (!_.isEmpty(dbEdi)) {
        resolve(dbEdi);
        return;
      }

      this.getServerEdi((edi) => {
        this.repo.save(edi);
        this.updateStatus();
        resolve(edi);
      });
    });
  }

  getServerEdi(successCb) {
    const param = `?cd=${this.key}`;
    PacAjax.get({
      url: this.apiUrl + param,
    },
    (dt) => {
      const ret = JSON.parse(dt.body);
      this.repo.upSysVer(ret.v);
      successCb(ret.edi);
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
    const todayHour5 = PacDate.sameDayTime(PacDate.now(), '05');
    if (nowH < '05') {
      return lastup > todayHour5;
    }
    return lastup <= todayHour5;
  }
}

export default PacEdiManager;
