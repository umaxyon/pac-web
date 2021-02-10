import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import ListView from './list/ListView';
import ListHelpDialog from './list/ListHelpDialog';
import { startLoadReport } from '../actions/';

export const loadReport = (dispatch, rows) => {
  const page = (rows.length / 10) + 1;
  dispatch(startLoadReport(page));
};

class ListPage extends React.Component {
  constructor(prop) {
    super(prop);
    loadReport(this.props.dispatch, []);
  }

  loadedContent() {
    return (
      <div>
        <div className="list-page-header pl-2 pt-1">
          最新ツイート一覧
          <div className="ss_txt">
            <ListHelpDialog />
          </div>
        </div>
        <div className="listpage-div">
          <ListView />
        </div>
      </div>
    );
  }

  render() {
    if (this.props.reportStatus === 'REPORT_LOADED') {
      return this.loadedContent();
    }
    return <div style={{ textAlign: 'center' }}>now loading...</div>;
  }
}

ListPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  reportStatus: PropTypes.string.isRequired,
};
const mapStateToProps = state => ({
  reportRows: state.reportLoader.reportRows,
  reportStatus: state.reportLoader.type,
  location: state.location,
});
export default connect(mapStateToProps)(withRouter(ListPage));
