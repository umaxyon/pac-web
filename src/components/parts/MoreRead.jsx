import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Chip from 'material-ui/Chip';
import Loading from './Loading';
import { setMoreReadStatus, startLoadNowPrice } from '../../actions/';

class MoreRead extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      if (nextProps.moreStatus === 'more' || nextProps.moreStatus === 'end') {
        this.priceLoad();
      }
    }
  }

  onClick() {
    this.moreReadDispatch('loading');
    this.props.onClick();
  }

  moreReadDispatch(status) {
    this.props.dispatch(setMoreReadStatus(status));
  }

  priceLoad() {
    if (this.props.priceLoad && this.props.orderNowPriceCcodes.length > 0) {
      this.props.dispatch(startLoadNowPrice());
    }
  }

  content() {
    let buf;
    switch (this.props.moreStatus) {
      case 'loading':
        buf = (
          <div>
            <Loading />
          </div>);
        break;
      case 'more':
        buf = <Chip className="more-load" onClick={this.onClick} label="さらに読み込む" />;
        break;
      case 'end':
        buf = <span>最後のデータです</span>;
        break;
      default:
        buf = '';
    }
    return buf;
  }

  render() {
    return (
      <div className="more-load-div">
        {this.content()}
      </div>
    );
  }
}

MoreRead.propTypes = {
  moreStatus: PropTypes.string,
  onClick: PropTypes.func,
  priceLoad: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  orderNowPriceCcodes: PropTypes.arrayOf(PropTypes.string),
};
MoreRead.defaultProps = {
  moreStatus: 'loading',
  priceLoad: false,
  orderNowPriceCcodes: [],
  onClick: () => {},
};

const mapStateToProps = state => ({
  moreStatus: state.moreReadReducer.moreStatus,
  orderNowPriceCcodes: state.setOrderNowPrice.ccodes,
});

export default connect(mapStateToProps)(MoreRead);
