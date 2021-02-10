import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { startImgLoad } from '../../actions/';

class PacProfImg extends React.Component {
  constructor(props) {
    super(props);
    this.imgErr = this.imgErr.bind(this);
    this.pacImgErr = this.pacImgErr.bind(this);
    this.imgSt = 'profImg';
    this.imgDb = this.props.dbCtx.profImg;
  }

  imgErr(e) {
    if (this.props.userId === '') {
      this.pacImgErr(e);
      return;
    }
    if (this.props.type === 'retweet') {
      this.pacImgErr(e);
      return;
    }
    this.imgSt = 'pac';
    const strImg = this.imgDb.get(`profimg-${this.props.userId}`);
    if (strImg) {
      e.target.src = strImg;
    } else {
      this.props.dispatch(startImgLoad(this.props.userId));
    }
  }

  pacImgErr(e) {
    e.target.src = '/img/no_user.png';
  }

  render() {
    let imgTag;
    if (this.props.type === 'retweet') {
      imgTag = (
        <img
          className={this.props.className}
          src={this.props.src}
          onError={(e) => { this.imgErr(e); }}
          alt="" />
      );
    } else if (this.imgSt === 'profImg') {
      imgTag = (
        <img
          className={this.props.className}
          src={this.props.src}
          onError={(e) => { this.imgErr(e, this.props.userId); }}
          alt="" />);
    } else if (this.props.loadedImage.userId === this.props.userId) {
      imgTag = (
        <img
          className={this.props.className}
          src={this.props.loadedImage.strImg}
          onError={(e) => { this.pacImgErr(e); }}
          alt="" />);
    } else {
      imgTag = (
        <img className={this.props.className} src="/img/no_user.png" alt="" />
      );
    }

    return imgTag;
  }
}

PacProfImg.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  userId: PropTypes.string,
  loadedImage: PropTypes.shape().isRequired,
  dispatch: PropTypes.func.isRequired,
  dbCtx: PropTypes.shape().isRequired,
};

PacProfImg.defaultProps = {
  className: '',
  userId: '',
  src: '',
  type: 'user',
};

const mapStateToProps = state => ({
  loadedImage: state.loadedImage,
  dbCtx: state.dbContextCreator.dbContext,
});
export default connect(mapStateToProps)(PacProfImg);
