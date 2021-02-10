import React from 'react';
import FA from 'react-fontawesome';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import { MarkUp, MarkNew, MarkHigh, MarkLow } from '../parts/Mark';


function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ListHelpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClickOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    return (
      <span>
        <FA
          name="question-circle"
          onClick={this.handleClickOpen}
          style={{ color: '#226b80', fontSize: '0.8rem', marginLeft: '5px' }} />
        <Dialog
          open={this.state.open}
          transition={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description">
          <DialogTitle id="alert-dialog-slide-title" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.8em' }}>「株パクパク」へようこそ</span>
          </DialogTitle>
          <DialogContent>
            <div style={{ fontSize: '0.7rem', marginBottom: '15px' }}>
            当サイトは、ツイッター株アカウントの皆さんの中から独断で100人ほど選定し、
            ツイート内容を解析、銘柄別に振り分けてお届けする、ツイッター連動型サイトです。
            </div>
            <ul style={{ fontSize: '0.7rem' }}>
              <li>ツイート更新は5分毎です。</li>
              <li>現在株価更新は20分毎です。</li>
              <li><MarkNew />: 初登場または30日ぶり</li>
              <li><MarkUp />: 30分以内tweet</li>
              <li><MarkHigh />: 3営業日以内にストップ高</li>
              <li><MarkLow />: 3営業日以内にストップ安</li>
            </ul>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </span>
    );
  }
}

export default ListHelpDialog;
