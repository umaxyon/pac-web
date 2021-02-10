import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from 'material-ui/Progress';
import purple from 'material-ui/colors/purple';
import orange from 'material-ui/colors/orange';
import teal from 'material-ui/colors/teal';

class Loading extends React.Component {
  content() {
    const loding = (this.props.lodingText) ? <span>Loading...</span> : '';
    let circleColor = purple[500];
    switch (this.props.circleColor) {
      case 'purple': circleColor = purple[500]; break;
      case 'orange': circleColor = orange[500]; break;
      case 'teal': circleColor = teal.A400; break;
      default:
    }
    return (
      <span className="item-middle" style={{ fontSize: '0.8rem' }}>
        {loding}
        <span>
          <CircularProgress
            style={{ color: circleColor }}
            size={this.props.circleSize}
            thickness={5} />
        </span>
      </span>
    );
  }

  render() {
    return (
      <div>
        {this.content()}
      </div>
    );
  }
}

Loading.propTypes = {
  lodingText: PropTypes.bool,
  circleSize: PropTypes.number,
  circleColor: PropTypes.string,
};
Loading.defaultProps = {
  lodingText: true,
  circleSize: 27,
  circleColor: 'purple',
};

export default Loading;
