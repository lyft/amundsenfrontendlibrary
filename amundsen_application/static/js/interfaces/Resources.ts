import { PeopleUser } from './User';
import { Badge } from './Tags';

export enum ResourceType {
  table = "table",
  user = "user",
  dashboard = "dashboard",
};

export const DEFAULT_RESOURCE_TYPE = ResourceType.table;

export interface Resource {
  type: ResourceType;
};

// TODO ttannis: Still need to update after search endpoint fixed 
export interface DashboardResource extends Resource  {
  type: ResourceType.dashboard;
  dashboard_group: string;
  dashboard_name: string;
  dashboard_group_description: string;
  product: string;
  description: string;
  uri: string;
  url: string;
  group_url: string;
  query_names: string[];
  cluster: string;
  last_successful_run_timestamp: number | undefined;
}

export interface TableResource extends Resource {
  type: ResourceType.table;
  cluster: string;
  database: string;
  description: string;
  key: string;
  // 'popular_tables' currently does not support 'last_updated_timestamp'
  last_updated_timestamp?: number;
  name: string;
  schema: string;
  badges?: Badge[];
};

export interface UserResource extends Resource, PeopleUser {
  type: ResourceType.user;
}

// TODO - Consider just using the 'Resource' type instead
export type Bookmark = TableResource & {};
