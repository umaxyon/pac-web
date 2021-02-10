import React from 'react';
import PropTypes from 'prop-types';
import FA from 'react-fontawesome';

export const MarkUp = (props) => {
  const stl = Object.assign({ fontSize: '0.5em' }, props.style);
  return (
    <span className="badge badge-warning ss_txt" style={stl}>up</span>
  );
};
MarkUp.propTypes = {
  style: PropTypes.shape(),
};
MarkUp.defaultProps = {
  style: {},
};

export const MarkNew = (props) => {
  const stl = Object.assign({ fontSize: '0.5em' }, props.style);
  return (
    <span className="badge badge-danger ss_txt" style={stl}>new</span>
  );
};
MarkNew.propTypes = {
  style: PropTypes.shape(),
};
MarkNew.defaultProps = {
  style: {},
};

export const MarkHigh = (props) => {
  const stl = Object.assign({ fontSize: '0.6em', backgroundColor: '#de3c3c', color: '#FFFB97' }, props.style);
  return (
    <span className="badge ss_txt" style={stl}>S高 <FA name="arrow-up" /></span>
  );
};
MarkHigh.propTypes = {
  style: PropTypes.shape(),
};
MarkHigh.defaultProps = {
  style: {},
};

export const MarkLow = (props) => {
  const stl = Object.assign({ fontSize: '0.6em', backgroundColor: '#0081c6', color: '#ABEDD8' }, props.style);
  return (
    <span className="badge ss_txt" style={stl}>S安 <FA name="arrow-down" /></span>
  );
};
MarkLow.propTypes = {
  style: PropTypes.shape(),
};
MarkLow.defaultProps = {
  style: {},
};
