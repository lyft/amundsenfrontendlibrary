import { AxiosResponse } from 'axios';
import axiosInstance from 'axiosInstance/instance';

import globalState from 'fixtures/globalState';

import { TableResource } from 'interfaces';

import * as API from '../v0';

jest.mock('axiosInstance');

describe('getPopularTables', () => {
  let axiosMock;
  let expectedTables: TableResource[];
  let mockGetResponse: AxiosResponse<API.PopularTablesAPI>;
  beforeAll(() => {
    expectedTables = globalState.popularTables;
    mockGetResponse = {
      data: {
       results: expectedTables,
       msg: 'Success'
      },
      status: 200,
      statusText: '',
      headers: {},
      config: {}
    };
    axiosMock = jest.spyOn(axiosInstance, 'get').mockImplementation(() => Promise.resolve(mockGetResponse));
  });

  it('resolves with array of table resources from response.data on success', async () => {
    expect.assertions(1);
    await API.getPopularTables().then(results => {
      expect(results).toEqual(expectedTables);
    });
  });
});
