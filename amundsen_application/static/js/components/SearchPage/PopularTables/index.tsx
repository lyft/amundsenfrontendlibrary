import * as React from 'react';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

import BookmarkList from 'components/common/Bookmark/BookmarkList';
import { POPULAR_TABLES_LABEL, POPULAR_TABLES_INFO_TEXT, POPULAR_TABLES_SOURCE_NAME } from './constants';
import InfoButton from 'components/common/InfoButton';
import SearchList from '../SearchList';

import { getPopularTables } from 'ducks/popularTables/reducer';
import { GetPopularTablesRequest, TableResource } from 'ducks/popularTables/types';
import { GlobalState } from 'ducks/rootReducer';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


interface PopularTablesState {
}

export interface StateFromProps {
  popularTables: TableResource[];
}

export interface DispatchFromProps {
  getPopularTables: () => GetPopularTablesRequest;
}

export type PopularTablesProps = StateFromProps & DispatchFromProps;

export class PopularTables extends React.Component<PopularTablesProps, PopularTablesState> {
  public static defaultProps: Partial<PopularTablesProps> = {};

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {};
  }

  componentDidMount() {
    this.props.getPopularTables();
  }

  render() {
    return (
      <div className="search-list-container">
        <BookmarkList />
        <div className="popular-tables-header">
          <label className="title-1">{POPULAR_TABLES_LABEL}</label>
          <InfoButton infoText={POPULAR_TABLES_INFO_TEXT} />
        </div>
        <SearchList results={ this.props.popularTables } params={{
          source: POPULAR_TABLES_SOURCE_NAME,
          paginationStartIndex: 0,
        }} />
      </div>
    );
  }
}
export const mapStateToProps = (state: GlobalState) => {
  return {
    popularTables: state.popularTables,
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ getPopularTables }, dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(PopularTables);
