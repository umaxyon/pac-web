import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createMuiTheme } from 'material-ui/styles';
import ListPage from './ListPage';
import StockPage from './StockPage';
import MemberPage from './MemberPage';
import TopMenu from './TopMenu';
import { initApp } from '../actions/';
import Auth from '../logic/auth/Auth';
import CollectStocksPage from './CollectStocksPage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.theme = createMuiTheme();
    this.props.dispatch(initApp());
  }

  handleAuthentication({ location }) {
    if (/access_token|id_token|error/.test(location.hash)) {
      new Auth().handleAuthentication();
    }
  }

  content() {
    if (this.props.appInit === 'ok') {
      return (
        <Switch>
          <Route exact path="/list" component={ListPage} />
          <Route exact path="/thema/:key" component={CollectStocksPage} />
          <Route exact path="/stock/:ccode" component={StockPage} />
          <Route exact path="/member/:userId" component={MemberPage} />
          <Route
            path="/callback"
            render={
              (props) => {
                this.handleAuthentication(props);
                return <ListPage />;
              }
            } />
        </Switch>
      );
    }
    return '';
  }

  render() {
    return (
      <MuiThemeProvider theme={this.theme}>
        <Router>
          <div className="app">
            <div className="top-title">
              <div className="top-title-img-div">
                <img width="23vw" height="23vh" src="/img/pac.png" alt="株パクパク" style={{ marginRight: '7px' }} />
                <img height="22vh" src="/img/title.png" alt="株パクパク" style={{ paddingBottom: '1px' }} />
              </div>
              {/* <h1 className="top-title-cap">株パクパク</h1> */}

              <TopMenu />
            </div>
            {this.content()}
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  appInit: PropTypes.string.isRequired,
};
App.defaultProps = {
  appInit: 'process..',
};
const mapStateToProps = state => ({
  moreStatus: state.moreStatus,
  appInit: state.appInitializer.progress,
});
export default connect(mapStateToProps)(App);
