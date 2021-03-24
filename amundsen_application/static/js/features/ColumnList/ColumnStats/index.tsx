// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import { formatNumber, isNumber } from 'utils/numberUtils';
import { filterOutUniqueValues, getStatsInfoText } from 'utils/stats';

import { TableColumnStats } from 'interfaces/index';

import { COLUMN_STATS_TITLE } from '../constants';

import './styles.scss';

export interface ColumnStatsProps {
  stats: TableColumnStats[];
}

type ColumnStatRowProps = {
  stat_type: string;
  stat_val: string;
};

const ColumnStatRow: React.FC<ColumnStatRowProps> = ({
  stat_type,
  stat_val,
}: ColumnStatRowProps) => (
  <div className="column-stat-row">
    <div className="stat-name body-3">{stat_type.toUpperCase()}</div>
    <div className="stat-value">
      {isNumber(stat_val) ? formatNumber(+stat_val) : stat_val}
    </div>
  </div>
);

const getStart = ({ start_epoch }) => start_epoch;
const getEnd = ({ end_epoch }) => end_epoch;

const ColumnStats: React.FC<ColumnStatsProps> = ({
  stats,
}: ColumnStatsProps) => {
  if (stats.length === 0) {
    return null;
  }
  const filteredStats = filterOutUniqueValues(stats);
  const startEpoch = Math.min(...filteredStats.map(getStart));
  const endEpoch = Math.max(...filteredStats.map(getEnd));

  return (
    <article className="column-stats">
      <div className="stat-collection-info">
        <span className="stat-title">{COLUMN_STATS_TITLE} </span>
        {getStatsInfoText(startEpoch, endEpoch)}
      </div>
      <div className="column-stats-table">
        <div className="column-stats-column">
          {filteredStats.map((stat, index) => {
            if (index % 2 === 0) {
              return (
                <ColumnStatRow
                  key={stat.stat_type}
                  stat_type={stat.stat_type}
                  stat_val={stat.stat_val}
                />
              );
            }

            return null;
          })}
        </div>
        <div className="column-stats-column">
          {filteredStats.map((stat, index) => {
            if (index % 2 === 1) {
              return (
                <ColumnStatRow
                  key={stat.stat_type}
                  stat_type={stat.stat_type}
                  stat_val={stat.stat_val}
                />
              );
            }

            return null;
          })}
        </div>
      </div>
    </article>
  );
};

export default ColumnStats;
