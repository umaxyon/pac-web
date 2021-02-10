import _ from 'lodash';
import { API_URL_BASE } from '../lib/const';
import PacAjax from '../lib/ajax';
import PacUtil from '../lib/util';
import PacCacheRepository from './PacCacheRepository';
import PacFriendsManager from './PacFriendsManager';

class PacReportManager {
  constructor(dbCtx) {
    this.apiUrl = `${API_URL_BASE}/Web001`;
    this.repo = new PacCacheRepository(dbCtx, 'reports');
    this.repoPage = new PacCacheRepository(dbCtx, 'reportPage');
    this.friendsManager = new PacFriendsManager(dbCtx, 'friends');
  }

  getReports(page) {
    return new Promise((resolve) => {
      const dbRepoPage = this.repoPage.get();
      let isEnd = false;
      if (!_.isEmpty(dbRepoPage) && dbRepoPage[page]) {
        if (page !== 1 || !this.repoPage.isElapsedMinute(5)) {
          // 1ページ目以外 または キャッシュ時間が5分以内
          const dat = this.repo.searchCache(dbRepoPage[page].ccodes);
          if (dat.nocache.length === 0) {
            this.friendsManager.populateFriendToObject(dat.datas, 'last_update_user', 'user')
              .then(repos => resolve(repos));
            isEnd = true;
          }
        }
      }
      if (!isEnd) {
        this.getServerReports(page, (repos, pages) => {
          if (page === 1) {
            this.repoPage.clearAll();
            this.repo.clearAll();
          }
          this.repoPage.save(pages);
          this.repo.save(repos);
          this.friendsManager.populateFriendToObject(repos, 'last_update_user', 'user')
            .then((frendInRepos) => {
              const ret = PacUtil.toAlignKeysSort(pages.ccodes, frendInRepos, 'ccode');
              resolve(ret);
            });
        });
      }
    });
  }

  getServerReports(page, successCb) {
    const param = `?p=${page}`;
    PacAjax.get({ url: this.apiUrl + param },
      (dt) => {
        const ret = JSON.parse(dt.body);
        this.repoPage.upSysVer(ret.v);
        successCb(ret.repos, ret.pages);
      });
  }

  updateStatus() {
    this.repoPage.upState();
  }
}

export default PacReportManager;
