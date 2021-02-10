import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import * as techan from 'techan';
import PacDate from '../../lib/date';


class PricesChart extends React.Component {
  constructor(props) {
    super(props);
    this.createLineChart = this.createLineChart.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.createLineChart();
  }
  componentDidUpdate() {
    this.createLineChart();
  }

  getData() {
    return this.props.price;
  }

  createLineChart() {
    const margin = { top: 4, right: 10, bottom: 28, left: 38 };
    const width = 300 - margin.left - margin.right;
    const height = 200 - margin.top - margin.right;
    const x = techan.scale.financetime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    const yVolume = d3.scaleLinear().range([y(0), y(0.2)]);

    const candlestick = techan.plot.candlestick().xScale(x).yScale(y);
    const xAxis = d3.axisBottom().scale(x).tickFormat(d3.timeFormat('%-m/%-d'));
    const yAxis = d3.axisLeft().scale(y);
    const volume = techan.plot.volume()
      .accessor(candlestick.accessor())
      .xScale(x)
      .yScale(yVolume);

    d3.selectAll('svg.chart-svg > g > *').remove();
    const svg = d3.select(this.node)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    svg.append('g').attr('class', 'volume');

    const accessor = candlestick.accessor();
    const datas = this.getData().map(row => ({
      date: PacDate.toDate(row.d),
      open: +row.o,
      high: +row.h,
      low: +row.l,
      close: +row.c,
      volume: +row.v,
    })).sort((a, b) => d3.ascending(accessor.d(a), accessor.d(b)));

    function draw(data) {
      x.domain(data.map(candlestick.accessor().d));
      y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());
      yVolume.domain(techan.scale.plot.volume(data).domain());

      svg.selectAll('g.candlestick').datum(data).call(candlestick);
      svg.selectAll('g.x.axis').call(xAxis)
        .selectAll('text')
        .attr('x', 5)
        .attr('y', 5)
        .attr('transform', 'rotate(45)')
        .style('text-anchor', 'start')
        .style('font-size', '0.8em');
      svg.selectAll('g.y.axis').call(yAxis)
        .selectAll('text')
        .style('font-size', '0.8em');
      svg.select('g.volume').datum(data).call(volume);
    }

    svg.append('g').attr('class', 'candlestick');
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')');
    svg.append('g')
      .attr('class', 'y axis')
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.61em')
      .style('text-anchor', 'end')
      .text('Price ($)');
    draw(datas);
  }

  render() {
    return <div style={{ display: 'flex', justifyContent: 'center' }}><svg className="chart-svg" ref={(node) => { this.node = node; }} /></div>;
  }
}

PricesChart.propTypes = {
  price: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
PricesChart.defaultProps = {
  price: [],
};
const mapStateToProps = state => ({
  price: state.priceLoader.price,
  priceState: state.priceLoader.type,
});
export default connect(mapStateToProps)(PricesChart);
