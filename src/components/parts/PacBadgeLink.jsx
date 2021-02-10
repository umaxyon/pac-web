import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import PacUtil from '../../lib/util';
import PacProfImg from './PacProfImg';


class PacBadgeLink extends React.Component {
  constructor(props) {
    super(props);
    this.styleClass = {
      img: 's_badge_img',
      cap: 's_badge_cap',
      base: 's_badge_base',
    };
    switch (props.type) {
      case 's-small':
        this.styleClass.img = 'ss_badge_img';
        this.styleClass.cap = 's_badge_cap';
        this.styleClass.base = 's_badge_base';
        break;
      case 'small':
        this.styleClass.img = 's_badge_img';
        this.styleClass.cap = 's_badge_cap';
        this.styleClass.base = 's_badge_base';
        break;
      case 'small-normal':
        this.styleClass.img = 's_badge_img';
        this.styleClass.cap = 'n_badge_cap';
        this.styleClass.base = 's_badge_base';
        break;
      case 'middle':
        this.styleClass.img = 'm_badge_img';
        this.styleClass.cap = 'm_badge_cap';
        this.styleClass.base = 'm_badge_base';
        break;
      default:
    }
  }

  imageError(e) {
    e.target.src = './img/no_user.png';
  }
  render() {
    const capCutSize = (PacUtil.isWidthSmall()) ? 11 : 13;
    return (
      <Link
        className={`badge ${this.styleClass.base}`}
        style={this.props.style}
        to={this.props.link}
        onClick={this.props.onClick}>
        <span className="item-middle">
          <PacProfImg
            className={this.styleClass.img}
            userId={this.props.userId}
            src={this.props.imgSrc} />
          <span
            ref={(n) => { this.inputNode = n; }}
            className={this.styleClass.cap}>{PacUtil.strCut(this.props.caption, capCutSize)}</span>
          {this.props.mark()}
        </span>
      </Link>
    );
  }
}

PacBadgeLink.propTypes = {
  caption: PropTypes.string.isRequired,
  imgSrc: PropTypes.string,
  userId: PropTypes.string,
  link: PropTypes.string,
  type: PropTypes.string,
  mark: PropTypes.func,
  onClick: PropTypes.func,
  style: PropTypes.shape(),
};
PacBadgeLink.defaultProps = {
  link: '#',
  imgSrc: null,
  userId: '',
  style: {},
  type: 'small',
  mark: () => {},
  onClick: () => {},
};

export default PacBadgeLink;
