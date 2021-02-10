import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FA from 'react-fontawesome';
import { toggleTweet } from '../../actions/';

class TweetRowToggle extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.toggleName = 'toggle-off';
  }

  onClick() {
    this.props.dispatch(toggleTweet(this.toggleName, this.props.id));
  }

  content() {
    if (this.props.id === this.props.toggleId) {
      this.toggleName = this.props.tweetToggleStatus;
    }
    return (
      <FA
        name={this.toggleName}
        onClick={this.onClick}
        style={{ color: '#606470', fontSize: '1.2rem', marginRight: '15px' }} />
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

TweetRowToggle.propTypes = {
  tweetToggleStatus: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  toggleId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

TweetRowToggle.defaultProps = {
  tweetToggleStatus: 'toggle-off',
  toggleId: '',
};

const mapStateToProps = state => ({
  tweetToggleStatus: state.toggleTweet.toggleState,
  toggleId: state.toggleTweet.tweetId,
});

export default connect(mapStateToProps)(TweetRowToggle);
