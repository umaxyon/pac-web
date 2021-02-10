import _ from 'lodash';
import { API_URL_BASE } from '../lib/const';
import PacAjax from '../lib/ajax';
import PacCacheRepository from './PacCacheRepository';

class PacIRManager {
  constructor(dbCtx, ccode) {
    this.apiUrl = `${API_URL_BASE}/Web006`;
    this.ccode = ccode;
    this.repo = new PacCacheRepository(dbCtx, 'ir', this.ccode);
  }

  getIR() {
    return new Promise((resolve) => {
      this.repo.deleteOldData(30);
      let lastId = '';
      const dbIR = this.repo.get();
      if (!_.isEmpty(dbIR) && dbIR.length > 0) {
        if (this.repo.isElapsedMinute(10)) {
          lastId = dbIR[0].tid;
        } else {
          resolve(dbIR);
          return;
        }
      }

      this.getServerIR(lastId, (ir, lid) => {
        if (ir && ir.length > 0) {
          this.repo.save(ir, lid);
        }
        this.updateStatus();
        if (dbIR && dbIR.length > 0) {
          resolve(ir.concat(dbIR));
          return;
        }
        resolve(ir);
      });
    });
  }

  getServerIR(lastId, successCb) {
    const param = `?cd=${this.ccode}&lt=${lastId}`;
    PacAjax.get({
      url: this.apiUrl + param,
    },
    (dt) => {
      const ret = JSON.parse(dt.body);
      this.repo.upSysVer(ret.v);
      successCb(ret.irs, lastId);
    });
  }

  updateStatus() {
    this.repo.upState();
  }
}

export default PacIRManager;
