import _ from 'lodash';
import PacDate from './date';

class PacDB {
  constructor(name, ctxName, type) {
    this.type = type || 'local';
    this.root = 'pac';
    this.name = name || 'sys';
    this.ctx_name = ctxName || 'user';
    this.autocommit = true;
    this.init();
  }

  init() {
    this.data = {};
    this.identify = `${this.root}-${this.name}`;
    this.storage = (this.type === 'local') ? window.localStorage : window.sessionStorage;
    if (!this.storage[this.identify]) {
      this.data.initial_time = PacDate.now();
      this.commit();
    } else {
      this.data = JSON.parse(this.storage[this.identify]);
    }
  }

  getContext() {
    if (!this.data[this.ctx_name]) {
      this.data[this.ctx_name] = {};
    }
    return this.data[this.ctx_name];
  }

  setAutoCommit(flg) {
    this.autocommit = flg;
  }

  get(key, ctx) {
    if (!key) {
      return this.getContext();
    }
    return (function nest(ob, k) {
      const dat = ob[k[0]];
      if (!dat) return;
      k.shift();
      // eslint-disable-next-line no-alert, consistent-return
      return (k.length === 0) ? dat : nest(dat, k);
    }(ctx || this.getContext(), key.split('-')));
  }

  set(key, val, ctx) {
    (function _nest(ob, k, v) {
      const kk = k[0];
      const obj = ob;
      k.shift();
      if (k.length === 0) {
        obj[kk] = v;
        return;
      } else if (!obj[kk] || typeof obj[kk] !== 'object') {
        obj[kk] = {};
      }
      _nest(obj[kk], k, v);
    }(ctx || this.getContext(), key.split('-'), val));

    if (this.autocommit) {
      this.commit();
    }
  }

  del(key) {
    (function _nest(ob, k) {
      const kk = k[0];
      const obj = ob;
      k.shift();
      if (k.length === 0) {
        delete obj[kk];
        return;
      }
      _nest(obj[kk], k);
    }(this.getContext(), key.split('-')));
  }

  clearStorage() {
    this.data = {};
    this.commit();
    this.init();
  }

  commit() {
    const strJson = JSON.stringify(this.data);
    const size = unescape(encodeURIComponent(strJson)).length;
    this.storage[this.identify] = strJson;
    const sizeCtx = JSON.parse(this.storage.size || '{}');
    sizeCtx[this.name] = size;
    const sizeList = _.values(sizeCtx);
    const sum = _.reduce(sizeList, (memo, s) => (memo + s), 0);
    this.storage['pac-allSize'] = sum;
    this.storage.size = JSON.stringify(sizeCtx);
  }

  rollback() {
    this.data = JSON.parse(this.storage[this.identify]);
  }

  txOpen() {
    this.commit();
    this.autocommit = false;
  }

  txClose() {
    this.commit();
    this.autocommit = true;
  }
}

export default PacDB;
