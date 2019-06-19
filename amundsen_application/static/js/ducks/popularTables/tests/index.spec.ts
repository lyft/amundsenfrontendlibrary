import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import { TableResource } from 'interfaces';

import globalState from 'fixtures/globalState';

import { metadataPopularTables } from '../api/v0';
import reducer, {
  getPopularTables,
  getPopularTablesFailure,
  getPopularTablesSuccess,
  PopularTablesReducerState
} from '../reducer';
import {
  getPopularTablesWorker, getPopularTablesWatcher
} from '../sagas';
import {
  GetPopularTables, GetPopularTablesRequest, GetPopularTablesResponse,
} from '../types';

describe('popularTables ducks', () => {
  let expectedTables: TableResource[];
  beforeAll(() => {
    expectedTables = globalState.popularTables;
  });
  describe('actions', () => {
    it('getPopularTables - returns the action to get popular tables', () => {
      expect(getPopularTables()).toEqual({
        type: GetPopularTables.REQUEST,
      });
    });

    it('getPopularTablesFailure - returns the action to process failure', () => {
      expect(getPopularTablesFailure()).toEqual({
        type: GetPopularTables.FAILURE,
        payload: {
          tables: [],
        }
      });
    });

    it('getPopularTablesSuccess - returns the action to process success', () => {
      expect(getPopularTablesSuccess(expectedTables)).toEqual({
        type: GetPopularTables.SUCCESS,
        payload: {
          tables: expectedTables,
        }
      });
    });
  });

  describe('reducer', () => {
    let testState: PopularTablesReducerState;
    beforeAll(() => {
      testState = [];
    });
    it('should return the existing state if action is not handled', () => {
      expect(reducer(testState, { type: 'INVALID.ACTION' })).toEqual(testState);
    });

    it('should handle GetPopularTables.SUCCESS', () => {
      expect(reducer(testState, getPopularTablesSuccess(expectedTables))).toEqual(expectedTables);
    });

    it('should handle GetPopularTables.FAILURE', () => {
      expect(reducer(testState, getPopularTablesFailure())).toEqual([]);
    });
  });

  describe('sagas', () => {
    describe('getPopularTablesWatcher', () => {
      it('takes every GetPopularTables.REQUEST with getPopularTablesWorker', () => {
        testSaga(getPopularTablesWatcher)
          .next()
          .takeEvery(GetPopularTables.REQUEST, getPopularTablesWorker);
      });
    });

    describe('getPopularTablesWorker', () => {
      it('executes flow for returning tables', () => {
        testSaga(getPopularTablesWorker)
          .next()
          .call(metadataPopularTables)
          .next(expectedTables)
          .put(getPopularTablesSuccess(expectedTables))
          .next()
          .isDone();
      });

      it('handles request error', () => {
        testSaga(getPopularTablesWorker)
          .next()
          .throw(new Error())
          .put(getPopularTablesFailure())
          .next()
          .isDone();
      });
    });
  });
});
