import _ from 'lodash';
import PacDate from '../lib/date';
import PacUtil from '../lib/util';

const ledger = {
  tweets: { primary: 'id_str', type: 'listhash', time: 'created_at' },
  brand: { primary: 'ccode', type: 'hash', time: 'none', updateType: 'daily' },
  edi: { primary: 'ccode', type: 'hash', time: 'date', updateType: 'daily' },
  ir: { primary: 'cd', type: 'listhash', time: 'd' },
  reports: { primary: 'ccode', type: 'hashlist', time: 'none', keypop: false, convert: true },
  reportPage: { primary: 'p', type: 'hash', time: 'none', keypop: true },
  friends: { primary: 'id_str', type: 'hashlist', time: 'none', keypop: false, convert: false, updateType: 'daily' },
  nowPrice: { primary: 'cd', type: 'hashlist', time: 'd', keypop: true, convert: false },
  price: { primary: 'cd', type: 'listhash', time: 'd' },
  highlow: { primary: 'cd', type: 'hash', time: 'date', updateType: 'daily' },
  membersum: { primary: 'uid', type: 'hash', time: 'none' },
  suggest: { primary: 'c', type: 'list', time: 'none', updateType: 'daily', key: 'suggest' },
  thema: { primary: 'nm', type: 'listhash', time: 'none', updateType: 'daily' },
};

class PacCacheRepository {
  constructor(dbCtx, dbname, key) {
    this.dbname = dbname;
    this.ddl = ledger[this.dbname];
    this.key = key || '';
    this.sysDb = dbCtx.sysDb;
    this.db = dbCtx[this.dbname];
    this.statusDb = dbCtx['st_' + this.dbname];
  }

  get() {
    if (this.key) {
      return this.db.get(this.key);
    }
    return this.db.getContext();
  }

  isExists() {
    return !(_.isEmpty(this.get()));
  }

  getKey(data) {
    if (this.ddl.type === 'hashlist') {
      return _.keys(data)[0];
    }
    return (this.key) ? this.key : data[this.ddl.primary] || this.dbname;
  }

  lastUpdate() {
    if (this.ddl.updateType === 'daily') {
      return this.statusDb.get('lastup');
    }
    return this.statusDb.get(`${this.dbname}-${this.key || this.dbname}-lastup`);
  }

  isElapsedMinute(minute) {
    const lastup = this.lastUpdate();
    const minAgo = PacDate.minAgo(minute);
    return (!lastup || minAgo > lastup);
  }

  searchCache(keys) {
    const ret = { nocache: [], datas: [] };
    const dbDatas = this.get();
    if (!dbDatas) {
      ret.nocache = keys;
      return ret;
    }
    _.each(keys, (key) => {
      const dat = dbDatas[key];
      if (dat) {
        ret.datas.push(dat);
      } else {
        ret.nocache.push(key);
      }
    });
    return ret;
  }

  upState() {
    if (this.ddl.updateType === 'daily') {
      this.statusDb.set('lastup', PacDate.now());
      return;
    }
    this.statusDb.set(`${this.dbname}-${this.key || this.dbname}-lastup`, PacDate.now());
  }

  upSysVer(version) {
    this.sysDb.set(this.dbname, { version });
  }

  clearAll() {
    this.db.clearStorage();
    this.statusDb.clearStorage();
  }

  deleteOldData(day) {
    const dat = _.filter(this.get(), row => row[this.ddl.time] > PacDate.dayAgo(day));
    this.db.set(this.key, dat);
  }

  save(datas, lastId) {
    if (this.ddl.type === 'listhash') {
      // listhash 例) {a:[1,2], b:[3,4]}
      this.listHashSave(datas, lastId);
    } else if (this.ddl.type === 'hashlist') {
      // hashlist 例) [{a:1, b1}, {a:2, b:2}]
      this.hashListSave(datas);
    } else if (this.ddl.type === 'list') {
      this.listSave(datas);
    } else {
      this.hashSave(datas);
    }
  }

  hashListConvert(datas) {
    // 例) [{key:'k1', a:1}, {key:'k2', a:2}] -> [{k1: {key:'k1, a:1}}, {k2: {key:'k2', a:2}}]
    return _.map(datas, (row) => {
      const ob = {};
      const k = row[this.ddl.primary];
      ob[k] = row;
      if (this.ddl.keypop) {
        delete ob[k][this.ddl.primary];
      }
      return ob;
    });
  }

  hashListSave(datas) {
    const dts = (this.ddl.convert) ? this.hashListConvert(datas) : datas;

    for (let i = 0; i < dts.length; i++) {
      const data = dts[i];
      this.hashSave(data);
    }
  }

  listSave(data) {
    this.db.set(this.ddl.key, data);
    this.upState();
  }

  hashSave(data) {
    const d = Object.assign({}, data);
    const key = this.getKey(d);
    if (this.ddl.keypop) {
      delete d[this.ddl.primary];
    }
    const isEmpty = _.isEmpty(this.db.get(key));
    this.db.set(key, d);
    if (this.ddl.updateType === 'daily' && !isEmpty) {
      return;
    }
    this.upState();
  }

  listHashSave(datas, lastId) {
    const dbDatas = this.get();
    if (!dbDatas || dbDatas.length === 0) {
      this.db.set(this.key, datas);
      this.upState();
      return;
    }

    let saveList = [];
    if (dbDatas[0][this.ddl.primary] === lastId) {
      // lastIdがDBの先頭 == [最新に追加]
      saveList = saveList.concat(
        PacUtil.topToKeyFromList(datas, this.ddl.primary, lastId),
        dbDatas,
      );
      this.db.set(this.key, saveList);
      if (this.ddl.updateType !== 'daily') {
        this.upState();
      }
    } else {
      if (lastId) {
        // lastIDがDBの先頭じゃない == [途中または最後に追加]
        saveList = PacUtil.topToKeyFromList(dbDatas, this.ddl.primary, lastId);
        const cnt = saveList.length;

        // datasからDB保存されているlastIdまでのリストを切り出す
        const dbLastId = (cnt < dbDatas.length) ? dbDatas[cnt][this.ddl.primary] : null;
        const topToDbLastDataList = PacUtil.topToKeyFromList(datas, this.ddl.primary, dbLastId);

        // DBのlastId以降を追加する
        saveList = saveList.concat(
          topToDbLastDataList,
          PacUtil.keyToLastFromList(dbDatas, null, cnt),
        );
        this.db.set(this.key, saveList);
      } else {
        // DBはあるがlastID指定なし == [最新更新取得]
        const lastDbId = dbDatas[0][this.ddl.primary];
        for (let i; i < datas.length; i++) {
          if (datas[i][this.ddl.primary] === lastDbId) {
            break;
          }
          saveList.push(datas[i]);
        }

        if (saveList.length > 0) {
          saveList = saveList.concat(dbDatas); // 結合
          this.db.set(this.key, saveList);
        }
      }
    }
  }
}

export default PacCacheRepository;
