import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Table from 'material-ui/Table/Table';
import TableBody from 'material-ui/Table/TableBody';
import TableRow from 'material-ui/Table/TableRow';
import TableHead from 'material-ui/Table/TableHead';
import ExpansionPanel from 'material-ui/ExpansionPanel';
import ExpansionPanelDetails from 'material-ui/ExpansionPanel/ExpansionPanelDetails';
import ExpansionPanelSummary from 'material-ui/ExpansionPanel/ExpansionPanelSummary';
import { SmallCell, SmallCellR } from '../parts/SmallTableParts';
import Loading from '../parts/Loading';
import ExpandMore from '../parts/ExpandMore';

class RankView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: 'panel1',
    };

    this.handleChange = this.handleChange.bind(this);
    this.highlow = this.highlow.bind(this);
    this.listHeight = this.props.height;
  }

  handleChange(panel) {
    return (event, expanded) => {
      this.setState({
        expanded: expanded ? panel : false,
      });
    };
  }

  highlow(mode) {
    let body = (
      <TableRow style={{ height: '6px', fontSize: '0.8em' }}>
        <SmallCell colSpan={2} style={{ textAlign: 'center' }}>なし</SmallCell>
      </TableRow>);
    let title = '';
    let color = '';
    switch (mode) {
      case 'h': title = 'ストップ高'; color = '#ed0000'; break;
      case 'l': title = 'ストップ安'; color = 'blue'; break;
      case 'r': title = '値上がり率'; color = 'blue'; break;
      case 'f': title = '値下がり率'; color = 'blue'; break;
      default:
    }
    if (this.props.highlow && this.props.highlow[mode]) {
      const highlows = this.props.highlow[mode];
      if (highlows.length > 0) {
        body = highlows.map((r) => {
          let val = '';
          switch (mode) {
            case 'h': val = `${r.most}(${r.vol})`; break;
            case 'l': val = `${r.most}(${r.vol})`; break;
            case 'r': val = `${r.rank}位(${r.per}%)`; break;
            case 'f': val = `${r.rank}位(${r.per}%)`; break;
            default:
          }
          return (
            <TableRow key={`${mode}${r.ccode}${r.date}`} style={{ height: '6px', fontSize: '0.8em' }}>
              <SmallCell style={{ border: '1px solid #dddddd', width: '52px', textAlign: 'center' }}>{r.date.split('_')[0]}</SmallCell>
              <SmallCellR style={{ paddingRight: '3px', color }}>{val}</SmallCellR>
            </TableRow>);
        });
      }
    }

    const tbl = (
      <Table style={{ width: '145px', marginLeft: 'auto', marginRight: 'auto' }}>
        <TableHead style={{ border: '1px solid #dddddd' }}>
          <TableRow style={{ height: '6px' }}>
            <SmallCell colSpan={2} style={{ textAlign: 'center' }}>{title}</SmallCell>
          </TableRow>
        </TableHead>
        <TableBody style={{ border: '1px solid #dddddd' }}>
          {body}
        </TableBody>
      </Table>
    );
    return tbl;
  }

  contentHighLow() {
    switch (this.props.highlowState) {
      case 'HIGHLOW_LOADED':
        return (
          <div style={{ height: this.listHeight }}>
            <Paper className="rank-card">
              <ExpansionPanel expanded={this.state.expanded === 'panel1'} onChange={this.handleChange('panel1')}>
                <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                  <Typography>S高/S安 履歴</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ paddingLeft: '2px', paddingRight: '2px' }}>
                  <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'spece-around',
                      width: '313px' }}>
                      {this.highlow('h')}
                      {this.highlow('l')}
                    </div>
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel expanded={this.state.expanded === 'panel2'} onChange={this.handleChange('panel2')}>
                <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                  <Typography>週次値上がり/値下がり率ランク 履歴</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ paddingLeft: '2px', paddingRight: '2px' }}>
                  <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'spece-around',
                      width: '313px' }}>
                      {this.highlow('r')}
                      {this.highlow('f')}
                    </div>
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Paper>
          </div>
        );
      case 'NO_HIGHLOW':
        return 'データなし';
      default:
    }
    return <Loading />;
  }

  render() {
    return (
      <div>
        {this.contentHighLow()}
      </div>
    );
  }
}

RankView.propTypes = {
  highlowState: PropTypes.string,
  highlow: PropTypes.shape().isRequired,
  height: PropTypes.number.isRequired,
};
RankView.defaultProps = {
  highlowState: 'HIGHLOW_LOADING',
};
const mapStateToProps = state => ({
  highlow: state.highlowLoader.highlow,
  highlowState: state.highlowLoader.type,
});
export default connect(mapStateToProps)(RankView);
