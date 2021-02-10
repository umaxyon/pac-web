import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Auth from '../logic/auth/Auth';
import SuggestForm from './parts/SuggestForm';
import NowPrice from './parts/NowPrice';

const style = {
  padding: '0',
  height: '32px',
};

export default class TopMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.handleToggle = () => this.setState({ open: !this.state.open });
    this.handleClose = this.handleClose.bind(this);
    this.loginout = this.loginout.bind(this);
    this.auth = new Auth();
  }

  loginout() {
    if (this.auth.isAuthenticated()) {
      this.auth.logout();
    } else {
      this.auth.login();
    }
  }

  handleClose() {
    console.log(window.location);
    this.setState({ open: false });
  }

  render() {
    return (
      <div>
        <IconButton
          className="top-title-menu-btn"
          style={style}
          onClick={this.handleToggle}>
          <MenuIcon />
        </IconButton>
        <Drawer
          open={this.state.open}
          onClose={this.handleClose}>
          <div style={{ width: '80vw', overflowY: 'auto' }}>
            <Button variant="raised" onClick={this.loginout} color="primary">
              {this.auth.isAuthenticated() ? 'ログアウト' : 'ログイン'}
            </Button>
            <div>
              日経平均：<NowPrice
                ccode="998407"
                mode="withLastPriceDiff"
                className="brand-now-price"
                dispType="1line"
                selfLoad={true} />
            </div>
            <div>
              ドル円：<NowPrice
                ccode="USDJPY"
                mode="withLastPriceDiff"
                className="brand-now-price"
                dispType="1line"
                selfLoad={true} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <SuggestForm onSuggestClick={this.handleClose} />
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}
