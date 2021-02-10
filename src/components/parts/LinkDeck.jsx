import React from 'react';
import PropTypes from 'prop-types';
import FA from 'react-fontawesome';
import PacUtil from '../../lib/util';

class LinkDeck extends React.Component {
  constructor(props) {
    super(props);
    this.gotoKeijiban = this.gotoKeijiban.bind(this);
    this.getHome = this.getHome.bind(this);
    this.getKj = this.getKj.bind(this);
  }

  getHome() {
    if (this.props.home) {
      return this.props.home;
    }
    if (this.props.brand) {
      return this.props.brand.url;
    }
    return null;
  }

  getKj() {
    if (this.props.kj) {
      return this.props.kj;
    }
    if (this.props.brand) {
      return this.props.brand.kj;
    }
    return null;
  }

  gotoKeijiban() {
    const url = (PacUtil.device() === 'sp') ? 'yjfinance://stock/bbs?code=' + this.props.ccode : this.getKj();
    window.open(url);
  }

  render() {
    return (
      <div className="link-deck">
        <a href={`https://kabutan.jp/stock/chart?code=${this.props.ccode}`} target="_blank" rel="noreferrer noopener">
          <img src="/img/kt.ico" className="row-icon" alt="株探" />
        </a>
        <a href="javascript:void(0)" onClick={() => (this.gotoKeijiban())} target="_blank" rel="noreferrer noopener" style={{ height: '29px' }}>
          <img src="/img/yf.ico" className="row-icon" alt="YahooStock掲示板" style={{ marginLeft: '10px', paddingTop: '3px', height: '20px', width: '20px' }} />
        </a>
        <a href={this.getHome()} target="_blank" rel="noreferrer noopener" style={{ marginLeft: '9px', textDecoration: 'none', color: '#0f4137', paddingBottom: '2px' }}>
          <FA name="home" />
        </a>
      </div>
    );
  }
}

LinkDeck.propTypes = {
  ccode: PropTypes.string.isRequired,
  kj: PropTypes.string,
  home: PropTypes.string,
  brand: PropTypes.shape(),
};
LinkDeck.defaultProps = {
  kj: '',
  home: '',
  brand: {},
};
export default LinkDeck;

