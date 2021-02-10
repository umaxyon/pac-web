import {
  startLoadStock,
  reloadReport,
  startLoadMember,
  registRouterHistory,
} from '../actions/';

class PacHistoryManager {
  constructor(dbCtx, dispatch, type) {
    this.db = dbCtx.history;
    this.dispatch = dispatch;
    this.type = type;
    this.history = this.db.get('h') || [];
    this.loaders = {
      list: reloadReport,
      stock: startLoadStock,
      member: startLoadMember,
    };
  }

  reInit(db) {
    this.db = db;
    this.history = this.db.get('h') || [];
    if (this.history.length > 0) {
      this.type = this.history[this.history.length - 1].next.t;
    }
  }

  hisOb(val, t) {
    return { t: t || this.type, v: val };
  }

  init(dat, routerHistory) {
    this.dispatch(registRouterHistory(routerHistory));
    if (dat) {
      if (this.history.length === 0) {
        this.history = [{
          base: this.hisOb(dat),
          next: this.hisOb(''),
        }];
        this.db.set('h', this.history);
      } else {
        this.next(dat);
      }
    }
  }

  next(dat, t) {
    if (dat) {
      if (this.history.length === 1 && this.history[0].next.v === '' && this.history[0].base.v !== dat) {
        this.history[0].next.v = dat;
        this.history[0].next.t = t || this.type;
      } else {
        const lastNext = this.history[this.history.length - 1].next;
        if (lastNext.v !== dat && lastNext.v !== '') {
          this.history.push({
            base: lastNext,
            next: this.hisOb(dat, t),
          });
        }
      }
      this.db.set('h', this.history);
    }
  }

  back() {
    const row = this.pop();
    if (this.history.length === 0) {
      this.history.push({
        base: row.base,
        next: this.hisOb(''),
      });
    }
    this.db.set('h', this.history);
    if (!row || row.length === 1) {
      return null;
    }
    return row.base;
  }

  pop() {
    const dat = (this.history) ? this.history.pop() : null;
    this.db.set('h', this.history);
    return dat;
  }

  get() {
    return (this.history) ? this.history[0] : null;
  }

  stockReload(hisOb) {
    const loader = this.loaders[hisOb.t];
    this.dispatch(loader(hisOb.v));
  }

  executeBack(routerHistory) {
    const hisOb = this.back();
    if (hisOb) {
      if (hisOb.v === 'list') {
        routerHistory.replace(`/${hisOb.v}`);
      } else {
        routerHistory.replace(`/${hisOb.t}/${hisOb.v}`);
        setTimeout(() => { this.stockReload(hisOb); }, 10);
      }
    }
  }

  addWindowPopStateEvent(getState, historyManager) {
    const listener = () => {
      const routerHistory = getState().routerHistoryRegister.routerHistory;

      // ここでのthis.dbはAppInit時のManagerを見ているため、historyを取得しなおす。
      const db = getState().dbContextCreator.dbContext.history;
      historyManager.reInit(db);
      historyManager.executeBack(routerHistory);
    };
    window.removeEventListener('popstate', listener);
    window.addEventListener('popstate', listener);
  }
}

export default PacHistoryManager;
