import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class PacBadgeEmp extends React.Component {
  constructor(props) {
    super(props);
    this.styleClass = {
      img: 's_badge_img',
      cap: 's_badge_cap',
      base: 's_badge_base',
    };
    switch (props.type) {
      case 'small':
        this.styleClass.cap = 's_badge_cap';
        this.styleClass.base = 's_badge_base';
        break;
      case 'normal':
        this.styleClass.cap = 'n_badge_cap';
        this.styleClass.base = 's_badge_base';
        break;
      case 'middle':
        this.styleClass.cap = 'm_badge_cap';
        this.styleClass.base = 'm_badge_base';
        break;
      default:
    }
  }

  render() {
    return (
      <Link to="" className="badge emp-btn ml-2" style={this.props.style}>
        <span className="item-middle">
          <img className="emp" src="/img/emp.png" alt="" />
          <span className={this.styleClass.cap}>{this.props.caption}</span>
        </span>
      </Link>
    );
  }
}

PacBadgeEmp.propTypes = {
  caption: PropTypes.string.isRequired,
  type: PropTypes.string,
  style: PropTypes.shape(),
};
PacBadgeEmp.defaultProps = {
  style: {},
  type: 'small',
};

export default PacBadgeEmp;
