import React from 'react';
import PropTypes from 'prop-types';

const PacButton = ({ caption }) => (
  <span className="badge badge-light pac-btn-span lnk_badge">{caption}</span>
);

PacButton.propTypes = {
  caption: PropTypes.string.isRequired,
};

export default PacButton;
