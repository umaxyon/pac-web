import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import InfiniteScroll from 'react-infinite-scroll-component';
import ListRow from './ListRow';
import MoreRead from '../parts/MoreRead';
import { setMoreReadStatus } from '../../actions/';
import PacUtil from '../../lib/util';
import PacHistoryManager from '../../logic/PacHistoryManager';
import { loadReport } from '../../components/ListPage';

export const reportCreateRow = (repo, cnt) => (
  <ListRow key={`repo${repo.ccode}${cnt}`} repo={repo} />
);

class ListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { divs: [] };
    this.moreReadDispatch('loading');
    this.listHeight = (PacUtil.documentHeight() - 100) * 0.97;
    this.historyManager = new PacHistoryManager(this.props.dbCtx, this.props.dispatch, 'list');
    this.historyManager.init('list', this.props.history);
  }

  moreReadDispatch(status) {
    this.props.dispatch(setMoreReadStatus(status));
  }

  loadedContent() {
    switch (this.props.reportStatus) {
      case 'REPORT_LOADED':
        return (
          <InfiniteScroll
            next={this.generateDivs}
            hasMore={false}
            height={this.listHeight}
            endMessage={
              <MoreRead
                priceLoad={true}
                onClick={() => loadReport(this.props.dispatch, this.props.reportRows)} />}>
            {this.props.reportRows}
          </InfiniteScroll>
        );
      case 'REPORT_LOADING':
        return 'Loading...';
      default:
    }
    return '';
  }

  render() {
    return (
      <div>
        {this.loadedContent()}
      </div>
    );
  }
}

ListView.propTypes = {
  dispatch: PropTypes.func.isRequired,
  dbCtx: PropTypes.shape().isRequired,
  reportRows: PropTypes.arrayOf(PropTypes.element).isRequired,
  reportStatus: PropTypes.string.isRequired,
  history: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  moreStatus: state.moreStatus,
  dbCtx: state.dbContextCreator.dbContext,
  reportRows: state.reportLoader.reportRows,
  reportStatus: state.reportLoader.type,
});
export default connect(mapStateToProps)(withRouter(ListView));
