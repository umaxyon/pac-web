import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import XRegExp from 'xregexp';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import PacViewUtil from '../../logic/PacViewUtil';
import PacDate from '../../lib/date';
import PacBadgeEmp from '../parts/PacBadgeEmp';
import { REG_URL } from '../../lib/const';
import Loading from '../parts/Loading';

class IRView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: this.props.brand,
    };
    this.listHeight = this.props.height;
  }

  toHtml(ir) {
    const t = PacViewUtil.getBasicStylingTweetText(ir);
    const targets = [REG_URL, XRegExp('(（義務発生.+日.+\n)')];
    const children = PacViewUtil.allItemReplace(t, targets, (word, cnt) => {
      if (XRegExp.test(word, REG_URL)) {
        return <a key={`irurl${cnt}`} href={word} target="_blank" style={{ fontSize: '0.8em' }}>{word}</a>;
      }
      if (XRegExp.test(word, /（義務発生/)) {
        const match = /（(義務発生.+日).+\n/.exec(word)[1];
        return <div key={`irhoyugimu${ir.tid}`} className="irhoyugimu">{match}</div>;
      }

      return word;
    });
    const cd = this.props.brand.ccode;
    const lineList = PacViewUtil.splitLineList(children);
    let title = 'IR';
    if (lineList[0][0].indexOf(cd) === 0) {
      lineList.shift();
    } else {
      title = '報告';
    }
    lineList.unshift(
      <div className="irtitle">
        <PacBadgeEmp
          caption={title}
          type="middle"
          style={{ backgroundColor: '#08c299' }} />
        <PacBadgeEmp
          caption={PacDate.transLong(ir.d)}
          type="middle"
          style={{ backgroundColor: '#eaf8e8', textAlign: 'left' }} />
      </div>);

    return _.map(lineList, (childList, i) => (<div key={`irtx${i}`}>{childList}</div>));
  }

  createRows() {
    return this.props.ir.map(ir => (
      <Paper key={`ir${ir.tid}`} className="listrow-card">
        <div>{this.toHtml(ir)}</div>
      </Paper>
    ));
  }

  loadedContent() {
    switch (this.props.irState) {
      case 'IR_LOADED':
        return (
          <div style={{ height: this.listHeight }}>
            {this.createRows()}
          </div>
        );
      case 'NO_IR':
        return 'IRデータなし';
      default:
    }
    return <Loading />;
  }

  render() {
    return (
      <div>
        {this.loadedContent()}
      </div>
    );
  }
}

IRView.propTypes = {
  brand: PropTypes.shape({
    ccode: PropTypes.string,
    name: PropTypes.string,
    info: PropTypes.string,
  }).isRequired,
  height: PropTypes.number.isRequired,
  irState: PropTypes.string,
  ir: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
IRView.defaultProps = {
  irState: 'IR_LOADING',
};
const mapStateToProps = state => ({
  ir: state.irLoader.ir,
  irState: state.irLoader.type,
});
export default connect(mapStateToProps)(IRView);
