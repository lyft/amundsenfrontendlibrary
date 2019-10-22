import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RouteComponentProps } from 'react-router';
import * as qs from 'simple-query-string';

import { GlobalState } from 'ducks/rootReducer';
import { getTableData } from 'ducks/tableMetadata/reducer';
import { GetTableDataRequest } from 'ducks/tableMetadata/types';

<<<<<<< HEAD
import BookmarkIcon from 'components/common/Bookmark/BookmarkIcon';
=======
import AppConfig from 'config/config';
import { notificationsEnabled } from 'config/config-utils';
import AvatarLabel from 'components/common/AvatarLabel';
>>>>>>> master
import Breadcrumb from 'components/common/Breadcrumb';
import Flag from 'components/common/Flag';
import LoadingSpinner from 'components/common/LoadingSpinner';
import ExploreButton from 'components/TableDetail/ExploreButton';
import FrequentUsers from 'components/TableDetail/FrequentUsers';
import DataPreviewButton from 'components/TableDetail/DataPreviewButton';
import DetailList from 'components/TableDetail/DetailList';
import LineageLink from 'components/TableDetail/LineageLink';
import OwnerEditor from 'components/TableDetail/OwnerEditor';
import SourceLink from 'components/TableDetail/SourceLink';
import TableDescEditableText from 'components/TableDetail/TableDescEditableText';
import WatermarkLabel from 'components/TableDetail/WatermarkLabel';
import WriterLink from 'components/TableDetail/WriterLink';
import TagInput from 'components/Tags/TagInput';
import { TableMetadata } from 'interfaces/TableMetadata';

<<<<<<< HEAD
import './styles';
import { EditableSection } from 'components/TableDetail/EditableSection';
=======
import DataPreviewButton from './DataPreviewButton';
import DetailList from './DetailList';
import RequestDescriptionText from './RequestDescriptionText';
import OwnerEditor from './OwnerEditor';
import TableDescEditableText from './TableDescEditableText';
import WatermarkLabel from "./WatermarkLabel";
import { logClick } from 'ducks/utilMethods';

import { OverlayTrigger, Popover } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { PreviewQueryParams, TableMetadata, User } from 'interfaces';

// TODO: Use css-modules instead of 'import'
import './styles.scss';
import BookmarkIcon from "components/common/Bookmark/BookmarkIcon";
import RequestMetadataForm from './RequestMetadataForm';
>>>>>>> master

export interface StateFromProps {
  isLoading: boolean;
  statusCode?: number;
  tableData: TableMetadata;
}

export interface DispatchFromProps {
  getTableData: (key: string, searchIndex?: string, source?: string, ) => GetTableDataRequest;
}

type TableDetailProps = StateFromProps & DispatchFromProps;

class TableDetail extends React.Component<TableDetailProps & RouteComponentProps<any>> {
  private cluster: string;
  private database: string;
  private displayName: string;
  private key: string;
  private schema: string;
  private tableName: string;

  constructor(props) {
    super(props);

    const { match } = props;
    const params = match.params;
    this.cluster = params ? params.cluster : '';
    this.database = params ? params.db : '';
    this.schema = params ? params.schema : '';
    this.tableName = params ? params.table : '';
    this.displayName = params ? `${this.schema}.${this.tableName}` : '';

    /*
    This 'key' is the `table_uri` format described in metadataservice. Because it contains the '/' character,
    we can't pass it as a single URL parameter without encodeURIComponent which makes ugly URLs.
    DO NOT CHANGE
    */
    this.key = params ? `${this.database}://${this.cluster}.${this.schema}/${this.tableName}` : '';

  }

  componentDidMount() {
    // TODO - Move into utility function
    const params = qs.parse(this.props.location.search);
    const searchIndex = params['index'];
    const source = params['source'];
    /* update the url stored in the browser history to remove params used for logging purposes */
    if (searchIndex !== undefined || source !== undefined) {
      window.history.replaceState({}, '', `${window.location.origin}${window.location.pathname}`);
    }

    this.props.getTableData(this.key, searchIndex, source);
  }

  render() {
    let innerContent;
    if (this.props.isLoading) {
      innerContent = <LoadingSpinner/>;
    } else if (this.props.statusCode === 500) {
      innerContent = (
        <div className="container error-label">
          <Breadcrumb />
          <label className="d-block m-auto">Something went wrong...</label>
        </div>
      );
    } else {
<<<<<<< HEAD
      const data = this.props.tableData;
      innerContent = (
        <div className="resource-detail-layout table-detail-2">
          <header className="resource-header">
            <div className="header-left">
              {/* TODO - Add Breadcrumb */}
              {/* TODO - Add Database Icon */}
              <h2 className="detail-header-text">
                { this.displayName }
                <BookmarkIcon bookmarkKey={ this.props.tableData.key }/>
              </h2>
              <div className="body-3">
                Datasets &bull;
                {/* TODO - Add Database Label */}
=======
        innerContent = (
          <div className="container table-detail">
            <Breadcrumb />
            {
              notificationsEnabled() &&
              <RequestMetadataForm />
            }
            <div className="row">
              <div className="detail-header col-xs-12 col-md-7 col-lg-8">
                <h1 className="detail-header-text">
                  { `${data.schema}.${data.table_name}` }
                  <BookmarkIcon bookmarkKey={ this.props.tableData.key } large={ true }/>
                </h1>
                {
                  data.is_view && <Flag text="Table View" labelStyle="primary" />
                }
>>>>>>> master
                {
                  data.is_view && <Flag text="Table View" labelStyle="primary"/>
                }
<<<<<<< HEAD
=======
                <TableDescEditableText
                  value={ data.table_description }
                  editable={ data.is_editable }
                  maxLength={ AppConfig.editableText.tableDescLength }
                />
                { !data.table_description && notificationsEnabled() && <RequestDescriptionText/> }
              </div>
              <div className="col-xs-12 col-md-5 float-md-right col-lg-4">
                <EntityCard sections={ this.createEntityCardSections() }/>
              </div>
              <div className="col-xs-12 col-md-7 col-lg-8">
                <div className="detail-list-header title-1">Columns</div>
                <DetailList
                  columns={ data.columns }
                />
>>>>>>> master
              </div>
            </div>
            <div className="header-right">
              <WriterLink tableWriter={ data.table_writer }/>
              <LineageLink tableData={ data }/>
              <SourceLink tableSource={ data.source }/>
              <ExploreButton tableData={ data }/>
              <DataPreviewButton modalTitle={ this.displayName }/>
            </div>
          </header>
          <main className="column-layout-1">
            <section className="left-panel">
              <section className="banner">optional banner</section>
              <section className="column-layout-2">
                <section className="left-panel">
                  <div className="section-title title-3">Description</div>
                  <TableDescEditableText
                    maxLength={ 750 }
                    value={ data.table_description }
                    editable={ data.is_editable }
                  />
                  {
                    !data.is_view &&
                    <>
                      <div className="section-title title-3">Date Range</div>
                      <WatermarkLabel watermarks={ data.watermarks }/>
                    </>
                  }

                </section>
                <section className="right-panel">
                  <EditableSection title="Tags">
                    <TagInput/>
                  </EditableSection>

                  <div className="section-title title-3">Owner</div>
                  <OwnerEditor readOnly={false}/>

                  <div className="section-title title-3">Frequent Users</div>
                  <FrequentUsers readers={ data.table_readers }/>
                </section>
              </section>
            </section>
            <section className="right-panel">
              <DetailList columns={ data.columns }/>
            </section>
          </main>
        </div>
      );
    }

    return (
      <DocumentTitle title={ `${this.displayName} - Amundsen Table Details` }>
        { innerContent }
      </DocumentTitle>
    );
  }
}


export const mapStateToProps = (state: GlobalState) => {
  return {
    isLoading: state.tableMetadata.isLoading,
    statusCode: state.tableMetadata.statusCode,
    tableData: state.tableMetadata.tableData,
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ getTableData } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(TableDetail);
