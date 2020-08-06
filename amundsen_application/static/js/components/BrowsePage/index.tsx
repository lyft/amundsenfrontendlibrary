// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import * as DocumentTitle from 'react-document-title';

import TagsList from 'components/common/TagsList';

import './styles.scss';

export class BrowsePage extends React.Component {
  render() {
    return (
      /* TODO: add expand/collapse behavior */
      <DocumentTitle title="Browse - Amundsen">
        <main className="container">
          <div className="row">
            <div className="col-xs-12">
              <h1 className="h3" id="browse-header">
                Browse Tags
              </h1>
              <hr className="header-hr" />
              <TagsList shortTagList={false} />
            </div>
          </div>
        </main>
      </DocumentTitle>
    );
  }
}

export default BrowsePage;
