import * as React from 'react';
import { connect } from 'react-redux';
import { GlobalState } from 'ducks/rootReducer';

import './styles.scss'
import { Bookmark, ResourceType } from 'interfaces';
import { getDisplayNameByResource, indexDashboardsEnabled } from 'config/config-utils';
import {
  BOOKMARK_TITLE,
  BOOKMARKS_PER_PAGE,
  EMPTY_BOOKMARK_MESSAGE,
  MY_BOOKMARKS_SOURCE_NAME,
} from './constants';
import ResourceList from 'components/common/ResourceList';
import TabsComponent from 'components/common/TabsComponent';

interface StateFromProps {
  myBookmarks: {
    [ResourceType.table]: Bookmark[];
    [ResourceType.dashboard]: Bookmark[];
  },
  isLoaded: boolean;
}

export type MyBookmarksProps = StateFromProps;

export class MyBookmarks extends React.Component<MyBookmarksProps> {
  constructor(props) {
    super(props);
  }

  generateTabContent = (resource: ResourceType) => {
    const bookmarks = this.props.myBookmarks[resource] || [];
    return (
      <ResourceList
        allItems={ bookmarks }
        source={ MY_BOOKMARKS_SOURCE_NAME }
        itemsPerPage={ BOOKMARKS_PER_PAGE }
        customEmptyText={ EMPTY_BOOKMARK_MESSAGE }
      />
    )
  };

  generateTabKey = (resource: ResourceType) => {
    return `bookmarktab:${resource}`;
  };

  generateTabTitle = (resource: ResourceType) => {
    const bookmarks = this.props.myBookmarks[resource] || [];
    return `${getDisplayNameByResource(resource)} (${bookmarks.length})`;
  };

  generateTabInfo = () => {
    const tabInfo = [];

    tabInfo.push({
      content: this.generateTabContent(ResourceType.table),
      key: this.generateTabKey(ResourceType.table),
      title: this.generateTabTitle(ResourceType.table)
    })

    if (indexDashboardsEnabled()) {
      tabInfo.push({
        content: this.generateTabContent(ResourceType.dashboard),
        key: this.generateTabKey(ResourceType.dashboard),
        title: this.generateTabTitle(ResourceType.dashboard)
      })
    }

    return tabInfo;
  };

  render() {
    if (!this.props.isLoaded) {
      return null;
    }

    return (
      <div className="bookmark-list">
        <div className="title-1">{ BOOKMARK_TITLE }</div>
        <TabsComponent tabs={ this.generateTabInfo() } defaultTab={ this.generateTabKey(ResourceType.table) } />
      </div>
    );
  }
}


export const mapStateToProps = (state: GlobalState) => {
  return {
    myBookmarks: {
      [ResourceType.table]: state.bookmarks.myBookmarks,
      [ResourceType.dashboard]: [],
    },
    isLoaded: state.bookmarks.myBookmarksIsLoaded,
  };
};

export default connect<StateFromProps>(mapStateToProps)(MyBookmarks);
