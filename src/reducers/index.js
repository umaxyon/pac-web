import { combineReducers } from 'redux';

const dbContextCreatorInitialState = {
  type: 'non_initalize',
};
const moreReadInitialState = {
  type: 'loading',
};
const loadedImageInitialState = {
  type: 'twitter_load',
};
const appStartInitialState = {
  type: 'now_initializing',
  progress: 'process..',
};

const stockPageLoaderInitialState = {
  type: 'loading',
  brand: {},
};

const reportLoaderInitialState = {
  type: 'REPORT_LOADING',
  page: '',
  reportRows: [],
};

const tweetLoaderInitialState = {
  type: 'TWEET_LOADING',
  lastTweetId: '',
  tweetRows: [],
};

const toggleTweetInitialState = {
  type: 'TWEET_toggle-off',
  toggleState: 'toggle-off',
  tweetId: '',
};

const toggleFavoriteInitialState = {
  type: 'FAVORITE_star-o',
  starState: 'star-o',
  ccode: '',
};

const nowPriceLoaderInitialState = {
  type: 'NOW_PRICE_LOADING',
  ccodes: [],
  nowPrices: {},
};

const setOrderNowPriceInitialState = {
  type: 'NO_ORDER_NOW_PRICE',
  ccodes: [],
};

const memberLoaderInitialState = {
  type: 'MEMBER_LOADING',
  member: {},
};

const routerHistoryRegisterInitialState = {
  type: 'NO_REGIST',
  routerHistory: {},
};

const irLoaderInitialState = {
  type: 'IR_LOADING',
  ir: [],
};

const ediLoaderInitialState = {
  type: 'EDI_LOADING',
  ir: [],
};

const priceLoaderInitialState = {
  type: 'PRICE_LOADING',
  ir: [],
};

const highlowLoaderInitialState = {
  type: 'HIGHLOW_LOADING',
  highlow: {},
};

const memsumLoaderInitialState = {
  type: 'MEMBER_SUM_LOADING',
  memsum: {},
};

const suggestLoaderInitialState = {
  type: 'SUGGEST_LOADING',
  suggest: {},
};

const collectLoaderInitialState = {
  type: 'COLLECT_LOADING',
  page: '',
  rows: [],
};

const suggestLoader = (state = suggestLoaderInitialState, action) => {
  switch (action.type) {
    case 'SUGGEST_LOADING':
      return state;
    case 'SUGGEST_LOADED':
      return action;
    default:
      return state;
  }
};

const highlowLoader = (state = highlowLoaderInitialState, action) => {
  switch (action.type) {
    case 'HIGHLOW_LOADING':
      return state;
    case 'HIGHLOW_LOADED':
      return action;
    default:
      return state;
  }
};

const priceLoader = (state = priceLoaderInitialState, action) => {
  switch (action.type) {
    case 'PRICE_LOADING':
      return state;
    case 'PRICE_LOADED':
      return action;
    default:
      return state;
  }
};

const ediLoader = (state = ediLoaderInitialState, action) => {
  switch (action.type) {
    case 'EDI_LOADING':
      return state;
    case 'EDI_LOADED':
      return action;
    default:
      return state;
  }
};

const irLoader = (state = irLoaderInitialState, action) => {
  switch (action.type) {
    case 'IR_LOADING':
      return state;
    case 'IR_LOADED':
      return action;
    case 'NO_IR':
      return action;
    default:
      return state;
  }
};

const memberLoader = (state = memberLoaderInitialState, action) => {
  switch (action.type) {
    case 'MEMBER_LOADING':
      return state;
    case 'MEMBER_LOADED':
      return action;
    default:
      return state;
  }
};

const memsumLoader = (state = memsumLoaderInitialState, action) => {
  switch (action.type) {
    case 'MEMBER_SUM_LOADING':
      return state;
    case 'MEMBER_SUM_LOADED':
      return action;
    default:
      return state;
  }
};

const collectLoader = (state = collectLoaderInitialState, action) => {
  switch (action.type) {
    case 'COLLECT_LOADED':
      return action;
    case 'COLLECT_CLEAR':
      return action;
    case 'COLLECT_RELOAD':
      return action;
    default:
      return state;
  }
};

const reportLoader = (state = reportLoaderInitialState, action) => {
  switch (action.type) {
    case 'REPORT_LOADED':
      return action;
    case 'REPORT_CLEAR':
      return action;
    case 'REPORT_RELOAD':
      return action;
    default:
      return state;
  }
};

const toggleTweet = (state = toggleTweetInitialState, action) => {
  switch (action.type) {
    case 'TWEET_toggle-off':
      return action;
    case 'TWEET_toggle-on':
      return action;
    default:
      return state;
  }
};

const toggleFavoriteStar = (state = toggleFavoriteInitialState, action) => {
  switch (action.type) {
    case 'FAVORITE_star-o':
      return action;
    case 'FAVORITE_star':
      return action;
    default:
      return state;
  }
};

const tweetLoader = (state = tweetLoaderInitialState, action) => {
  switch (action.type) {
    case 'TWEET_LOADED':
      return action;
    case 'TWEET_CLEAR':
      return action;
    case 'TWEET_RELOAD':
      return action;
    default:
      return state;
  }
};

const setOrderNowPrice = (state = setOrderNowPriceInitialState, action) => {
  if (action.type === 'ORDER_NOW_PRICE') {
    let ccodes = Object.assign([], state.ccodes).concat(action.ccode);
    ccodes = [...new Set(ccodes)];
    return { ccodes };
  }
  return state;
};

const nowPriceLoader = (state = nowPriceLoaderInitialState, action) => {
  switch (action.type) {
    case 'NOW_PRICE_LOADING':
      return Object.assign(state, action);
    case 'NOW_PRICE_LOADED':
      return action;
    default:
      return state;
  }
};

const stockPageLoader = (state = stockPageLoaderInitialState, action) => {
  switch (action.type) {
    case 'BRAND_LOADING':
      return state;
    case 'BRAND_LOADED':
      return action;
    case 'DETAIL_LOADED':
      return Object.assign(state, action);
    default:
      return state;
  }
};

const dbContextCreator = (state = dbContextCreatorInitialState, action) => {
  switch (action.type) {
    case 'DB_INITIALIZED':
      return action;
    default:
      return state;
  }
};

const moreReadReducer = (state = moreReadInitialState, action) => {
  switch (action.type) {
    case 'MORE_READ_STATUS':
      return action;
    default:
      return state;
  }
};

const loadedImage = (state = loadedImageInitialState, action) => {
  switch (action.type) {
    case 'LOAD_IMG_SRC':
      return action;
    default:
      return state;
  }
};

const routerHistoryRegister = (state = routerHistoryRegisterInitialState, action) => {
  switch (action.type) {
    case 'ROUTER_HISTORY_REGIST':
      return action;
    default:
      return state;
  }
};

const appInitializer = (state = appStartInitialState, action) => {
  switch (action.type) {
    case 'APP_INITIALIZED':
      return action;
    case 'SWITCH_PAGE':
      return action;
    default:
      return state;
  }
};

export default combineReducers({
  routerHistoryRegister,
  moreReadReducer,
  loadedImage,
  dbContextCreator,
  appInitializer,
  reportLoader,
  stockPageLoader,
  tweetLoader,
  toggleTweet,
  nowPriceLoader,
  setOrderNowPrice,
  memberLoader,
  toggleFavoriteStar,
  irLoader,
  ediLoader,
  priceLoader,
  highlowLoader,
  memsumLoader,
  suggestLoader,
  collectLoader,
});
