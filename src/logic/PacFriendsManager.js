import _ from 'lodash';
import { API_URL_BASE } from '../lib/const';
import PacAjax from '../lib/ajax';
import PacUtil from '../lib/util';
import PacDate from '../lib/date';
import PacCacheRepository from './PacCacheRepository';

class PacFriendsManager {
  constructor(dbCtx) {
    this.apiUrl = `${API_URL_BASE}/Web004`;
    this.repo = new PacCacheRepository(dbCtx, 'friends');
  }

  getFriends(userIds) {
    return new Promise((resolve) => {
      if (this.isExpire()) {
        this.repo.clearAll();
      }
      let ids = userIds;
      let retList = [];
      if (this.repo.isExists()) {
        const dat = this.repo.searchCache(ids);
        if (dat.nocache.length === 0) {
          resolve(dat.datas);
          return;
        }
        ids = dat.nocache;
        retList = dat.datas;
      }

      this.getServerFriends(ids, (friends) => {
        const friendsHashList = this.repo.hashListConvert(friends);
        this.repo.save(friendsHashList);
        this.updateStatus();
        retList = retList.concat(friendsHashList);
        resolve(retList);
      });
    });
  }

  getFriendFromCache(userId) {
    const dat = this.repo.searchCache([userId]);
    return (dat.nocache.length === 0) ? dat.datas[0] : null;
  }

  populateFriendToObject(obList, keyName, targetKeyName) {
    return new Promise((resolve) => {
      const lastUpUserIds = _.uniq(_.map(obList, (r) => {
        if (keyName in r) {
          return r[keyName];
        }
        return PacUtil.getHashInOb(r, keyName);
      }));
      this.getFriends(lastUpUserIds)
        .then((friends) => {
          const reultList = _.cloneDeep(obList);
          for (let i = 0; i < reultList.length; i++) {
            const r = PacUtil.getHashInOb(reultList[i]);
            const friend = _.filter(friends, (fre) => {
              const f = PacUtil.getHashInOb(fre);
              return f.id_str === r[keyName];
            });
            r[targetKeyName || keyName] = PacUtil.getHashInOb(friend[0]) || {};
          }
          resolve(reultList);
        });
    });
  }

  getServerFriends(keys, successCb) {
    const param = `?ids=${keys.join('_')}`;
    PacAjax.get({ url: this.apiUrl + param },
      (dt) => {
        const ret = JSON.parse(dt.body);
        this.repo.upSysVer(ret.v);
        successCb(ret.friends);
      });
  }

  updateStatus() {
    this.repo.upState();
  }

  isExpire() {
    // true: 期限切れ
    const lastup = this.repo.lastUpdate();
    const todayHour18 = PacDate.sameDayTime(PacDate.now(), '18');
    return !lastup || lastup < todayHour18;
  }
}

export default PacFriendsManager;
