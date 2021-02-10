import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FA from 'react-fontawesome';
import PacProfImg from './PacProfImg';
import PacUtil from '../../lib/util';
import PacViewUtil from '../../logic/PacViewUtil';

class Retweet extends React.Component {
  constructor(props) {
    super(props);
    this.styleClass = {
      img: 's_badge_img',
      cap: 's_badge_cap',
      base: 's_badge_base',
    };
  }

  render() {
    const screenName = PacViewUtil.getTwitterScreenNamesInText(this.props.screenName);
    const name = this.props.tw.retweet_user_name || screenName;
    const capCutSize = (PacUtil.isWidthSmall()) ? 13 : 15;
    return (
      <div style={{ paddingBottom: '8px' }}>
        <Link
          to={`https://twitter.com/${screenName}`}
          className={`badge ${this.styleClass.base}`}
          target="_blank">
          <span className="item-middle">
            <FA
              name="retweet"
              style={{ color: '#606470', fontSize: '0.9rem', marginRight: '8px' }} />
            <PacProfImg
              src={this.props.tw.retweet_user_profile_image}
              type="retweet"
              className={this.styleClass.img} />
            <span className={this.styleClass.cap}>{PacUtil.strCut(name, capCutSize)}</span>
          </span>
        </Link>
      </div>
    );
  }
}

Retweet.propTypes = {
  tw: PropTypes.shape().isRequired,
  screenName: PropTypes.string.isRequired,
};

export default Retweet;
