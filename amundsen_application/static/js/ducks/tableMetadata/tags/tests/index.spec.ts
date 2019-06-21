import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import { UpdateMethod, UpdateTagData, Tag } from 'interfaces';

import globalState from 'fixtures/globalState';

import { metadataUpdateTableTags, metadataTableTags } from '../../api/v0';
import reducer, {
  updateTags, updateTagsFailure, updateTagsSuccess,
  initialTagsState, TableTagsReducerState,
} from '../reducer';
import { getTableData, getTableDataFailure, getTableDataSuccess } from '../../reducer';
import { updateTableTagsWorker, updateTableTagsWatcher } from '../sagas';
import { GetTableData, UpdateTags } from '../../types';

describe('tableMetadata:tags ducks', () => {
  let expectedTags: Tag[];
  let updatePayload: UpdateTagData[];
  beforeAll(() => {
    expectedTags = [{tag_count: 2, tag_name: 'test'}, {tag_count: 1, tag_name: 'test2'}];
    updatePayload = [{methodName: UpdateMethod.PUT, tagName: 'test'}];
  });

  describe('actions', () => {
    it('updateTags - returns the action to updateTags', () => {
      expect(updateTags(updatePayload)).toEqual({
        type: UpdateTags.REQUEST,
        payload: {
          tagArray: updatePayload
        }
      });
    });

    it('updateTagsFailure - returns the action to process failure', () => {
      expect(updateTagsFailure()).toEqual({
        type: UpdateTags.FAILURE,
        payload: {
          tags: [],
        }
      });
    });

    it('updateTagsSuccess - returns the action to process success', () => {
      expect(updateTagsSuccess(expectedTags)).toEqual({
        type: UpdateTags.SUCCESS,
        payload: {
          tags: expectedTags,
        }
      });
    });
  });

  describe('reducer', () => {
    let testState: TableTagsReducerState;
    beforeAll(() => {
      testState = initialTagsState;
    });
    it('should return the existing state if action is not handled', () => {
      expect(reducer(testState, { type: 'INVALID.ACTION' })).toEqual(testState);
    });

    it('should handle UpdateTags.REQUEST', () => {
      expect(reducer(testState, updateTags(updatePayload))).toEqual({
        ...testState,
        isLoading: true,
      });
    });

    it('should handle UpdateTags.FAILURE', () => {
      expect(reducer(testState, updateTagsFailure())).toEqual({
        ...testState,
        isLoading: false,
      });
    });

    it('should handle UpdateTags.SUCCESS', () => {
      expect(reducer(testState, updateTagsSuccess(expectedTags))).toEqual({
        ...testState,
        isLoading: false,
        tags: expectedTags,
      });
    });

    it('should handle GetTableData.REQUEST', () => {
      expect(reducer(testState, getTableData('testKey'))).toEqual({
        ...testState,
        isLoading: true,
        tags: [],
      });
    });

    it('should handle GetTableData.FAILURE', () => {
      expect(reducer(testState, getTableDataFailure())).toEqual({
        ...testState,
        isLoading: false,
        tags: [],
      });
    });

    it('should handle GetTableData.SUCCESS', () => {
      const mockTableData = globalState.tableMetadata.tableData;
      expect(reducer(testState, getTableDataSuccess(mockTableData, {}, 200, expectedTags))).toEqual({
        ...testState,
        isLoading: false,
        tags: expectedTags,
      });
    });
  });

  describe('sagas', () => {
    describe('updateTableTagsWatcher', () => {
      it('takes every UpdateTags.REQUEST with updateTableTagsWorker', () => {
        testSaga(updateTableTagsWatcher)
          .next()
          .takeEvery(UpdateTags.REQUEST, updateTableTagsWorker);
      });
    });

    /* TODO: These tests throw errors and warnings, more investigation needed
    describe('updateTableTagsWorker', () => {
      it('executes flow for updating tags and returning up to date tag array', () => {
        testSaga(updateTableTagsWorker, updateTags(updatePayload))
          .next()
          .select()
          .next({tableMetadata: { tableData: {key: 'testKey'}}})
          .all(call(metadataUpdateTableTags, updatePayload, 'testKey'))
          .next()
          .call(metadataTableTags, 'testKey')
          .next(expectedTags)
          .put(updateTagsSuccess(expectedTags))
          .next()
          .isDone();
      });

      it('handles request error', () => {
        testSaga(updateTableTagsWorker, updateTags(updatePayload))
          .next()
          .select()
          .next({tableMetadata: { tableData: {key: 'testKey'}}})
          .throw(new Error())
          .put(updateTagsFailure())
          .next()
          .isDone();
      });
    });*/
  });
});
