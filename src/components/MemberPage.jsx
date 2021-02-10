import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import XRegExp from 'xregexp';
import Paper from 'material-ui/Paper';
import Table from 'material-ui/Table/Table';
import TableBody from 'material-ui/Table/TableBody';
import TableRow from 'material-ui/Table/TableRow';
import FA from 'react-fontawesome';
import { startLoadMember, startLoadMemberSum } from '../actions/';
import Retweet from './parts/Retweet';
import PacHistoryManager from '../logic/PacHistoryManager';
import PacDate from '../lib/date';
import PacUtil from '../lib/util';
import PacProfImg from './parts/PacProfImg';
import PacViewUtil from '../logic/PacViewUtil';
import PacBadgeEmp from './parts/PacBadgeEmp';
import { SmallCell, SmallCellR } from './parts/SmallTableParts';
import { REG_URL, REG_TWITTER_USER, REG_RETWEET } from '../lib/const';

class MemberPage extends React.Component {
  constructor(prop) {
    super(prop);
    this.userId = this.props.match.params.userId;

    this.handleClickBack = this.handleClickBack.bind(this);
    this.historyManager = new PacHistoryManager(this.props.dbCtx, this.props.dispatch, 'member');
    this.historyManager.init(this.userId, this.props.history);
    this.props.dispatch(startLoadMember(this.userId));
    this.props.dispatch(startLoadMemberSum(this.userId));
    this.member = {};
    this.height = (PacUtil.documentHeight() - 100) * 0.98;
  }

  handleClickBack() {
    this.historyManager.executeBack(this.props.routerHistory);
  }

  loadedContent() {
    this.member = this.props.member;
    return (
      <div>
        <div className="member-header">
          <div className="member-header-top-back">
            <FA name="arrow-circle-left" onClick={this.handleClickBack} />
          </div>
          <PacProfImg
            className="member-img"
            userId={this.userId}
            src={this.member.prifile_image_url} />
          <div className="member-name">
            <Link
              to={`https://twitter.com/${this.member.screen_name}`}
              target="_blank">
              {this.member.name}
            </Link>
          </div>
        </div>
        <div className="member-body" style={{ height: this.height }}>
          {this.main()}
        </div>
      </div>
    );
  }

  linkClick(ccode) {
    this.historyManager.next(ccode);
  }

  lastTweet() {
    const tw = this.props.memsum.t;
    const t = PacViewUtil.getBasicStylingTweetText(tw);
    const targetWords = PacViewUtil.getTweetTargetWords(tw);
    const wcm = targetWords.wordCcodeMap || {};
    let targets = [REG_URL, REG_RETWEET, REG_TWITTER_USER];
    targets = targets.concat(targetWords.targets);

    const children = PacViewUtil.allItemReplace(t, targets, (word, cnt) => {
      const cd = wcm[word];
      if (cd) {
        const link = `/stock/${cd}`;
        return <Link key={cnt} to={link} onClick={() => { this.linkClick(cd); }}>{word}</Link>;
      }
      if (XRegExp.test(word, REG_URL)) {
        return <a key={`dtl${cnt}`} href={word} target="_blank" style={{ fontSize: '0.8em' }}>{word}</a>;
      }
      if (XRegExp.test(word, REG_RETWEET)) {
        return <Retweet key={`rt${cnt}`} tw={tw} cnt={cnt} screenName={word} />;
      }
      if (XRegExp.test(word, REG_TWITTER_USER)) {
        const screenName = word.substring(1);
        return <a key={`twuer${cnt}${screenName}`} className="badge badge-lignt tweet-user-link" href={`https://twitter.com/${screenName}`} target="_blank">@{screenName}</a>;
      }
      return word;
    });
    const lineList = PacViewUtil.splitLineList(children);
    const ret = _.map(lineList, (childList, i) => (<div key={`twtx${i}`}>{childList}</div>));
    let capDate = '';
    if (!_.isEmpty(tw)) {
      capDate = (
        <PacBadgeEmp
          caption={PacDate.transShort(tw.created_at)}
          type="middle"
          style={{ backgroundColor: '#eaf8e8' }} />
      );
    }
    return (
      <Paper className="member-card">
        <div className="member-card-head">
          <div className="member-tw-title">
            最新の銘柄ツイート
          </div>
          <div>{capDate}</div>
        </div>
        <div className="tweet-row-text">{ret}</div>
        <div>{this.mediaHtml()}</div>
      </Paper>
    );
  }

  imgErr() {
    this.mediaNode.textContent = '';
  }

  mediaHtml() {
    const tw = this.props.memsum.t;
    if (tw.media_url) {
      return (
        <div ref={(n) => { this.mediaNode = n; }}>
          <hr style={{ width: '94%' }} />
          {_.map(tw.media_url, (u, i) => (
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

  rank() {
    let body = (
      <TableRow style={{ height: '6px', fontSize: '0.8em' }}>
        <SmallCell colSpan={3} style={{ textAlign: 'center' }}>なし</SmallCell>
      </TableRow>);
    if (this.props.memsum && this.props.memsum.r) {
      const ranks = this.props.memsum.r;
      body = ranks.map(r => (
        <TableRow key={`memr${r.cd}`} style={{ height: '6px', fontSize: '0.8em' }}>
          <SmallCell style={{ border: '1px solid #dddddd' }}>
            <Link className="badge pac-btn-ccode-lnk mr-2" style={{ fontSize: '0.94em', height: '10px' }} to={`/stock/${r.cd}`}>{r.cd}</Link>
            {`${r.nm}`}
          </SmallCell>
          <SmallCellR style={{ paddingRight: '3px', width: '25px' }}>{`${r.ct}回`}</SmallCellR>
          <SmallCellR style={{ paddingRight: '3px', border: '1px solid #dddddd', width: '30px' }}>{PacDate.transShort(r.d)}</SmallCellR>
        </TableRow>
      ));
    }


    const tbl = (
      <Table style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <TableBody style={{ border: '1px solid #dddddd' }}>
          {body}
        </TableBody>
      </Table>
    );
    return (
      <Paper className="member-card">
        <div className="member-card-head">
          <div className="member-tw-title">
            15日以内にツイートした銘柄(上位20件)
          </div>
        </div>
        <div>
          {tbl}
        </div>
      </Paper>
    );
  }

  main() {
    let dat = <span>データなし</span>;
    if (this.props.memsumState === 'MEMBER_SUM_LOADED') {
      dat = (
        <div style={{ textAlign: 'center' }}>
          {this.lastTweet()}
          {this.rank()}
        </div>
      );
    }
    return dat;
  }

  render() {
    if (this.props.memberState === 'MEMBER_LOADED') {
      return this.loadedContent();
    }
    return <div style={{ textAlign: 'center' }}>now loading...</div>;
  }
}
MemberPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  memberState: PropTypes.string,
  member: PropTypes.shape(),
  memsumState: PropTypes.string,
  memsum: PropTypes.shape(),
  dispatch: PropTypes.func.isRequired,
  dbCtx: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  routerHistory: PropTypes.shape().isRequired,
};
MemberPage.defaultProps = {
  memberState: '',
  member: {},
  memsumState: '',
  memsum: {},
};

const mapStateToProps = state => ({
  memberState: state.memberLoader.type,
  member: state.memberLoader.member,
  memsumState: state.memsumLoader.type,
  memsum: state.memsumLoader.memsum,
  dbCtx: state.dbContextCreator.dbContext,
  routerHistory: state.routerHistoryRegister.routerHistory,
});
export default connect(mapStateToProps)(withRouter(MemberPage));
