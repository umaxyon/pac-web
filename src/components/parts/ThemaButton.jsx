import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class ThemaButton extends React.Component {
  constructor(props) {
    super(props);
    this.thema = this.props.thema;
  }

  render() {
    const link = `/thema/${this.thema}`;
    return (
      <Link to={link}>
        <span key={`${this.props.ccode}${this.thema}`} className="badge badge-primary mr-1">{this.thema}</span>
      </Link>
    );
  }
}

ThemaButton.propTypes = {
  ccode: PropTypes.string.isRequired,
  thema: PropTypes.string.isRequired,
};

export default ThemaButton;
