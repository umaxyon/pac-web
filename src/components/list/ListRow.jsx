import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import { Link } from 'react-router-dom';
import PacDate from '../../lib/date';
import PacBadgeLink from '../parts/PacBadgeLink';
import NowPrice from '../parts/NowPrice';
import { MarkUp, MarkNew, MarkHigh, MarkLow } from '../parts/Mark';
import LinkDeck from '../parts/LinkDeck';
import PacHistoryManager from '../../logic/PacHistoryManager';
import FavoriteStar from '../parts/FavoriteStar';


function gatName(repo) {
  let nm = '';
  if (repo) {
    if (repo.user) {
      nm = repo.user.name || '';
    }
    if (!nm || nm === '') {
      nm = repo.last_up_uname || '';
    }
  }
  return nm;
}

class ListRow extends React.Component {
  constructor(props) {
    super(props);
    this.repo = this.props.repo;
    this.imgDb = this.props.dbCtx.profImg;
    this.historyManager = new PacHistoryManager(this.props.dbCtx, this.props.dispatch, 'list');
  }

  linkToStock(ccode) {
    return `/stock/${ccode}`;
  }

  linkToMember(userId) {
    this.historyManager.next(userId, 'member');
  }

  markUpOrNew(repo) {
    if (PacDate.dayAgo(1) < repo.created_at ||
      (repo.ago_uptime && PacDate.dayAgo(30) > repo.ago_uptime)) {
      return <MarkNew style={{ marginLeft: '7px' }} />;
    } else if (PacDate.minAgo(30) < repo.last_updated_at) {
      return <MarkUp style={{ marginLeft: '7px' }} />;
    }
    return '';
  }

  mark() {
    const mk = [];
    if (this.repo.mk && this.repo.mk.hs === '*') {
      mk.push(<MarkHigh key={`mkHigh${this.repo.ccode}`} style={{ marginLeft: '8px' }} />);
    }
    if (this.repo.mk && this.repo.mk.ls === '*') {
      mk.push(<MarkLow key={`mkLow${this.repo.ccode}`} style={{ marginLeft: '8px' }} />);
    }
    return mk;
  }

  render() {
    let userId = this.repo.last_update_user;
    if (this.repo.user && this.repo.user.id_str) {
      userId = this.repo.user.id_str;
    }

    return (
      <div>
        <Paper className="listrow-card">
          <div className="report-row-header">
            <div className="report-row-header-left">
              <Link
                className="badge pac-btn-ccode-lnk mr-1"
                to={this.linkToStock(this.repo.ccode)}>
                {this.repo.ccode}
              </Link>
              <PacBadgeLink
                caption={this.repo.tweets}
                imgSrc="/img/tw.ico"
                type="s-small"
                mark={() => (this.markUpOrNew(this.repo))}
                link={this.linkToStock(this.repo.ccode)} />
              {this.mark()}
            </div>
            <div className="report-row-header-right">
              <FavoriteStar ccode={this.repo.ccode} />
            </div>
          </div>
          <div className="report-row-main">
            <div className="report-row-main-left">
              <div className="report-row-name">
                {this.repo.name}
              </div>
            </div>
            <div className="report-row-main-right">
              <NowPrice
                ccode={this.repo.ccode}
                mode="withLastPriceDiff"
                className="report-now-price" />
            </div>
          </div>
          <div className="report-row-footer">
            <div className="report-row-footer-left">
              <Link to="" className="badge emp-btn mr-1 pac-emp-uptime">
                <span className="item-middle">
                  <img className="emp" src="./img/emp.png" alt="" /> <span className="tw-uptime">{PacDate.transShort(this.repo.last_updated_at)}</span>
                </span>
              </Link>
              <PacBadgeLink
                caption={gatName(this.repo)}
                imgSrc={this.imgDb.get(`profimg-${userId}`)}
                userId={userId}
                type="small"
                style={{ marginLeft: 3 }}
                link={`/member/${userId}`}
                onClick={() => { this.linkToMember(userId); }} />
            </div>
            <div className="report-row-footer-right">
              <LinkDeck ccode={this.repo.ccode} home={this.repo.url} kj={this.repo.kj} />
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

ListRow.propTypes = {
  repo: PropTypes.shape({
    ccode: PropTypes.any,
    name: PropTypes.string,
  }).isRequired,
  dbCtx: PropTypes.shape().isRequired,
  dispatch: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  dbCtx: state.dbContextCreator.dbContext,
});
export default connect(mapStateToProps)(ListRow);
