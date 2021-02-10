import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import CollectListView from './collect/CollectListView';
import ListHelpDialog from './list/ListHelpDialog';
import { startLoadCollectStocks } from '../actions/';

export const loadCollectStocks = (dispatch, rows, key) => {
  const page = (rows.length / 10) + 1;
  dispatch(startLoadCollectStocks(key, page));
};

class CollectStocksPage extends React.Component {
  constructor(prop) {
    super(prop);
    this.key = this.props.match.params.key;
    loadCollectStocks(this.props.dispatch, [], this.key);
  }

  loadedContent() {
    return (
      <div>
        <div className="list-page-header pl-2 pt-1">
          {this.key}
          <div className="ss_txt">
            <ListHelpDialog />
          </div>
        </div>
        <div className="listpage-div">
          <CollectListView colKey={this.key} />
        </div>
      </div>
    );
  }

  render() {
    if (this.props.collectStatus === 'COLLECT_LOADED') {
      return this.loadedContent();
    }
    return <div style={{ textAlign: 'center' }}>now loading...</div>;
  }
}

CollectStocksPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      key: PropTypes.string,
    }).isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  collectStatus: PropTypes.string.isRequired,
};
const mapStateToProps = state => ({
  location: state.location,
  collectStatus: state.collectLoader.type,
});
export default connect(mapStateToProps)(withRouter(CollectStocksPage));
