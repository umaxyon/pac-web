import _ from 'lodash';
import { API_URL_BASE } from '../lib/const';
import PacAjax from '../lib/ajax';
import PacUtil from '../lib/util';
import PacCacheRepository from './PacCacheRepository';


class PacCollectStocksManager {
  constructor(dbCtx) {
    this.apiUrl = `${API_URL_BASE}/Web011`;
    this.thema = new PacCacheRepository(dbCtx, 'thema');
  }

  getCollectStocks(key, page) {
    return new Promise((resolve) => {
      this.getServerCollectStocks(key, page, (cds, repos) => {
        console.log(cds);
        console.log(repos);
        resolve(repos);
      });
    });
  }

  getServerCollectStocks(key, page, successCb) {
    const p = page || 1;
    const param = `?k=${key}&p=${p}`;
    PacAjax.get({ url: this.apiUrl + param },
      (dt) => {
        const ret = JSON.parse(dt.body);
        this.thema.upSysVer(ret.v);
        successCb(ret.cds, ret.repos);
      });
  }

  updateStatus() {
    this.repoPage.upState();
  }
}

export default PacCollectStocksManager;
