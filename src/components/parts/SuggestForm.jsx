import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import PacHistoryManager from '../../logic/PacHistoryManager';
import { startLoadStock, startLoadNowPrice, orderNowPrice } from '../../actions/';


class SuggestForm extends React.Component {
  constructor(props) {
    super(props);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onChange = this.onChange.bind(this);
    this.clickSuggest = this.clickSuggest.bind(this);
    this.state = {
      value: '',
      suggestions: [],
    };
  }

  onChange(event, { newValue }) {
    this.setState({
      value: newValue,
    });
  }

  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    if (inputLength <= 1) {
      return [];
    }

    return this.props.suggest.filter((dat) => {
      const dictVal = dat.ns.toLowerCase();
      return dictVal.indexOf(inputValue) !== -1;
    });
  }

  getSuggestionValue(suggestion) {
    return suggestion.n;
  }

  clickSuggest(cd) {
    const type = window.location.pathname.split('/')[1];
    const hm = new PacHistoryManager(this.props.dbCtx, this.props.dispatch, type);
    hm.next(cd);
    this.props.dispatch(orderNowPrice(cd));
    this.props.dispatch(startLoadStock(cd));
    this.props.dispatch(startLoadNowPrice());
    this.props.onSuggestClick();
  }

  renderSuggestion(sug) {
    return (
      <div>
        <Link to={`/stock/${sug.c}`} onClick={() => this.clickSuggest(sug.c)}>
          {`${sug.c} ${sug.n}`}
        </Link>
      </div>
    );
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: '銘柄名、証券コード',
      value,
      onChange: this.onChange,
    };
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps} />
    );
  }
}
SuggestForm.propTypes = {
  suggest: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onSuggestClick: PropTypes.func,
  dbCtx: PropTypes.shape().isRequired,
  dispatch: PropTypes.func.isRequired,
};
SuggestForm.defaultProps = {
  onSuggestClick: () => {},
};
const mapStateToProps = state => ({
  dbCtx: state.dbContextCreator.dbContext,
  suggestState: state.suggestLoader.type,
  suggest: state.suggestLoader.suggest,
});
export default connect(mapStateToProps)(SuggestForm);
