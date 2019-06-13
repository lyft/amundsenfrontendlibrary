import {
  PreviewData,
  PreviewQueryParams,
  TableMetadata,
  UpdateOwnerPayload,
  UpdateTagData,
  User,
  Tag,
} from 'interfaces';

export enum GetTableData {
  REQUEST = 'amundsen/tableMetadata/GET_TABLE_DATA_REQUEST',
  SUCCESS = 'amundsen/tableMetadata/GET_TABLE_DATA_SUCCESS',
  FAILURE = 'amundsen/tableMetadata/GET_TABLE_DATA_FAILURE',
};
export interface GetTableDataRequest {
  type: GetTableData.REQUEST;
  key: string;
  searchIndex?: string;
  source?: string;
};
export interface GetTableDataResponse {
  type: GetTableData.SUCCESS | GetTableData.FAILURE;
  payload: {
    statusCode: number;
    data: TableMetadata;
    owners: { [id: string] : User };
    tags: Tag[];
  }
};

export enum GetTableDescription {
  REQUEST = 'amundsen/tableMetadata/GET_TABLE_DESCRIPTION_REQUEST',
  SUCCESS = 'amundsen/tableMetadata/GET_TABLE_DESCRIPTION_SUCCESS',
  FAILURE = 'amundsen/tableMetadata/GET_TABLE_DESCRIPTION_FAILURE',
};
export interface GetTableDescriptionRequest {
  type: GetTableDescription.REQUEST;
  onSuccess?: () => any;
  onFailure?: () => any;
};
export interface GetTableDescriptionResponse {
  type: GetTableDescription.SUCCESS | GetTableDescription.FAILURE;
  payload: {
    tableMetadata: TableMetadata;
  };
};

export enum UpdateTableDescription {
  REQUEST = 'amundsen/tableMetadata/UPDATE_TABLE_DESCRIPTION_REQUEST',
  SUCCESS = 'amundsen/tableMetadata/UPDATE_TABLE_DESCRIPTION_SUCCESS',
  FAILURE = 'amundsen/tableMetadata/UPDATE_TABLE_DESCRIPTION_FAILURE',
};
export interface UpdateTableDescriptionRequest {
  type: UpdateTableDescription.REQUEST;
  newValue: string;
  onSuccess?: () => any;
  onFailure?: () => any;
};
export interface UpdateTableDescriptionResponse {
  type: UpdateTableDescription.SUCCESS | UpdateTableDescription.FAILURE;
};

export enum GetColumnDescription {
  REQUEST = 'amundsen/tableMetadata/GET_COLUMN_DESCRIPTION_REQUEST',
  SUCCESS = 'amundsen/tableMetadata/GET_COLUMN_DESCRIPTION_SUCCESS',
  FAILURE = 'amundsen/tableMetadata/GET_COLUMN_DESCRIPTION_FAILURE',
};
export interface GetColumnDescriptionRequest {
  type: GetColumnDescription.REQUEST;
  columnIndex: number;
  onSuccess?: () => any;
  onFailure?: () => any;
};
export interface GetColumnDescriptionResponse {
  type: GetColumnDescription.SUCCESS | GetColumnDescription.FAILURE;
  payload: {
    tableMetadata: TableMetadata;
  };
};

export enum UpdateColumnDescription {
  REQUEST = 'amundsen/tableMetadata/UPDATE_COLUMN_DESCRIPTION_REQUEST',
  SUCCESS = 'amundsen/tableMetadata/UPDATE_COLUMN_DESCRIPTION_SUCCESS',
  FAILURE = 'amundsen/tableMetadata/UPDATE_COLUMN_DESCRIPTION_FAILURE',
};
export interface UpdateColumnDescriptionRequest {
  type: UpdateColumnDescription.REQUEST;
  newValue: string;
  columnIndex: number;
  onSuccess?: () => any;
  onFailure?: () => any;
};
export interface UpdateColumnDescriptionResponse {
  type: UpdateColumnDescription.SUCCESS | UpdateColumnDescription.FAILURE;
};

export enum GetLastIndexed {
  REQUEST = 'amundsen/tableMetadata/GET_LAST_UPDATED_REQUEST',
  SUCCESS = 'amundsen/tableMetadata/GET_LAST_UPDATED_SUCCESS',
  FAILURE = 'amundsen/tableMetadata/GET_LAST_UPDATED_FAILURE',
};
export interface GetLastIndexedRequest {
  type: GetLastIndexed.REQUEST;
};
export interface GetLastIndexedResponse {
  type: GetLastIndexed.SUCCESS | GetLastIndexed.FAILURE;
  payload?: {
    lastIndexedEpoch: number;
  };
};

export enum GetPreviewData {
  REQUEST = 'amundsen/preview/GET_PREVIEW_DATA_REQUEST',
  SUCCESS = 'amundsen/preview/GET_PREVIEW_DATA_SUCCESS',
  FAILURE = 'amundsen/preview/GET_PREVIEW_DATA_FAILURE',
};
export interface GetPreviewDataRequest {
  type: GetPreviewData.REQUEST;
  queryParams: PreviewQueryParams;
};
export interface GetPreviewDataResponse {
  type: GetPreviewData.SUCCESS | GetPreviewData.FAILURE;
  payload: {
    data: PreviewData;
    status: number | null;
  };
};

export enum UpdateTableOwner {
  REQUEST = 'amundsen/tableMetadata/UPDATE_TABLE_OWNER_REQUEST',
  SUCCESS = 'amundsen/tableMetadata/UPDATE_TABLE_OWNER_SUCCESS',
  FAILURE = 'amundsen/tableMetadata/UPDATE_TABLE_OWNER_FAILURE',
};
export interface UpdateTableOwnerRequest {
  type: UpdateTableOwner.REQUEST;
  updateArray: UpdateOwnerPayload[];
  onSuccess?: () => any;
  onFailure?: () => any;
};
export interface UpdateTableOwnerResponse {
  type: UpdateTableOwner.SUCCESS | UpdateTableOwner.FAILURE;
  payload: {
    owners: { [id: string] : User };
  };
};


export enum UpdateTags {
  REQUEST = 'amundsen/tags/UPDATE_TAGS_REQUEST',
  SUCCESS = 'amundsen/tags/UPDATE_TAGS_SUCCESS',
  FAILURE = 'amundsen/tags/UPDATE_TAGS_FAILURE',
};
export interface UpdateTagsRequest {
  type: UpdateTags.REQUEST,
  tagArray: UpdateTagData[];
};
export interface UpdateTagsResponse {
  type: UpdateTags.SUCCESS | UpdateTags.FAILURE,
  payload: {
    tags: Tag[];
  }
};
