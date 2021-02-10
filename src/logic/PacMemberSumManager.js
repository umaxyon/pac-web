import _ from 'lodash';
import { API_URL_BASE } from '../lib/const';
import PacAjax from '../lib/ajax';
import PacDate from '../lib/date';
import PacCacheRepository from './PacCacheRepository';

class PacMemberSumManager {
  constructor(dbCtx, uid) {
    this.apiUrl = `${API_URL_BASE}/Web010`;
    this.uid = uid;
    this.repo = new PacCacheRepository(dbCtx, 'membersum', this.uid);
  }

  getMemberSummary() {
    return new Promise((resolve) => {
      const dbMemSum = this.repo.get();
      if (!_.isEmpty(dbMemSum) && !this.isExpire()) {
        resolve(dbMemSum);
        return;
      }

      this.getServerMemberSum((memsum) => {
        this.repo.save(memsum);
        this.updateStatus();
        resolve(memsum);
      });
    });
  }

  getServerMemberSum(successCb) {
    const param = `?uid=${this.uid}`;
    PacAjax.get({ url: this.apiUrl + param },
      (dt) => {
        const ret = JSON.parse(dt.body);
        this.repo.upSysVer(ret.v);
        successCb(ret.tfs);
      });
  }

  updateStatus() {
    this.repo.upState();
  }

  isExpire() {
    const dbMemSum = this.repo.get();
    return !dbMemSum || PacDate.minAgo(5) >= dbMemSum.d;
  }
}

export default PacMemberSumManager;
