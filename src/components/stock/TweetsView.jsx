import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import TweetRow from './TweetRow';
import PacFriendsManager from '../../logic/PacFriendsManager';
import PacTweetManager from '../../logic/PacTweetManager';
import MoreRead from '../parts/MoreRead';
import { setMoreReadStatus, startLoadTweet } from '../../actions/';
import Loding from '../parts/Loading';

class TweetsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      divs: [],
      last_id: '',
    };
    this.moreReadDispatch('loading');
    this.listHeight = this.props.height;
    this.tweetManager = new PacTweetManager(this.props.dbCtx, this.props.ccode);
    this.friendsManager = new PacFriendsManager(this.props.dbCtx);
  }

  createRow(tw, ccode, cnt) {
    return <TweetRow key={tw.id_str + `${cnt}`} tw={tw} ccode={ccode} />;
  }

  loadTweet() {
    this.props.dispatch(startLoadTweet(this.props.ccode, this.createRow));
  }

  moreReadDispatch(status) {
    this.props.dispatch(setMoreReadStatus(status));
  }

  loadedContent() {
    switch (this.props.tweetStatus) {
      case 'TWEET_LOADED':
        return (
          <InfiniteScroll
            next={this.generateDivs}
            hasMore={false}
            height={this.listHeight}
            endMessage={<MoreRead onClick={() => this.loadTweet()} />}>
            {this.props.tweetRows}
          </InfiniteScroll>
        );
      case 'TWEET_RELOAD':
        this.loadTweet();
        break;
      default:
    }
    return <Loding />;
  }

  render() {
    return (
      <div>
        {this.loadedContent()}
      </div>
    );
  }
}

TweetsView.propTypes = {
  ccode: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  dbCtx: PropTypes.shape().isRequired,
  tweetStatus: PropTypes.string.isRequired,
  tweetRows: PropTypes.arrayOf(PropTypes.element).isRequired,
};

const mapStateToProps = state => ({
  dbCtx: state.dbContextCreator.dbContext,
  tweetRows: state.tweetLoader.tweetRows,
  tweetStatus: state.tweetLoader.type,
});
export default connect(mapStateToProps)(TweetsView);
