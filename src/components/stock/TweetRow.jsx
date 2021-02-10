import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import XRegExp from 'xregexp';
import Paper from 'material-ui/Paper';
import { Link } from 'react-router-dom';
import PacDate from '../../lib/date';
import PacBadgeLink from '../parts/PacBadgeLink';
import PacBadgeEmp from '../parts/PacBadgeEmp';
import TweetRowToggle from '../parts/TweetRowToggle';
import Retweet from '../parts/Retweet';
import PacHistoryManager from '../../logic/PacHistoryManager';
import PacFriendsManager from '../../logic/PacFriendsManager';
import PacViewUtil from '../../logic/PacViewUtil';
import { REG_URL, REG_TWITTER_USER, REG_RETWEET } from '../../lib/const';
import { startLoadStock, orderNowPrice, startLoadNowPrice } from '../../actions/';


function profileNullToBlank(ob, key) {
  if (ob && ob.user) {
    return ob.user[key] || '';
  }
  return '';
}

class TweetRow extends React.Component {
  constructor(props) {
    super(props);
    this.tw = this.props.tw;
    this.user = this.props.tw.user;
    this.ccode = this.props.ccode;
    if (this.tw.ws) {
      const { targets, wordCcodeMap } = PacViewUtil.getTweetTargetWords(this.tw);
      this.wordCcodeMap = wordCcodeMap;
      this.mecabWordTargets = targets;
      this.mecabWordTargetsMyCcode = _.filter(targets, r => wordCcodeMap[r] === this.ccode);
      const ccodeVals = _.values(this.wordCcodeMap);
      this.tweetInOtherCcodes = _.filter(ccodeVals, cd => cd !== this.ccode);
      this.toggleName = 'toggle-off';
    }
    this.friendsManager = new PacFriendsManager(this.props.dbCtx);
    this.historyManager = new PacHistoryManager(this.props.dbCtx, this.props.dispatch, 'stock');
    this.imgErr = this.imgErr.bind(this);
  }

  tweetToHtml() {
    const t = PacViewUtil.getBasicStylingTweetText(this.tw);
    const pageCd = this.ccode;
    const wcm = this.wordCcodeMap || {};
    let targets = [REG_URL, REG_RETWEET, REG_TWITTER_USER];

    if (this.isToggleOn() && this.mecabWordTargets) {
      targets = targets.concat(this.mecabWordTargets);
    } else if (this.mecabWordTargetsMyCcode) {
      targets = targets.concat(this.mecabWordTargetsMyCcode);
    }

    const children = PacViewUtil.allItemReplace(t, targets, (word, cnt) => {
      const cd = wcm[word];
      if (cd) {
        if (cd !== pageCd) {
          const link = `/stock/${cd}`;
          return <Link key={cnt} to={link} onClick={() => { this.linkClick(cd); }}>{word}</Link>;
        }
        return <span key={cnt} style={{ color: '#c40018' }} >{word}</span>;
      }
      if (XRegExp.test(word, REG_URL)) {
        return <a key={`dtl${cnt}`} href={word} target="_blank" style={{ fontSize: '0.8em' }}>{word}</a>;
      }
      if (XRegExp.test(word, REG_RETWEET)) {
        return <Retweet key={`rt${cnt}`} tw={this.tw} cnt={cnt} screenName={word} />;
      }
      if (XRegExp.test(word, REG_TWITTER_USER)) {
        const screenName = word.substring(1);
        return <a key={`twuer${cnt}${screenName}`} className="badge badge-lignt tweet-user-link" href={`https://twitter.com/${screenName}`} target="_blank">@{screenName}</a>;
      }
      return word;
    });

    const lineList = PacViewUtil.splitLineList(children);
    return _.map(lineList, (childList, i) => (<div key={`twtx${i}`}>{childList}</div>));
  }

  linkClick(ccode) {
    this.historyManager.next(ccode);
    this.props.dispatch(orderNowPrice(ccode));
    this.props.dispatch(startLoadStock(ccode));
    this.props.dispatch(startLoadNowPrice());
  }

  imgErr() {
    this.mediaNode.textContent = '';
  }

  mediaHtml() {
    if (this.tw.media_url) {
      return (
        <div ref={(n) => { this.mediaNode = n; }}>
          <hr style={{ width: '94%' }} />
          {_.map(this.tw.media_url, (u, i) => (
            <div key={`twim${i}`} className="img-trim">
              <a href={u} target="_blank">
                <img alt="" src={u} height="100%" onError={(e) => { this.imgErr(e); }} />
              </a>
            </div>
          ))}
        </div>
      );
    }
    return '';
  }

  tweetPrice() {
    const prices = this.tw.prices;
    if (prices && prices[this.ccode]) {
      const pf = PacViewUtil.priceFormat(prices[this.ccode][0], true, this.ccode);
      return (
        <span style={pf.style}>
          {pf.p}<span style={{ fontSize: '0.9em' }}> {pf.df}</span>
        </span>
      );
    }
    return '';
  }

  isOtherCcodeInTweet() {
    return this.tw.ws && this.tweetInOtherCcodes.length > 0;
  }

  isToggleOn() {
    if (this.isOtherCcodeInTweet() && this.tw.id_str === this.props.toggleId) {
      this.toggleName = this.props.tweetToggleStatus;
    }
    return this.toggleName === 'toggle-on';
  }

  memberClick(userId) {
    this.historyManager.next(userId, 'member');
  }

  tweetToggle() {
    if (this.isOtherCcodeInTweet()) {
      return (
        <div style={{ textAlign: 'right' }}>
          <TweetRowToggle id={this.tw.id_str} />
        </div>
      );
    }
    return '';
  }

  render() {
    return (
      <div>
        <Paper className="listrow-card">
          <div>
            <div className="tweet-row-head">
              <div>
                <PacBadgeLink
                  caption={this.tw.user_name}
                  imgSrc={profileNullToBlank(this.user, 'profile_image_url')}
                  userId={this.tw.user_id}
                  link={`/member/${this.tw.user_id}`}
                  onClick={() => { this.memberClick(this.tw.user_id); }}
                  type="middle" />
              </div>
              <div style={{ marginRight: '10px', textAlign: 'right' }}>
                <div>
                  <PacBadgeEmp
                    caption={PacDate.transShort(this.tw.created_at)}
                    type="middle"
                    style={{ backgroundColor: '#eaf8e8' }} />
                </div>
                <div className="badge" style={{ fontSize: '0.7em', backgroundColor: '#fbfae1' }}>
                  {this.tweetPrice()}
                </div>
              </div>
            </div>
            <div className="tweet-row-text">
              {this.tweetToHtml()}
            </div>
            {this.tweetToggle()}
            {this.mediaHtml()}
          </div>
        </Paper>
      </div>
    );
  }
}

TweetRow.propTypes = {
  tw: PropTypes.shape({
    id_str: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    created_at: PropTypes.stirng,
    user_id: PropTypes.string,
    user_name: PropTypes.string,
    user: PropTypes.shape(),
  }).isRequired,
  ccode: PropTypes.string.isRequired,
  dbCtx: PropTypes.shape().isRequired,
  dispatch: PropTypes.func.isRequired,
  tweetToggleStatus: PropTypes.string.isRequired,
  toggleId: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  dbCtx: state.dbContextCreator.dbContext,
  tweetToggleStatus: state.toggleTweet.toggleState,
  toggleId: state.toggleTweet.tweetId,
});
export default connect(mapStateToProps)(TweetRow);
