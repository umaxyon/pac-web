import PacAjax from '../lib/ajax';
import PacCacheRepository from './PacCacheRepository';
import { API_URL_BASE } from '../lib/const';
import PacDate from '../lib/date';

class PacPriceManager {
  constructor(dbCtx, ccode, dayCnt) {
    this.ccode = ccode;
    this.apiUrl = `${API_URL_BASE}/Web008`;
    this.dayCnt = dayCnt || 14;
    this.sysDb = dbCtx.sysDb;
    this.repo = new PacCacheRepository(dbCtx, 'price', this.ccode);
  }

  getPrices() {
    return new Promise((resolve) => {
      this.repo.deleteOldData(30);
      const dbPrice = this.repo.get();

      const now = PacDate.now();
      const todayHour21 = PacDate.sameDayTime(now, '21');
      const lastDay = (now > todayHour21) ? PacDate.today() : PacDate.yesterday();
      let lt = '';
      if (dbPrice && dbPrice.length > 0) {
        lt = dbPrice[dbPrice.length - 1].d;
        if (lt === lastDay) {
          resolve(dbPrice);
          return;
        }
      }

      this.getServerPrices(lt, (prices, d) => {
        this.repo.save(prices, d);
        this.updateStatus();
        if (prices.length < 30 && dbPrice && dbPrice.length > 0) {
          const localPrice = dbPrice.slice(0, Math.min(30 - prices.length, dbPrice.length));
          resolve(localPrice.concat(prices));
          return;
        }
        resolve(prices);
      });
    });
  }

  getServerPrices(lastDay, successCb) {
    const param = `?cd=${this.ccode}&lt=${lastDay}`;
    PacAjax.get({ url: this.apiUrl + param },
      (dt) => {
        const ret = JSON.parse(dt.body);
        this.repo.upSysVer(ret.v);
        successCb(ret.ps, lastDay);
      });
  }

  updateStatus() {
    this.repo.upState();
  }
}

export default PacPriceManager;
