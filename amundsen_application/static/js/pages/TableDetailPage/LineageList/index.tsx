// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import BookmarkIcon from 'components/Bookmark/BookmarkIcon';
import { getSourceDisplayName } from 'config/config-utils';
import BadgeList from 'features/BadgeList';
import { ResourceType } from 'interfaces/Resources';
import { LineageItem } from 'interfaces/TableMetadata';
import { RightIcon } from 'components/SVGIcons';

export interface LineageListProps {
  items: LineageItem[];
}

const LineageList: React.FC<LineageListProps> = ({
  items,
}: LineageListProps) => (
  <div className="list-group">
    {items.map((table, index) => {
      const { cluster, database, schema, name } = table;
      const link = `/table_detail/${cluster}/${database}/${schema}/${name}?index=${index}&source=table_lineage_list`;
      // TODO - test badges
      const badges = table.badges.map((badgeName) => ({
        badge_name: badgeName,
      }));

      return (
        <li key={index} className="list-group-item clickable">
          <a
            href={link}
            className="resource-list-item"
            target="_blank"
            rel="noreferrer"
          >
            <div className="resource-info">
              <div className="resource-info-text my-auto">
                <div className="resource-name title-2">
                  <div className="truncated">
                    {table.schema}.{table.name}
                  </div>
                  <BookmarkIcon
                    bookmarkKey={table.key}
                    resourceType={ResourceType.table}
                  />
                </div>
              </div>
            </div>
            <div className="resource-type">
              {getSourceDisplayName(table.database, ResourceType.table)}
            </div>
            <div className="resource-badges">
              {!!table.badges && table.badges.length > 0 && (
                <div>
                  <div className="body-secondary-3">
                    <BadgeList badges={badges} />
                  </div>
                </div>
              )}
              <RightIcon />
            </div>
          </a>
        </li>
      );
    })}
  </div>
);
export default LineageList;
