import * as React from 'react';
import * as History from 'history';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import { GlobalState } from 'ducks/rootReducer';
import { clearSearch, submitSearch, getInlineResultsDebounce, selectInlineResult } from 'ducks/search/reducer';
import { ClearSearchRequest, SubmitSearchRequest, InlineSearchRequest, InlineSearchSelect } from 'ducks/search/types';

import { ResourceType } from 'interfaces';

import InlineSearchResults from './InlineSearchResults';

import './styles.scss';

import {
  BUTTON_CLOSE_TEXT,
  PLACEHOLDER_DEFAULT,
  SIZE_SMALL
} from './constants';

export interface StateFromProps {
  searchTerm: string;
}

export interface DispatchFromProps {
  clearSearch: () => ClearSearchRequest;
  submitSearch: (searchTerm: string, useFilters?: boolean) => SubmitSearchRequest;
  onInputChange: (term: string) => InlineSearchRequest;
  onSelectInlineResult: (resourceType: ResourceType, searchTerm: string, updateUrl: boolean) => InlineSearchSelect;
}

export interface OwnProps {
  location?: History.Location;
  placeholder?: string;
  size?: string;
}

export type SearchBarProps = StateFromProps & DispatchFromProps & OwnProps;

interface SearchBarState {
  showTypeAhead: boolean;
  searchTerm: string;
}

export class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  private refToSelf: React.RefObject<HTMLDivElement>;

  public static defaultProps: Partial<SearchBarProps> = {
    placeholder: PLACEHOLDER_DEFAULT,
    size: '',
  };

  constructor(props) {
    super(props);
    this.refToSelf = React.createRef<HTMLDivElement>();

    this.state = {
      showTypeAhead: false,
      searchTerm: this.props.searchTerm,
    };
  }

  clearSearchTerm = () : void => {
    this.setState({ showTypeAhead: false, searchTerm: '' });
    // TODO (ttannis): Still coonsidering better way to do this
    if (this.props.location && this.props.location.pathname === '/search') {
      this.props.clearSearch();
    }
  };

  componentDidMount = () => {
    document.addEventListener('mousedown', this.updateTypeAhead, false);
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.updateTypeAhead, false);
  };

  componentDidUpdate = (prevProps: SearchBarProps) => {
    if (this.props.searchTerm !== prevProps.searchTerm) {
      this.setState({ searchTerm: this.props.searchTerm });
    }
  };

  handleValueChange = (event: React.SyntheticEvent<HTMLInputElement>) : void => {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();

    if (searchTerm.length > 0) {
      this.props.onInputChange(searchTerm);
      this.setState({ searchTerm, showTypeAhead: true });
    }
    else {
      this.clearSearchTerm();
    }
  };

  handleValueSubmit = (event: React.FormEvent<HTMLFormElement>) : void => {
    const searchTerm = this.state.searchTerm.trim();
    // TODO (ttannis): Conside if there is a better way to address this, or if we want to prioritize
    // and inmprovement to allow users to toggle
    const useFilters = this.props.location ? this.props.location.pathname === '/search' : false;
    event.preventDefault();
    if (this.isFormValid()) {
      this.props.submitSearch(searchTerm, useFilters);
      this.hideTypeAhead();
    }
  };

  hideTypeAhead = () : void => {
    this.setState({ showTypeAhead: false });
  };

  isFormValid = () : boolean => {
    const form = document.getElementById("search-bar-form") as HTMLFormElement;
    return form.checkValidity();
  };

  onSelectInlineResult = (resourceType: ResourceType, updateUrl: boolean = false) : void => {
    this.hideTypeAhead();
    this.props.onSelectInlineResult(resourceType, this.state.searchTerm, updateUrl);
  }

  shouldShowTypeAhead = (searchTerm: string) : boolean => {
    return searchTerm.length > 0;
  }

  updateTypeAhead = (event: Event): void => {
    /* This logic will hide/show the inline results component when the user clicks
      outside/inside of the search bar */
    if (this.refToSelf.current && this.refToSelf.current.contains(event.target as Node)) {
      this.setState({ showTypeAhead: this.shouldShowTypeAhead(this.state.searchTerm) });
    } else {
      this.hideTypeAhead();
    }
  };

  render() {
    const inputClass = `${this.props.size === SIZE_SMALL ? 'title-2 small' : 'h2 large'} search-bar-input form-control`;
    const searchButtonClass = `btn btn-flat-icon search-button ${this.props.size === SIZE_SMALL ? 'small' : 'large'}`;

    return (
      <div id="search-bar" ref={this.refToSelf}>
        <form id="search-bar-form" className="search-bar-form" onSubmit={ this.handleValueSubmit }>
            <input
              id="search-input"
              required={ true }
              className={ inputClass }
              value={ this.state.searchTerm }
              onChange={ this.handleValueChange }
              aria-label={ this.props.placeholder }
              placeholder={ this.props.placeholder }
              autoFocus={ true }
              autoComplete="off"
            />
          <button className={ searchButtonClass } type="submit">
            <img className="icon icon-search" />
          </button>
          {
            this.props.size === SIZE_SMALL &&
            <button type="button" className="btn btn-close clear-button" aria-label={BUTTON_CLOSE_TEXT} onClick={this.clearSearchTerm} />
          }
        </form>
        {
          this.state.showTypeAhead &&
          // @ts-ignore: Investigate proper configuration for 'className' to be valid by default on custom components
          <InlineSearchResults
            className={this.props.size === SIZE_SMALL ? 'small' : ''}
            onItemSelect={this.onSelectInlineResult}
            searchTerm={this.state.searchTerm}
          />
        }
      </div>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  return {
    searchTerm: state.search.search_term,
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ clearSearch, submitSearch, onInputChange: getInlineResultsDebounce, onSelectInlineResult: selectInlineResult }, dispatch);
};

export default connect<StateFromProps, DispatchFromProps, OwnProps>(mapStateToProps,  mapDispatchToProps)(SearchBar);
