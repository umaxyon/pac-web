import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import FA from 'react-fontawesome';
import SwipeableViews from 'react-swipeable-views';
import Tabs from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import PacUtil from '../lib/util';
import PacHistoryManager from '../logic/PacHistoryManager';
import PacTab from './parts/PacTab';
import NowPrice from './parts/NowPrice';
import BrandInfo from './stock/BrandInfo';
import RankView from './stock/RankView';
import IRView from './stock/IRView';
import TweetsView from './stock/TweetsView';
import {
  startLoadStock,
  startLoadIR,
  startLoadEDI,
  startLoadPrice,
  startLoadRank,
} from '../actions/';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 1 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = {
  tabs: {
    backgroundColor: '#00bcd4',
    minHeight: '25px',
    height: '25px',
  },
};

class StockPage extends React.Component {
  constructor(prop) {
    super(prop);

    this.ccode = this.props.match.params.ccode;
    this.state = {
      tabIndex: 0,
    };
    this.tabChange = this.tabChange.bind(this);
    this.tabChangeIndex = this.tabChangeIndex.bind(this);
    this.handleClickBack = this.handleClickBack.bind(this);
    this.tabAreaHeight = (PacUtil.documentHeight() - 120) * 0.95;
    this.historyManager = new PacHistoryManager(this.props.dbCtx, this.props.dispatch, 'stock');
    this.historyManager.init(this.ccode, this.props.history);
    this.init();
  }

  init() {
    const stockLoad = cd => (this.props.dispatch(startLoadStock(cd)));
    stockLoad(this.ccode);
  }

  tabChange(event, tabIndex) {
    this.setState({ tabIndex });
    if (tabIndex === 1) {
      this.props.dispatch(startLoadEDI(this.ccode));
      this.props.dispatch(startLoadPrice(this.ccode));
    } else if (tabIndex === 2) {
      this.props.dispatch(startLoadIR(this.ccode));
    } else if (tabIndex === 3) {
      this.props.dispatch(startLoadRank(this.ccode));
    }
  }

  tabChangeIndex(index) {
    this.setState({ tabIndex: index });
  }

  handleClickBack() {
    this.tabChangeIndex(0);
    this.historyManager.executeBack(this.props.routerHistory);
  }

  loadedContent() {
    const { ccode, name, market } = this.props.brand;
    this.ccode = ccode;
    let titleSize = '1em';
    if (PacUtil.isWidthSmall()) {
      titleSize = (name.length > 18) ? '0.7em' : '0.8em';
      titleSize = (name.length > 22) ? '0.6em' : titleSize;
    } else if (PacUtil.isWidthBig()) {
      titleSize = (name.length > 18) ? '1.2em' : '1.5em';
    } else {
      titleSize = (name.length > 18) ? '0.8em' : '1em';
      titleSize = (name.length > 22) ? '0.7em' : titleSize;
    }
    return (
      <div>
        <div className="detail-header">
          <div className="detail-header-top-box">
            <div className="detail-header-top-left">
              <div className="detail-header-top-left-top">
                <div className="detail-header-top-back">
                  <FA name="arrow-circle-left" onClick={this.handleClickBack} />
                </div>
                <span className="badge badge-light detail-header-ccode">{ccode}</span>
                <span className="badge badge-success detai-badge ml-1">{market}</span>
              </div>
              <div style={{ marginLeft: '10px' }}>
                <span style={{ fontSize: titleSize }} className="detail-header-name">{name}</span>
              </div>
            </div>
            <div className="detail-header-top-right">
              <NowPrice
                ccode={this.ccode}
                mode="withLastPriceDiff"
                className="brand-now-price"
                selfLoad={true} />
            </div>
          </div>
          <div className="detail-header-infoline">
            <span>{}</span>
          </div>
        </div>
        <div>
          <Tabs
            value={this.state.tabIndex}
            onChange={this.tabChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
            style={styles.tabs}>
            <PacTab icon={<FA name="twitter" />} />
            <PacTab label="基本" />
            <PacTab label="IR" />
            <PacTab label="履歴" />
          </Tabs>
          <SwipeableViews
            axis={this.props.theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={this.state.tabIndex}
            style={{ height: this.tabAreaHeight + 10 }}
            onChangeIndex={this.tabChangeIndex}>
            <TabContainer dir={this.props.theme.direction}>
              <div style={{ height: this.tabAreaHeight, textAlign: 'center' }}>
                <TweetsView ccode={this.props.brand.ccode} height={this.tabAreaHeight} />
              </div>
            </TabContainer>
            <TabContainer dir={this.props.theme.direction}>
              <div style={{ height: this.tabAreaHeight, textAlign: 'center' }}>
                <BrandInfo brand={this.props.brand} height={this.tabAreaHeight} />
              </div>
            </TabContainer>
            <TabContainer dir={this.props.theme.direction}>
              <div style={{ height: this.tabAreaHeight, textAlign: 'center' }}>
                <IRView brand={this.props.brand} height={this.tabAreaHeight} />
              </div>
            </TabContainer>
            <TabContainer dir={this.props.theme.direction}>
              <div style={{ height: this.tabAreaHeight, textAlign: 'center' }}>
                <RankView height={this.tabAreaHeight} />
              </div>
            </TabContainer>
          </SwipeableViews>
        </div>
      </div>
    );
  }

  render() {
    if (this.props.brandState === 'BRAND_LOADED') {
      return this.loadedContent();
    }
    return <div style={{ textAlign: 'center' }}>now loading...</div>;
  }
}

StockPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      ccode: PropTypes.string,
    }).isRequired,
  }).isRequired,
  theme: PropTypes.shape().isRequired,
  brand: PropTypes.shape().isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape().isRequired,
  dbCtx: PropTypes.shape().isRequired,
  brandState: PropTypes.string.isRequired,
  routerHistory: PropTypes.shape().isRequired,
};

const themaStyles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
});
const mapStateToProps = state => ({
  dbCtx: state.dbContextCreator.dbContext,
  brand: state.stockPageLoader.brand,
  brandState: state.stockPageLoader.type,
  routerHistory: state.routerHistoryRegister.routerHistory,
});
export default withStyles(
  themaStyles,
  { withTheme: true },
)(connect(mapStateToProps)(withRouter(StockPage)));
