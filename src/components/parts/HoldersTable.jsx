import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import Table from 'material-ui/Table/Table';
import TableBody from 'material-ui/Table/TableBody';
import TableRow from 'material-ui/Table/TableRow';
import { SmallCell, SmallCellR } from '../parts/SmallTableParts';
import Loading from './Loading';
import PacUtil from '../../lib/util';


class HoldersTable extends React.Component {
  content() {
    let buf = '';
    switch (this.props.ediState) {
      case 'EDI_LOADING':
        buf = <Loading circleSize={35} />;
        break;
      case 'EDI_LOADED':
        buf = this.createTable();
        break;
      default:
        buf = '';
    }
    return buf;
  }

  amount(val) {
    const unit = parseInt(this.props.edi.ho.unit, 10);
    const v = parseInt(val, 10);
    return PacUtil.toComma(unit * v);
  }

  createTable() {
    if (_.isEmpty(this.props.edi) ||
        _.isEmpty(this.props.edi.ho) ||
        _.isEmpty(this.props.edi.ho.unit) ||
        isNaN(this.props.edi.ho.unit)) {
      return 'データがありません';
    }
    const holders = this.props.edi.ho.holders;
    let totalRow;
    if (holders[holders.length - 1][0] === '計') {
      const sum = holders.pop();
      totalRow = (
        <TableRow style={{ height: '6px', fontSize: '0.8em' }}>
          <SmallCell>{}</SmallCell>
          <SmallCellR>{sum[0]}</SmallCellR>
          <SmallCellR style={{ paddingRight: '5px' }}>{`${this.amount(sum[1])}株`}</SmallCellR>
        </TableRow>);
    }
    const tbl = (
      <Table style={{ width: '98%', marginLeft: 'auto', marginRight: 'auto' }}>
        <TableBody style={{ border: '1px solid #dddddd' }}>
          {
            holders.map((r, i) => (
              <TableRow key={`hoderrow${r[0]}`} style={{ height: '6px', fontSize: '0.8em' }}>
                <SmallCell style={{ textAlign: 'center', border: '1px solid #dddddd' }}>{i + 1}</SmallCell>
                <SmallCell className="holder-name-cell">{r[0]}</SmallCell>
                <SmallCellR style={{ paddingRight: '5px', width: '23%' }}>{this.amount(r[1])}</SmallCellR>
              </TableRow>
            ))
          }
          {totalRow}
        </TableBody>
      </Table>
    );
    return tbl;
  }

  render() {
    return <div style={{ display: 'flex', justifyContent: 'center' }}>{this.content()}</div>;
  }
}

HoldersTable.propTypes = {
  ediState: PropTypes.string.isRequired,
  edi: PropTypes.shape(),
};
HoldersTable.defaultProps = {
  edi: {},
};
const mapStateToProps = state => ({
  edi: state.ediLoader.edi,
  ediState: state.ediLoader.type,
});
export default connect(mapStateToProps)(HoldersTable);
