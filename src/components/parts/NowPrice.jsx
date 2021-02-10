import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PacNowPriceManager from '../../logic/PacNowPriceManager';
import PacViewUtil from '../../logic/PacViewUtil';
import { orderNowPrice, startLoadNowPrice } from '../../actions/';
import Loading from './Loading';

class NowPrice extends React.Component {
  constructor(props) {
    super(props);
    this.ccode = this.props.ccode;
    this.nowPriceManager = new PacNowPriceManager(this.props.dbCtx);
    this.nowPrice = '';
    this.diffStr = '';
    this.nowStyle = {};
  }

  componentWillMount() {
    this.props.dispatch(orderNowPrice(this.ccode));
    if (this.props.selfLoad) {
      this.props.dispatch(startLoadNowPrice());
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.isNowPriceLoaded(nextProps)) {
      this.setNowPrice(nextProps);
    }
  }

  setNowPrice(nextProps) {
    const ps = (nextProps || this.props).nowPrices[nextProps.ccode];
    const fPs = PacViewUtil.priceFormat(ps, this.isNeedCalcLastPriceDiff(), nextProps.ccode);
    this.nowPrice = fPs.p;
    this.diffStr = fPs.df;
    this.nowStyle = fPs.style;
  }

  isNowPriceLoading(nextProps) {
    return (nextProps || this.props).nowPriceLoadStatus === 'NOW_PRICE_LOADING';
  }

  isNowPriceLoaded(nextProps) {
    return (nextProps || this.props).nowPriceLoadStatus === 'NOW_PRICE_LOADED';
  }

  isNeedCalcLastPriceDiff() {
    return this.props.mode === 'withLastPriceDiff';
  }

  price() {
    if (this.isNowPriceLoading()) {
      this.diffStr = '';
      return <Loading lodingText={false} circleColor="teal" circleSize={15} />;
    }
    return this.nowPrice;
  }

  render() {
    let body = '';
    if (this.props.dispType === '1line') {
      body = (
        <span style={this.nowStyle}>{this.price()}<span style={{ fontSize: '0.7em' }}>{this.diffStr}</span></span>
      );
    } else if (this.props.dispType === '2line') {
      body = (
        <div key={`nowprice${this.props.ccode}`} className={this.props.className}>
          <div>
            <span style={this.nowStyle}>{this.price()}</span>
          </div>
          <div style={{ fontSize: '0.7em', fontWeight: '400' }}>
            <span style={this.nowStyle}>{this.diffStr}</span>
          </div>
        </div>
      );
    }
    return body;
  }
}

NowPrice.propTypes = {
  ccode: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  mode: PropTypes.string,
  className: PropTypes.string,
  selfLoad: PropTypes.bool,
  dispType: PropTypes.string,
  dbCtx: PropTypes.shape().isRequired,
};
NowPrice.defaultProps = {
  mode: 'priceOnly',
  className: '',
  selfLoad: false,
  dispType: '2line',
};

const mapStateToProps = state => ({
  nowPrices: state.nowPriceLoader.nowPrices,
  nowPriceLoadStatus: state.nowPriceLoader.type,
  dbCtx: state.dbContextCreator.dbContext,
});

export default connect(mapStateToProps)(NowPrice);
