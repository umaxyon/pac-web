import React from 'react';
import PropTypes from 'prop-types';
import FA from 'react-fontawesome';


class ExpandMore extends React.Component {
  constructor(props) {
    super(props);
    this.content = this.content.bind(this);
  }

  content() {
    let st = 'chevron-down';
    if (this.props.st === 'open') {
      st = 'cheveron-up';
    }
    return (
      <FA name={st} style={{ color: '#606470', fontSize: '1rem' }} />
    );
  }

  render() {
    return (
      <span>{this.content()}</span>
    );
  }
}
ExpandMore.propTypes = {
  st: PropTypes.string,
};
ExpandMore.defaultProps = {
  st: 'chevron-down',
};
export default ExpandMore;
