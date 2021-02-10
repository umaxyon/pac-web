import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FA from 'react-fontawesome';
import { toggleFavoriteStar } from '../../actions/';

class FavoriteStar extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.starName = 'star-o';
  }

  onClick() {
    this.props.dispatch(toggleFavoriteStar(this.starName, this.props.ccode));
  }

  content() {
    if (this.props.ccode === this.props.starCcode) {
      this.starName = this.props.starState;
    }
    return (
      <FA
        name={this.starName}
        onClick={this.onClick}
        style={{ color: '#3D6CB9', fontSize: '1rem' }} />
    );
  }

  render() {
    return (
      <div style={{ textAlign: 'right' }}>
        {this.content()}
      </div>
    );
  }
}

FavoriteStar.propTypes = {
  starState: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  starCcode: PropTypes.string.isRequired,
  ccode: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  starState: state.toggleFavoriteStar.starState,
  starCcode: state.toggleFavoriteStar.ccode,
});

export default connect(mapStateToProps)(FavoriteStar);
