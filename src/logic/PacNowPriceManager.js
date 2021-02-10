import _ from 'lodash';
import { API_URL_BASE } from '../lib/const';
import PacAjax from '../lib/ajax';
import PacDate from '../lib/date';
import PacCacheRepository from './PacCacheRepository';

class PacNowPriceManager {
  constructor(dbCtx) {
    this.apiUrl = `${API_URL_BASE}/Web005`;
    this.sysDb = dbCtx.sysDb;
    this.NOW_UPTIME_KEY = 'nowPriceUptime';
    this.repo = new PacCacheRepository(dbCtx, 'nowPrice');
  }

  getNowPrice(ccodes) {
    return new Promise((resolve) => {
      if (this.isNeedUpdateNowPrice()) {
        this.repo.clearAll();
      }
      let cds = ccodes;
      let retList = [];
      if (this.repo.isExists()) {
        const dat = this.repo.searchCache(ccodes);
        if (dat.nocache.length === 0) {
          resolve(dat.datas);
          return;
        }
        cds = dat.nocache;
        retList = dat.datas;
      }

      this.getServerNowPrice(cds, (prices) => {
        const pricesHashList = this.repo.hashListConvert(prices);
        this.repo.save(pricesHashList);
        this.updateStatus();
        retList = retList.concat(pricesHashList);
        resolve(retList);
      });
    });
  }

  getServerNowPrice(cds, successCb) {
    const param = `?cds=${cds.join('_')}`;
    PacAjax.get({
      url: this.apiUrl + param,
    },
    (dt) => {
      const ret = JSON.parse(dt.body);
      this.repo.upSysVer(ret.v);
      this.upNowPriceUpTime(ret);
      successCb(ret.prices);
    });
  }

  convertHashList(priceList) {
    return _.map(priceList, (row) => {
      const ob = {};
      ob[row[this.repo.ddl.primary]] = row;
      return ob;
    });
  }

  upNowPriceUpTime(ret) {
    const uptime = ret.now_price_uptime;
    this.sysDb.set(this.NOW_UPTIME_KEY, uptime);
  }

  updateStatus() {
    this.repo.upState();
  }

  isNeedUpdateNowPrice() {
    const now = PacDate.nowDate();
    if (!PacDate.isMarketTime(now)) {
      return false;
    }
    const nowUp = this.sysDb.get(this.NOW_UPTIME_KEY);
    if (!nowUp) {
      return true;
    }
    let uptime = PacDate.toDate(nowUp);
    uptime = uptime.add(21, 'minutes');
    // uptimeが前(現在時刻がuptimeを過ぎた -> 更新が必要)
    return uptime.isBefore(now);
  }
}

export default PacNowPriceManager;
