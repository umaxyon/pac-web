import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Table from 'material-ui/Table/Table';
import TableBody from 'material-ui/Table/TableBody';
import TableRow from 'material-ui/Table/TableRow';
import TableCell from 'material-ui/Table/TableCell';
import LinkDeck from '../parts/LinkDeck';
import ThemaButton from '../parts/ThemaButton';
import HolderRatePie from '../parts/HolderRatePie';
import HoldersTable from '../parts/HoldersTable';
import PricesChart from '../parts/PricesChart';
import { SmallCell, SmallCellR } from '../parts/SmallTableParts';
import PacDate from '../../lib/date';
import PacUtil from '../../lib/util';

class BrandInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: this.props.brand,
    };
    this.themaList = this.themaList.bind(this);
    this.ookabunushiDate = this.ookabunushiDate.bind(this);
  }

  gaiyo() {
    return (
      <Paper className="brandinfo-card">
        <div className="brand-gaiyo">
          <div className="brand-gaiyo-title">
            概要
          </div>
          <div className="brand-linkdeck">
            <LinkDeck ccode={this.props.brand.ccode} brand={this.props.brand} />
          </div>
        </div>
        <div className="brand-gaiyo-info">
          {this.props.brand.info}
        </div>
        <div className="brand-gaiyo-table-div">
          <Table style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
            <TableBody>
              <TableRow style={{ height: '10px' }}>
                <TableCell colSpan={2} style={{ textAlign: 'right', paddingRight: '5px', paddingBottom: '8px' }}><b>時価総額</b></TableCell>
                <TableCell colSpan={2} style={{ fontSize: '1.1em', paddingBottom: '9px', width: '70%' }}>{this.convertYen(this.props.brand.j)}</TableCell>
              </TableRow>
              <TableRow style={{ height: '6px' }}>
                <SmallCell style={{ paddingRight: '20px' }}><b>PER</b></SmallCell>
                <SmallCellR style={{ paddingRight: '20px', width: '25%' }}>{this.convertPbrPer(this.props.brand.e)}</SmallCellR>
                <SmallCell><b>年初来高値</b></SmallCell>
                <SmallCellR>{PacUtil.toComma(this.props.brand.t)}</SmallCellR>
              </TableRow>
              <TableRow style={{ height: '6px' }}>
                <SmallCell style={{ paddingRight: '20px' }}><b>PBR</b></SmallCell>
                <SmallCellR style={{ paddingRight: '20px', width: '25%' }}>{this.convertPbrPer(this.props.brand.b)}</SmallCellR>
                <SmallCell><b>年初来安値</b></SmallCell>
                <SmallCellR>{PacUtil.toComma(this.props.brand.y)}</SmallCellR>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Paper>
    );
  }

  convertPbrPer(val) {
    if (!val || isNaN(val)) {
      return '-';
    }
    return `${val}倍`;
  }

  convertYen(val) {
    if (!val || isNaN(val)) {
      return '-';
    }
    const s = val.length;
    let yen = '';
    const million = val.substring(s - 2);
    if (s > 6) {
      const billion = val.substring(s - 6, s - 2);
      const trillion = val.substring(0, s - 6);
      yen = `${trillion}兆${billion}億${million}00万円`;
    } else {
      const billion = val.substring(0, s - 2);
      yen = `${billion}億${million}00万円`;
    }
    return yen;
  }

  kabunushiRateDate() {
    let buf = '';
    if (this.props.ediState === 'EDI_LOADED') {
      if (this.props.edi.ra && this.props.edi.ra.date && this.props.edi.ra.date !== '-') {
        const d = PacDate.toDate(this.props.edi.ra.date);
        buf = PacDate.fmt(d, 'YYYY年MM月DD日 時点');
      }
    }
    return buf;
  }

  kabunushiRate() {
    return (
      <Paper className="brandinfo-card">
        <div className="brand-holderrate">
          <div className="brand-holderrate-title">
            株主構成
          </div>
          <div className="brand-title-right">
            {this.kabunushiRateDate()}
          </div>
        </div>
        <div className="brand-holderrate-pie">
          <HolderRatePie />
        </div>
      </Paper>
    );
  }

  ookabunushiDate() {
    let buf = '';
    if (this.props.ediState === 'EDI_LOADED') {
      if (this.props.edi.ho && this.props.edi.ho.date && this.props.edi.ho.date !== '-') {
        const d = PacDate.toDate(this.props.edi.ho.date);
        buf = PacDate.fmt(d, 'YYYY年MM月DD日 時点');
      }
    }
    return buf;
  }
  ookabunushi() {
    return (
      <Paper className="brandinfo-card">
        <div className="brand-holders">
          <div className="brand-holders-title">
            大株主
          </div>
          <div className="brand-title-right">
            {this.ookabunushiDate()}
          </div>
        </div>
        <div className="brand-holders-table-div">
          <HoldersTable />
        </div>
      </Paper>
    );
  }

  priceChart() {
    return (
      <Paper className="brandinfo-card">
        <div className="brand-prices">
          <div className="brand-prices-title">
            価格＋出来高
          </div>
          <div className="brand-price-right">
            日足(30日分)
          </div>
        </div>
        <div className="brand-prices-chart">
          <PricesChart />
        </div>
      </Paper>
    );
  }

  themaList() {
    const thema = this.props.brand.thema;
    if (!thema || thema === '') {
      return '';
    }
    const themas = thema.split(',').map(t => (
      <ThemaButton key={`${this.props.brand.ccode}${t}`} ccode={this.props.brand.ccode} thema={t} />
    ));
    return (
      <Paper className="brandinfo-card">
        <div className="brand-thema">
          <div className="brand-thema-title">
            テーマ
          </div>
        </div>
        <div className="brand-thema-list">
          {themas}
        </div>
      </Paper>
    );
  }

  render() {
    return (
      <div className="brand-main" style={{ height: this.props.height }}>
        {this.priceChart()}
        {this.gaiyo()}
        {this.themaList()}
        {this.kabunushiRate()}
        {this.ookabunushi()}
      </div>
    );
  }
}

BrandInfo.propTypes = {
  brand: PropTypes.shape({
    ccode: PropTypes.string,
    name: PropTypes.string,
    info: PropTypes.string,
    thema: PropTypes.string,
    j: PropTypes.string,
    e: PropTypes.string,
    b: PropTypes.string,
    t: PropTypes.string,
    y: PropTypes.string,
  }).isRequired,
  ediState: PropTypes.string.isRequired,
  edi: PropTypes.shape(),
  height: PropTypes.number.isRequired,
};
BrandInfo.defaultProps = {
  ccode: '',
  name: '',
  info: '',
  thema: '',
  edi: {},
};
const mapStateToProps = state => ({
  edi: state.ediLoader.edi,
  ediState: state.ediLoader.type,
});
export default connect(mapStateToProps)(BrandInfo);
