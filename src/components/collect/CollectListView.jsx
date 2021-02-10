import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import InfiniteScroll from 'react-infinite-scroll-component';
import ListRow from '../list/ListRow';
import MoreRead from '../parts/MoreRead';
import { setMoreReadStatus } from '../../actions/';
import PacUtil from '../../lib/util';
import PacHistoryManager from '../../logic/PacHistoryManager';
import { loadCollectStocks } from '../CollectStocksPage';

export const reportCreateRow = (repo, cnt) => (
  <ListRow key={`repo${repo.ccode}${cnt}`} repo={repo} />
);

class CollectListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { divs: [] };
    this.moreReadDispatch('loading');
    this.listHeight = (PacUtil.documentHeight() - 100) * 0.97;
    // this.historyManager = new PacHistoryManager(this.props.dbCtx, this.props.dispatch, 'list');
    // this.historyManager.init('list', this.props.history);
  }

  moreReadDispatch(status) {
    this.props.dispatch(setMoreReadStatus(status));
  }

  loadedContent() {
    switch (this.props.collectStatus) {
      case 'COLLECT_LOADED':
        return (
          <InfiniteScroll
            next={this.generateDivs}
            hasMore={false}
            height={this.listHeight}
            endMessage={
              <MoreRead
                priceLoad={true}
                onClick={
                  () => loadCollectStocks(this.props.dispatch, this.props.rows, this.props.colKey)
                } />}>
            {this.props.rows}
          </InfiniteScroll>
        );
      case 'COLLECT_LOADING':
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

CollectListView.propTypes = {
  dispatch: PropTypes.func.isRequired,
  dbCtx: PropTypes.shape().isRequired,
  rows: PropTypes.arrayOf(PropTypes.element).isRequired,
  collectStatus: PropTypes.string.isRequired,
  history: PropTypes.shape().isRequired,
  colKey: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  moreStatus: state.moreStatus,
  dbCtx: state.dbContextCreator.dbContext,
  rows: state.collectLoader.rows,
  collectStatus: state.collectLoader.type,
});
export default connect(mapStateToProps)(withRouter(CollectListView));
