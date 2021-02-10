import _ from 'lodash';
import { API_URL_BASE } from '../lib/const';
import PacAjax from '../lib/ajax';
import PacDate from '../lib/date';
import PacCacheRepository from './PacCacheRepository';

class PacBrandManager {
  constructor(dbCtx, key) {
    this.apiUrl = `${API_URL_BASE}/Web002`;
    this.key = key;
    this.repo = new PacCacheRepository(dbCtx, 'brand', key);
  }

  getBrand() {
    return new Promise((resolve) => {
      if (this.isExpire()) {
        this.repo.clearAll();
      }

      const dbBrand = this.repo.get();
      if (!_.isEmpty(dbBrand)) {
        resolve(dbBrand);
        return;
      }

      this.getServerBrand((brand) => {
        this.repo.save(brand);
        this.updateStatus();
        resolve(brand);
      });
    });
  }

  getServerBrand(successCb) {
    const param = `?cd=${this.key}`;
    PacAjax.get({
      url: this.apiUrl + param,
    },
    (dt) => {
      const ret = JSON.parse(dt.body);
      this.repo.upSysVer(ret.v);
      successCb(ret.brand);
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

export default PacBrandManager;
