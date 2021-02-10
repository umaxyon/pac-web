import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { PieChart, Pie, Cell, Label, Legend } from 'recharts';
import Loading from './Loading';
import PacUtil from '../../lib/util';

class HolderRatePie extends React.Component {
  constructor(props) {
    super(props);
    this.createChart = this.createChart.bind(this);
    this.colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A8C6EF', '#BA78CD', '#FFBBBB'];
    this.labels = ['政府及び地方公共団体', '金融機関', '金融商品取引業者', 'その他法人', '外国法人', '外国個人', '個人その他'];
  }

  content() {
    let buf = '';
    switch (this.props.ediState) {
      case 'EDI_LOADING':
        buf = <Loading circleSize={35} />;
        break;
      case 'EDI_LOADED':
        buf = this.createChart();
        break;
      default:
        buf = '';
    }
    return buf;
  }
  convertDat() {
    if (_.isEmpty(this.props.edi) || _.isEmpty(this.props.edi.ra)) {
      return [];
    }
    const rateDat = this.props.edi.ra;
    const dat = [
      { n: this.labels[0], v: parseFloat(rateDat.gov[2]) },
      { n: this.labels[1], v: parseFloat(rateDat.fin[2]) },
      { n: this.labels[2], v: parseFloat(rateDat.sec[2]) },
      { n: this.labels[3], v: parseFloat(rateDat.cop[2]) },
      { n: this.labels[4], v: parseFloat(rateDat.frc[2]) },
      { n: this.labels[5], v: parseFloat(rateDat.frp[2]) },
      { n: this.labels[6], v: parseFloat(rateDat.otp[2]) },
    ];
    for (let i = 0; i < dat.length; i++) {
      if (isNaN(dat[i].v)) {
        return [];
      }
    }
    return dat;
  }
  createChart() {
    const data = this.convertDat();
    if (data.length === 0) {
      return 'データがありません';
    }
    const kabusu = this.hakkouKabusu();
    let label = '';
    if (kabusu) {
      label = (
        <Label width={70} style={{ fontSize: '0.6em' }} position="center">
          {`発行済み株式数 ${kabusu}`}
        </Label>);
    }

    const pie = (
      <PieChart width={120} height={130}>
        <Pie dataKey="v" data={data} cx={50} cy={55} innerRadius={38} outerRadius={55}>
          {
            data.map((entry, i) => <Cell key={`hrcell${entry.n}`} fill={this.colors[i % this.colors.length]} />)
          }
          {label}
        </Pie>
      </PieChart>
    );
    const labelData = this.labels.map((val, i) => {
      const ret = { value: val, color: this.colors[i] };
      return ret;
    });
    const legend = (
      <Legend
        x={140}
        width={110}
        height={95}
        layout="vertical"
        align="right"
        verticalAlign="middle"
        iconSize={9}
        margin={{ left: 5 }}
        payload={labelData} />
    );
    const perData = data.map((row) => {
      const ret = { value: `${parseInt(row.v, 10)}%` };
      return ret;
    });
    const legendPer = (
      <Legend
        x={260}
        width={33}
        height={95}
        layout="vertical"
        align="left"
        verticalAlign="middle"
        iconSize={0}
        margin={{ left: 10 }}
        payload={perData} />
    );

    return (
      <div style={{ display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: 'space-arround' }}>
        <div style={{ position: 'relative', width: '130px' }}>{pie}</div>
        <div className="holderrate-pie-legend" style={{ position: 'relative', fontSize: '0.6em', width: '110px' }}>{legend}</div>
        <div className="holderrate-pie-legend" style={{ position: 'relative', fontSize: '0.6em', width: '35px' }}>{legendPer}</div>
      </div>);
  }

  hakkouKabusu() {
    const edi = this.props.edi;
    if (_.isEmpty(edi) || _.isEmpty(edi.ra) || _.isEmpty(edi.ra.tot) ||
        _.isEmpty(edi.os) || _.isEmpty(edi.os.unit)) {
      return '';
    }
    const total = edi.ra.tot;
    let unit = edi.os.unit;
    if (!isNaN(total[1]) && !isNaN(unit)) {
      try {
        const kabusu = parseInt(total[1], 10);
        unit = parseInt(unit, 10);
        if (unit === 1) {
          unit = 100;
        }
        return PacUtil.toComma(kabusu * unit);
      } catch (e) {
        return '';
      }
    }
    const hakkou = edi.os.hutuu_hakkou;
    if (hakkou) {
      hakkou.replace(/\(注\)1$/g, '');
      hakkou.replace(/\(注\)/g, '');
      hakkou.replace('※', '');
      hakkou.replace('株', '');
      if (!isNaN(hakkou)) {
        return PacUtil.toComma(hakkou);
      }
    }
    return '';
  }

  render() {
    return <div style={{ display: 'flex', justifyContent: 'center' }}>{this.content()}</div>;
  }
}
HolderRatePie.propTypes = {
  ediState: PropTypes.string.isRequired,
  edi: PropTypes.shape(),
};
HolderRatePie.defaultProps = {
  edi: {},
};
const mapStateToProps = state => ({
  edi: state.ediLoader.edi,
  ediState: state.ediLoader.type,
});
export default connect(mapStateToProps)(HolderRatePie);
