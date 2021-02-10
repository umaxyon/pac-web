import _ from 'lodash';
import PacAjax from '../lib/ajax';
import PacDB from '../lib/storage';
import PacUtil from '../lib/util';
import PacBrandManager from '../logic/PacBrandManager';
import PacReportManager from '../logic/PacReportManager';
import PacTweetManager from '../logic/PacTweetManager';
import PacFriendsManager from '../logic/PacFriendsManager';
import PacMemberSumManager from '../logic/PacMemberSumManager';
import PacNowPriceManager from '../logic/PacNowPriceManager';
import PacHistoryManager from '../logic/PacHistoryManager';
import PacPriceManager from '../logic/PacPriceManager';
import PacIRManager from '../logic/PacIRManager';
import PacEdiManager from '../logic/PacEdiManager';
import PacSuggestManager from '../logic/PacSuggestManager';
import PacHighLowManager from '../logic/PacHighLowManager';
import PacCollectStocksManager from '../logic/PacCollectStocksManager';
import { reportCreateRow } from '../components/list/ListView';


export const setMoreReadStatus = st => dispatch => dispatch({ type: 'MORE_READ_STATUS', moreStatus: st });

export const setImgSrc = (strImg, userId) => dispatch => dispatch({ type: 'LOAD_IMG_SRC', strImg, userId });

export const startImgLoad = userId => (dispatch) => {
  PacAjax.get({ url: `https://kabupac.net/prof/${userId}` },
    (dt) => {
      dispatch(setImgSrc(dt.i, userId));
    },
    () => {
      dispatch(setImgSrc('/img/no_user.png', userId));
    });
};

export const startLoadRank = ccode => (dispatch, getState) => {
  const dbCtx = getState().dbContextCreator.dbContext;
  new PacHighLowManager(dbCtx, ccode).getHighLow()
    .then((highlow) => {
      dispatch({ type: 'HIGHLOW_LOADED', highlow });
    });
};

export const startLoadPrice = ccode => (dispatch, getState) => {
  const dbCtx = getState().dbContextCreator.dbContext;
  new PacPriceManager(dbCtx, ccode).getPrices()
    .then((price) => {
      dispatch({ type: 'PRICE_LOADED', price });
    });
};

export const startLoadIR = ccode => (dispatch, getState) => {
  const dbCtx = getState().dbContextCreator.dbContext;
  new PacIRManager(dbCtx, ccode).getIR()
    .then((ir) => {
      const type = (ir.length > 0) ? 'IR_LOADED' : 'NO_IR';
      dispatch({ type, ir });
    });
};


export const startLoadEDI = ccode => (dispatch, getState) => {
  const dbCtx = getState().dbContextCreator.dbContext;
  new PacEdiManager(dbCtx, ccode).getEdi()
    .then((edi) => {
      dispatch({ type: 'EDI_LOADED', edi });
    });
};

export const toggleTweet = (toggleName, tweetId) => (dispatch) => {
  const st = (toggleName === 'toggle-off') ? 'toggle-on' : 'toggle-off';
  dispatch({ type: `TWEET_${st}`, toggleState: st, tweetId });
};

export const toggleFavoriteStar = (starName, ccode) => (dispatch) => {
  const st = (starName === 'star-o') ? 'star' : 'star-o';
  dispatch({ type: `FAVORITE_${st}`, starState: st, ccode });
};

export const startLoadMemberSum = userId => (dispatch, getState) => {
  const dbCtx = getState().dbContextCreator.dbContext;
  new PacMemberSumManager(dbCtx, userId).getMemberSummary()
    .then((memsum) => {
      dispatch({ type: 'MEMBER_SUM_LOADED', memsum });
    });
};

export const startLoadMember = userId => (dispatch, getState) => {
  const dbCtx = getState().dbContextCreator.dbContext;
  new PacFriendsManager(dbCtx).getFriends([userId])
    .then((friends) => {
      dispatch({ type: 'MEMBER_LOADED', member: friends[0][userId] });
    });
};


export const setLoadingNowPrice = () => dispatch => dispatch({ type: 'NOW_PRICE_LOADING' });
export const orderNowPrice = ccode => dispatch => dispatch({ type: 'ORDER_NOW_PRICE', ccode });

export const startLoadNowPrice = () => (dispatch, getState) => {
  dispatch(setLoadingNowPrice());
  const ccodes = getState().setOrderNowPrice.ccodes;
  const dbCtx = getState().dbContextCreator.dbContext;
  new PacNowPriceManager(dbCtx).getNowPrice(ccodes)
    .then((priceList) => {
      const nowPrices = _.assignIn({}, ...priceList);
      dispatch({ type: 'NOW_PRICE_LOADED', nowPrices });
    });
};

export const startLoadCollectStocks = (key, page) => (dispatch, getState) => {
  const moreRow = [];
  const collectRows = getState().collectLoader.rows;
  const dbCtx = getState().dbContextCreator.dbContext;
  const manager = new PacCollectStocksManager(dbCtx);
  manager.getCollectStocks(key, page)
    .then((repos) => {
      _.each(repos, (repo) => {
        const i = collectRows.length + moreRow.length + 1;
        moreRow.push(reportCreateRow(PacUtil.getHashInOb(repo), i));
      });
      const rows = (page === 1) ? moreRow : collectRows.concat(moreRow);
      setTimeout(() => {
        dispatch({
          type: 'COLLECT_LOADED',
          rows,
        });
        dispatch(setMoreReadStatus((moreRow.length === 0) ? 'end' : 'more'));
      }, 500);
    });
};

export const startLoadReport = page => (dispatch, getState) => {
  const moreRow = [];
  const reportRows = getState().reportLoader.reportRows;
  const dbCtx = getState().dbContextCreator.dbContext;
  const reportManager = new PacReportManager(dbCtx);
  reportManager.getReports(page)
    .then((repos) => {
      _.each(repos, (repo) => {
        const i = reportRows.length + moreRow.length + 1;
        moreRow.push(reportCreateRow(PacUtil.getHashInOb(repo), i));
      });
      const nextStatus = (page === 20) ? 'end' : 'more';
      const rows = (page === 1) ? moreRow : reportRows.concat(moreRow);
      setTimeout(() => {
        dispatch({
          type: 'REPORT_LOADED',
          reportRows: rows,
        });
        dispatch(setMoreReadStatus((moreRow.length === 0) ? 'end' : nextStatus));
      }, 500);
    });
};

export const reloadReport = () => (dispatch) => {
  dispatch({ type: 'REPORT_LOADING', reportRows: {} });
  dispatch(startLoadReport(1));
};

export const clearTweet = () => dispatch => dispatch({
  type: 'TWEET_CLEAR',
  tweetRows: [],
  lastTweetId: '' });

export const reloadTweet = () => dispatch => dispatch({
  type: 'TWEET_RELOAD',
  tweetRows: [],
  lastTweetId: '' });

export const startLoadTweet = (ccode, createRow) => (dispatch, getState) => {
  const moreRow = [];
  const lastId = getState().tweetLoader.lastTweetId;
  const tweetRows = getState().tweetLoader.tweetRows;
  const dbCtx = getState().dbContextCreator.dbContext;
  const tweetManager = new PacTweetManager(dbCtx, ccode);
  tweetManager.getTweets(lastId)
    .then((tweets) => {
      new PacFriendsManager(dbCtx).populateFriendToObject(tweets, 'user_id', 'user')
        .then((frinedInTws) => {
          _.each(frinedInTws, (tw) => {
            const i = tweetRows.length + moreRow.length + 1;
            moreRow.push(createRow(tw, ccode, i));
          });

          let nextStatus = 'more';
          let lastTweetId = '';
          if (tweets.length > 0) {
            const lastTw = tweets[tweets.length - 1];
            nextStatus = (tweetManager.isEnd(lastTw)) ? 'end' : 'more';
            lastTweetId = lastTw.id_str;
          }
          setTimeout(() => {
            dispatch({
              type: 'TWEET_LOADED',
              tweetRows: tweetRows.concat(moreRow),
              lastTweetId,
            });
            dispatch(setMoreReadStatus((moreRow.length === 0) ? 'end' : nextStatus));
          }, 100);
        });
    });
};

export const startLoadStock = ccode => (dispatch, getState) => {
  dispatch({ type: 'BRAND_LOADING', brand: {} });
  dispatch(clearTweet());
  const dbCtx = getState().dbContextCreator.dbContext;
  new PacBrandManager(dbCtx, ccode).getBrand()
    .then((brand) => {
      dispatch({ type: 'BRAND_LOADED', brand });
      dispatch(reloadTweet());
    });
};
export const setAppStatusOK = () => dispatch => dispatch({ type: 'APP_INITIALIZED', progress: 'ok' });

export const registRouterHistory = routerHistory => (dispatch) => {
  dispatch({ type: 'ROUTER_HISTORY_REGIST', routerHistory });
};

const addEventListener = (dbCtx, dispatch, getState) => {
  if (getState().routerHistoryRegister.type !== 'ROUTER_HISTORY_REGIST') {
    const historyManager = new PacHistoryManager(dbCtx, dispatch);
    historyManager.addWindowPopStateEvent(getState, historyManager);
  }
};

export const startSuggestListInitialize = () => (dispatch, getState) => {
  const dbCtx = getState().dbContextCreator.dbContext;
  new PacSuggestManager(dbCtx).getSuggest()
    .then((suggest) => {
      dispatch({ type: 'SUGGEST_LOADED', suggest });
      dispatch(setAppStatusOK());
    });
};

export const startDBInitialize = () => (dispatch, getState) => {
  const dbContext = {
    sysDb: new PacDB(),
    brand: new PacDB('brand'),
    reportPage: new PacDB('reportPage'),
    reports: new PacDB('reports'),
    friends: new PacDB('friends'),
    profImg: new PacDB('profImg'),
    suggest: new PacDB('suggest'),
    tweets: new PacDB('tweets'),
    ir: new PacDB('ir'),
    edi: new PacDB('edi'),
    history: new PacDB('history', null, 'session'),
    nowPrice: new PacDB('nowPrice', null, 'session'),
    price: new PacDB('price', null, 'session'),
    highlow: new PacDB('highlow', null, 'session'),
    membersum: new PacDB('membersum', null, 'session'),
    thema: new PacDB('thema'),
    st_brand: new PacDB('status-brand', null, 'session'),
    st_ir: new PacDB('status-ir', null, 'session'),
    st_edi: new PacDB('status-edi', null, 'session'),
    st_reportPage: new PacDB('status-reportPage', null, 'session'),
    st_reports: new PacDB('status-reports', null, 'session'),
    st_friends: new PacDB('status-friends', null, 'session'),
    st_tweets: new PacDB('status-tweets', null, 'session'),
    st_history: new PacDB('status-history', null, 'session'),
    st_nowPrice: new PacDB('status-nowPrice', null, 'session'),
    st_price: new PacDB('status-price', null, 'session'),
    st_highlow: new PacDB('status-highlow', null, 'session'),
    st_membersum: new PacDB('status-membersum', null, 'session'),
    st_suggest: new PacDB('status-suggest', null, 'session'),
    st_thema: new PacDB('status-thema', null, 'session'),
  };

  dispatch({ type: 'DB_INITIALIZED', dbContext });
  addEventListener(dbContext, dispatch, getState);
  dispatch(startSuggestListInitialize());
};


export const startProfImgInitialize = () => (dispatch) => {
  const profImgDb = new PacDB('profImg');
  if (profImgDb.get('profimg')) {
    dispatch(startDBInitialize());
  } else {
    PacAjax.get({ url: 'https://kabupac.net/prof/profimg.json' },
      (dt) => {
        profImgDb.set('profimg', dt);
        dispatch(startDBInitialize());
      },
      () => {
        dispatch(startDBInitialize());
      });
  }
};

export const initApp = () => (dispatch) => {
  dispatch(startProfImgInitialize());
};
