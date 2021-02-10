import React from 'react';
import PropTypes from 'prop-types';
import { Tab } from 'material-ui/Tabs';
import { withStyles } from 'material-ui/styles';

const styles = {
  tab: {
    height: '25px',
    lineHeight: '25px',
    labelContainer: {
      paddingTop: '0',
    },
  },
};

function PacTab(props) {
  const { style, ...other } = props;
  const st = (style) ? Object.assign(styles.tab, style) : styles.tab;
  return (
    <Tab
      {...other}
      style={st} />);
}

PacTab.propTypes = {
  style: PropTypes.element,
};
PacTab.defaultProps = {
  style: undefined,
};

export default withStyles({
  labelContainer: {
    paddingTop: 0,
    paddingBottom: 0,
  },
})(PacTab);
